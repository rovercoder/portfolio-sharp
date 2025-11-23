import { hasOverlays, openOverlay, closeOverlayLast } from '../scripts/overlay.js';

var mainMenuOverlay: Element | undefined = undefined;

var hamburgerElements = document.querySelectorAll('.hamburger');
hamburgerElements.forEach(hamburgerElement => {
    hamburgerElement.addEventListener('click', () => {
        if (!hasOverlays()) {
            var _mainMenuOverlay = document.querySelector('header .overlay-navigation-menu');
            if (_mainMenuOverlay != null) {
                var mainMenuOverlayClone = _mainMenuOverlay.cloneNode(true) as HTMLElement;
                mainMenuOverlayClone.removeAttribute('aria-hidden');
                mainMenuOverlay = openOverlay(mainMenuOverlayClone);
            }
        } else {
            closeOverlayLast();
        }
    });
});
