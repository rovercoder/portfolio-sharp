import { initCssVariableElementWatcher } from "./utilities.js";
getInitializeImageBrowserOverlayObject();
function getInitializeImageBrowserOverlayObject() {
    if (window._siteCustomOverlays == null) {
        window._siteCustomOverlays = {};
    }
    if (window._siteCustomOverlays['image-browser'] == null) {
        window._siteCustomOverlays['image-browser'] = {
            initialize: initializeImageBrowserOverlay,
            destroy: undefined,
            state: []
        };
    }
    return window._siteCustomOverlays['image-browser'];
}
function initializeImageBrowserOverlay(overlayElement) {
    const imageBrowserOverlayObject = getInitializeImageBrowserOverlayObject();
    initCssVariableElementWatcher({ element: overlayElement.querySelector('.progress-indicators-action-buttons-spacing'), elementToAttachVariableTo: overlayElement, cssVariableName: '--image-browser-progress-indicators-action-buttons-height', elementPropertyWatched: 'height' });
}
