import { ManagedLifecycleObject, OverlaysObjectGroup } from "./global.types.js";
import { getInitializeOverlayObjectsGroups } from "./overlay.js";
import { initCssVariableElementWatcher, removeCssVariableElementWatcherEntryIfExists } from "./utilities-general.js";

getInitializeImageBrowserOverlayObjectsGroup();

function getInitializeImageBrowserOverlayObjectsGroup(): OverlaysObjectGroup {
    var overlayObjectsGroups = getInitializeOverlayObjectsGroups();

    if (overlayObjectsGroups['image-browser'] == null) {
        overlayObjectsGroups['image-browser'] = {
            initialize: initializeImageBrowserOverlay,
            destroy: undefined,
            state: []
        }
    }

    return overlayObjectsGroups['image-browser']!;
}

function initializeImageBrowserOverlay(overlayElement: HTMLElement) {
    const imageBrowserOverlayObjectGroup = getInitializeImageBrowserOverlayObjectsGroup();

    const imageBrowserStatusBarHeightElementWatched = overlayElement.querySelector('.status-bar-spacing') as HTMLElement;
    const imageBrowserStatusBarHeightElementToAttachVariableTo = overlayElement as HTMLElement;
    const imageBrowserStatusBarHeightCssVariableName = '--image-browser-status-bar-height';

    initCssVariableElementWatcher({ 
        element: imageBrowserStatusBarHeightElementWatched, 
        elementToAttachVariableTo: imageBrowserStatusBarHeightElementToAttachVariableTo, 
        cssVariableName: imageBrowserStatusBarHeightCssVariableName, 
        elementPropertyWatched: 'height' 
    });

    const imageBrowserStatusBarHeightWatcherDestructor =
        () => removeCssVariableElementWatcherEntryIfExists({ 
            elementToAttachVariableTo: imageBrowserStatusBarHeightElementToAttachVariableTo,
            cssVariableName: imageBrowserStatusBarHeightCssVariableName 
        });
        
    

    const stateEntry: ManagedLifecycleObject = {
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
