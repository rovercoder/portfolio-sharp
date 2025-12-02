import { CardHeadersObject, WindowCustom } from "./global.types.js";
import { openOverlay } from "./overlay.js";

let cardHeaderInnerElements = document.querySelectorAll('.card-header-inner');
const imageIndexCssVariableName = '--imageIndex';

(window as WindowCustom).savedCardHeaderObjects?.forEach((x) => {
    let obj = (x as CardHeadersObject);
    obj.imageBrowserOpenButtonTapHandleRemover?.();
    obj.imageNextButtonTapHandleRemover?.();
    obj.imagePreviousButtonTapHandleRemover?.();
    obj.infoButtonHoverHandleRemover?.();
    obj.infoButtonTapHandleRemover?.();
});

let savedCardHeaderObjects: CardHeadersObject[] = [];
(window as WindowCustom).savedCardHeaderObjects = savedCardHeaderObjects;

cardHeaderInnerElements.forEach(cardHeaderInnerElement => {
    let imageBrowserOverlay: HTMLElement | undefined;
    const getImageIndex = (): number | undefined => {
        const value = (cardHeaderInnerElement as HTMLElement).style.getPropertyValue(imageIndexCssVariableName);
        const valueParsed = parseInt(value);
        return isNaN(valueParsed) ? undefined : valueParsed;
    };
    const setImageIndex = (imageIndex: number): void => { 
        (cardHeaderInnerElement as HTMLElement).style.setProperty(imageIndexCssVariableName, imageIndex.toString());
        imageBrowserOverlay?.style.setProperty(imageIndexCssVariableName, imageIndex.toString());
    };
    const getImagesTotal = (): number | undefined => cardHeaderInnerElement.querySelector('.image-preview .images-container')?.children.length;

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
        } else if (imageIndex < 0) {
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
        } else if (imageIndex < 0) {
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
        } else {
            if (imageIndex > 0) {
                imagePreviousButtonShown = true;
            }
            imageNextButtonShown = true;
        }

        if (imagePreviousButtonShown) {
            imagePreviousButton?.classList.remove(visuallyHiddenClass);
        } else {
            imagePreviousButton?.classList.add(visuallyHiddenClass);
        }

        if (imageNextButtonShown) {
            imageNextButton?.classList.remove(visuallyHiddenClass);
        } else {
            imageNextButton?.classList.add(visuallyHiddenClass);
        }
    }

    const openImageBrowser = () => {
        const _imageBrowserOverlay = cardHeaderInnerElement.querySelector('.overlay-image-browser');
        if (_imageBrowserOverlay != null) {
            const imageBrowserOverlayClone = _imageBrowserOverlay.cloneNode(true) as HTMLElement;
            imageBrowserOverlayClone.removeAttribute('aria-hidden');
            imageBrowserOverlay = openOverlay(imageBrowserOverlayClone) as HTMLElement | undefined;
            setImageIndex(getImageIndex() ?? 0);
        }
    }

    imagePreviousButton?.addEventListener('click', decreaseImageIndex);
    imageNextButton?.addEventListener('click', increaseImageIndex);
    imageBrowserOpenButton?.addEventListener('click', openImageBrowser);

    const savedCardHeaderObject: CardHeadersObject = {
        innerElement: cardHeaderInnerElement as HTMLElement,
        imagePreviousButtonTapHandleRemover: () => { 
            imagePreviousButton?.removeEventListener('click', decreaseImageIndex);
        },
        imageNextButtonTapHandleRemover: () => {
            imageNextButton?.removeEventListener('click', increaseImageIndex);
        },
        imageBrowserOpenButtonTapHandleRemover: () => {
            imageBrowserOpenButton?.removeEventListener('click', openImageBrowser);
        }
    };
    savedCardHeaderObjects.push(savedCardHeaderObject);
});
