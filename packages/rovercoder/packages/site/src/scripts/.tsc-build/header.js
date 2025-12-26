import { headerHeightCssVariableName } from "./header.consts.js";
import { ensureHTMLElementThrowOrNull, getRootElement, initCssVariableElementWatcher } from "./utilities-general.js";
const _headerElement = getHeaderElement();
if (_headerElement == null) {
    console.error('Header element is undefined!');
}
else {
    initCssVariableElementWatcher({ element: _headerElement, elementToAttachVariableTo: getRootElement(), cssVariableName: headerHeightCssVariableName, elementPropertyWatched: 'height' });
}
function getHeaderElement() {
    return ensureHTMLElementThrowOrNull(document.querySelector('header'), 'Header element is invalid!');
}
