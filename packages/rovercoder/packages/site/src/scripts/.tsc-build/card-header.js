import { openOverlay } from "./overlay.js";
let cardHeaderInnerElements = document.querySelectorAll('.card-header-inner');
const imageIndexCssVariableName = '--imageIndex';
window._siteCustomSavedCardHeaderObjects?.forEach((x) => {
    let obj = x;
    obj.imageBrowserOpenButtonTapHandleRemover?.();
    obj.imageNextButtonTapHandleRemover?.();
    obj.imagePreviousButtonTapHandleRemover?.();
    obj.infoButtonHoverHandleRemover?.();
    obj.infoButtonTapHandleRemover?.();
    obj.imagesContainerObserverRemover?.();
});
let savedCardHeaderObjects = [];
window._siteCustomSavedCardHeaderObjects = savedCardHeaderObjects;
cardHeaderInnerElements.forEach(cardHeaderInnerElement => {
    let imageBrowserOverlay;
    const getImageIndex = () => {
        const value = cardHeaderInnerElement.style.getPropertyValue(imageIndexCssVariableName);
        const valueParsed = parseInt(value);
        return isNaN(valueParsed) ? undefined : valueParsed;
    };
    const setImageIndex = (imageIndex) => {
        cardHeaderInnerElement.style.setProperty(imageIndexCssVariableName, imageIndex.toString());
        imageBrowserOverlay?.style.setProperty(imageIndexCssVariableName, imageIndex.toString());
    };
    const getImagesContainer = () => cardHeaderInnerElement.querySelector('.image-preview .images-container');
    const getImagesTotal = () => getImagesContainer()?.children.length;
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
        resetImageNavigatorsVisibility();
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
    let imagesContainerObserverRemover = undefined;
    const imagesContainer = getImagesContainer();
    if (imagesContainer != null) {
        const imagesContainerObserver = new MutationObserver(() => resetImageNavigatorsVisibility());
        imagesContainerObserver.observe(imagesContainer, { subtree: true, childList: true });
        imagesContainerObserverRemover = () => imagesContainerObserver.disconnect();
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
    imageNextButton?.addEventListener('click', increaseImageIndex);
    imageBrowserOpenButton?.addEventListener('click', openImageBrowser);
    const savedCardHeaderObject = {
        innerElement: cardHeaderInnerElement,
        imagePreviousButtonTapHandleRemover: () => {
            imagePreviousButton?.removeEventListener('click', decreaseImageIndex);
        },
        imageNextButtonTapHandleRemover: () => {
            imageNextButton?.removeEventListener('click', increaseImageIndex);
        },
        imageBrowserOpenButtonTapHandleRemover: () => {
            imageBrowserOpenButton?.removeEventListener('click', openImageBrowser);
        },
        imagesContainerObserverRemover
    };
    savedCardHeaderObjects.push(savedCardHeaderObject);
});
