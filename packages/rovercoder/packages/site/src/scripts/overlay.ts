import { ManagedLifecycleObjectGroupInitializeExtraArguments, OverlaysObjectGroups, WindowCustom } from "./global.types.js";
import { destroyManagedLifecycleObject, initializeManagedLifecycleObject } from "./utilities-lifecycle.js";
import { ensureHTMLElementThrowOrNull, filterByHTMLElement, initCssVariableElementWatcher, isHTMLElement, runOnElementRemoval } from "./utilities-general.js";
import { overlayHeightCssVariableName, overlayNonDetectableClass, overlayOpenBodyClass, overlayShownClass } from "./overlay.consts.js";

const overlayTypeAttributeName = 'data-overlay-type';

getInitializeOverlayObjectsGroups();

let _overlayContentElement = getOverlayContentElement();

if (_overlayContentElement == null) {
    console.error('Overlay content element is undefined!');
} else {
    initCssVariableElementWatcher({ element: _overlayContentElement, elementToAttachVariableTo: _overlayContentElement, cssVariableName: overlayHeightCssVariableName, elementPropertyWatched: 'height' });
}

export function getInitializeOverlayObjectsGroups(): OverlaysObjectGroups {
    if ((window as WindowCustom)._siteCustomOverlays == null) {
        (window as WindowCustom)._siteCustomOverlays = {};
    }
    return (window as WindowCustom)._siteCustomOverlays!;
}

export function hasOverlays(args?: { detectNonDetectable?: boolean }): boolean {
    let detectNonDetectable = false;
    if (args != null && typeof args === 'object') {
        detectNonDetectable = args.detectNonDetectable?.toString().toLowerCase() == 'true';
    }
    const overlayContentElement = getOverlayContentElement();
    if (overlayContentElement == null) {
        return false;
    }
    return Array.from(overlayContentElement.children).filter(x => detectNonDetectable || !x.classList.contains(overlayNonDetectableClass)).length > 0;
}

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

    const displayedChildren = allChildren.filter(x => !(x.computedStyleMap().get('display')?.toString().toLowerCase().startsWith('none') ?? false) && !x.classList.contains(overlayNonDetectableClass));
    if (displayedChildren.length > 0) {
        document?.documentElement.classList.add(overlayOpenBodyClass);
    } else {
        document?.documentElement.classList.remove(overlayOpenBodyClass);
    }
}

export function openOverlay(elementToAdd: HTMLElement, extraArguments?: ManagedLifecycleObjectGroupInitializeExtraArguments): HTMLElement | undefined {
    if (elementToAdd == null) {
        return;
    }
    removeScriptsAndStyles(elementToAdd);
    const element = getOverlayContentElement()?.appendChild(elementToAdd);
    if (element) {
        initializeManagedLifecycleObject({ 
            element, 
            extraArguments,
            attributeName: overlayTypeAttributeName, 
            objectGetterInitializer: getInitializeOverlayObjectsGroups 
        });
    }
    // triggers animation
    setTimeout(() => element?.classList.add(overlayShownClass), 0);
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

export function closeOverlay(overlayElement: HTMLElement): boolean {
    return closeOverlays({ closeAllOverlays: true, closeNonDetectable: true, byElement: overlayElement });
}

export function closeOverlayLast(args: { closeNonDetectable: boolean, byClass?: string, byElement?: HTMLElement }): boolean {
    if (args == null || typeof args !== 'object') {
        console.error('Arguments invalid!');
        return false;
    }

    return closeOverlays({ closeAllOverlays: false, closeNonDetectable: args.closeNonDetectable, byClass: args.byClass, byElement: args.byElement });
}

function _removeOverlay(overlay: HTMLElement, previousOverlaysFunction?: Function | null) {
    if (overlay == null || !isHTMLElement(overlay)) {
        throw Error('Overlay Invalid!');
    }

    const _removePreviousOverlays = () => {
        if (previousOverlaysFunction != null && typeof previousOverlaysFunction === 'function') {
            previousOverlaysFunction();
        }
    };

    const _destroyAndRemoveOverlay = (overlay: HTMLElement) => {
        destroyManagedLifecycleObject({ element: overlay, objectGetterInitializer: getInitializeOverlayObjectsGroups });
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

export function closeOverlays(args: { closeAllOverlays: boolean, closeNonDetectable: boolean, byClass?: string, byElement?: HTMLElement }): boolean {
    if (args == null || typeof args !== 'object') {
        console.error('Arguments invalid!');
        return false;
    }

    const closeAllOverlays = args.closeAllOverlays.toString().toLowerCase() === 'true';
    const closeNonDetectable = args.closeNonDetectable.toString().toLowerCase() === 'true';
    const closeByClasses = args.byClass?.toString().trim().split(/\s+/) ?? [];
    const closeByElement = args.byElement;

    const parentElement = getOverlayContentElement();
    var filteredOverlays = filterByHTMLElement(Array.from(parentElement?.children ?? []))
            .filter(element => closeNonDetectable || !element.classList.contains(overlayNonDetectableClass))
            .filter(element => closeByClasses.length === 0 || closeByClasses.every(cls => element.classList.contains(cls)))
            .filter(element => closeByElement == null || closeByElement == element);
    if (filteredOverlays.length > 0) {
        let removeOverlaysFunction: Function | null = null;
        for (let i = Math.max(0, closeAllOverlays ? 0 : filteredOverlays.length - 1); i < filteredOverlays.length; i++) {
            const child = filteredOverlays[i];
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

function getOverlayContentElement(): HTMLElement | null { 
    return ensureHTMLElementThrowOrNull(document.querySelector('#overlay-main > #overlay-content'), 'Overlay content is invalid!');
}
