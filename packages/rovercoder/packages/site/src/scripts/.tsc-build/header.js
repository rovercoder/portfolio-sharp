"use strict";
var headerElements = document.querySelectorAll('header');
var headerElementsLastHeight = [];
function onHeaderHeightChanged(element, newHeight, oldHeight) {
    var root = document.querySelector(':root');
    if (root != null) {
        root.style.setProperty('--headerHeight', "".concat(newHeight, "px"));
    }
}
var headerObserver = new ResizeObserver(function (entries) {
    var _loop_1 = function (entry) {
        var newHeight = entry.contentRect.height;
        lastHeightEntry = headerElementsLastHeight.find(function (x) { return x.element == entry.target; });
        lastHeight = lastHeightEntry === null || lastHeightEntry === void 0 ? void 0 : lastHeightEntry.lastHeight;
        if (lastHeightEntry == null || lastHeightEntry.lastHeight == null || (lastHeightEntry != null && lastHeightEntry.lastHeight != newHeight)) {
            onHeaderHeightChanged(entry.target, newHeight, lastHeight);
        }
        lastHeightEntry = headerElementsLastHeight.find(function (x) { return x.element == entry.target; });
        if (lastHeightEntry != null) {
            lastHeightEntry.lastHeight = newHeight;
        }
        else {
            headerElementsLastHeight.push({ element: entry.target, lastHeight: newHeight });
        }
    };
    var lastHeightEntry, lastHeight;
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        _loop_1(entry);
    }
});
headerElements.forEach(function (headerElement) {
    var lastHeightEntry = headerElementsLastHeight.find(function (x) { return x.element == headerElement; });
    if (lastHeightEntry == null) {
        headerElementsLastHeight.push({ element: headerElement, lastHeight: headerElement.offsetHeight });
    }
    onHeaderHeightChanged(headerElement, headerElement.offsetHeight, undefined);
    headerObserver.observe(headerElement);
});
