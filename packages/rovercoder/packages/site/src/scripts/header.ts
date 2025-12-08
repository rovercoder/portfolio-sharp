import { initCssVariableElementWatcher } from "./utilities-general.js";

initCssVariableElementWatcher({ element: document.querySelector('header') as HTMLElement, elementToAttachVariableTo: document.querySelector(':root') as HTMLElement, cssVariableName: '--headerHeight', elementPropertyWatched: 'height' });
