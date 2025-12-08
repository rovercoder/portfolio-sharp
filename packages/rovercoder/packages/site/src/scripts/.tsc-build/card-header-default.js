import { getInitializeCardHeaderObjectsGroups } from "./card-header.js";
import { openOverlay } from "./overlay.js";
const imageIndexCssVariableName = '--imageIndex';
const imageUnloadedClass = 'image-unloaded';
getInitializeDefaultCardHeaderObjectsGroup();
function getInitializeDefaultCardHeaderObjectsGroup() {
    var cardHeaderObjectsGroups = getInitializeCardHeaderObjectsGroups();
    if (cardHeaderObjectsGroups['default'] == null) {
        cardHeaderObjectsGroups['default'] = {
            initialize: initializeDefaultCardHeader,
            destroy: undefined,
            state: []
        };
    }
    return cardHeaderObjectsGroups['default'];
}
function initializeDefaultCardHeader(cardHeaderElement) {
    var defaultCardHeaderObjectGroup = getInitializeDefaultCardHeaderObjectsGroup();
    const cardHeaderInnerElement = cardHeaderElement.querySelector('.card-header-inner');
    if (cardHeaderInnerElement == null) {
        return;
    }
    let imageBrowserOverlay;
    const getImageIndex = () => {
        const value = cardHeaderInnerElement.style.getPropertyValue(imageIndexCssVariableName);
        const valueParsed = parseInt(value);
        return isNaN(valueParsed) ? undefined : valueParsed;
    };
    const setImageIndex = (imageIndex) => {
        cardHeaderInnerElement.style.setProperty(imageIndexCssVariableName, imageIndex.toString());
        const imagesContainer = getImagesContainer();
        if (imagesContainer != null) {
            if (imageIndex in imagesContainer.children && imagesContainer.children[imageIndex]) {
                imagesContainer.children[imageIndex].classList.remove(imageUnloadedClass);
            }
        }
        imageBrowserOverlay?.style.setProperty(imageIndexCssVariableName, imageIndex.toString());
    };
    const getImagesContainer = () => cardHeaderInnerElement.querySelector('.image-preview .images-container');
    const getImagesTotal = () => getImagesContainer()?.children.length;
    setImageIndex(getImageIndex() ?? 0);
    const controlsTop = cardHeaderInnerElement.querySelector('.controls-top');
    const infoButton = controlsTop?.querySelector('.info[role="button"]');
    const imageBrowserOpenButton = controlsTop?.querySelector('.image-browser-open[role="button"]');
    const controlsMiddle = cardHeaderInnerElement.querySelector('.controls-middle');
    const imagePreviousButton = controlsMiddle?.querySelector('.image-previous[role="button"]');
    const imageNextButton = controlsMiddle?.querySelector('.image-next[role="button"]');
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
        }
        else if (imageIndex < 0) {
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
        }
        else if (imageIndex < 0) {
            setImageIndex(0);
        }
        refreshVisualState();
    };
    const refreshVisualState = () => {
        resetImageNavigatorsVisibility();
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
        }
        else {
            if (imageIndex > 0) {
                imagePreviousButtonShown = true;
            }
            imageNextButtonShown = true;
        }
        if (imagePreviousButtonShown) {
            imagePreviousButton?.classList.remove(visuallyHiddenClass);
        }
        else {
            imagePreviousButton?.classList.add(visuallyHiddenClass);
        }
        if (imageNextButtonShown) {
            imageNextButton?.classList.remove(visuallyHiddenClass);
        }
        else {
            imageNextButton?.classList.add(visuallyHiddenClass);
        }
    };
    refreshVisualState();
    let imagesContainerObserverRemover = () => { };
    let cardHeaderInnerElementAttributeObserverRemover = () => { };
    const onMutationRefresh = () => refreshVisualState();
    const imagesContainer = getImagesContainer();
    if (imagesContainer != null) {
        const imagesContainerObserver = new MutationObserver(onMutationRefresh);
        imagesContainerObserver.observe(imagesContainer, { subtree: true, childList: true });
        imagesContainerObserverRemover = () => imagesContainerObserver.disconnect();
    }
    if (cardHeaderInnerElement != null) {
        const cardHeaderInnerElementAttributeObserver = new MutationObserver(onMutationRefresh);
        cardHeaderInnerElementAttributeObserver.observe(cardHeaderInnerElement, { attributes: true }); // to listen to CSS variable changes
        cardHeaderInnerElementAttributeObserverRemover = () => cardHeaderInnerElementAttributeObserver.disconnect();
    }
    const openImageBrowser = () => {
        const _imageBrowserOverlay = cardHeaderInnerElement.querySelector('.overlay-image-browser');
        if (_imageBrowserOverlay != null) {
            const imageBrowserOverlayClone = _imageBrowserOverlay.cloneNode(true);
            imageBrowserOverlayClone.removeAttribute('aria-hidden');
            imageBrowserOverlay = openOverlay(imageBrowserOverlayClone);
            setImageIndex(getImageIndex() ?? 0);
        }
    };
    imagePreviousButton?.addEventListener('click', decreaseImageIndex);
    const imagePreviousButtonTapHandleRemover = () => {
        imagePreviousButton?.removeEventListener('click', decreaseImageIndex);
    };
    imageNextButton?.addEventListener('click', increaseImageIndex);
    const imageNextButtonTapHandleRemover = () => {
        imageNextButton?.removeEventListener('click', increaseImageIndex);
    };
    imageBrowserOpenButton?.addEventListener('click', openImageBrowser);
    const imageBrowserOpenButtonTapHandleRemover = () => {
        imageBrowserOpenButton?.removeEventListener('click', openImageBrowser);
    };
    const stateEntry = {
        element: cardHeaderElement,
        components: {
            ...(imagePreviousButton != null ? {
                'imagePreviousButton': {
                    element: imagePreviousButton,
                    observables: {},
                    listeners: {
                        'imagePreviousButtonTapHandleRemover': {
                            destructor: imagePreviousButtonTapHandleRemover
                        }
                    }
                }
            } : {}),
            ...(imageNextButton != null ? {
                'imageNextButton': {
                    element: imageNextButton,
                    observables: {},
                    listeners: {
                        'imageNextButtonTapHandleRemover': {
                            destructor: imageNextButtonTapHandleRemover
                        }
                    }
                }
            } : {}),
            ...(imageBrowserOpenButton != null ? {
                'imageBrowserOpenButton': {
                    element: imageBrowserOpenButton,
                    observables: {},
                    listeners: {
                        'imageBrowserOpenButtonTapHandleRemover': {
                            destructor: imageBrowserOpenButtonTapHandleRemover
                        }
                    }
                }
            } : {}),
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
            ...(cardHeaderInnerElement != null ? {
                'cardHeaderInnerElement': {
                    element: cardHeaderInnerElement,
                    observables: {
                        'onMutationRefresh': {
                            destructor: cardHeaderInnerElementAttributeObserverRemover
                        }
                    },
                    listeners: {}
                }
            } : {})
        }
    };
    defaultCardHeaderObjectGroup.state.push(stateEntry);
}
