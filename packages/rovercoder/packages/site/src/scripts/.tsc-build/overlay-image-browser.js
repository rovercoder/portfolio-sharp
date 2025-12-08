import { getInitializeOverlayObjectsGroups } from "./overlay.js";
import { initCssVariableElementWatcher, removeCssVariableElementWatcherEntryIfExists } from "./utilities-general.js";
getInitializeImageBrowserOverlayObjectsGroup();
function getInitializeImageBrowserOverlayObjectsGroup() {
    var overlayObjectsGroups = getInitializeOverlayObjectsGroups();
    if (overlayObjectsGroups['image-browser'] == null) {
        overlayObjectsGroups['image-browser'] = {
            initialize: initializeImageBrowserOverlay,
            destroy: undefined,
            state: []
        };
    }
    return overlayObjectsGroups['image-browser'];
}
function initializeImageBrowserOverlay(overlayElement) {
    const imageBrowserOverlayObjectGroup = getInitializeImageBrowserOverlayObjectsGroup();
    const imageBrowserStatusBarHeightElementWatched = overlayElement.querySelector('.status-bar-spacing');
    const imageBrowserStatusBarHeightElementToAttachVariableTo = overlayElement;
    const imageBrowserStatusBarHeightCssVariableName = '--image-browser-status-bar-height';
    initCssVariableElementWatcher({
        element: imageBrowserStatusBarHeightElementWatched,
        elementToAttachVariableTo: imageBrowserStatusBarHeightElementToAttachVariableTo,
        cssVariableName: imageBrowserStatusBarHeightCssVariableName,
        elementPropertyWatched: 'height'
    });
    const imageBrowserStatusBarHeightWatcherDestructor = () => removeCssVariableElementWatcherEntryIfExists({
        elementToAttachVariableTo: imageBrowserStatusBarHeightElementToAttachVariableTo,
        cssVariableName: imageBrowserStatusBarHeightCssVariableName
    });
    const stateEntry = {
        element: overlayElement,
        components: {
            'imageBrowserStatusBarSpacing': {
                element: imageBrowserStatusBarHeightElementWatched,
                observables: {
                    'imageBrowserStatusBarHeightCssVariable': {
                        destructor: imageBrowserStatusBarHeightWatcherDestructor
                    }
                },
                listeners: {}
            }
        }
    };
    imageBrowserOverlayObjectGroup.state.push(stateEntry);
}
