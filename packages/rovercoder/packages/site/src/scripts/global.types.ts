export type WindowCustom = Window & typeof globalThis & { 
    cssVariableElementDimensionsWatcher?: CssVariableElementDimensionsWatcher;
    initImageBrowserOverlay?: Function;
    savedCardHeaderObjects?: CardHeadersObject[];
}

export interface CssVariableElementDimensionsWatcher {
    [cssVariableName: string]: CssVariableElementDimensionsWatcherEntryValue[];
}

export interface CssVariableElementDimensionsWatcherEntryValue {
    element: Element;
    elementToAttachVariableTo: Element;
    propertyWatched: ElementPropertyWatched;
    observerDisposeFn: Function;
}

export type ElementPropertyWatchedWidthHeight = 'width' | 'height';
export type ElementPropertyWatched = ElementPropertyWatchedWidthHeight;

export interface CardHeadersObject {
    innerElement: HTMLElement;
    imagePreviousButtonTapHandleRemover?: Function;
    imageNextButtonTapHandleRemover?: Function;
    imageBrowserOpenButtonTapHandleRemover?: Function;
    infoButtonTapHandleRemover?: Function;
    infoButtonHoverHandleRemover?: Function;
}
