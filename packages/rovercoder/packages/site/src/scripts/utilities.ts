import { CssVariableElementDimensionsWatcherEntryValue, ElementPropertyWatched, ElementPropertyWatchedWidthHeight, WindowCustom } from "./global.types.js";

export function runOnElementRemoval(elementToWatch: Element, callback: Function, parent: Element = document.body) {
    const observer = new MutationObserver(function (mutations) {
        // loop through all mutations
        mutations.forEach(function (mutation) {
            // check if anything was removed and if the specific element we were looking for was removed
            if (mutation.removedNodes.length > 0) {
                for (let i = 0; i < mutation.removedNodes.length; i++) {
                    if (mutation.removedNodes[i] === elementToWatch) {
                        observer.disconnect();
                        callback();
                    }
                }
            }
        });
    });

    const _parent = parent ?? elementToWatch.parentNode ?? document.body;

    if (_parent) {
        // start observing the parent - defaults to document body
        observer.observe(_parent as any, { subtree: true, childList: true });
    }
}

function getRootElement() { 
    return document.querySelector(':root'); 
}

export function initCssVariableElementWatcher(args: { element: HTMLElement, elementToAttachVariableTo?: HTMLElement | null, cssVariableName: string, elementPropertyWatched: ElementPropertyWatched }) {
    if (args == null) {
        console.error('initCssVariableElementWatcher args undefined!');
        return;
    }
    
    if (args.element == null) {
        console.error('Element for dimension watching is undefined!');
        return;
    }

    const elementToAttachVariableTo = (args.elementToAttachVariableTo ?? getRootElement()) as HTMLElement | null;

    if (elementToAttachVariableTo == null) {
        console.error('Element for CSS variable attachment is undefined!');
        return;
    }

    const cssVariableName = args.cssVariableName?.toString().trim();

    if (cssVariableName == null || cssVariableName.length == 0) {
        console.error('CSS Variable Name for element dimension watching is undefined!');
        return;
    }

    const _window = window as WindowCustom;

    if (_window._siteCustomCssVariableElementDimensionsWatcher == null) {
        _window._siteCustomCssVariableElementDimensionsWatcher = {};
    }

    const cssVariableElementDimensionsWatcher = _window._siteCustomCssVariableElementDimensionsWatcher;

    const cssVariableElementDimensionsWatcherEntry = cssVariableElementDimensionsWatcher[cssVariableName]?.find(x => x.elementToAttachVariableTo === elementToAttachVariableTo);

    if (cssVariableElementDimensionsWatcherEntry != null) {
        const observerDisposeFn = cssVariableElementDimensionsWatcherEntry.observerDisposeFn;
        if (observerDisposeFn != null && typeof observerDisposeFn === 'function') {
            observerDisposeFn();
        }
    }

    const elementPropertyWatched = args.elementPropertyWatched?.toString().trim() as ElementPropertyWatched | undefined;

    let result: (CssVariableElementDimensionsWatcherEntryValue & { cssVariableName: string }) | undefined;
    switch (elementPropertyWatched) {
        case 'width':
        case 'height':
            result = observeElementResizing({ element: args.element, elementToAttachVariableTo, elementPropertyWatched, cssVariableName });
            break;
        default:
            console.error(`initCssVariableElementWatcher | Unhandled case: ${elementPropertyWatched}`);
            return;
    }

    if (result != null) {
        if (cssVariableElementDimensionsWatcher[cssVariableName] == null) {
            cssVariableElementDimensionsWatcher[cssVariableName] = [];
        }
        const cssVariableElementDimensionsWatcherPreviousEntryIndex = cssVariableElementDimensionsWatcher[cssVariableName].findIndex(x => x.elementToAttachVariableTo === elementToAttachVariableTo);
        if (cssVariableElementDimensionsWatcherPreviousEntryIndex > -1) {
            cssVariableElementDimensionsWatcher[cssVariableName].splice(cssVariableElementDimensionsWatcherPreviousEntryIndex, 1);
        }
        cssVariableElementDimensionsWatcher[cssVariableName].push({ 
            element: result.element,
            elementToAttachVariableTo: result.elementToAttachVariableTo,
            propertyWatched: result.propertyWatched,
            observerDisposeFn: result.observerDisposeFn
        });
    }
}

function observeElementResizing(args: { element: Element, elementToAttachVariableTo: Element, elementPropertyWatched: ElementPropertyWatchedWidthHeight, cssVariableName: string }): (CssVariableElementDimensionsWatcherEntryValue & { cssVariableName: string }) | undefined {
    if (args == null) {
        console.error('observeElementResizing args undefined!');
        return;
    }
    
    if (args.element == null) {
        console.error('Element for dimension watching is undefined!');
        return;
    }

    const elementPropertyWatched = args.elementPropertyWatched?.toString().trim() as ElementPropertyWatchedWidthHeight | undefined;
    
    if (elementPropertyWatched == null || !['width', 'height'].includes(elementPropertyWatched.toLowerCase())) {
        console.error('elementPropertyWatched is invalid!');
        return;
    }
    
    const cssVariableName = args.cssVariableName?.toString().trim();

    if (cssVariableName == null || cssVariableName.length === 0) {
        console.error('cssVariableName is invalid!');
        return;
    }

    const element = args.element as HTMLElement;
    const elementToAttachVariableTo = args.elementToAttachVariableTo as HTMLElement;
    let lastDimension: number | undefined;

    if (elementToAttachVariableTo == null) {
        console.error('elementToAttachVariableTo is invalid!');
        return;
    }

    function onDimensionChanged(args: { element: HTMLElement, elementToAttachVariableTo: HTMLElement | null, newDimension: number | undefined, oldDimension: number | undefined, propertyType: ElementPropertyWatchedWidthHeight, cssVariableName: string }) {
        if (args == null) {
            console.error('onDimensionChanged args undefined!');
            return;
        }

        const cssVariableName = args.cssVariableName?.toString().trim();
        
        if (elementToAttachVariableTo != null && cssVariableName != null) {
            elementToAttachVariableTo.style.setProperty(cssVariableName, args.newDimension != null ? `${args.newDimension}px` : null);
        }
    }

    const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
            let newDimension: number | undefined;
            switch (elementPropertyWatched?.toLowerCase()) {
                case 'width': 
                    newDimension = entry.contentRect.width;
                    break;
                case 'height': 
                    newDimension = entry.contentRect.height;
                    break;
                default:
                    console.error(`elementPropertyWatched invalid: ${elementPropertyWatched}`);
                    return;
            }
            if (newDimension != lastDimension) {
                onDimensionChanged({ element: element, elementToAttachVariableTo, newDimension, oldDimension: lastDimension, cssVariableName, propertyType: elementPropertyWatched });
            }
            lastDimension = newDimension;
        }
    });

    onDimensionChanged({ element, elementToAttachVariableTo, newDimension: element.offsetHeight, oldDimension: undefined, cssVariableName, propertyType: elementPropertyWatched });
    lastDimension = element.offsetHeight;
    
    observer.observe(element);

    return {
        element,
        elementToAttachVariableTo,
        cssVariableName,
        propertyWatched: elementPropertyWatched,
        observerDisposeFn: () => observer.unobserve(element)
    };
}
