"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOverlays = hasOverlays;
exports.openOverlay = openOverlay;
exports.closeOverlayLast = closeOverlayLast;
exports.closeOverlays = closeOverlays;
var utilities_1 = require("./utilities");
var overlayShownClass = 'shown';
var overlaysOpenBodyClass = 'overlay-open';
function hasOverlays() {
    var _a, _b;
    return ((_b = (_a = getOverlayContentElement()) === null || _a === void 0 ? void 0 : _a.children.length) !== null && _b !== void 0 ? _b : 0) > 0;
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
    var allChildren = [];
    for (var i = 0; i < parentElement.children.length; i++) {
        allChildren.push(parentElement.children[i]);
    }
    var displayedChildren = allChildren.filter(function (x) { var _a, _b; return !((_b = (_a = x.computedStyleMap().get('display')) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase().startsWith('none')) !== null && _b !== void 0 ? _b : false); });
    if (displayedChildren.length > 0) {
        document === null || document === void 0 ? void 0 : document.documentElement.classList.add(overlaysOpenBodyClass);
    }
    else {
        document === null || document === void 0 ? void 0 : document.documentElement.classList.remove(overlaysOpenBodyClass);
    }
}
function openOverlay(elementToAdd) {
    var _a;
    var element = (_a = getOverlayContentElement()) === null || _a === void 0 ? void 0 : _a.appendChild(elementToAdd);
    // triggers animation
    setTimeout(function () { return element === null || element === void 0 ? void 0 : element.classList.add(overlayShownClass); }, 0);
    return element;
}
function closeOverlayLast() {
    return closeOverlays(false);
}
function _removeOverlay(overlay, previousOverlay) {
    if (overlay == null) {
        throw Error('Overlay Invalid!');
    }
    var removePreviousOverlay = function () {
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
            var onElementEnd = function () {
                childOfOverlay === null || childOfOverlay === void 0 ? void 0 : childOfOverlay.remove();
                if (overlay != null && overlay.children.length === 0) {
                    overlay.remove();
                }
            };
            childOfOverlay.addEventListener('animationend', onElementEnd);
            childOfOverlay.addEventListener('transitionend', onElementEnd);
            (0, utilities_1.runOnElementRemoval)(childOfOverlay, onElementEnd, document.body);
        }
        else {
            childOfOverlay.remove();
        }
    }
    // triggers animation
    overlay.classList.remove(overlayShownClass);
    (0, utilities_1.runOnElementRemoval)(overlay, removePreviousOverlay);
    if (overlay.children.length === 0) {
        overlay.remove();
    }
}
function closeOverlays(allOverlays) {
    if (allOverlays === void 0) { allOverlays = true; }
    var parentElement = getOverlayContentElement();
    if ((parentElement === null || parentElement === void 0 ? void 0 : parentElement.children) != null && parentElement.children.length > 0) {
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
function getOverlayContentElement() {
    return document.querySelector('#overlay-main > #overlay-content');
}
