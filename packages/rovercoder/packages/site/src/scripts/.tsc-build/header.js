import { initCssVariableElementWatcher } from "./utilities-general.js";
initCssVariableElementWatcher({ element: document.querySelector('header'), elementToAttachVariableTo: document.querySelector(':root'), cssVariableName: '--headerHeight', elementPropertyWatched: 'height' });
