import { hasOverlays, openOverlay, closeOverlayLast } from '../scripts/overlay.js';

let mainMenuOverlay: Element | undefined = undefined;

let hamburgerElements = document.querySelectorAll('.hamburger');
hamburgerElements.forEach(hamburgerElement => {
    hamburgerElement.addEventListener('click', () => {
        if (!hasOverlays()) {
            const _mainMenuOverlay = document.querySelector('header .overlay-navigation-menu');
            if (_mainMenuOverlay != null) {
                const mainMenuOverlayClone = _mainMenuOverlay.cloneNode(true) as HTMLElement;
                mainMenuOverlayClone.removeAttribute('aria-hidden');
                mainMenuOverlay = openOverlay(mainMenuOverlayClone);
            }
        } else {
            closeOverlayLast();
        }
    });
});
