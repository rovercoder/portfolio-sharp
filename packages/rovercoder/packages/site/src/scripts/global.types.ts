export type WindowCustom = Window & typeof globalThis & { 
    _siteCustomCssVariableElementDimensionsWatcher?: CssVariableElementDimensionsWatcher;
    _siteCustomOverlays?: Overlays;
    _siteCustomSavedCardHeaderObjects?: CardHeadersObject[];
}

export interface Overlays {
    [overlayType: string]: OverlayEntry;
}

export interface OverlayEntry {
    initialize: (overlayElement: HTMLElement) => void;
    destroy?: (overlayElement: HTMLElement) => void;
    state: OverlayEntryStateEntry[];
}

export interface OverlayEntryStateEntry {
    element: HTMLElement;
    components: { [componentKey: string]: OverlayEntryStateEntryComponent };
}

export interface OverlayEntryStateEntryComponent {
    element: HTMLElement;
    listeners: { [listenerKey: string]: OverlayEntryStateEntryComponentListener };
}

export interface OverlayEntryStateEntryComponentListener {
    destructor: Function;
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
    imagesContainerObserverRemover?: Function;
}
