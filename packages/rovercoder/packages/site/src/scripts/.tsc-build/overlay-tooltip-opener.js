import { closeOverlay, openOverlay } from "./overlay.js";
import { tooltipOuterToDisplayClass } from "./overlay-tooltip.consts.js";
import { ensureHTMLElementOrNull, isHTMLElement } from "./utilities-general.js";
import { destroyManagedLifecycleObjectComponent } from "./utilities-lifecycle.js";
export function tooltipOpenerInitializer(args) {
    if (args == null || typeof args !== 'object') {
        return;
    }
    const managedLifecycleObjectComponents = {};
    const triggerElement = args.triggerElement;
    const tooltipOverlayRawSource = args.tooltipOverlayRawSource;
    if (triggerElement == null || !isHTMLElement(triggerElement)) {
        console.error('Trigger element is invalid!');
        return;
    }
    if (tooltipOverlayRawSource == null || !isHTMLElement(tooltipOverlayRawSource)) {
        console.error('Tooltip overlay to clone is invalid!');
        return;
    }
    if (!triggerElement.hasAttribute('tabindex')) {
        triggerElement.setAttribute('tabindex', '0');
    }
    let tooltipOverlay;
    const tooltipOuterElementKey = 'tooltipOuterElement';
    let tooltipOuterElementIsFocused = false;
    let triggerElementIsFocused = false;
    let tooltipOverlayEventTypes = [];
    const getTooltipOuterElement = () => ensureHTMLElementOrNull(tooltipOverlay?.querySelector(`.${tooltipOuterToDisplayClass}`));
    const initTooltipOuterElement = () => {
        destroyTooltipOuterElement();
        const tooltipOuterElement = getTooltipOuterElement();
        if (tooltipOuterElement == null) {
            return;
        }
        tooltipOuterElement.addEventListener('focusin', tooltipOuterElementOnFocusInFn);
        tooltipOuterElement.addEventListener('focusout', tooltipOuterElementOnFocusOutFn);
        const tooltipOuterElementDestructorFn = () => {
            tooltipOuterElement.removeEventListener('focusin', tooltipOuterElementOnFocusInFn);
            tooltipOuterElement.removeEventListener('focusout', tooltipOuterElementOnFocusOutFn);
        };
        managedLifecycleObjectComponents[tooltipOuterElementKey] = {
            element: tooltipOuterElement,
            listeners: {
                'all': {
                    destructor: tooltipOuterElementDestructorFn
                }
            },
            observables: {},
            loops: {}
        };
    };
    const destroyTooltipOuterElement = () => {
        if (managedLifecycleObjectComponents[tooltipOuterElementKey] == null) {
            return;
        }
        destroyManagedLifecycleObjectComponent(managedLifecycleObjectComponents[tooltipOuterElementKey]);
        delete managedLifecycleObjectComponents[tooltipOuterElementKey];
    };
    const openTooltipOverlay = (triggerElement, triggerElementEventType) => {
        if (tooltipOverlay != null) {
            closeTooltipOverlay();
        }
        if (tooltipOverlayRawSource != null) {
            const tooltipOverlayClone = ensureHTMLElementOrNull(tooltipOverlayRawSource.cloneNode(true));
            if (tooltipOverlayClone == null) {
                return;
            }
            tooltipOverlayClone.removeAttribute('aria-hidden');
            tooltipOverlay = openOverlay(tooltipOverlayClone, { originalElement: tooltipOverlayRawSource, trigger: { element: triggerElement, eventType: triggerElementEventType } });
            tooltipOverlayEventTypes.push(triggerElementEventType);
            if (triggerElementEventType == 'click') {
                triggerElement.focus();
                initTooltipOuterElement();
            }
        }
    };
    const closeTooltipOverlay = () => {
        tooltipOverlayEventTypes.splice(0, tooltipOverlayEventTypes.length);
        if (tooltipOverlay != null) {
            destroyTooltipOuterElement();
            closeOverlay(tooltipOverlay);
            tooltipOverlay = undefined;
            return true;
        }
        return false;
    };
    const triggerElementOpenTooltipOverlayMouseOverFn = () => !tooltipOverlayEventTypes.includes('click') && openTooltipOverlay(triggerElement, 'mouseover');
    const triggerElementCloseTooltipOverlayMouseLeaveFn = () => !tooltipOverlayEventTypes.includes('click') && closeTooltipOverlay();
    const triggerElementOpenTooltipOverlayClickFn = () => (!tooltipOverlayEventTypes.includes('click') || closeTooltipOverlay() === false) && openTooltipOverlay(triggerElement, 'click');
    const triggerElementOnFocusInFn = () => triggerElementIsFocused = true;
    const triggerElementOnFocusOutFn = () => { triggerElementIsFocused = false; setTimeout(() => !triggerElementIsFocused && !tooltipOuterElementIsFocused && tooltipOverlayEventTypes.includes('click') && closeTooltipOverlay(), 0); };
    const tooltipOuterElementOnFocusInFn = () => tooltipOuterElementIsFocused = true;
    const tooltipOuterElementOnFocusOutFn = () => { tooltipOuterElementIsFocused = false; setTimeout(() => !tooltipOuterElementIsFocused && !triggerElementIsFocused && tooltipOverlayEventTypes.includes('click') && closeTooltipOverlay(), 0); };
    const triggerElementOpenTooltipOverlayKeydownFn = (evt) => closeTooltipOverlay() || evt.key?.toLowerCase() !== 'enter' || openTooltipOverlay(triggerElement, 'keydown');
    triggerElement.addEventListener('mouseover', triggerElementOpenTooltipOverlayMouseOverFn);
    triggerElement.addEventListener('mouseleave', triggerElementCloseTooltipOverlayMouseLeaveFn);
    triggerElement.addEventListener('click', triggerElementOpenTooltipOverlayClickFn);
    triggerElement.addEventListener('focusin', triggerElementOnFocusInFn);
    triggerElement.addEventListener('focusout', triggerElementOnFocusOutFn);
    triggerElement.addEventListener('keydown', triggerElementOpenTooltipOverlayKeydownFn);
    const triggerElementAllListenersDestructor = () => {
        triggerElement.removeEventListener('mouseover', triggerElementOpenTooltipOverlayMouseOverFn);
        triggerElement.removeEventListener('mouseleave', triggerElementCloseTooltipOverlayMouseLeaveFn);
        triggerElement.removeEventListener('click', triggerElementOpenTooltipOverlayClickFn);
        triggerElement.removeEventListener('focusin', triggerElementOnFocusInFn);
        triggerElement.removeEventListener('focusout', triggerElementOnFocusOutFn);
        triggerElement.removeEventListener('keydown', triggerElementOpenTooltipOverlayKeydownFn);
    };
    managedLifecycleObjectComponents['triggerElement'] = {
        element: triggerElement,
        listeners: {
            'all': {
                destructor: triggerElementAllListenersDestructor
            }
        },
        observables: {},
        loops: {}
    };
    return managedLifecycleObjectComponents;
}
