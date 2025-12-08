import { ManagedLifecycleObjectGroups } from "./global.types.js";

export function initializeManagedLifecycleObject(args: { element: Element, attributeName: string, objectGetterInitializer: () => ManagedLifecycleObjectGroups }) {
    if (args == null) {
        console.error('Arguments are undefined!');
        return;
    }
    
    if (args.element == null) {
        console.error('Element is undefined!');
        return;
    }

    if (args.attributeName == null || args.attributeName.toString().trim().length === 0) {
        console.error('Attribute name is undefined!');
        return;
    }

    if (args.objectGetterInitializer == null || typeof args.objectGetterInitializer !== 'function') {
        console.error('objectGetterInitializer is undefined!');
        return;
    }
    
    const attributeValue = [
        args.element.attributes.getNamedItem(args.attributeName.trim()), 
        ...Array.from(args.element.children).map(x => x.attributes.getNamedItem(args.attributeName.trim()))
    ]
    .map(x => x?.value?.trim())
    .find(x => x != null && x.length > 0);

    if (attributeValue != null && args.objectGetterInitializer()[attributeValue] != null) {
        const lifecycleObjectGroupEntry = args.objectGetterInitializer()[attributeValue];
        if (lifecycleObjectGroupEntry.initialize != null && typeof lifecycleObjectGroupEntry.initialize === 'function') {
            lifecycleObjectGroupEntry.initialize(args.element as HTMLElement);
        }
    }
}

export function destroyManagedLifecycleObject(args: { element: Element, objectGetterInitializer: () => ManagedLifecycleObjectGroups }) {
    if (args == null) {
        console.error('Arguments are undefined!');
        return;
    }

    if (args.element == null) {
        console.error('Element is undefined!');
        return;
    }

    if (args.objectGetterInitializer == null || typeof args.objectGetterInitializer !== 'function') {
        console.error('objectGetterInitializer is undefined!');
        return;
    }

    _destroyManagedLifecycleObjects({ 
        filterByElement: args.element, 
        objectGetterInitializer: args.objectGetterInitializer
    });
}

export function destroyAllManagedLifecycleObjects(args: { objectGetterInitializer: () => ManagedLifecycleObjectGroups }) {
    if (args == null) {
        console.error('Arguments are undefined!');
        return;
    }

    if (args.objectGetterInitializer == null || typeof args.objectGetterInitializer !== 'function') {
        console.error('objectGetterInitializer is undefined!');
        return;
    }

    _destroyManagedLifecycleObjects({ 
        objectGetterInitializer: args.objectGetterInitializer
    });
}

function _destroyManagedLifecycleObjects(args: { filterByElement?: Element, objectGetterInitializer: () => ManagedLifecycleObjectGroups }) {
    if (args == null) {
        console.error('Arguments are undefined!');
        return;
    }

    if (args.objectGetterInitializer == null || typeof args.objectGetterInitializer !== 'function') {
        console.error('objectGetterInitializer is undefined!');
        return;
    }

    const managedLifecycleObjectGroups = args.objectGetterInitializer();
    for (const managedLifecycleObjectGroupKey in managedLifecycleObjectGroups) {
        const managedLifecycleObjectGroup = managedLifecycleObjectGroups[managedLifecycleObjectGroupKey];
        const managedLifecycleObjectGroupState = managedLifecycleObjectGroup.state ?? [];
        for (let i = 0; i < managedLifecycleObjectGroupState.length; i++) {
            if (args.filterByElement == null || managedLifecycleObjectGroupState[i].element === args.filterByElement) {
                if (managedLifecycleObjectGroup.destroy != null && typeof managedLifecycleObjectGroup.destroy === 'function') {
                    managedLifecycleObjectGroup.destroy(managedLifecycleObjectGroupState[i].element as HTMLElement);
                }
                const managedLifecycleObjectGroupStateEntry = managedLifecycleObjectGroupState[i];
                if (managedLifecycleObjectGroupStateEntry.components != null && typeof managedLifecycleObjectGroupStateEntry.components === 'object') {
                    for (const componentKey in managedLifecycleObjectGroupStateEntry.components) {
                        const component = managedLifecycleObjectGroupStateEntry.components[componentKey];
                        if (component.observables != null && typeof component.observables === 'object') {
                            for (const observableKey in component.observables) {
                                const destructor = component.observables[observableKey].destructor;
                                if (destructor != null && typeof destructor === 'function') {
                                    destructor();
                                }
                            }
                        }
                        if (component.listeners != null && typeof component.listeners === 'object') {
                            for (const listenerKey in component.listeners) {
                                const destructor = component.listeners[listenerKey].destructor;
                                if (destructor != null && typeof destructor === 'function') {
                                    destructor();
                                }
                            }
                        }
                    }
                }
                managedLifecycleObjectGroupState.splice(i, 1);
                i--;
            }
        }
    }
}