import { OverlayEntry, WindowCustom } from "./global.types.js";
import { initCssVariableElementWatcher } from "./utilities.js";

getInitializeImageBrowserOverlayObject();

function getInitializeImageBrowserOverlayObject(): OverlayEntry {
    if ((window as WindowCustom)._siteCustomOverlays == null) {
        (window as WindowCustom)._siteCustomOverlays = {};
    }

    if ((window as WindowCustom)._siteCustomOverlays!['image-browser'] == null) {
        (window as WindowCustom)._siteCustomOverlays!['image-browser'] = {
            initialize: initializeImageBrowserOverlay,
            destroy: undefined,
            state: []
        }
    }

    return (window as WindowCustom)._siteCustomOverlays!['image-browser'];
}

function initializeImageBrowserOverlay(overlayElement: HTMLElement) {
    const imageBrowserOverlayObject = getInitializeImageBrowserOverlayObject();

    initCssVariableElementWatcher({ element: overlayElement.querySelector('.progress-indicators-action-buttons-spacing') as HTMLElement, elementToAttachVariableTo: overlayElement as HTMLElement, cssVariableName: '--image-browser-progress-indicators-action-buttons-height', elementPropertyWatched: 'height' });

    
}
