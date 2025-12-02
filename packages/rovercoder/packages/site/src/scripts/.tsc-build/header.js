import { initCssVariableElementWatcher } from "./utilities.js";
initCssVariableElementWatcher({ element: document.querySelector('header'), elementToAttachVariableTo: document.querySelector(':root'), cssVariableName: '--headerHeight', elementPropertyWatched: 'height' });
