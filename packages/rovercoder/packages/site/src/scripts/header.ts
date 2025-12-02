import { initCssVariableElementWatcher } from "./utilities.js";

initCssVariableElementWatcher({ element: document.querySelector('header') as HTMLElement, elementToAttachVariableTo: document.querySelector(':root') as HTMLElement, cssVariableName: '--headerHeight', elementPropertyWatched: 'height' });
