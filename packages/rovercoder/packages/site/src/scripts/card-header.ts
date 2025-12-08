import { CardHeadersObjectsGroups, WindowCustom } from "./global.types.js";
import { destroyAllManagedLifecycleObjects, initializeManagedLifecycleObject } from "./utilities-lifecycle.js";

getInitializeCardHeaderObjectsGroups();

const cardHeaderTypeAttributeName = 'data-card-header-type';

export function getInitializeCardHeaderObjectsGroups(): CardHeadersObjectsGroups {
    if ((window as WindowCustom)._siteCustomCardHeaders == null) {
        (window as WindowCustom)._siteCustomCardHeaders = {};
    }
    return (window as WindowCustom)._siteCustomCardHeaders!;
}

document.addEventListener('DOMContentLoaded', function(event) {
    initializeAllCardHeaders();
});

function initializeAllCardHeaders() {
    destroyAllManagedLifecycleObjects({ objectGetterInitializer: getInitializeCardHeaderObjectsGroups });
    document.querySelectorAll('.card .card-header').forEach(cardHeaderElement => {
        initializeManagedLifecycleObject({ 
            element: cardHeaderElement, 
            attributeName: cardHeaderTypeAttributeName, 
            objectGetterInitializer: getInitializeCardHeaderObjectsGroups 
        });
    });
}
