export type WindowCustom = Window & typeof globalThis & { 
    _siteCustomCssVariableElementDimensionsWatcher?: CssVariableElementDimensionsWatcher;
    _siteCustomOverlays?: OverlaysObjectGroups;
    _siteCustomCardHeaders?: CardHeadersObjectsGroups;
}

export type OverlaysObjectGroups = ManagedLifecycleObjectGroups;
export type OverlaysObjectGroup = ManagedLifecycleObjectGroup;
export type CardHeadersObjectsGroups = ManagedLifecycleObjectGroups;
export type CardHeadersObjectsGroup = ManagedLifecycleObjectGroup;

export interface ManagedLifecycleObjectGroups {
    [objectGroupName: string]: ManagedLifecycleObjectGroup;
}

export interface ManagedLifecycleObjectGroup {
    initialize: (mainElement: HTMLElement) => void;
    destroy?: (mainElement: HTMLElement) => void;
    state: ManagedLifecycleObject[];
}

export interface ManagedLifecycleObject {
    element: HTMLElement;
    components: { [componentKey: string]: ManagedLifecycleObjectComponent };
}

export interface ManagedLifecycleObjectComponent {
    element: HTMLElement;
    observables: { [observableKey: string]: ManagedLifecycleObjectComponentObservable }
    listeners: { [listenerKey: string]: ManagedLifecycleObjectComponentListener };
}

export interface ManagedLifecycleObjectComponentObservable {
    destructor: Function;
}

export interface ManagedLifecycleObjectComponentListener {
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
    imagesControlsObserverRemover?: Function;
}
