export function runOnElementRemoval(elementToWatch, callback, parent = document.body) {
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
        observer.observe(_parent, { subtree: true, childList: true });
    }
}
function getRootElement() {
    return document.querySelector(':root');
}
function _processFilteringArgs(args) {
    const elementToAttachVariableTo = (args.elementToAttachVariableTo ?? getRootElement());
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
export function removeCssVariableElementWatcherEntryIfExists(args) {
    const filteringArgs = _processFilteringArgs({ elementToAttachVariableTo: args.elementToAttachVariableTo, cssVariableName: args.cssVariableName });
    if (filteringArgs == null) {
        return false;
    }
    const { elementToAttachVariableTo, cssVariableName } = filteringArgs;
    const _window = window;
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
export function initCssVariableElementWatcher(args) {
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
    const _window = window;
    if (_window._siteCustomCssVariableElementDimensionsWatcher == null) {
        _window._siteCustomCssVariableElementDimensionsWatcher = {};
    }
    const cssVariableElementDimensionsWatcher = _window._siteCustomCssVariableElementDimensionsWatcher;
    removeCssVariableElementWatcherEntryIfExists({ elementToAttachVariableTo: args.elementToAttachVariableTo, cssVariableName: args.cssVariableName });
    const elementPropertyWatched = args.elementPropertyWatched?.toString().trim();
    let result;
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
function observeElementResizing(args) {
    if (args == null) {
        console.error('observeElementResizing args undefined!');
        return;
    }
    if (args.element == null) {
        console.error('Element for dimension watching is undefined!');
        return;
    }
    const elementPropertyWatched = args.elementPropertyWatched?.toString().trim();
    if (elementPropertyWatched == null || !['width', 'height'].includes(elementPropertyWatched.toLowerCase())) {
        console.error('elementPropertyWatched is invalid!');
        return;
    }
    const cssVariableName = args.cssVariableName?.toString().trim();
    if (cssVariableName == null || cssVariableName.length === 0) {
        console.error('cssVariableName is invalid!');
        return;
    }
    const element = args.element;
    const elementToAttachVariableTo = args.elementToAttachVariableTo;
    let lastDimension;
    if (elementToAttachVariableTo == null) {
        console.error('elementToAttachVariableTo is invalid!');
        return;
    }
    function onDimensionChanged(args) {
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
            let newDimension;
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
export function replaceHTMLElementText(element, newText, currentText) {
    if (element == null) {
        console.error('Element is undefined!');
        return;
    }
    const _currentText = currentText ?? element.textContent;
    if (element.innerHTML.trim() === _currentText.trim()) {
        element.innerHTML = newText;
        return true;
    }
    else {
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
