import { Overlays, WindowCustom } from "./global.types.js";
import { initCssVariableElementWatcher, runOnElementRemoval } from "./utilities.js";

const overlayShownClass = 'shown';
const overlaysOpenBodyClass = 'overlay-open';

getInitializeOverlayObject();

initCssVariableElementWatcher({ element: getOverlayContentElement() as HTMLElement, elementToAttachVariableTo: getOverlayContentElement() as HTMLElement, cssVariableName: '--overlayHeight', elementPropertyWatched: 'height' });

function getInitializeOverlayObject(): Overlays {
    if ((window as WindowCustom)._siteCustomOverlays == null) {
        (window as WindowCustom)._siteCustomOverlays = {};
    }
    return (window as WindowCustom)._siteCustomOverlays!;
}

export function hasOverlays(): boolean {
    return (getOverlayContentElement()?.children.length ?? 0) > 0;
}

let _overlayContentElement = getOverlayContentElement();

if (_overlayContentElement != null) {
    const overlayMutationObserver = new MutationObserver(function () {
        resetOverlayShownClassOnBody();
    });
    const overlayResizeObserver = new ResizeObserver(function () {
        resetOverlayShownClassOnBody();
    });
    overlayMutationObserver.observe(_overlayContentElement, { subtree: true, childList: true });
    overlayResizeObserver.observe(_overlayContentElement);
}

function resetOverlayShownClassOnBody() {
    const parentElement = getOverlayContentElement();
    if (parentElement == null) {
        return;
    }

    const allChildren: Element[] = [];
    for (let i = 0; i < parentElement.children.length; i++) {
        allChildren.push(parentElement.children[i]);
    }

    const displayedChildren = allChildren.filter(x => !(x.computedStyleMap().get('display')?.toString().toLowerCase().startsWith('none') ?? false))
    if (displayedChildren.length > 0) {
        document?.documentElement.classList.add(overlaysOpenBodyClass);
    } else {
        document?.documentElement.classList.remove(overlaysOpenBodyClass);
    }
}

export function openOverlay(elementToAdd: Element): Element | undefined {
    if (elementToAdd == null) {
        return;
    }
    removeScriptsAndStyles(elementToAdd);
    const element = getOverlayContentElement()?.appendChild(elementToAdd);
    // triggers animation
    setTimeout(() => element?.classList.add(overlayShownClass), 0);
    if (element) {
        initializeOverlay(element);
    }
    return element;
}

function removeScriptsAndStyles(element: Element) {
    if (['script', 'style'].includes(element.tagName.toLowerCase()) 
            || ('link' === element.tagName.toLowerCase() && (['stylesheet', 'script'].includes(element.attributes.getNamedItem('rel')?.value ?? '') 
                || (['stylesheet', 'script'].includes(element.attributes.getNamedItem('as')?.value ?? ''))))) {
        element.remove();
        return;
    }
    if (element.children == null) {
        return;
    }
    for (let i = 0; i < element.children.length; i++) {
        removeScriptsAndStyles(element.children[i]);
    }
}

function initializeOverlay(element: Element) {
    const overlayType = element.attributes.getNamedItem('data-overlay-type')?.value?.trim();
    if (overlayType != null && getInitializeOverlayObject()[overlayType] != null) {
        const overlayObjectEntry = getInitializeOverlayObject()[overlayType];
        if (overlayObjectEntry.initialize != null && typeof overlayObjectEntry.initialize === 'function') {
            overlayObjectEntry.initialize(element as HTMLElement);
        }
    }
}

function destroyOverlay(element: Element) {
    const overlayObject = getInitializeOverlayObject();
    for (const overlayObjectKey in overlayObject) {
        const overlayObjectEntry = overlayObject[overlayObjectKey];
        const overlayObjectEntryState = overlayObjectEntry.state ?? [];
        for (let i = 0; i < overlayObjectEntryState.length; i++) {
            if (overlayObjectEntryState[i].element === element) {
                if (overlayObjectEntry.destroy != null && typeof overlayObjectEntry.destroy === 'function') {
                    overlayObjectEntry.destroy(element as HTMLElement);
                }
                const overlayObjectEntryStateEntry = overlayObjectEntryState[i];
                if (overlayObjectEntryStateEntry.components != null && typeof overlayObjectEntryStateEntry.components === 'object') {
                    for (const componentKey in overlayObjectEntryStateEntry.components) {
                        const component = overlayObjectEntryStateEntry.components[componentKey];
                        if (component.listeners != null && typeof component.listeners === 'object') {
                            for (const listenerKey in component.listeners) {
                                component.listeners[listenerKey].destructor();
                            }
                        }
                    }
                }
                overlayObjectEntryState.splice(i, 1);
                i--;
            }
        }
    }
}

export function closeOverlayLast(): boolean {
    return closeOverlays(false);
}

function _removeOverlay(overlay: Element, previousOverlaysFunction?: Function | null) {
    if (overlay == null) {
        throw Error('Overlay Invalid!');
    }

    const _removePreviousOverlays = () => {
        if (previousOverlaysFunction != null && typeof previousOverlaysFunction === 'function') {
            previousOverlaysFunction();
        }
    };

    const _destroyAndRemoveOverlay = (overlay: Element) => {
        destroyOverlay(overlay);
        overlay.remove();
    };

    runOnElementRemoval(overlay, _removePreviousOverlays);

    const cleanupFunctionsIfAnimationTransitionListenerFails: Function[] = [];
    const cleanupFunctionsIfAnimationTransitionListenerFailsDelayAllowanceMs = 500;

    const overlayChildrenLeft: Element[] = Array.from(overlay.children);

    for (let c = 0; c < overlay.children.length; c++) {
        const childOfOverlay = overlay.children[c];

        const getAnimationTransitionCssTimeTotalMs = (timeStr: string): number => {
            // Handle possible comma-separated lists (e.g., "0.3s, 0s")
            const durations = timeStr.split(',').map(part => part.trim());
            
            let totalMilliseconds = 0;

            for (let i = 0; i < durations.length; i++) {
                const duration = durations[i].trim();

                if (duration === '' || duration === '0' || duration === '0s' || duration === '0ms') {
                    continue;
                }

                let _duration = '';

                let isSeconds = false;
                let isMilliseconds = false;

                if (duration.endsWith('ms')) {
                    _duration = duration.substring(0, duration.length - 'ms'.length);
                    isMilliseconds = true;
                } else if (duration.endsWith('s')) {
                    _duration = duration.substring(0, duration.length - 's'.length);
                    isSeconds = true;
                } else {
                    // Invalid state
                    console.error(`Invalid duration: ${duration}`);
                    continue;
                }

                const durationParsed = parseFloat(_duration);
                if (isNaN(durationParsed)) {
                    console.error(`Invalid duration: ${duration}`);
                    continue;
                } else {
                    totalMilliseconds += durationParsed * (isSeconds ? 1000 : (isMilliseconds ? 1 : 0));
                }
            }

            return totalMilliseconds;
        }

        const computedStyle = window.getComputedStyle(childOfOverlay);
        const animationDurationMs = getAnimationTransitionCssTimeTotalMs(computedStyle.animationDuration);
        const transitionDurationMs = getAnimationTransitionCssTimeTotalMs(computedStyle.transitionDuration);

        const animated = (computedStyle.animationName != null && computedStyle.animationName.trim().length > 0 && computedStyle.animationName.trim().toLowerCase() !== 'none' && animationDurationMs > 0) 
                        || (computedStyle.transitionProperty != null && computedStyle.transitionProperty.trim().length > 0 && computedStyle.transitionProperty.trim().toLowerCase() !== 'none' && transitionDurationMs > 0);

        if (animated) {
            const maxAnimationTransitionDurationMs = Math.max(animationDurationMs, transitionDurationMs);
            const onElementEnd = () => {
                const overlayChildrenLeftIndex = overlayChildrenLeft.findIndex(x => x == childOfOverlay);
                if (overlayChildrenLeftIndex > -1) {
                    overlayChildrenLeft.splice(overlayChildrenLeftIndex, 1);
                }
                if (overlay != null && overlayChildrenLeft.length === 0) {
                    _destroyAndRemoveOverlay(overlay);
                }
            };
            childOfOverlay.addEventListener('animationend', onElementEnd);
            childOfOverlay.addEventListener('transitionend', onElementEnd);
            runOnElementRemoval(childOfOverlay, onElementEnd, document.body);
            cleanupFunctionsIfAnimationTransitionListenerFails.push(() => setTimeout(onElementEnd, maxAnimationTransitionDurationMs + cleanupFunctionsIfAnimationTransitionListenerFailsDelayAllowanceMs))
        } else {
            const overlayChildrenLeftIndex = overlayChildrenLeft.findIndex(x => x == childOfOverlay);
            if (overlayChildrenLeftIndex > -1) {
                overlayChildrenLeft.splice(overlayChildrenLeftIndex, 1);
            }
        }
    }

    // triggers animation
    overlay.classList.remove(overlayShownClass);

    cleanupFunctionsIfAnimationTransitionListenerFails.forEach((fn) => fn());
    
    if (overlayChildrenLeft.length === 0) {
        _destroyAndRemoveOverlay(overlay);
    }
}

export function closeOverlays(allOverlays: boolean = true): boolean {
    const parentElement = getOverlayContentElement();
    if (parentElement?.children != null && parentElement.children.length > 0) {
        let removeOverlaysFunction: Function | null = null;
        for (let i = Math.max(0, allOverlays ? 0 : parentElement.children.length - 1); i < parentElement.children.length; i++) {
            const child = parentElement.children[i];
            const _removeOverlaysFunction = removeOverlaysFunction;
            removeOverlaysFunction = () => _removeOverlay(child /** This overlay */, _removeOverlaysFunction /** Previous overlays */);
        }
        if (removeOverlaysFunction != null) {
            removeOverlaysFunction();
        }
        return true;
    }
    return false;
}

function getOverlayContentElement(): Element | null { 
    return document.querySelector('#overlay-main > #overlay-content');
}
