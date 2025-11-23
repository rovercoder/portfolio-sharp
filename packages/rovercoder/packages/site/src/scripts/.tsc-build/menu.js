"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var overlay_js_1 = require("../scripts/overlay.js");
var mainMenuOverlay = undefined;
var hamburgerElements = document.querySelectorAll('.hamburger');
hamburgerElements.forEach(function (hamburgerElement) {
    hamburgerElement.addEventListener('click', function () {
        if (!(0, overlay_js_1.hasOverlays)()) {
            var _mainMenuOverlay = document.querySelector('header .overlay-navigation-menu');
            if (_mainMenuOverlay != null) {
                var mainMenuOverlayClone = _mainMenuOverlay.cloneNode(true);
                mainMenuOverlayClone.removeAttribute('aria-hidden');
                mainMenuOverlay = (0, overlay_js_1.openOverlay)(mainMenuOverlayClone);
            }
        }
        else {
            (0, overlay_js_1.closeOverlayLast)();
        }
    });
});
