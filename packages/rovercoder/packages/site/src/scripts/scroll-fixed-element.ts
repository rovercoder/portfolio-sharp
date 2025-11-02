const _scrollerResizeObserver = new ResizeObserver((entries) => handleScroll());
const _scrollers: HTMLElement[] = [];

function handleScroll() {
    document.querySelectorAll('.sticky-child').forEach(stickyChild => {
        var _stickyChild: HTMLElement = stickyChild as HTMLElement;
        var parent = stickyChild.parentElement;
        var scrollParent = getScrollParent(_stickyChild, true);
        if (!_scrollers.includes(scrollParent)) {
            _scrollers.push(scrollParent);
        }
        var scrollerHeight = getScrollerHeight(scrollParent);
        
        var position = '';
        var top = '';
        var bottom = '';
        var left = '';
        var right = '';
        var clipPath = '';

        if (parent != null && isElementVisible(parent)) {
            var scrollTop = parent.getBoundingClientRect().top;
            var scrollBottom = parent.getBoundingClientRect().bottom - scrollerHeight;
            position = 'fixed';
            top = '0px';
            bottom = '0px';
            left = parent.getBoundingClientRect().left + 'px'; // optional: match horizontal position
            right = parent.getBoundingClientRect().right + 'px';
            clipPath = `inset(${scrollTop > 0 ? scrollTop : 0}px 0px ${scrollBottom > 0 ? 0 : -scrollBottom}px 0px)`;
        } else {
            // Reset to normal flow
            position = '';
            top = '';
            bottom = '';
            left = '';
            right = '';
            clipPath = '';
        }

        var sampleElement = document.createElement('div');
        sampleElement.style.position = position;
        sampleElement.style.top = top;
        sampleElement.style.bottom = bottom;
        sampleElement.style.left = left;
        sampleElement.style.right = right;
        sampleElement.style.clipPath = clipPath;

        var updated = false;
        if (sampleElement.style.position !== _stickyChild.style.position) {
            _stickyChild.style.position = position;
            updated = true;
        }
        if (sampleElement.style.top !== _stickyChild.style.top) {
            _stickyChild.style.top = top;
            updated = true;
        }
        if (sampleElement.style.bottom !== _stickyChild.style.bottom) {
            _stickyChild.style.bottom = bottom;
            updated = true;
        }
        if (sampleElement.style.left !== _stickyChild.style.left) {
            _stickyChild.style.left = left;
            updated = true;
        }
        if (sampleElement.style.right !== _stickyChild.style.right) {
            _stickyChild.style.right = right;
            updated = true;
        }
        if (sampleElement.style.clipPath !== _stickyChild.style.clipPath) {
            _stickyChild.style.clipPath = clipPath;
            updated = true;
        }
    });
    _scrollers.forEach(scroller => {
        for (var i = 0; i < scroller.children.length; i++) {
            var child = scroller.children[i];
            _scrollerResizeObserver.observe(child);
        }
        _scrollerResizeObserver.observe(scroller);
    });
}

window.addEventListener('scroll', handleScroll);//, { passive: true });
window.addEventListener('touchstart', handleScroll);//, { passive: true });
window.addEventListener('touchmove', handleScroll);//, { passive: true });
window.addEventListener('touchend', handleScroll);//, { passive: true });
window.addEventListener('wheel', handleScroll);//, { passive: true });
window.addEventListener('keydown', handleScroll);//, { passive: true });
window.addEventListener('keypress', handleScroll);//, { passive: true });

// Also run on load in case page is reloaded mid-scroll
handleScroll();

window.addEventListener('resize', handleScroll);

function isElementVisible(element: HTMLElement){
    var rect = element.getBoundingClientRect(), 
        top = rect.top, 
        height = rect.height,
        parentElement = element.parentElement;

    if (parentElement == null) return true;

    // Check if bottom of the element is off the page
    if (rect.bottom < 0) return false;
    // Check its within the document viewport
    if (top > document.documentElement.clientHeight) return false;
    do {
        rect = parentElement.getBoundingClientRect()
        if (top <= rect.bottom === false) return false;
        // Check if the element is out of view due to a container scrolling
        if ((top + height) <= rect.top) return false;
        parentElement = parentElement.parentElement;

        if (parentElement == null) return true;
    
    } while (parentElement != document.body);

    return true;
};

function getScrollParent(element: HTMLElement, includeHidden: boolean): HTMLElement {
    var style = getComputedStyle(element);
    var excludeStaticParent = style.position === "absolute";
    var overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

    if (style.position === "fixed") return document.body;
    for (var parent: HTMLElement | null = element; (parent = parent.parentElement);) {
        if (parent == null) {
            break;
        }
        style = getComputedStyle(parent);
        if (excludeStaticParent && style.position === "static") {
            continue;
        }
        if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
    }
    return document.body;
}

function getScrollerHeight(element: Element) {
    if (element === document.documentElement || element === document.body) {
        return window.innerHeight /* excludes scrollbar */ || document.documentElement.clientHeight;
    }
    return element.clientHeight;
}
