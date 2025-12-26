import { filterByHTMLElement } from "./utilities-general.js";
import { destroyAllManagedLifecycleObjects, initializeManagedLifecycleObject } from "./utilities-lifecycle.js";
getInitializeCardHeaderObjectsGroups();
const cardHeaderTypeAttributeName = 'data-card-header-type';
export function getInitializeCardHeaderObjectsGroups() {
    if (window._siteCustomCardHeaders == null) {
        window._siteCustomCardHeaders = {};
    }
    return window._siteCustomCardHeaders;
}
document.addEventListener('DOMContentLoaded', function (event) {
    initializeAllCardHeaders();
});
function initializeAllCardHeaders() {
    destroyAllManagedLifecycleObjects({ objectGetterInitializer: getInitializeCardHeaderObjectsGroups });
    filterByHTMLElement(document.querySelectorAll('.card .card-header')).forEach(cardHeaderElement => {
        initializeManagedLifecycleObject({
            element: cardHeaderElement,
            attributeName: cardHeaderTypeAttributeName,
            objectGetterInitializer: getInitializeCardHeaderObjectsGroups
        });
    });
}
