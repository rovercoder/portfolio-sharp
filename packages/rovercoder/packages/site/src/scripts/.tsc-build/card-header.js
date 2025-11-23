"use strict";
var _a;
var cardHeaderInnerElements = document.querySelectorAll('.card-header-inner');
var imageIndexCssVariableName = '--imageIndex';
(_a = window.savedCardHeaderObjects) === null || _a === void 0 ? void 0 : _a.forEach(function (x) {
    var _a, _b, _c, _d, _e;
    var obj = x;
    (_a = obj.imageBrowserOpenButtonTapHandleRemover) === null || _a === void 0 ? void 0 : _a.call(obj);
    (_b = obj.imageNextButtonTapHandleRemover) === null || _b === void 0 ? void 0 : _b.call(obj);
    (_c = obj.imagePreviousButtonTapHandleRemover) === null || _c === void 0 ? void 0 : _c.call(obj);
    (_d = obj.infoButtonHoverHandleRemover) === null || _d === void 0 ? void 0 : _d.call(obj);
    (_e = obj.infoButtonTapHandleRemover) === null || _e === void 0 ? void 0 : _e.call(obj);
});
var savedCardHeaderObjects = [];
window.savedCardHeaderObjects = savedCardHeaderObjects;
cardHeaderInnerElements.forEach(function (cardHeaderInnerElement) {
    var getImageIndex = function () {
        var value = cardHeaderInnerElement.style.getPropertyValue(imageIndexCssVariableName);
        var valueParsed = parseInt(value);
        return isNaN(valueParsed) ? undefined : valueParsed;
    };
    var setImageIndex = function (imageIndex) {
        cardHeaderInnerElement.style.setProperty(imageIndexCssVariableName, imageIndex.toString());
    };
    var getImagesTotal = function () { var _a; return (_a = cardHeaderInnerElement.querySelector('.image-preview .images-container')) === null || _a === void 0 ? void 0 : _a.children.length; };
    var controlsTop = cardHeaderInnerElement.querySelector('.controls-top');
    var infoButton = controlsTop === null || controlsTop === void 0 ? void 0 : controlsTop.querySelector('.info[role="button"]');
    var imageBrowserOpenButton = controlsTop === null || controlsTop === void 0 ? void 0 : controlsTop.querySelector('.image-browser-open[role="button"]');
    var controlsMiddle = cardHeaderInnerElement.querySelector('.controls-middle');
    var imagePreviousButton = controlsMiddle === null || controlsMiddle === void 0 ? void 0 : controlsMiddle.querySelector('.image-previous[role="button"]');
    var imageNextButton = controlsMiddle === null || controlsMiddle === void 0 ? void 0 : controlsMiddle.querySelector('.image-next[role="button"]');
    var decreaseImageIndex = function () {
        var _a;
        var imageIndex = (_a = getImageIndex()) !== null && _a !== void 0 ? _a : 0;
        var imagesTotal = getImagesTotal();
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
    var increaseImageIndex = function () {
        var _a;
        var imageIndex = (_a = getImageIndex()) !== null && _a !== void 0 ? _a : 0;
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
        }
        else if (imageIndex < 0) {
            setImageIndex(0);
        }
        resetImageNavigatorsVisibility();
    };
    var resetImageNavigatorsVisibility = function () {
        var _a;
        var imageIndex = (_a = getImageIndex()) !== null && _a !== void 0 ? _a : 0;
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
        }
        else {
            if (imageIndex > 0) {
                imagePreviousButtonShown = true;
            }
            imageNextButtonShown = true;
        }
        if (imagePreviousButtonShown) {
            imagePreviousButton === null || imagePreviousButton === void 0 ? void 0 : imagePreviousButton.classList.remove(visuallyHiddenClass);
        }
        else {
            imagePreviousButton === null || imagePreviousButton === void 0 ? void 0 : imagePreviousButton.classList.add(visuallyHiddenClass);
        }
        if (imageNextButtonShown) {
            imageNextButton === null || imageNextButton === void 0 ? void 0 : imageNextButton.classList.remove(visuallyHiddenClass);
        }
        else {
            imageNextButton === null || imageNextButton === void 0 ? void 0 : imageNextButton.classList.add(visuallyHiddenClass);
        }
    };
    imagePreviousButton === null || imagePreviousButton === void 0 ? void 0 : imagePreviousButton.addEventListener('click', decreaseImageIndex);
    imageNextButton === null || imageNextButton === void 0 ? void 0 : imageNextButton.addEventListener('click', increaseImageIndex);
    var savedCardHeaderObject = {
        innerElement: cardHeaderInnerElement,
        imagePreviousButtonTapHandleRemover: function () {
            imagePreviousButton === null || imagePreviousButton === void 0 ? void 0 : imagePreviousButton.removeEventListener('click', decreaseImageIndex);
        },
        imageNextButtonTapHandleRemover: function () {
            imageNextButton === null || imageNextButton === void 0 ? void 0 : imageNextButton.removeEventListener('click', increaseImageIndex);
        }
    };
    savedCardHeaderObjects.push(savedCardHeaderObject);
});
