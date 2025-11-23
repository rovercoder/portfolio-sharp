export function runOnElementRemoval(elementToWatch: Element, callback: Function, parent: Element = document.body) {
    const observer = new MutationObserver(function (mutations) {
        // loop through all mutations
        mutations.forEach(function (mutation) {
            // check if anything was removed and if the specific element we were looking for was removed
            if (mutation.removedNodes.length > 0) {
                for (var i = 0; i < mutation.removedNodes.length; i++) {
                    if (mutation.removedNodes[i] === elementToWatch) {
                        observer.disconnect();
                        callback();
                    }
                }
            }
        });
    });

    var _parent = parent ?? elementToWatch.parentNode ?? document.body;

    if (_parent) {
        // start observing the parent - defaults to document body
        observer.observe(_parent as any, { subtree: true, childList: true });
    }
}
