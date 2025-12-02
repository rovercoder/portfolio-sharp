import { initCssVariableElementWatcher } from "./utilities.js";
function initImageBrowserOverlay() {
    document.querySelectorAll('#overlay-main #overlay-content .overlay.overlay-image-browser').forEach(overlayElement => {
        initCssVariableElementWatcher({ element: overlayElement.querySelector('.progress-indicators-action-buttons-spacing'), elementToAttachVariableTo: overlayElement, cssVariableName: '--image-browser-progress-indicators-action-buttons-height', elementPropertyWatched: 'height' });
    });
}
window.initImageBrowserOverlay = initImageBrowserOverlay;
initImageBrowserOverlay();
