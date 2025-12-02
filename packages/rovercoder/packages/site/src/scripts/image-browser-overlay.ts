import { WindowCustom } from "./global.types.js";
import { initCssVariableElementWatcher } from "./utilities.js";

function initImageBrowserOverlay() {
    document.querySelectorAll('#overlay-main #overlay-content .overlay.overlay-image-browser').forEach(overlayElement => {
        initCssVariableElementWatcher({ element: overlayElement.querySelector('.progress-indicators-action-buttons-spacing') as HTMLElement, elementToAttachVariableTo: overlayElement as HTMLElement, cssVariableName: '--image-browser-progress-indicators-action-buttons-height', elementPropertyWatched: 'height' });
    });
}

(window as WindowCustom).initImageBrowserOverlay = initImageBrowserOverlay;

initImageBrowserOverlay();
