import { runOnElementRemoval } from "./utilities";

const overlayShownClass = 'shown';
const overlaysOpenBodyClass = 'overlay-open';

export function hasOverlays(): boolean {
    return (getOverlayContentElement()?.children.length ?? 0) > 0;
}

var _overlayContentElement = getOverlayContentElement();

if (_overlayContentElement != null) {
    var overlayMutationObserver = new MutationObserver(function () {
        resetOverlayShownClassOnBody();
    });
    var overlayResizeObserver = new ResizeObserver(function () {
        resetOverlayShownClassOnBody();
    });
    overlayMutationObserver.observe(_overlayContentElement, { subtree: true, childList: true });
    overlayResizeObserver.observe(_overlayContentElement);
}

function resetOverlayShownClassOnBody() {
    var parentElement = getOverlayContentElement();
    if (parentElement == null) {
        return;
    }

    const allChildren: Element[] = [];
    for (var i = 0; i < parentElement.children.length; i++) {
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
    var element = getOverlayContentElement()?.appendChild(elementToAdd);
    // triggers animation
    setTimeout(() => element?.classList.add(overlayShownClass), 0);
    return element;
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

    for (var c = 0; c < overlay.children.length; c++) {
        var childOfOverlay = overlay.children[c];

        var computedStyle = childOfOverlay.computedStyleMap();
        var animationCssPropertyValue = computedStyle.get('animation');
        var transitionCssPropertyValue = computedStyle.get('transition');

        var animated = (animationCssPropertyValue != null && animationCssPropertyValue.toString().trim().length > 0) 
                        || (transitionCssPropertyValue != null && transitionCssPropertyValue.toString().trim().length > 0);

        if (animated) {
            var onElementEnd = () => {
                childOfOverlay?.remove();
                if (overlay != null && overlay.children.length === 0) {
                    overlay.remove();
                }
            };
            childOfOverlay.addEventListener('animationend', onElementEnd);
            childOfOverlay.addEventListener('transitionend', onElementEnd);
            runOnElementRemoval(childOfOverlay, onElementEnd, document.body);
        } else {
            childOfOverlay.remove();
        }
    }

    // triggers animation
    overlay.classList.remove(overlayShownClass);

    runOnElementRemoval(overlay, removePreviousOverlay);
    
    if (overlay.children.length === 0) {
        overlay.remove();
    }
}

export function closeOverlays(allOverlays: boolean = true): boolean {
    var parentElement = getOverlayContentElement();
    if (parentElement?.children != null && parentElement.children.length > 0) {
        for (var i = parentElement.children.length - 1; i >= 0; i--) {
            var child = parentElement.children[i];
            var previousChild = i > 0 ? parentElement.children[i - 1] : null;

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
