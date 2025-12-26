import { hasOverlays, openOverlay, closeOverlayLast } from '../scripts/overlay.js';
import { ensureHTMLElementOrNull, filterByHTMLElement } from './utilities-general.js';
let mainMenuOverlay = undefined;
const openMainMenuOverlay = (triggerElement, triggerElementEventType) => {
    if (!hasOverlays()) {
        const _mainMenuOverlay = ensureHTMLElementOrNull(document.querySelector('header .overlay-navigation-menu'));
        if (_mainMenuOverlay != null) {
            const mainMenuOverlayClone = ensureHTMLElementOrNull(_mainMenuOverlay.cloneNode(true));
            if (mainMenuOverlayClone != null) {
                mainMenuOverlayClone.removeAttribute('aria-hidden');
                mainMenuOverlay = openOverlay(mainMenuOverlayClone, { originalElement: _mainMenuOverlay, trigger: { element: triggerElement, eventType: triggerElementEventType } });
            }
        }
    }
    else {
        closeOverlayLast({ closeNonDetectable: false });
    }
};
filterByHTMLElement(document.querySelectorAll('.hamburger')).forEach(hamburgerElement => {
    const hamburgerElementOpenMainMenuOverlayClickFn = () => openMainMenuOverlay(hamburgerElement, 'click');
    hamburgerElement.addEventListener('click', hamburgerElementOpenMainMenuOverlayClickFn);
});
