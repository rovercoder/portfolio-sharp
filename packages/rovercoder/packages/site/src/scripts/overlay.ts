import { initCssVariableElementWatcher, runOnElementRemoval } from "./utilities.js";

const overlayShownClass = 'shown';
const overlaysOpenBodyClass = 'overlay-open';

initCssVariableElementWatcher({ element: getOverlayContentElement() as HTMLElement, elementToAttachVariableTo: getOverlayContentElement() as HTMLElement, cssVariableName: '--overlayHeight', elementPropertyWatched: 'height' });

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
    initializeOverlayElement(element);
    if (element.children == null) {
        return;
    }
    for (let i = 0; i < element.children.length; i++) {
        initializeOverlay(element.children[i]);
    }
}

function initializeOverlayElement(element: Element) {
    const attribute = element.attributes.getNamedItem('data-initialization-javascript');
    if (attribute != null) {
        eval(attribute.value);
    }
}

export function closeOverlayLast(): boolean {
    return closeOverlays(false);
}

function _removeOverlay(overlay: Element, previousOverlay?: Element | null) {
    if (overlay == null) {
        throw Error('Overlay Invalid!');
    }

    const removePreviousOverlay = () => {
        if (previousOverlay != null) {
            _removeOverlay(previousOverlay);
        }
    };

    const cleanupFunctionsIfAnimationTransitionListenerFails: Function[] = [];
    const cleanupFunctionsIfAnimationTransitionListenerFailsDelayAllowanceMs = 500;

    const overlayChildren: Element[] = Array.from(overlay.children);

    for (let c = 0; c < overlayChildren.length; c++) {
        const childOfOverlay = overlayChildren[c];

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
                childOfOverlay?.remove();
                if (overlay != null && overlay.children.length === 0) {
                    overlay.remove();
                }
            };
            childOfOverlay.addEventListener('animationend', onElementEnd);
            childOfOverlay.addEventListener('transitionend', onElementEnd);
            runOnElementRemoval(childOfOverlay, onElementEnd, document.body);
            cleanupFunctionsIfAnimationTransitionListenerFails.push(() => setTimeout(onElementEnd, maxAnimationTransitionDurationMs + cleanupFunctionsIfAnimationTransitionListenerFailsDelayAllowanceMs))
        } else {
            childOfOverlay.remove();
        }
    }

    // triggers animation
    overlay.classList.remove(overlayShownClass);

    cleanupFunctionsIfAnimationTransitionListenerFails.forEach((fn) => fn());

    runOnElementRemoval(overlay, removePreviousOverlay);
    
    if (overlay.children.length === 0) {
        overlay.remove();
    }
}

export function closeOverlays(allOverlays: boolean = true): boolean {
    const parentElement = getOverlayContentElement();
    if (parentElement?.children != null && parentElement.children.length > 0) {
        for (let i = parentElement.children.length - 1; i >= 0; i--) {
            const child = parentElement.children[i];
            const previousChild = i > 0 ? parentElement.children[i - 1] : null;

            if (i === 0) {
                _removeOverlay(child, allOverlays ? previousChild : null);
            }
            if (!allOverlays) {
                break;
            }
        }
        return true;
    }
    return false;
}

function getOverlayContentElement(): Element | null { 
    return document.querySelector('#overlay-main > #overlay-content');
}
