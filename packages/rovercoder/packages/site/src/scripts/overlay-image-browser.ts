import { ManagedLifecycleObject, OverlaysObjectGroup } from "./global.types.js";
import { getInitializeOverlayObjectsGroups } from "./overlay.js";
import { initCssVariableElementWatcher, removeCssVariableElementWatcherEntryIfExists, replaceHTMLElementText } from "./utilities-general.js";
import { destroyManagedLifecycleObject } from "./utilities-lifecycle.js";

getInitializeImageBrowserOverlayObjectsGroup();

const imageIndexCssVariableName = '--imageIndex';
const imageUnloadedClass = 'image-unloaded';

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
    destroyManagedLifecycleObject({ element: overlayElement, objectGetterInitializer: getInitializeOverlayObjectsGroups });

    const imageBrowserOverlayObjectGroup = getInitializeImageBrowserOverlayObjectsGroup();

    const imageBrowserStatusBarHeightElementWatched = overlayElement.querySelector('.status-bar-spacing') as HTMLElement;
    const imageBrowserStatusBarHeightElementToAttachVariableTo = overlayElement as HTMLElement;
    const imageBrowserStatusBarHeightCssVariableName = '--image-browser-status-bar-height';

    let imageBrowserStatusBarHeightWatcherDestructor = () => {};
    if (imageBrowserStatusBarHeightElementWatched != null) {
        initCssVariableElementWatcher({ 
            element: imageBrowserStatusBarHeightElementWatched, 
            elementToAttachVariableTo: imageBrowserStatusBarHeightElementToAttachVariableTo, 
            cssVariableName: imageBrowserStatusBarHeightCssVariableName, 
            elementPropertyWatched: 'height' 
        });

        imageBrowserStatusBarHeightWatcherDestructor =
            () => removeCssVariableElementWatcherEntryIfExists({ 
                elementToAttachVariableTo: imageBrowserStatusBarHeightElementToAttachVariableTo,
                cssVariableName: imageBrowserStatusBarHeightCssVariableName 
            });
    }

    const getImageIndex = (): number | undefined => {
        const value = (overlayElement as HTMLElement).style.getPropertyValue(imageIndexCssVariableName);
        const valueParsed = parseInt(value);
        return isNaN(valueParsed) ? undefined : valueParsed;
    };
    const setImageIndex = (imageIndex: number): void => { 
        (overlayElement as HTMLElement).style.setProperty(imageIndexCssVariableName, imageIndex.toString());
        const imagesContainer = getImagesContainer();
        if (imagesContainer != null) {
            if (imageIndex in imagesContainer.children && imagesContainer.children[imageIndex]) {
                imagesContainer.children[imageIndex].classList.remove(imageUnloadedClass);
            }
        }
    };
    const getImagesContainer = (): HTMLElement | undefined => overlayElement.querySelector('.images-container .images-container-inner') as HTMLElement | undefined;
    const getTextsContainer = (): HTMLElement | undefined => overlayElement.querySelector('.texts-container') as HTMLElement | undefined;
    const getImagesTotal = (): number | undefined => getImagesContainer()?.children.length;

    setImageIndex(getImageIndex() ?? 0);

    const imagePreviousButtons = Array.from(overlayElement.querySelectorAll('.action-indicators .action.previous[role="button"]'));
    const imageNextButtons = Array.from(overlayElement.querySelectorAll('.action-indicators .action.next[role="button"]'));
    const progressIndicatorIndexElements = Array.from(overlayElement.querySelectorAll('.progress-indicator .progress-indicator-element.index'));
    const progressIndicatorTotalElements = Array.from(overlayElement.querySelectorAll('.progress-indicator .progress-indicator-element.total'));

    const decreaseImageIndex = () => {
        const imageIndex = getImageIndex() ?? 0;
        const imagesTotal = getImagesTotal();
        if (imageIndex > 0) {
            if (imagesTotal != null && imageIndex > (imagesTotal - 1)) {
                setImageIndex(imagesTotal - 1);
            }
            else {
                setImageIndex(imageIndex - 1);
            }
        } else if (imageIndex < 0) {
            setImageIndex(0);
        }
        refreshVisualState();
    };

    const increaseImageIndex = () => {
        const imageIndex = getImageIndex() ?? 0;
        const imagesTotal = getImagesTotal();
        if (imageIndex >= 0) {
            if (imagesTotal != null && imageIndex >= (imagesTotal - 1)) {
                if (imageIndex > (imagesTotal - 1)) {
                    setImageIndex(imagesTotal - 1);
                }
            }
            else {
                setImageIndex(imageIndex + 1);
            }
        } else if (imageIndex < 0) {
            setImageIndex(0);
        }
        refreshVisualState();
    };

    const refreshVisualState = () => {
        switchImage();
        resetProgressIndicators();
        resetImageNavigatorsVisibility();
    };

    const switchImage = () => {
        const imageIndex = getImageIndex() ?? 0;
        const imagesTotal = getImagesTotal();

        const imagesContainer = getImagesContainer() as HTMLElement | null;
        if (imagesContainer == null) {
            return;
        }
        for (let i = 0; i < imagesContainer.children.length; i++) {
            if (i == imageIndex) {
                imagesContainer.children[i].classList.add('active');
            } else {
                imagesContainer.children[i].classList.remove('active');
            }
        }

        const textsContainer = getTextsContainer() as HTMLElement | null;
        if (textsContainer == null) {
            return;
        }
        for (let i = 0; i < textsContainer.children.length; i++) {
            if (i == imageIndex) {
                textsContainer.children[i].classList.add('active');
            } else {
                textsContainer.children[i].classList.remove('active');
            }
        }
    };

    const resetProgressIndicators = () => {
        const imageIndex = getImageIndex() ?? 0;
        const imagesTotal = getImagesTotal();

        progressIndicatorIndexElements.forEach(x => replaceHTMLElementText(x as HTMLElement, (imageIndex + 1).toString()));
        progressIndicatorTotalElements.forEach(x => replaceHTMLElementText(x as HTMLElement, (imagesTotal ?? 0).toString()));
    };

    const resetImageNavigatorsVisibility = () => {
        const imageIndex = getImageIndex() ?? 0;
        const imagesTotal = getImagesTotal();

        const visuallyHiddenClass = 'visually-hidden';

        let imagePreviousButtonShown = false;
        let imageNextButtonShown = false;

        if (imagesTotal != null) {
            if (imageIndex > 0 && imagesTotal > 1) {
                imagePreviousButtonShown = true;
            }
            if (imageIndex < (imagesTotal - 1)) {
                imageNextButtonShown = true;
            }
        } else {
            if (imageIndex > 0) {
                imagePreviousButtonShown = true;
            }
            imageNextButtonShown = true;
        }

        if (imagePreviousButtonShown) {
            imagePreviousButtons.forEach(x => x.classList.remove(visuallyHiddenClass));
        } else {
            imagePreviousButtons.forEach(x => x.classList.add(visuallyHiddenClass));
        }

        if (imageNextButtonShown) {
            imageNextButtons.forEach(x => x.classList.remove(visuallyHiddenClass));
        } else {
            imageNextButtons.forEach(x => x.classList.add(visuallyHiddenClass));
        }
    }

    refreshVisualState();

    let imagesContainerObserverRemover = () => {};
    let textsContainerObserverRemover = () => {};
    let overlayElementAttributeObserverRemover = () => {};
    
    const onMutationRefresh = () => refreshVisualState();
    
    const imagesContainer = getImagesContainer();
    if (imagesContainer != null) {
        const imagesContainerObserver = new MutationObserver(onMutationRefresh);
        imagesContainerObserver.observe(imagesContainer, { subtree: true, childList: true });
        imagesContainerObserverRemover = () => imagesContainerObserver.disconnect(); 
    }

    const textsContainer = getTextsContainer();
    if (textsContainer != null) {
        const textsContainerObserver = new MutationObserver(onMutationRefresh);
        textsContainerObserver.observe(textsContainer, { subtree: true, childList: true });
        textsContainerObserverRemover = () => textsContainerObserver.disconnect(); 
    }
    
    const overlayElementAttributeObserver = new MutationObserver(onMutationRefresh);
    overlayElementAttributeObserver.observe(overlayElement, { attributes: true }); // to listen to CSS variable changes
    overlayElementAttributeObserverRemover = () => overlayElementAttributeObserver.disconnect();

    imagePreviousButtons.forEach(x => x.addEventListener('click', decreaseImageIndex));
    imageNextButtons.forEach(x => x.addEventListener('click', increaseImageIndex));

    const stateEntry: ManagedLifecycleObject = {
        element: overlayElement,
        components: {
            ...(imageBrowserStatusBarHeightElementWatched != null ? {
                'imageBrowserStatusBarSpacing': {
                    element: imageBrowserStatusBarHeightElementWatched,
                    observables: {
                        'imageBrowserStatusBarHeightCssVariable': {
                            destructor: imageBrowserStatusBarHeightWatcherDestructor
                        } 
                    },
                    listeners: {}
                }
            } : {}),
            ...Object.assign({}, ...(imagePreviousButtons.map((imagePreviousButton, i) => ({
                [`imagePrevious-${i}`]: {
                    element: imagePreviousButton as HTMLElement,
                    observables: {},
                    listeners: {
                        'click': {
                            destructor: () => imagePreviousButton.removeEventListener('click', decreaseImageIndex)
                        }
                    }
                }
            })))),
            ...Object.assign({}, ...(imageNextButtons.map((imageNextButton, i) => ({
                [`imageNext-${i}`]: {
                    element: imageNextButton as HTMLElement,
                    observables: {},
                    listeners: {
                        'click': {
                            destructor: () => imageNextButton.removeEventListener('click', increaseImageIndex)
                        }
                    }
                }
            })))),
            ...(imagesContainer != null ? {
                'imagesContainer': {
                    element: imagesContainer,
                    observables: {
                        'onMutationRefresh': {
                            destructor: imagesContainerObserverRemover
                        } 
                    },
                    listeners: {}
                }
            } : {}),
            ...(textsContainer != null ? {
                'textsContainer': {
                    element: textsContainer,
                    observables: {
                        'onMutationRefresh': {
                            destructor: textsContainerObserverRemover
                        } 
                    },
                    listeners: {}
                }
            } : {}),
            'overlayElement': {
                element: overlayElement,
                observables: {
                    'onMutationRefresh': {
                        destructor: overlayElementAttributeObserverRemover
                    }
                },
                listeners: {}
            }
        }
    };
    imageBrowserOverlayObjectGroup.state.push(stateEntry);
}
