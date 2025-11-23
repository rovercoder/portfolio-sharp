var cardHeaderInnerElements = document.querySelectorAll('.card-header-inner');
const imageIndexCssVariableName = '--imageIndex';

window.savedCardHeaderObjects?.forEach((x) => {
    var obj = (x as CardHeadersObject);
    obj.imageBrowserOpenButtonTapHandleRemover?.();
    obj.imageNextButtonTapHandleRemover?.();
    obj.imagePreviousButtonTapHandleRemover?.();
    obj.infoButtonHoverHandleRemover?.();
    obj.infoButtonTapHandleRemover?.();
});

var savedCardHeaderObjects: CardHeadersObject[] = [];
window.savedCardHeaderObjects = savedCardHeaderObjects;

cardHeaderInnerElements.forEach(cardHeaderInnerElement => {
    const getImageIndex = (): number | undefined => {
        var value = (cardHeaderInnerElement as HTMLElement).style.getPropertyValue(imageIndexCssVariableName);
        var valueParsed = parseInt(value);
        return isNaN(valueParsed) ? undefined : valueParsed;
    };
    const setImageIndex = (imageIndex: number): void => { 
        (cardHeaderInnerElement as HTMLElement).style.setProperty(imageIndexCssVariableName, imageIndex.toString());
    };
    const getImagesTotal = (): number | undefined => cardHeaderInnerElement.querySelector('.image-preview .images-container')?.children.length;

    var controlsTop = cardHeaderInnerElement.querySelector('.controls-top');
    var infoButton = controlsTop?.querySelector('.info[role="button"]');
    var imageBrowserOpenButton = controlsTop?.querySelector('.image-browser-open[role="button"]');

    var controlsMiddle = cardHeaderInnerElement.querySelector('.controls-middle');
    var imagePreviousButton = controlsMiddle?.querySelector('.image-previous[role="button"]');
    var imageNextButton = controlsMiddle?.querySelector('.image-next[role="button"]');

    const decreaseImageIndex = () => {
        var imageIndex = getImageIndex() ?? 0;
        var imagesTotal = getImagesTotal();
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
        var imageIndex = getImageIndex() ?? 0;
        var imagesTotal = getImagesTotal();
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
        var imageIndex = getImageIndex() ?? 0;
        var imagesTotal = getImagesTotal();

        var visuallyHiddenClass = 'visually-hidden';

        var imagePreviousButtonShown = false;
        var imageNextButtonShown = false;

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

    imagePreviousButton?.addEventListener('click', decreaseImageIndex);
    imageNextButton?.addEventListener('click', increaseImageIndex);

    var savedCardHeaderObject: CardHeadersObject = {
        innerElement: cardHeaderInnerElement as HTMLElement,
        imagePreviousButtonTapHandleRemover: () => { 
            imagePreviousButton?.removeEventListener('click', decreaseImageIndex);
        },
        imageNextButtonTapHandleRemover: () => {
            imageNextButton?.removeEventListener('click', increaseImageIndex);
        }
    };
    savedCardHeaderObjects.push(savedCardHeaderObject);
});

interface CardHeadersObject {
    innerElement: HTMLElement;
    imagePreviousButtonTapHandleRemover?: Function;
    imageNextButtonTapHandleRemover?: Function;
    imageBrowserOpenButtonTapHandleRemover?: Function;
    infoButtonTapHandleRemover?: Function;
    infoButtonHoverHandleRemover?: Function;
}
