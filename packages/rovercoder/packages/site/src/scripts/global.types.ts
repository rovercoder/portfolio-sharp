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

export interface ManagedLifecycleObjectGroupInitializeExtraArguments { 
    originalElement?: HTMLElement;
    trigger?: { 
        element: HTMLElement;
        eventType: string;
    }
}

export interface ManagedLifecycleObjectGroup {
    initialize: (mainElement: HTMLElement, extra?: ManagedLifecycleObjectGroupInitializeExtraArguments) => void;
    destroy?: (mainElement: HTMLElement) => void;
    state: ManagedLifecycleObject[];
}

export interface ManagedLifecycleObject {
    element: HTMLElement;
    originalElement?: HTMLElement;
    trigger?: {
        element: HTMLElement;
        eventType: string;
    }
    components: { [componentKey: string]: ManagedLifecycleObjectComponent };
    componentsGroups: {
        [componentGroupKey: string]: { [componentKey: string]: ManagedLifecycleObjectComponent };
    }
}

export interface ManagedLifecycleObjectComponent {
    element: HTMLElement;
    observables: { [observableKey: string]: ManagedLifecycleObjectComponentObservable }
    listeners: { [listenerKey: string]: ManagedLifecycleObjectComponentListener };
    loops: { [loopKey: string]: ManagedLifecycleObjectComponentListener };
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
    element: HTMLElement;
    elementToAttachVariableTo: HTMLElement;
    propertyWatched: ElementPropertyWatched;
    observerDisposeFn: Function;
}

export type ElementPropertyWatchedWidthHeight = 'width' | 'height';
export type ElementPropertyWatched = ElementPropertyWatchedWidthHeight;
