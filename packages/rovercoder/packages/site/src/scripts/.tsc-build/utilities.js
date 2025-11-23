"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runOnElementRemoval = runOnElementRemoval;
function runOnElementRemoval(elementToWatch, callback, parent) {
    var _a;
    if (parent === void 0) { parent = document.body; }
    var observer = new MutationObserver(function (mutations) {
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
    var _parent = (_a = parent !== null && parent !== void 0 ? parent : elementToWatch.parentNode) !== null && _a !== void 0 ? _a : document.body;
    if (_parent) {
        // start observing the parent - defaults to document body
        observer.observe(_parent, { subtree: true, childList: true });
    }
}
