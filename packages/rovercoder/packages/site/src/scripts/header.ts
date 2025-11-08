var headerElements = document.querySelectorAll('header');
var headerElementsLastHeight: { element: HTMLElement, lastHeight: number }[] = [];

function onHeaderHeightChanged(element: HTMLElement, newHeight: number, oldHeight?: number) {
    var root = document.querySelector(':root') as HTMLElement;
    if (root != null) {
        root.style.setProperty('--headerHeight', `${newHeight}px`);
    }
}

var headerObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
        const newHeight = entry.contentRect.height;
        var lastHeightEntry = headerElementsLastHeight.find(x => x.element == entry.target);
        var lastHeight = lastHeightEntry?.lastHeight;
        if (lastHeightEntry == null || lastHeightEntry.lastHeight == null || (lastHeightEntry != null && lastHeightEntry.lastHeight != newHeight)) {
            onHeaderHeightChanged(entry.target as HTMLElement, newHeight, lastHeight);
        }
        lastHeightEntry = headerElementsLastHeight.find(x => x.element == entry.target);
        if (lastHeightEntry != null) {
            lastHeightEntry.lastHeight = newHeight;
        } else {
            headerElementsLastHeight.push({ element: entry.target as HTMLElement, lastHeight: newHeight });
        }
    }
});

headerElements.forEach((headerElement) => {
    var lastHeightEntry = headerElementsLastHeight.find(x => x.element == headerElement);
    if (lastHeightEntry == null) {
        headerElementsLastHeight.push({ element: headerElement, lastHeight: headerElement.offsetHeight });
    }
    onHeaderHeightChanged(headerElement, headerElement.offsetHeight, undefined);
    headerObserver.observe(headerElement);
});
