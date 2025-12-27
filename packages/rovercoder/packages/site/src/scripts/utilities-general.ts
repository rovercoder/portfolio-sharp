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

export function getRootElement(): HTMLElement { 
    return ensureHTMLElement(document.querySelector(':root'), 'Invalid root element!'); 
}

function _processFilteringArgs(args: { elementToAttachVariableTo?: HTMLElement | null, cssVariableName: string }): { elementToAttachVariableTo: HTMLElement, cssVariableName: string } | undefined {
    const elementToAttachVariableTo = args.elementToAttachVariableTo ?? getRootElement();

    if (elementToAttachVariableTo == null) {
        console.error('Element for CSS variable attachment is undefined!');
        return;
    }

    const cssVariableName = args.cssVariableName?.toString().trim();

    if (cssVariableName == null || cssVariableName.length == 0) {
        console.error('CSS Variable Name for element dimension watching is undefined!');
        return;
    }

    return { elementToAttachVariableTo, cssVariableName };
}

export function removeCssVariableElementWatcherEntryIfExists(args: { elementToAttachVariableTo?: HTMLElement | null, cssVariableName: string }): boolean {
    const filteringArgs = _processFilteringArgs({ elementToAttachVariableTo: args.elementToAttachVariableTo, cssVariableName: args.cssVariableName });
    if (filteringArgs == null) {
        return false;
    }
    const { elementToAttachVariableTo, cssVariableName } = filteringArgs;

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
            cssVariableElementDimensionsWatcher[cssVariableName].splice(cssVariableElementDimensionsWatcher[cssVariableName].findIndex(x => x == cssVariableElementDimensionsWatcherEntry), 1);
            return true;
        }
        cssVariableElementDimensionsWatcher[cssVariableName].splice(cssVariableElementDimensionsWatcher[cssVariableName].findIndex(x => x == cssVariableElementDimensionsWatcherEntry), 1);
    }
    return false;
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

    const filteringArgs = _processFilteringArgs({ elementToAttachVariableTo: args.elementToAttachVariableTo, cssVariableName: args.cssVariableName });
    if (filteringArgs == null) {
        return;
    }
    const { elementToAttachVariableTo, cssVariableName } = filteringArgs;

    const _window = window as WindowCustom;

    if (_window._siteCustomCssVariableElementDimensionsWatcher == null) {
        _window._siteCustomCssVariableElementDimensionsWatcher = {};
    }

    const cssVariableElementDimensionsWatcher = _window._siteCustomCssVariableElementDimensionsWatcher;

    removeCssVariableElementWatcherEntryIfExists({ elementToAttachVariableTo: args.elementToAttachVariableTo, cssVariableName: args.cssVariableName });

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
            const observerDisposeFn = cssVariableElementDimensionsWatcher[cssVariableName][cssVariableElementDimensionsWatcherPreviousEntryIndex].observerDisposeFn;
            if (observerDisposeFn != null && typeof observerDisposeFn === 'function') {
                observerDisposeFn();
            }
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

function observeElementResizing(args: { element: HTMLElement, elementToAttachVariableTo: HTMLElement, elementPropertyWatched: ElementPropertyWatchedWidthHeight, cssVariableName: string }): (CssVariableElementDimensionsWatcherEntryValue & { cssVariableName: string }) | undefined {
    if (args == null) {
        console.error('observeElementResizing args undefined!');
        return;
    }
    
    if (args.element == null || !isHTMLElement(args.element)) {
        console.error('Element for dimension watching is undefined or invalid!');
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

    if (args.elementToAttachVariableTo == null || !isHTMLElement(args.elementToAttachVariableTo)) {
        console.error('elementToAttachVariableTo is invalid!');
        return;
    }

    const element = args.element;
    const elementToAttachVariableTo = args.elementToAttachVariableTo;
    let lastDimension: number | undefined;

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

    let newDimension: number | undefined;
    switch (elementPropertyWatched?.toLowerCase()) {
        case 'width': 
            newDimension = element.offsetWidth;
            break;
        case 'height': 
            newDimension = element.offsetHeight;
            break;
        default:
            console.error(`elementPropertyWatched invalid: ${elementPropertyWatched}`);
            return;
    }
    if (newDimension != null) {
        onDimensionChanged({ element, elementToAttachVariableTo, newDimension, oldDimension: undefined, cssVariableName, propertyType: elementPropertyWatched });
    }
    lastDimension = newDimension;
    
    observer.observe(element);

    return {
        element,
        elementToAttachVariableTo,
        cssVariableName,
        propertyWatched: elementPropertyWatched,
        observerDisposeFn: () => observer.disconnect()
    };
}

export function replaceHTMLElementText(element: Element, newText: string, currentText?: string) {
    if (element == null) {
        console.error('Element is undefined!');
        return;
    }

    const _currentText = currentText ?? element.textContent;

    if (element.innerHTML.trim() === _currentText.trim()) {
        element.innerHTML = newText;
        return true;
    } else {
        if (element.children.length > 0) {
            for (let i = 0; i < element.children.length; i++) {
                const result = replaceHTMLElementText(element.children[i], newText, _currentText);
                if (result == true) {
                    return true;
                }
            }
        }
    }
    return false;
}

export function parseCssPixels(cssPixels: string): number | undefined {
    if (cssPixels == null) {
        throw Error(`Invalid cssPixels: ${cssPixels}`);
    }
    const cssPixelsOnly = cssPixels?.replaceAll('px', '');
    const result = parseFloat(cssPixelsOnly);
    return !isNaN(result) ? result : undefined;
}

export function isHTMLElement(element: Element | Node | null | undefined): boolean {
    return element != null 
            && typeof element === 'object' 
            && 'ownerDocument' in element 
            && element.ownerDocument != null 
            && typeof element.ownerDocument === 'object' 
            && 'defaultView' in element.ownerDocument 
            && element.ownerDocument.defaultView != null 
            && typeof element.ownerDocument.defaultView === 'object'
            && element instanceof element.ownerDocument.defaultView.HTMLElement;
}

export function filterByHTMLElement(elements: (Element | Node | null | undefined)[] | NodeListOf<Element>): HTMLElement[] {
    if (elements == null || typeof elements !== 'object') {
        throw Error('Elements argument invalid!');
    }
    return (Array.isArray(elements) ? elements : Array.from(elements)).filter(x => isHTMLElement(x)).map(x => x as HTMLElement);
}

export function ensureHTMLElement(element: Element | Node | null | undefined, message?: string): HTMLElement {
    if (!isHTMLElement(element)) {
        throw Error(message ?? 'Element not a HTMLElement!');
    }
    return element as HTMLElement;
}

export function ensureHTMLElementOrNull(element: Element | Node | null | undefined): HTMLElement | null {
    if (!isHTMLElement(element)) {
        return null;
    }
    return element as HTMLElement;
}

export function ensureHTMLElementOrUndefined(element: Element | Node | null | undefined): HTMLElement | undefined {
    if (!isHTMLElement(element)) {
        return undefined;
    }
    return element as HTMLElement;
}

export function ensureHTMLElementThrowOrNull(element: Element | Node | null | undefined, message?: string): HTMLElement | null {
    if (element == null) {
        return null;
    }
    if (!isHTMLElement(element)) {
        throw Error(message ?? 'Element not a HTMLElement!');
    }
    return element as HTMLElement;
}

export function ensureHTMLElementThrowOrUndefined(element: Element | Node | null | undefined, message?: string): HTMLElement | undefined {
    return ensureHTMLElementThrowOrNull(element, message) ?? undefined;
}

export function isSameElementOrChild(parentElement: HTMLElement | Element | Node | null | undefined, testElement: HTMLElement | Element | Node | null | undefined) {
    if (parentElement == null || testElement == null || !isHTMLElement(parentElement) || !isHTMLElement(testElement)) {
        return false;
    }
    return parentElement == testElement || parentElement.contains(testElement);
}
