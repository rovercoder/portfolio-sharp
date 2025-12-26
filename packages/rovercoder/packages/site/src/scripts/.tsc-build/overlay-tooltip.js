import { tooltipOuterHiddenForSizeFullClass, tooltipSpaceAwayFromTriggerElementClass, tooltipOuterToDisplayClass, tooltipPositionAttribute, tooltipCalculationsTestingContainerClass, tooltipOuterPlacementAttribute, tooltipMarginClosestToTriggerElementEnabledAttribute, tooltipScrollFactorCalculationForChildrenPercentageAttribute } from "./overlay-tooltip.consts.js";
import { getInitializeOverlayObjectsGroups } from "./overlay.js";
import { ensureHTMLElementOrNull, ensureHTMLElementThrowOrNull, isHTMLElement } from "./utilities-general.js";
import { destroyManagedLifecycleObject, destroyManagedLifecycleObjectComponent } from "./utilities-lifecycle.js";
getInitializeTooltipOverlayObjectsGroup();
function getInitializeTooltipOverlayObjectsGroup() {
    var overlayObjectsGroups = getInitializeOverlayObjectsGroups();
    if (overlayObjectsGroups['tooltip'] == null) {
        overlayObjectsGroups['tooltip'] = {
            initialize: initializeTooltipOverlay,
            destroy: undefined,
            state: []
        };
    }
    return overlayObjectsGroups['tooltip'];
}
function initializeTooltipOverlay(overlayElement, extra) {
    destroyManagedLifecycleObject({ element: overlayElement, objectGetterInitializer: getInitializeOverlayObjectsGroups });
    const tooltipOverlayObjectGroup = getInitializeTooltipOverlayObjectsGroup();
    const stateEntryComponents = {};
    if (extra == null || typeof extra !== 'object' || extra.trigger == null || typeof extra.trigger !== 'object' || extra.trigger.element == null) {
        console.error('Failed to initialize tooltip overlay!');
        return;
    }
    const overlayTooltipInnerElement = ensureHTMLElementOrNull(overlayElement.querySelector('.overlay-tooltip-inner'));
    if (overlayTooltipInnerElement == null) {
        console.error('Failed to initialize tooltip overlay - missing elements!');
        return;
    }
    const tooltipOuterElement = ensureHTMLElementOrNull(overlayTooltipInnerElement.querySelector(`.${tooltipOuterToDisplayClass}`));
    let tooltipElement = ensureHTMLElementOrNull(tooltipOuterElement?.querySelector('* > .tooltip'));
    if (tooltipOuterElement == null || tooltipElement == null) {
        console.error('Failed to initialize tooltip overlay - missing elements!');
        return;
    }
    const tooltipOuterElementClone = ensureHTMLElementOrNull(tooltipOuterElement.cloneNode());
    if (tooltipOuterElementClone == null) {
        console.error('Failed to initialize tooltip overlay - could not clone tooltip outer element!');
        return;
    }
    tooltipOuterElementClone.classList.remove(tooltipOuterToDisplayClass);
    const getTooltipCalculationsContainer = () => ensureHTMLElementThrowOrNull(overlayTooltipInnerElement.querySelector(`.${tooltipCalculationsTestingContainerClass}`), 'Invalid tooltip calculations testing container!');
    const tooltipPositionsState = [];
    const initTooltipCalculationsContainer = () => {
        let tooltipCalculationsContainer = getTooltipCalculationsContainer();
        if (tooltipCalculationsContainer == null) {
            const _tooltipCalculationsContainer = document.createElement('div');
            _tooltipCalculationsContainer.className = tooltipCalculationsTestingContainerClass;
            overlayTooltipInnerElement.prepend(_tooltipCalculationsContainer);
            tooltipCalculationsContainer = _tooltipCalculationsContainer;
        }
        const tooltipSpaceAwayFromTriggerElementElementKey = 'tooltipSpaceAwayFromTriggerElementElement';
        let tooltipSpaceAwayFromTriggerElementElement = ensureHTMLElementOrNull(tooltipCalculationsContainer.querySelector(`.${tooltipSpaceAwayFromTriggerElementClass}`));
        if (tooltipSpaceAwayFromTriggerElementElement == null || stateEntryComponents[tooltipSpaceAwayFromTriggerElementElementKey]?.element != tooltipSpaceAwayFromTriggerElementElement) {
            if (stateEntryComponents[tooltipSpaceAwayFromTriggerElementElementKey] != null) {
                destroyManagedLifecycleObjectComponent(stateEntryComponents[tooltipSpaceAwayFromTriggerElementElementKey]);
            }
            if (tooltipSpaceAwayFromTriggerElementElement == null) {
                const _tooltipSpaceAwayFromTriggerElementElement = document.createElement('div');
                _tooltipSpaceAwayFromTriggerElementElement.className = tooltipSpaceAwayFromTriggerElementClass;
                tooltipCalculationsContainer.append(_tooltipSpaceAwayFromTriggerElementElement);
                tooltipSpaceAwayFromTriggerElementElement = _tooltipSpaceAwayFromTriggerElementElement;
            }
            const tooltipSpaceAwayFromTriggerElementElementResizeObserver = new ResizeObserver((entries, observer) => {
                entries.filter(x => x.target == tooltipSpaceAwayFromTriggerElementElement).forEach((entry) => {
                    tooltipSpaceAwayFromTriggerElementElementDimensions = getDimensionsFromDomRect(entry.target.getBoundingClientRect());
                });
                if (entries.some(x => x.target == tooltipSpaceAwayFromTriggerElementElement)) {
                    initTooltipCalculationsContainer();
                }
            });
            tooltipSpaceAwayFromTriggerElementElementResizeObserver.observe(tooltipSpaceAwayFromTriggerElementElement);
            const tooltipSpaceAwayFromTriggerElementElementResizeObserverRemover = () => tooltipSpaceAwayFromTriggerElementElementResizeObserver.disconnect();
            stateEntryComponents[tooltipSpaceAwayFromTriggerElementElementKey] = {
                element: tooltipSpaceAwayFromTriggerElementElement,
                observables: {
                    'resizeObserver': {
                        destructor: tooltipSpaceAwayFromTriggerElementElementResizeObserverRemover
                    }
                },
                listeners: {},
                loops: {}
            };
        }
        tooltipSpaceAwayFromTriggerElementElementDimensions = getDimensionsFromDomRect(tooltipSpaceAwayFromTriggerElementElement.getBoundingClientRect());
        const tooltipHiddenForSizeOuterElementKey = 'tooltipHiddenForSizeOuterElement';
        let tooltipHiddenForSizeOuterElement = ensureHTMLElementOrNull(tooltipCalculationsContainer.querySelector(`.${tooltipOuterHiddenForSizeFullClass}`));
        if (tooltipHiddenForSizeOuterElement == null || stateEntryComponents[tooltipHiddenForSizeOuterElementKey]?.element != tooltipHiddenForSizeOuterElement) {
            if (stateEntryComponents[tooltipHiddenForSizeOuterElementKey] != null) {
                destroyManagedLifecycleObjectComponent(stateEntryComponents[tooltipHiddenForSizeOuterElementKey]);
            }
            if (tooltipHiddenForSizeOuterElement == null) {
                const _tooltipHiddenForSizeOuterElement = ensureHTMLElementOrNull(tooltipOuterElementClone.cloneNode());
                if (_tooltipHiddenForSizeOuterElement == null) {
                    throw Error('Could not clone tooltip outer element clone for hidden for size outer element!');
                }
                _tooltipHiddenForSizeOuterElement.classList.add(tooltipOuterHiddenForSizeFullClass);
                tooltipCalculationsContainer.append(_tooltipHiddenForSizeOuterElement);
                tooltipHiddenForSizeOuterElement = _tooltipHiddenForSizeOuterElement;
            }
            if (tooltipHiddenForSizeOuterElement.innerHTML != tooltipOuterElement.innerHTML) {
                tooltipHiddenForSizeOuterElement.innerHTML = tooltipOuterElement.innerHTML;
            }
            const tooltipHiddenForSizeOuterElementResizeObserver = new ResizeObserver((entries, observer) => {
                entries.filter(x => x.target == tooltipHiddenForSizeOuterElement).forEach((entry) => {
                    tooltipHiddenForSizeOuterElementDimensions = getDimensionsFromDomRect(entry.target.getBoundingClientRect());
                });
                if (entries.some(x => x.target == tooltipHiddenForSizeOuterElement)) {
                    initTooltipCalculationsContainer();
                }
            });
            tooltipHiddenForSizeOuterElementResizeObserver.observe(tooltipHiddenForSizeOuterElement);
            const tooltipHiddenForSizeOuterElementResizeObserverRemover = () => tooltipHiddenForSizeOuterElementResizeObserver.disconnect();
            stateEntryComponents[tooltipHiddenForSizeOuterElementKey] = {
                element: tooltipHiddenForSizeOuterElement,
                observables: {
                    'resizeObserver': {
                        destructor: tooltipHiddenForSizeOuterElementResizeObserverRemover
                    }
                },
                listeners: {},
                loops: {}
            };
        }
        if (tooltipHiddenForSizeOuterElement.innerHTML != tooltipOuterElement.innerHTML) {
            tooltipHiddenForSizeOuterElement.innerHTML = tooltipOuterElement.innerHTML;
        }
        tooltipHiddenForSizeOuterElementDimensions = getDimensionsFromDomRect(tooltipHiddenForSizeOuterElement.getBoundingClientRect());
        const tooltipHiddenForSizeTooltipElementKey = 'tooltipHiddenForSizeTooltipElement';
        const tooltipHiddenForSizeTooltipElement = ensureHTMLElementOrNull(tooltipHiddenForSizeOuterElement.querySelector('* > .tooltip'));
        if (tooltipHiddenForSizeTooltipElement == null) {
            throw Error('Tooltip element in hidden for size outer element not found!');
        }
        if (stateEntryComponents[tooltipHiddenForSizeTooltipElementKey]?.element != tooltipHiddenForSizeTooltipElement) {
            if (stateEntryComponents[tooltipHiddenForSizeTooltipElementKey] != null) {
                destroyManagedLifecycleObjectComponent(stateEntryComponents[tooltipHiddenForSizeTooltipElementKey]);
            }
            const tooltipHiddenForSizeTooltipElementResizeObserver = new ResizeObserver((entries, observer) => {
                entries.filter(x => x.target == tooltipHiddenForSizeTooltipElement).forEach((entry) => {
                    tooltipHiddenForSizeTooltipElementDimensions = getDimensionsFromDomRect(entry.target.getBoundingClientRect());
                });
                if (entries.some(x => x.target == tooltipHiddenForSizeTooltipElement)) {
                    initTooltipCalculationsContainer();
                }
            });
            tooltipHiddenForSizeTooltipElementResizeObserver.observe(tooltipHiddenForSizeTooltipElement);
            const tooltipHiddenForSizeTooltipElementResizeObserverRemover = () => tooltipHiddenForSizeTooltipElementResizeObserver.disconnect();
            const tooltipHiddenForSizeTooltipElementMutationObserver = new MutationObserver((entries, observer) => {
                if (entries.some(x => x.target == tooltipHiddenForSizeTooltipElement)) {
                    initTooltipCalculationsContainer();
                }
            });
            tooltipHiddenForSizeTooltipElementMutationObserver.observe(tooltipHiddenForSizeTooltipElement, { subtree: true, childList: true, attributes: true });
            const tooltipHiddenForSizeTooltipElementMutationObserverRemover = () => tooltipHiddenForSizeTooltipElementMutationObserver.disconnect();
            stateEntryComponents[tooltipHiddenForSizeTooltipElementKey] = {
                element: tooltipHiddenForSizeTooltipElement,
                observables: {
                    'resizeObserver': {
                        destructor: tooltipHiddenForSizeTooltipElementResizeObserverRemover
                    },
                    'mutationObserver': {
                        destructor: tooltipHiddenForSizeTooltipElementMutationObserverRemover
                    }
                },
                listeners: {},
                loops: {}
            };
        }
        tooltipHiddenForSizeTooltipElementDimensions = getDimensionsFromDomRect(tooltipHiddenForSizeTooltipElement.getBoundingClientRect());
        const tooltipMarginClosestToTriggerElementEnabled = getTooltipMarginClosestToTriggerElementEnabled();
        const tooltipPositionsAll = getTooltipPositionsAll();
        const tooltipPositionsRequired = getTooltipPositionsRequired();
        const tooltipPositionsAllExceptRequired = tooltipPositionsAll.filter(x => !tooltipPositionsRequired.some(y => matchTooltipPosition(x, y)));
        const getTooltipHiddenForPositionOuterElementKey = (tooltipPosition) => `tooltipHiddenForPositionOuterElement-position[${getTooltipPositionString(tooltipPosition)}]`;
        for (const tooltipPosition of tooltipPositionsAllExceptRequired) {
            const tooltipHiddenForPositionOuterElementKey = getTooltipHiddenForPositionOuterElementKey(tooltipPosition);
            if (stateEntryComponents[tooltipHiddenForPositionOuterElementKey] != null) {
                destroyManagedLifecycleObjectComponent(stateEntryComponents[tooltipHiddenForPositionOuterElementKey]);
            }
            const tooltipPositionString = getTooltipPositionString(tooltipPosition);
            const tooltipOuterForPosition = ensureHTMLElementOrNull(tooltipCalculationsContainer.querySelector(`* > .tooltip-outer[${tooltipOuterPlacementAttribute}="${tooltipPositionString}"]`));
            tooltipOuterForPosition?.remove();
            const tooltipPositionStateIndex = tooltipPositionsState.findIndex(x => matchTooltipPosition(tooltipPositionString, x.position));
            if (tooltipPositionStateIndex > -1) {
                tooltipPositionsState.splice(tooltipPositionStateIndex, 1);
            }
        }
        for (const tooltipPosition of tooltipPositionsRequired) {
            const tooltipHiddenForPositionOuterElementKey = getTooltipHiddenForPositionOuterElementKey(tooltipPosition);
            const tooltipPositionString = getTooltipPositionString(tooltipPosition);
            let tooltipHiddenForPositionOuterElement = ensureHTMLElementOrNull(tooltipCalculationsContainer.querySelector(`* > .tooltip-outer[${tooltipOuterPlacementAttribute}="${tooltipPositionString}"]`));
            if (tooltipHiddenForPositionOuterElement == null || stateEntryComponents[tooltipHiddenForPositionOuterElementKey]?.element != tooltipHiddenForPositionOuterElement) {
                if (stateEntryComponents[tooltipHiddenForPositionOuterElementKey] != null) {
                    destroyManagedLifecycleObjectComponent(stateEntryComponents[tooltipHiddenForPositionOuterElementKey]);
                }
                if (tooltipHiddenForPositionOuterElement == null) {
                    const _tooltipHiddenForPositionOuterElement = document.createElement('div');
                    if (_tooltipHiddenForPositionOuterElement == null) {
                        throw Error('Could not clone tooltip outer element clone for hidden for position outer element!');
                    }
                    _tooltipHiddenForPositionOuterElement.classList.add('tooltip-outer');
                    _tooltipHiddenForPositionOuterElement.setAttribute(tooltipOuterPlacementAttribute, tooltipPositionString);
                    tooltipCalculationsContainer.append(_tooltipHiddenForPositionOuterElement);
                    tooltipHiddenForPositionOuterElement = _tooltipHiddenForPositionOuterElement;
                }
                if (tooltipHiddenForPositionOuterElement.innerHTML != tooltipOuterElement.innerHTML) {
                    tooltipHiddenForPositionOuterElement.innerHTML = tooltipOuterElement.innerHTML;
                }
                const tooltipHiddenForPositionOuterElementMutationObserver = new MutationObserver((entries, observer) => {
                    if (entries.some(x => x.target == tooltipHiddenForPositionOuterElement)) {
                        initTooltipCalculationsContainer();
                    }
                });
                tooltipHiddenForPositionOuterElementMutationObserver.observe(tooltipHiddenForPositionOuterElement, { subtree: true, childList: true });
                const tooltipHiddenForPositionOuterElementMutationObserverRemover = () => tooltipHiddenForPositionOuterElementMutationObserver.disconnect();
                stateEntryComponents[tooltipHiddenForPositionOuterElementKey] = {
                    element: tooltipHiddenForPositionOuterElement,
                    observables: {
                        'mutationObserver': {
                            destructor: tooltipHiddenForPositionOuterElementMutationObserverRemover
                        }
                    },
                    listeners: {},
                    loops: {}
                };
            }
            if (tooltipHiddenForPositionOuterElement.innerHTML != tooltipOuterElement.innerHTML) {
                tooltipHiddenForPositionOuterElement.innerHTML = tooltipOuterElement.innerHTML;
            }
            const result = tooltipPositions.find(tooltipPositionEntry => matchTooltipPosition(tooltipPositionString, tooltipPositionEntry.position))?.function({
                overlayContainerInnerElementDimensions,
                tooltipHiddenForSizeOuterElementDimensions,
                tooltipHiddenForSizeTooltipElementDimensions,
                tooltipOuterElement: tooltipHiddenForPositionOuterElement,
                tooltipSpaceAwayFromTriggerElementDimensions: tooltipSpaceAwayFromTriggerElementElementDimensions,
                triggerElementDimensions,
                tooltipMarginClosestToTriggerElementEnabled
            });
            if (result != null) {
                const tooltipPositionState = {
                    position: tooltipPosition,
                    ...result
                };
                const tooltipPositionStateIndex = tooltipPositionsState.findIndex(x => matchTooltipPosition(tooltipPositionString, x.position));
                if (tooltipPositionStateIndex > -1) {
                    tooltipPositionsState[tooltipPositionStateIndex] = tooltipPositionState;
                }
                else {
                    tooltipPositionsState.push(tooltipPositionState);
                }
            }
        }
    };
    ;
    const checkDimensionsChanged = (elementDimensions1, elementDimensions2) => (elementDimensions1.width !== elementDimensions2.width
        || elementDimensions1.height !== elementDimensions2.height
        || elementDimensions1.x !== elementDimensions2.x
        || elementDimensions1.y !== elementDimensions2.y);
    const getDimensionsFromDomRect = (domRect) => ({ width: domRect.width, height: domRect.height, x: domRect.x, y: domRect.y });
    let overlayContainerInnerElementDimensions = getDimensionsFromDomRect(overlayTooltipInnerElement.getBoundingClientRect());
    let tooltipHiddenForSizeOuterElementDimensions;
    let tooltipHiddenForSizeTooltipElementDimensions;
    let tooltipSpaceAwayFromTriggerElementElementDimensions;
    const triggerElement = extra.trigger.element;
    const triggerElementEventType = extra.trigger.eventType;
    let triggerElementDimensions = getDimensionsFromDomRect(triggerElement.getBoundingClientRect());
    const overlayElementMutationObserver = new MutationObserver((entries, observer) => {
        if (entries.some(x => x.target == overlayElement)) {
            initTooltipCalculationsContainer();
        }
    });
    overlayElementMutationObserver.observe(overlayElement, { attributes: true, attributeFilter: [tooltipPositionAttribute, tooltipMarginClosestToTriggerElementEnabledAttribute, tooltipScrollFactorCalculationForChildrenPercentageAttribute] });
    const overlayElementMutationObserverRemover = () => overlayElementMutationObserver.disconnect();
    const overlayTooltipInnerElementResizeObserver = new ResizeObserver((entries, observer) => {
        entries.filter(x => x.target == overlayTooltipInnerElement).forEach((entry) => {
            overlayContainerInnerElementDimensions = getDimensionsFromDomRect(entry.target.getBoundingClientRect());
        });
        if (entries.some(x => x.target == overlayTooltipInnerElement)) {
            initTooltipCalculationsContainer();
        }
    });
    overlayTooltipInnerElementResizeObserver.observe(overlayTooltipInnerElement);
    const overlayTooltipInnerElementResizeObserverRemover = () => overlayTooltipInnerElementResizeObserver.disconnect();
    const overlayTooltipInnerElementMutationObserver = new MutationObserver((entries, observer) => {
        if (entries.some(x => x.target == overlayTooltipInnerElement)) {
            initTooltipCalculationsContainer();
        }
    });
    overlayTooltipInnerElementMutationObserver.observe(overlayTooltipInnerElement, { attributes: true, attributeFilter: [tooltipPositionAttribute, tooltipMarginClosestToTriggerElementEnabledAttribute, tooltipScrollFactorCalculationForChildrenPercentageAttribute] });
    const overlayTooltipInnerElementMutationObserverRemover = () => overlayTooltipInnerElementMutationObserver.disconnect();
    const triggerElementMutationObserver = new MutationObserver((entries, observer) => {
        if (entries.some(x => x.target == triggerElement)) {
            initTooltipCalculationsContainer();
        }
    });
    triggerElementMutationObserver.observe(triggerElement, { attributes: true, attributeFilter: [tooltipPositionAttribute, tooltipMarginClosestToTriggerElementEnabledAttribute, tooltipScrollFactorCalculationForChildrenPercentageAttribute] });
    const triggerElementMutationObserverRemover = () => triggerElementMutationObserver.disconnect();
    const triggerElementResizeObserver = new ResizeObserver((entries, observer) => {
        entries.filter(x => x.target == triggerElement).forEach((entry) => {
            triggerElementDimensions = getDimensionsFromDomRect(entry.target.getBoundingClientRect());
        });
    });
    triggerElementResizeObserver.observe(triggerElement);
    const triggerElementResizeObserverRemover = () => triggerElementResizeObserver.disconnect();
    const tooltipPositionCalculationFunctionArgsChecker = (args) => {
        return args != null
            && typeof args === 'object'
            && args.tooltipOuterElement != null
            && args.tooltipSpaceAwayFromTriggerElementDimensions != null
            && args.triggerElementDimensions != null
            && args.overlayContainerInnerElementDimensions != null
            && args.tooltipHiddenForSizeOuterElementDimensions != null
            && args.tooltipHiddenForSizeTooltipElementDimensions != null
            && args.tooltipMarginClosestToTriggerElementEnabled != null;
    };
    const calculateFromOverlayLeft = (left, overlayContainerInnerElementDimensions) => {
        return left - overlayContainerInnerElementDimensions.x;
    };
    const calculateFromOverlayRight = (left, overlayContainerInnerElementDimensions) => {
        return (overlayContainerInnerElementDimensions.x + overlayContainerInnerElementDimensions.width) - left;
    };
    const calculateFromOverlayTop = (top, overlayContainerInnerElementDimensions) => {
        return top - overlayContainerInnerElementDimensions.y;
    };
    const calculateFromOverlayBottom = (top, overlayContainerInnerElementDimensions) => {
        return (overlayContainerInnerElementDimensions.y + overlayContainerInnerElementDimensions.height) - top;
    };
    const getTooltipPositionCalculationFunctionScrollViewVisibleScoreResponse = (args) => {
        if (args == null) {
            throw Error('Invalid arguments for getTooltipPositionCalculationFunctionResponse method!');
        }
        const tooltipScrollFactorCalculationForChildrenPercentage = getTooltipScrollFactorCalculationForChildrenPercentage();
        const tooltipInnerElement = getTooltipFromOuterElement(args.tooltipOuterElement);
        const _getScrollViewVisibleScoreResponseRecursive = (element, divisor) => {
            if (element == null) {
                return {
                    scrollViewVisibleScore: 0,
                    scrollViewVisibleHorizontallyScore: 0,
                    scrollViewVisibleVerticallyScore: 0,
                };
            }
            let scrollViewVisibleScore = ((element.clientHeight * element.clientWidth) / (element.scrollHeight * element.scrollWidth)) * divisor;
            let scrollViewVisibleHorizontallyScore = (element.clientWidth / element.scrollWidth) * divisor;
            let scrollViewVisibleVerticallyScore = (element.clientHeight / element.scrollHeight) * divisor;
            const childDivisor = divisor * (tooltipScrollFactorCalculationForChildrenPercentage / 100);
            let _scrollViewVisibleScoreChildren = [];
            let _scrollViewVisibleScoreHorizontallyChildren = [];
            let _scrollViewVisibleScoreVerticallyChildren = [];
            for (let i = 0; i < element.children.length; i++) {
                const childElement = ensureHTMLElementOrNull(element.children.item(i));
                const { scrollViewVisibleScore: _scrollViewVisibleScore, scrollViewVisibleHorizontallyScore: _scrollViewVisibleHorizontallyScore, scrollViewVisibleVerticallyScore: _scrollViewVisibleVerticallyScore } = _getScrollViewVisibleScoreResponseRecursive(childElement, childDivisor);
                const childElementAreaFactor = ((childElement?.offsetHeight ?? 0) * (childElement?.offsetWidth ?? 0)) / (element.scrollHeight * element.scrollWidth);
                _scrollViewVisibleScoreChildren.push({ areaFactor: childElementAreaFactor, score: _scrollViewVisibleScore });
                _scrollViewVisibleScoreHorizontallyChildren.push({ areaFactor: childElementAreaFactor, score: _scrollViewVisibleHorizontallyScore });
                _scrollViewVisibleScoreVerticallyChildren.push({ areaFactor: childElementAreaFactor, score: _scrollViewVisibleVerticallyScore });
            }
            const _scrollViewVisibleScoreChildrenAreaFactorSum = _scrollViewVisibleScoreChildren.length == 0 ? 0 : _scrollViewVisibleScoreChildren.map(x => x.areaFactor).reduce((partialSum, a) => partialSum + a, 0);
            const _scrollViewVisibleScoreHorizontallyChildrenAreaFactorSum = _scrollViewVisibleScoreHorizontallyChildren.length == 0 ? 0 : _scrollViewVisibleScoreHorizontallyChildren.map(x => x.areaFactor).reduce((partialSum, a) => partialSum + a, 0);
            const _scrollViewVisibleScoreVerticallyChildrenAreaFactorSum = _scrollViewVisibleScoreVerticallyChildren.length == 0 ? 0 : _scrollViewVisibleScoreVerticallyChildren.map(x => x.areaFactor).reduce((partialSum, a) => partialSum + a, 0);
            const _scrollViewVisibleScoreChildrenScores = _scrollViewVisibleScoreChildren.map(x => (x.areaFactor / _scrollViewVisibleScoreChildrenAreaFactorSum) * x.score);
            const _scrollViewVisibleScoreHorizontallyChildrenScores = _scrollViewVisibleScoreHorizontallyChildren.map(x => (x.areaFactor / _scrollViewVisibleScoreHorizontallyChildrenAreaFactorSum) * x.score);
            const _scrollViewVisibleScoreVerticallyChildrenScores = _scrollViewVisibleScoreVerticallyChildren.map(x => (x.areaFactor / _scrollViewVisibleScoreVerticallyChildrenAreaFactorSum) * x.score);
            scrollViewVisibleScore += _scrollViewVisibleScoreChildrenScores.length == 0 ? 0 : _scrollViewVisibleScoreChildrenScores.reduce((partialSum, a) => partialSum + a, 0);
            scrollViewVisibleHorizontallyScore += _scrollViewVisibleScoreHorizontallyChildrenScores.length == 0 ? 0 : _scrollViewVisibleScoreHorizontallyChildrenScores.reduce((partialSum, a) => partialSum + a, 0);
            scrollViewVisibleVerticallyScore += _scrollViewVisibleScoreVerticallyChildrenScores.length == 0 ? 0 : _scrollViewVisibleScoreVerticallyChildrenScores.reduce((partialSum, a) => partialSum + a, 0);
            return {
                scrollViewVisibleScore,
                scrollViewVisibleHorizontallyScore,
                scrollViewVisibleVerticallyScore,
            };
        };
        return _getScrollViewVisibleScoreResponseRecursive(tooltipInnerElement, 1);
    };
    const getTooltipPositionCalculationFunctionResponse = (args) => {
        if (args == null) {
            throw Error('Invalid arguments for getTooltipPositionCalculationFunctionResponse method!');
        }
        const boundingClientRect = args.tooltipOuterElement.getBoundingClientRect();
        return {
            top: calculateFromOverlayTop(boundingClientRect.y, args.overlayContainerInnerElementDimensions),
            bottom: calculateFromOverlayBottom(boundingClientRect.y + boundingClientRect.height, args.overlayContainerInnerElementDimensions),
            left: calculateFromOverlayLeft(boundingClientRect.x, args.overlayContainerInnerElementDimensions),
            right: calculateFromOverlayRight(boundingClientRect.x + boundingClientRect.width, args.overlayContainerInnerElementDimensions),
            width: boundingClientRect.width,
            height: boundingClientRect.height,
            area: boundingClientRect.width * boundingClientRect.height,
            ...getTooltipPositionCalculationFunctionScrollViewVisibleScoreResponse(args)
        };
    };
    const getTooltipFromOuterElement = (tooltipOuterElement) => {
        return ensureHTMLElementThrowOrNull(tooltipOuterElement.querySelector('.tooltip'), 'Tooltip element is invalid!');
    };
    const updateTooltipOuterElementPosition = (tooltipOuterElement, overlayContainerInnerElementDimensions, positionArgs, options) => {
        if (tooltipOuterElement == null || !isHTMLElement(tooltipOuterElement) || positionArgs == null || typeof positionArgs !== 'object') {
            throw Error('Invalid arguments for updateTooltipOuterElementPosition!');
        }
        const centerX = options?.centerX?.x;
        const centerXExact = options?.centerX?.exact?.toString().toLowerCase() === 'true';
        const centerXArgs = options?.centerX?.args;
        if (centerX != null && !tooltipPositionCalculationFunctionArgsTooltipHiddenForSizeMarginValidate(centerXArgs)) {
            throw Error('Invalid centerX args in updateTooltipOuterElementPosition!');
        }
        const centerY = options?.centerY?.y;
        const centerYExact = options?.centerY?.exact?.toString().toLowerCase() === 'true';
        const centerYArgs = options?.centerY?.args;
        if (centerY != null && !tooltipPositionCalculationFunctionArgsTooltipHiddenForSizeMarginValidate(centerYArgs)) {
            throw Error('Invalid centerY args in updateTooltipOuterElementPosition!');
        }
        const returnInCssPixels = (value) => value != null ? `${value}px` : '';
        let positionChanged = false;
        let top = positionArgs.top;
        let left = positionArgs.left;
        let bottom = positionArgs.bottom;
        let right = positionArgs.right;
        const setPosition = () => {
            if (tooltipOuterElement.style.position !== 'absolute') {
                tooltipOuterElement.style.position = 'absolute';
                positionChanged = true;
            }
            if (tooltipOuterElement.style.top !== returnInCssPixels(top)) {
                tooltipOuterElement.style.top = returnInCssPixels(top);
                positionChanged = true;
            }
            if (tooltipOuterElement.style.left !== returnInCssPixels(left)) {
                tooltipOuterElement.style.left = returnInCssPixels(left);
                positionChanged = true;
            }
            if (tooltipOuterElement.style.bottom !== returnInCssPixels(bottom)) {
                tooltipOuterElement.style.bottom = returnInCssPixels(bottom);
                positionChanged = true;
            }
            if (tooltipOuterElement.style.right !== returnInCssPixels(right)) {
                tooltipOuterElement.style.right = returnInCssPixels(right);
                positionChanged = true;
            }
        };
        setPosition();
        if (positionArgs.top == null || positionArgs.left == null || positionArgs.bottom == null || positionArgs.right == null) {
            if ((centerX != null && centerXArgs != null) || (centerY != null && centerYArgs != null)) {
                if (centerX != null && centerXArgs != null) {
                    const boundingClientRect = tooltipOuterElement.getBoundingClientRect();
                    const tooltipLeftMargin = getTooltipLeftMargin(centerXArgs);
                    const tooltipRightMargin = getTooltipRightMargin(centerXArgs);
                    const tooltipInnerWidth = boundingClientRect.width - tooltipLeftMargin - tooltipRightMargin;
                    const tooltipOuterCenterPointX = boundingClientRect.x + tooltipLeftMargin + (tooltipInnerWidth / 2);
                    const xDifference = tooltipOuterCenterPointX - centerX;
                    const _left = calculateFromOverlayLeft(boundingClientRect.x - xDifference, overlayContainerInnerElementDimensions);
                    const _right = calculateFromOverlayRight(boundingClientRect.x + boundingClientRect.width - xDifference, overlayContainerInnerElementDimensions);
                    let __left = _left;
                    let __right = _right;
                    if (centerXExact) {
                        if (__left < 0) {
                            const leftDifference = 0 - __left;
                            __right += leftDifference;
                            __left = 0;
                        }
                        if (__right < 0) {
                            const rightDifference = 0 - __right;
                            __left += rightDifference;
                            __right = 0;
                        }
                    }
                    else {
                        if (__left < 0) {
                            const leftDifference = 0 - __left;
                            __right = Math.max(0, __right - leftDifference);
                            __left = 0;
                        }
                        else if (__right < 0) {
                            const rightDifference = 0 - __right;
                            __left = Math.max(0, __left - rightDifference);
                            __right = 0;
                        }
                    }
                    left = __left;
                    right = __right;
                    setPosition();
                }
                if (centerY != null && centerYArgs != null) {
                    const boundingClientRect = tooltipOuterElement.getBoundingClientRect();
                    const tooltipTopMargin = getTooltipTopMargin(centerYArgs);
                    const tooltipBottomMargin = getTooltipBottomMargin(centerYArgs);
                    const tooltipInnerHeight = boundingClientRect.height - tooltipTopMargin - tooltipBottomMargin;
                    const tooltipOuterCenterPointY = boundingClientRect.y + tooltipTopMargin + (tooltipInnerHeight / 2);
                    const yDifference = tooltipOuterCenterPointY - centerY;
                    const _top = calculateFromOverlayTop(boundingClientRect.y - yDifference, overlayContainerInnerElementDimensions);
                    const _bottom = calculateFromOverlayBottom(boundingClientRect.y + boundingClientRect.height - yDifference, overlayContainerInnerElementDimensions);
                    let __top = _top;
                    let __bottom = _bottom;
                    if (centerYExact) {
                        if (__top < 0) {
                            const topDifference = 0 - __top;
                            __bottom += topDifference;
                            __top = 0;
                        }
                        if (__bottom < 0) {
                            const bottomDifference = 0 - __bottom;
                            __top += bottomDifference;
                            __bottom = 0;
                        }
                    }
                    else {
                        if (__top < 0) {
                            const topDifference = 0 - __top;
                            __bottom = Math.max(0, __bottom - topDifference);
                            __top = 0;
                        }
                        else if (__bottom < 0) {
                            const bottomDifference = 0 - __bottom;
                            __top = Math.max(0, __top - bottomDifference);
                            __bottom = 0;
                        }
                    }
                    top = __top;
                    bottom = __bottom;
                    setPosition();
                }
            }
            const boundingClientRect = tooltipOuterElement.getBoundingClientRect();
            const _left = calculateFromOverlayLeft(boundingClientRect.x, overlayContainerInnerElementDimensions);
            const _right = calculateFromOverlayRight(boundingClientRect.x + boundingClientRect.width, overlayContainerInnerElementDimensions);
            if (_left < 0) {
                left = 0;
            }
            if (_right < 0) {
                right = 0;
            }
            const _top = calculateFromOverlayTop(boundingClientRect.y, overlayContainerInnerElementDimensions);
            const _bottom = calculateFromOverlayBottom(boundingClientRect.y + boundingClientRect.height, overlayContainerInnerElementDimensions);
            if (_top < 0) {
                top = 0;
            }
            if (_bottom < 0) {
                bottom = 0;
            }
            setPosition();
        }
    };
    const tooltipPositionCalculationFunctionArgsTooltipHiddenForSizeMarginValidate = (args) => {
        return !(args == null || typeof args !== 'object' || args.tooltipHiddenForSizeOuterElementDimensions == null || args.tooltipHiddenForSizeTooltipElementDimensions == null);
    };
    const getTooltipLeftMargin = (args) => {
        if (!tooltipPositionCalculationFunctionArgsTooltipHiddenForSizeMarginValidate(args)) {
            throw Error('Invalid arguments for getTooltipLeftMargin!');
        }
        return args.tooltipHiddenForSizeTooltipElementDimensions.x - args.tooltipHiddenForSizeOuterElementDimensions.x;
    };
    const getTooltipTopMargin = (args) => {
        if (!tooltipPositionCalculationFunctionArgsTooltipHiddenForSizeMarginValidate(args)) {
            throw Error('Invalid arguments for getTooltipTopMargin!');
        }
        return args.tooltipHiddenForSizeTooltipElementDimensions.y - args.tooltipHiddenForSizeOuterElementDimensions.y;
    };
    const getTooltipRightMargin = (args) => {
        if (!tooltipPositionCalculationFunctionArgsTooltipHiddenForSizeMarginValidate(args)) {
            throw Error('Invalid arguments for getTooltipRightMargin!');
        }
        return args.tooltipHiddenForSizeOuterElementDimensions.width - (getTooltipLeftMargin(args) + args.tooltipHiddenForSizeTooltipElementDimensions.width);
    };
    const getTooltipBottomMargin = (args) => {
        if (!tooltipPositionCalculationFunctionArgsTooltipHiddenForSizeMarginValidate(args)) {
            throw Error('Invalid arguments for getTooltipBottomMargin!');
        }
        return args.tooltipHiddenForSizeOuterElementDimensions.height - (getTooltipTopMargin(args) + args.tooltipHiddenForSizeTooltipElementDimensions.height);
    };
    const _tooltipPositionTopDimensionsTopAndBottom = (args) => {
        if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
            throw new Error('Invalid arguments for tooltip position calculation function!');
        }
        const tooltipMarginClosestToTriggerElementRemover = args.tooltipMarginClosestToTriggerElementEnabled ? 0 : getTooltipTopMargin(args);
        const top = Math.max(0, calculateFromOverlayTop(args.triggerElementDimensions.y - args.tooltipHiddenForSizeOuterElementDimensions.height - args.tooltipSpaceAwayFromTriggerElementDimensions.height + tooltipMarginClosestToTriggerElementRemover, args.overlayContainerInnerElementDimensions));
        const bottom = Math.max(0, calculateFromOverlayBottom(args.triggerElementDimensions.y - args.tooltipSpaceAwayFromTriggerElementDimensions.height + tooltipMarginClosestToTriggerElementRemover, args.overlayContainerInnerElementDimensions));
        return { top, bottom };
    };
    const _tooltipPositionLeftDimensionsLeftAndRight = (args) => {
        if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
            throw new Error('Invalid arguments for tooltip position calculation function!');
        }
        const tooltipMarginClosestToTriggerElementRemover = args.tooltipMarginClosestToTriggerElementEnabled ? 0 : getTooltipLeftMargin(args);
        const left = Math.max(0, calculateFromOverlayLeft(args.triggerElementDimensions.x - args.tooltipHiddenForSizeOuterElementDimensions.width - args.tooltipSpaceAwayFromTriggerElementDimensions.width + tooltipMarginClosestToTriggerElementRemover, args.overlayContainerInnerElementDimensions));
        const right = Math.max(0, calculateFromOverlayRight(args.triggerElementDimensions.x - args.tooltipSpaceAwayFromTriggerElementDimensions.width + tooltipMarginClosestToTriggerElementRemover, args.overlayContainerInnerElementDimensions));
        return { left, right };
    };
    const _tooltipPositionBottomDimensionsTopAndBottom = (args) => {
        if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
            throw new Error('Invalid arguments for tooltip position calculation function!');
        }
        const tooltipMarginClosestToTriggerElementRemover = args.tooltipMarginClosestToTriggerElementEnabled ? 0 : getTooltipBottomMargin(args);
        const top = Math.max(0, calculateFromOverlayTop(args.triggerElementDimensions.y + args.triggerElementDimensions.height + args.tooltipSpaceAwayFromTriggerElementDimensions.height - tooltipMarginClosestToTriggerElementRemover, args.overlayContainerInnerElementDimensions));
        const bottom = Math.max(0, calculateFromOverlayBottom(args.triggerElementDimensions.y + args.triggerElementDimensions.height + args.tooltipHiddenForSizeOuterElementDimensions.height + args.tooltipSpaceAwayFromTriggerElementDimensions.height - tooltipMarginClosestToTriggerElementRemover, args.overlayContainerInnerElementDimensions));
        return { top, bottom };
    };
    const _tooltipPositionRightDimensionsLeftAndRight = (args) => {
        if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
            throw new Error('Invalid arguments for tooltip position calculation function!');
        }
        const tooltipMarginClosestToTriggerElementRemover = args.tooltipMarginClosestToTriggerElementEnabled ? 0 : getTooltipRightMargin(args);
        const left = Math.max(0, calculateFromOverlayLeft(args.triggerElementDimensions.x + args.triggerElementDimensions.width + args.tooltipSpaceAwayFromTriggerElementDimensions.width - tooltipMarginClosestToTriggerElementRemover, args.overlayContainerInnerElementDimensions));
        const right = Math.max(0, calculateFromOverlayRight(args.triggerElementDimensions.x + args.triggerElementDimensions.width + args.tooltipHiddenForSizeOuterElementDimensions.width + args.tooltipSpaceAwayFromTriggerElementDimensions.width - tooltipMarginClosestToTriggerElementRemover, args.overlayContainerInnerElementDimensions));
        return { left, right };
    };
    const getTooltipPositionString = (tooltipPosition) => tooltipPosition.join('-');
    const tooltipPositions = [
        {
            position: ['center', 'top'],
            function: (args) => {
                if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
                    throw new Error('Invalid arguments for tooltip position calculation function!');
                }
                let { top, bottom } = _tooltipPositionTopDimensionsTopAndBottom(args);
                updateTooltipOuterElementPosition(args.tooltipOuterElement, args.overlayContainerInnerElementDimensions, { bottom }, { centerX: { x: args.triggerElementDimensions.x + (args.triggerElementDimensions.width / 2), exact: true, args } });
                return getTooltipPositionCalculationFunctionResponse(args);
            }
        },
        {
            position: ['top', 'right'],
            function: (args) => {
                if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
                    throw new Error('Invalid arguments for tooltip position calculation function!');
                }
                let { top, bottom } = _tooltipPositionTopDimensionsTopAndBottom(args);
                let right = Math.max(0, calculateFromOverlayRight(args.triggerElementDimensions.x + args.triggerElementDimensions.width + getTooltipRightMargin(args), args.overlayContainerInnerElementDimensions));
                updateTooltipOuterElementPosition(args.tooltipOuterElement, args.overlayContainerInnerElementDimensions, { right, bottom });
                return getTooltipPositionCalculationFunctionResponse(args);
            }
        },
        {
            position: ['top', 'left'],
            function: (args) => {
                if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
                    throw new Error('Invalid arguments for tooltip position calculation function!');
                }
                let { top, bottom } = _tooltipPositionTopDimensionsTopAndBottom(args);
                let left = Math.max(0, calculateFromOverlayLeft(args.triggerElementDimensions.x - getTooltipLeftMargin(args), args.overlayContainerInnerElementDimensions));
                updateTooltipOuterElementPosition(args.tooltipOuterElement, args.overlayContainerInnerElementDimensions, { left, bottom });
                return getTooltipPositionCalculationFunctionResponse(args);
            }
        },
        {
            position: ['top'],
            function: (args) => {
                if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
                    throw new Error('Invalid arguments for tooltip position calculation function!');
                }
                let { top, bottom } = _tooltipPositionTopDimensionsTopAndBottom(args);
                updateTooltipOuterElementPosition(args.tooltipOuterElement, args.overlayContainerInnerElementDimensions, { bottom }, { centerX: { x: args.triggerElementDimensions.x + (args.triggerElementDimensions.width / 2), exact: false, args } });
                return getTooltipPositionCalculationFunctionResponse(args);
            }
        },
        {
            position: ['center', 'left'],
            function: (args) => {
                if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
                    throw new Error('Invalid arguments for tooltip position calculation function!');
                }
                let { left, right } = _tooltipPositionLeftDimensionsLeftAndRight(args);
                updateTooltipOuterElementPosition(args.tooltipOuterElement, args.overlayContainerInnerElementDimensions, { right }, { centerY: { y: args.triggerElementDimensions.y + (args.triggerElementDimensions.height / 2), exact: true, args } });
                return getTooltipPositionCalculationFunctionResponse(args);
            }
        },
        {
            position: ['center', 'right'],
            function: (args) => {
                if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
                    throw new Error('Invalid arguments for tooltip position calculation function!');
                }
                let { left, right } = _tooltipPositionRightDimensionsLeftAndRight(args);
                updateTooltipOuterElementPosition(args.tooltipOuterElement, args.overlayContainerInnerElementDimensions, { left }, { centerY: { y: args.triggerElementDimensions.y + (args.triggerElementDimensions.height / 2), exact: true, args } });
                return getTooltipPositionCalculationFunctionResponse(args);
            }
        },
        {
            position: ['left', 'top'],
            function: (args) => {
                if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
                    throw new Error('Invalid arguments for tooltip position calculation function!');
                }
                let { left, right } = _tooltipPositionLeftDimensionsLeftAndRight(args);
                let top = Math.max(0, calculateFromOverlayTop(args.triggerElementDimensions.y - getTooltipTopMargin(args), args.overlayContainerInnerElementDimensions));
                updateTooltipOuterElementPosition(args.tooltipOuterElement, args.overlayContainerInnerElementDimensions, { top, right });
                return getTooltipPositionCalculationFunctionResponse(args);
            }
        },
        {
            position: ['left', 'bottom'],
            function: (args) => {
                if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
                    throw new Error('Invalid arguments for tooltip position calculation function!');
                }
                let { left, right } = _tooltipPositionLeftDimensionsLeftAndRight(args);
                let bottom = Math.max(0, calculateFromOverlayBottom(args.triggerElementDimensions.y + args.triggerElementDimensions.height + getTooltipBottomMargin(args), args.overlayContainerInnerElementDimensions));
                updateTooltipOuterElementPosition(args.tooltipOuterElement, args.overlayContainerInnerElementDimensions, { right, bottom });
                return getTooltipPositionCalculationFunctionResponse(args);
            }
        },
        {
            position: ['left'],
            function: (args) => {
                if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
                    throw new Error('Invalid arguments for tooltip position calculation function!');
                }
                let { left, right } = _tooltipPositionLeftDimensionsLeftAndRight(args);
                updateTooltipOuterElementPosition(args.tooltipOuterElement, args.overlayContainerInnerElementDimensions, { right }, { centerY: { y: args.triggerElementDimensions.y + (args.triggerElementDimensions.height / 2), exact: false, args } });
                return getTooltipPositionCalculationFunctionResponse(args);
            }
        },
        {
            position: ['right', 'top'],
            function: (args) => {
                if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
                    throw new Error('Invalid arguments for tooltip position calculation function!');
                }
                let { left, right } = _tooltipPositionRightDimensionsLeftAndRight(args);
                let top = Math.max(0, calculateFromOverlayTop(args.triggerElementDimensions.y - getTooltipTopMargin(args), args.overlayContainerInnerElementDimensions));
                updateTooltipOuterElementPosition(args.tooltipOuterElement, args.overlayContainerInnerElementDimensions, { top, left });
                return getTooltipPositionCalculationFunctionResponse(args);
            }
        },
        {
            position: ['right', 'bottom'],
            function: (args) => {
                if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
                    throw new Error('Invalid arguments for tooltip position calculation function!');
                }
                let { left, right } = _tooltipPositionRightDimensionsLeftAndRight(args);
                let bottom = Math.max(0, calculateFromOverlayBottom(args.triggerElementDimensions.y + args.triggerElementDimensions.height + getTooltipBottomMargin(args), args.overlayContainerInnerElementDimensions));
                updateTooltipOuterElementPosition(args.tooltipOuterElement, args.overlayContainerInnerElementDimensions, { left, bottom });
                return getTooltipPositionCalculationFunctionResponse(args);
            }
        },
        {
            position: ['right'],
            function: (args) => {
                if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
                    throw new Error('Invalid arguments for tooltip position calculation function!');
                }
                let { left, right } = _tooltipPositionRightDimensionsLeftAndRight(args);
                updateTooltipOuterElementPosition(args.tooltipOuterElement, args.overlayContainerInnerElementDimensions, { left }, { centerY: { y: args.triggerElementDimensions.y + (args.triggerElementDimensions.height / 2), exact: false, args } });
                return getTooltipPositionCalculationFunctionResponse(args);
            }
        },
        {
            position: ['center', 'bottom'],
            function: (args) => {
                if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
                    throw new Error('Invalid arguments for tooltip position calculation function!');
                }
                let { top, bottom } = _tooltipPositionBottomDimensionsTopAndBottom(args);
                updateTooltipOuterElementPosition(args.tooltipOuterElement, args.overlayContainerInnerElementDimensions, { top }, { centerX: { x: args.triggerElementDimensions.x + (args.triggerElementDimensions.width / 2), exact: true, args } });
                return getTooltipPositionCalculationFunctionResponse(args);
            }
        },
        {
            position: ['bottom', 'right'],
            function: (args) => {
                if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
                    throw new Error('Invalid arguments for tooltip position calculation function!');
                }
                let { top, bottom } = _tooltipPositionBottomDimensionsTopAndBottom(args);
                let left = Math.max(0, calculateFromOverlayLeft(args.triggerElementDimensions.x + args.triggerElementDimensions.width - args.tooltipHiddenForSizeOuterElementDimensions.width + getTooltipRightMargin(args), args.overlayContainerInnerElementDimensions));
                let right = Math.max(0, calculateFromOverlayRight(args.triggerElementDimensions.x + args.triggerElementDimensions.width + getTooltipRightMargin(args), args.overlayContainerInnerElementDimensions));
                updateTooltipOuterElementPosition(args.tooltipOuterElement, args.overlayContainerInnerElementDimensions, { top, right });
                return getTooltipPositionCalculationFunctionResponse(args);
            }
        },
        {
            position: ['bottom', 'left'],
            function: (args) => {
                if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
                    throw new Error('Invalid arguments for tooltip position calculation function!');
                }
                let { top, bottom } = _tooltipPositionBottomDimensionsTopAndBottom(args);
                let left = Math.max(0, calculateFromOverlayLeft(args.triggerElementDimensions.x - getTooltipLeftMargin(args), args.overlayContainerInnerElementDimensions));
                let right = Math.max(0, calculateFromOverlayRight(args.triggerElementDimensions.x + args.tooltipHiddenForSizeOuterElementDimensions.width - getTooltipLeftMargin(args), args.overlayContainerInnerElementDimensions));
                updateTooltipOuterElementPosition(args.tooltipOuterElement, args.overlayContainerInnerElementDimensions, { top, left });
                return getTooltipPositionCalculationFunctionResponse(args);
            }
        },
        {
            position: ['bottom'],
            function: (args) => {
                if (tooltipPositionCalculationFunctionArgsChecker(args) === false) {
                    throw new Error('Invalid arguments for tooltip position calculation function!');
                }
                let { top, bottom } = _tooltipPositionBottomDimensionsTopAndBottom(args);
                updateTooltipOuterElementPosition(args.tooltipOuterElement, args.overlayContainerInnerElementDimensions, { top }, { centerX: { x: args.triggerElementDimensions.x + (args.triggerElementDimensions.width / 2), exact: false, args } });
                return getTooltipPositionCalculationFunctionResponse(args);
            }
        }
    ];
    const getTooltipScrollFactorCalculationForChildrenPercentage = () => {
        const tooltipScrollFactorCalculationForChildrenPercentageDefaultValue = 100;
        const elementsToCheck = [triggerElement, overlayElement, overlayTooltipInnerElement];
        for (const elementToCheck of elementsToCheck) {
            const attributeValue = elementToCheck.getAttribute(tooltipScrollFactorCalculationForChildrenPercentageAttribute);
            if (attributeValue != null) {
                const attributeValueParsed = parseFloat(attributeValue.toString().trim());
                if (!isNaN(attributeValueParsed)) {
                    return attributeValueParsed;
                }
            }
        }
        return tooltipScrollFactorCalculationForChildrenPercentageDefaultValue;
    };
    const getTooltipMarginClosestToTriggerElementEnabled = () => {
        let tooltipMarginClosestToTriggerElementEnabled = triggerElement.getAttribute(tooltipMarginClosestToTriggerElementEnabledAttribute)?.trim().toLowerCase() || overlayElement.getAttribute(tooltipMarginClosestToTriggerElementEnabledAttribute)?.trim().toLowerCase() || overlayTooltipInnerElement.getAttribute(tooltipMarginClosestToTriggerElementEnabledAttribute)?.trim().toLowerCase();
        return tooltipMarginClosestToTriggerElementEnabled == 'true';
    };
    const getTooltipPositionsRequired = () => {
        const tooltipPositionsAll = getTooltipPositionsAll();
        let tooltipPosition = triggerElement.getAttribute(tooltipPositionAttribute)?.trim() || overlayElement.getAttribute(tooltipPositionAttribute)?.trim() || overlayTooltipInnerElement.getAttribute(tooltipPositionAttribute)?.trim();
        if (tooltipPosition == null || tooltipPosition.length === 0) {
            tooltipPosition = tooltipPositions.map(x => getTooltipPositionString(x.position)).join(' ');
        }
        return tooltipPosition.split(/\s+/).filter(x => x != null && x.length > 0).map(x => tooltipPositionsAll.find(y => matchTooltipPosition(x, y))).filter(x => x != null);
    };
    const getTooltipPositionsAll = () => {
        return tooltipPositions.map(x => x.position);
    };
    const getTooltipPositionInternal = (tooltipPosition) => {
        return tooltipPositions.find(x => matchTooltipPosition(tooltipPosition, x.position))?.position;
    };
    const matchTooltipPosition = (tooltipPosition, checkPosition) => {
        if (tooltipPosition == null) {
            return false;
        }
        if (Array.isArray(tooltipPosition)) {
            tooltipPosition = getTooltipPositionString(tooltipPosition);
        }
        if (tooltipPosition == null || tooltipPosition.toString().trim().length === 0 || checkPosition == null || typeof checkPosition !== 'object' || !Array.isArray(checkPosition) || checkPosition.length === 0 || !checkPosition.every(x => typeof x === 'string')) {
            return false;
        }
        const _tooltipPosition = tooltipPosition.toString().trim();
        const _checkPosition = checkPosition.map(x => x?.toString().trim()).filter(x => x != null);
        if (_checkPosition.length === 1) {
            return _checkPosition[0].toLowerCase() == _tooltipPosition.toLowerCase();
        }
        else if (_checkPosition.length == 2) {
            if ((_tooltipPosition.toLowerCase() === `${_checkPosition[0].toLowerCase()}${_checkPosition[1].toLowerCase()}`)
                || (_tooltipPosition.toLowerCase() === `${_checkPosition[0].toLowerCase()}-${_checkPosition[1].toLowerCase()}`)) {
                return true;
            }
            if (_checkPosition.some(x => x.toLowerCase() === 'center') &&
                ((_tooltipPosition.toLowerCase() === `${_checkPosition[1].toLowerCase()}${_checkPosition[0].toLowerCase()}`)
                    || (_tooltipPosition.toLowerCase() === `${_checkPosition[1].toLowerCase()}-${_checkPosition[0].toLowerCase()}`))) {
                return true;
            }
        }
        return false;
    };
    function getElementIntersectionDimensions(args) {
        if (args == null || typeof args !== 'object' || !isHTMLElement(args.targetElement) || (args.targetContainerElement != null && !isHTMLElement(args.targetContainerElement)) || (args.ignoreOverlappingElements != null && (typeof args.ignoreOverlappingElements !== 'object' || !Array.isArray(args.ignoreOverlappingElements) || args.ignoreOverlappingElements.some(x => !isHTMLElement(x))))) {
            throw Error('Invalid arguments for isElementTopmost function!');
        }
        const sampleCountDefaultValue = 9;
        const targetElement = args.targetElement;
        const targetContainerElement = args.targetContainerElement;
        const ignoreOverlappingElements = args.ignoreOverlappingElements;
        const sampleCount = args.sampleCount != null && !isNaN(args.sampleCount) ? parseInt(args.sampleCount.toString()) : sampleCountDefaultValue;
        const rect = getDimensionsFromDomRect(targetElement.getBoundingClientRect());
        const containerRect = targetContainerElement != null ? getDimensionsFromDomRect(targetContainerElement.getBoundingClientRect()) : undefined;
        // Early exit if off-screen (optional)
        if (rect.width <= 0 || rect.height <= 0)
            return;
        // Avoid sampling exactly on edges (which may hit parent containers)
        const distanceFromBorderHorizontal = 0.25;
        const distanceFromBorderVertical = 0.25;
        if (rect.width < (distanceFromBorderHorizontal * 2) || rect.height < (distanceFromBorderVertical * 2)) {
            return;
        }
        // Determine how many points to sample along X and Y
        const gridSize = Math.max(2, Math.floor(Math.sqrt(sampleCount)));
        const xDivisions = gridSize;
        const yDivisions = gridSize;
        const plot = Array.from({ length: xDivisions + 1 }).map((_) => Array.from({ length: yDivisions + 1 }));
        const elementWidthScanned = rect.width - (distanceFromBorderHorizontal * 2);
        const elementHeightScanned = rect.height - (distanceFromBorderVertical * 2);
        const isOutsideContainerRect = (dimensions) => {
            if (dimensions == null || typeof dimensions !== 'object' || dimensions.x == null || dimensions.y == null) {
                throw Error('Invalid arguments for isOutsideContainerRect!');
            }
            if (containerRect == null) {
                return false;
            }
            return containerRect.x > dimensions.x
                || ((containerRect.x + containerRect.width) < dimensions.x)
                || containerRect.y > dimensions.y
                || ((containerRect.y + containerRect.height) < dimensions.y);
        };
        const isIgnoredElement = (element) => {
            return ignoreOverlappingElements != null && ignoreOverlappingElements.some(ignoredElement => element == ignoredElement || ignoredElement.contains(element));
        };
        // Sample points in a grid pattern
        for (let i = 0; i <= xDivisions; i++) {
            for (let j = 0; j <= yDivisions; j++) {
                const xOffset = distanceFromBorderHorizontal + ((elementWidthScanned / xDivisions) * i);
                const yOffset = distanceFromBorderVertical + ((elementHeightScanned / yDivisions) * j);
                const x = rect.x + xOffset;
                const y = rect.y + yOffset;
                let elementAtPoint = undefined;
                if (targetContainerElement != null && isOutsideContainerRect({ x, y })) {
                    elementAtPoint = targetContainerElement;
                }
                else {
                    // Optimised
                    const _elementAtPoint = document.elementFromPoint(x, y);
                    if (_elementAtPoint != null) {
                        if (!isIgnoredElement(_elementAtPoint)) {
                            elementAtPoint = _elementAtPoint;
                        }
                        else {
                            const elementsAtPoint = document.elementsFromPoint(x, y);
                            for (const _elementAtPoint of elementsAtPoint) {
                                if (isIgnoredElement(_elementAtPoint)) {
                                    continue;
                                }
                                elementAtPoint = _elementAtPoint;
                                break;
                            }
                        }
                    }
                }
                plot[i][j] = (elementAtPoint != null && targetElement.contains(elementAtPoint) || elementAtPoint == targetElement) ? targetElement : elementAtPoint;
            }
        }
        const averageFn = (array) => array.reduce((a, b) => a + b) / array.length;
        const getHorizontalDimensionResultLeftNotRight = (leftNotRight) => {
            const result = { full: 0, additionalPartial: { distance: 0, saturationPercentage: 0 } };
            const additionalPartialPercentages = [];
            for (let i = 0; i < plot.length; i++) {
                const idx = leftNotRight ? i : (plot.length - i - 1);
                const percentage = (plot[idx].filter((element) => element != null && element != targetElement).length / plot[idx].length) * 100;
                if (percentage == 0) {
                    break;
                }
                else {
                    const additionalDistanceCovered = (((idx == 0 || idx == plot.length - 1) ? distanceFromBorderHorizontal : 0) + (((leftNotRight && idx > 0) || (!leftNotRight && (idx < (plot.length - 1)))) ? (elementWidthScanned / xDivisions) : 0));
                    if (percentage == 100 && additionalPartialPercentages.length == 0) {
                        result.full += additionalDistanceCovered;
                    }
                    else {
                        result.additionalPartial.distance += additionalDistanceCovered;
                        additionalPartialPercentages.push(percentage);
                    }
                }
            }
            result.additionalPartial.saturationPercentage = additionalPartialPercentages.length > 0 ? averageFn(additionalPartialPercentages) : 0;
            return result;
        };
        const getVerticalDimensionResultTopNotBottom = (topNotBottom) => {
            const result = { full: 0, additionalPartial: { distance: 0, saturationPercentage: 0 } };
            const additionalPartialPercentages = [];
            const firstItemArrayLength = plot[0].length;
            for (let j = 0; j < firstItemArrayLength; j++) {
                const idx = topNotBottom ? j : (firstItemArrayLength - j - 1);
                const percentage = (plot.filter((element) => element[idx] != null && element[idx] != targetElement).length / plot.length) * 100;
                if (percentage == 0) {
                    break;
                }
                else {
                    const additionalDistanceCovered = (((idx == 0 || idx == firstItemArrayLength - 1) ? distanceFromBorderHorizontal : 0) + (((topNotBottom && idx > 0) || (!topNotBottom && (idx < (firstItemArrayLength - 1)))) ? (elementHeightScanned / yDivisions) : 0));
                    if (percentage == 100 && additionalPartialPercentages.length == 0) {
                        result.full += additionalDistanceCovered;
                    }
                    else {
                        result.additionalPartial.distance += additionalDistanceCovered;
                        additionalPartialPercentages.push(percentage);
                    }
                }
            }
            result.additionalPartial.saturationPercentage = additionalPartialPercentages.length > 0 ? averageFn(additionalPartialPercentages) : 0;
            return result;
        };
        const results = {
            top: getVerticalDimensionResultTopNotBottom(true),
            bottom: getVerticalDimensionResultTopNotBottom(false),
            left: getHorizontalDimensionResultLeftNotRight(true),
            right: getHorizontalDimensionResultLeftNotRight(false)
        };
        return results;
    }
    const resetTooltipPosition = () => {
        const tooltipPositions = getTooltipPositionsRequired();
        const triggerElementIntersectionDimensionsPositions = ['left', 'right', 'top', 'bottom'];
        const triggerElementIntersectionDimensions = getElementIntersectionDimensions({ targetElement: triggerElement, targetContainerElement: overlayTooltipInnerElement, ignoreOverlappingElements: [overlayElement] });
        const tooltipPositionsStatesFiltered = tooltipPositions.filter(tooltipPosition => triggerElementIntersectionDimensions == null
            || !triggerElementIntersectionDimensionsPositions.some(pos => triggerElementIntersectionDimensions[pos].full > 0 && tooltipPosition.includes(pos))).map(tooltipPosition => tooltipPositionsState.find(x => matchTooltipPosition(tooltipPosition, x.position)))
            .filter(x => x != null)
            .filter(tooltipPositionState => (tooltipPositionState.area ?? 0) > 0);
        const tooltipPositionsStatesFilteredSorted = Array.from(tooltipPositionsStatesFiltered).sort((item1, item2) => {
            const _item1State = item1;
            const _item2State = item2;
            if (_item1State == null || _item2State == null) {
                return 0;
            }
            if (_item1State.scrollViewVisibleScore > _item2State.scrollViewVisibleScore) {
                return -1;
            }
            else if (_item1State.scrollViewVisibleScore < _item2State.scrollViewVisibleScore) {
                return 1;
            }
            if (triggerElementIntersectionDimensions != null) {
                const distanceAdjusted = triggerElementIntersectionDimensionsPositions.map((position) => ({
                    position: position,
                    valueFull: triggerElementIntersectionDimensions[position].full,
                    valuePartial: (triggerElementIntersectionDimensions[position].additionalPartial.distance * (triggerElementIntersectionDimensions[position].additionalPartial.saturationPercentage / 100))
                }));
                distanceAdjusted.sort((a, b) => {
                    if (a.valueFull > b.valueFull) {
                        return 1;
                    }
                    else if (a.valueFull < b.valueFull) {
                        return -1;
                    }
                    if (a.valuePartial > b.valuePartial) {
                        return 1;
                    }
                    else if (a.valuePartial < b.valuePartial) {
                        return -1;
                    }
                    return 0;
                });
                const item1Pos = triggerElementIntersectionDimensionsPositions.find(pos => _item1State.position.length > 0 && _item1State.position[0] == pos);
                const item2Pos = triggerElementIntersectionDimensionsPositions.find(pos => _item2State.position.length > 0 && _item2State.position[0] == pos);
                if (item1Pos != null && item2Pos != null) {
                    const item1DistanceAdjustedIndex = distanceAdjusted.findIndex(x => x.position === item1Pos);
                    const item2DistanceAdjustedIndex = distanceAdjusted.findIndex(x => x.position === item2Pos);
                    if (item1DistanceAdjustedIndex !== -1 && item2DistanceAdjustedIndex !== -1
                        && (distanceAdjusted[item1DistanceAdjustedIndex].valueFull != distanceAdjusted[item2DistanceAdjustedIndex].valueFull
                            || distanceAdjusted[item1DistanceAdjustedIndex].valuePartial != distanceAdjusted[item2DistanceAdjustedIndex].valuePartial)) {
                        if (item1DistanceAdjustedIndex < item2DistanceAdjustedIndex) {
                            return -1;
                        }
                        else if (item1DistanceAdjustedIndex > item2DistanceAdjustedIndex) {
                            return 1;
                        }
                    }
                }
            }
            const _item1IndexOf = tooltipPositionsStatesFiltered.indexOf(item1);
            const _item2IndexOf = tooltipPositionsStatesFiltered.indexOf(item2);
            if (_item1IndexOf < _item2IndexOf) {
                return -1;
            }
            else if (_item1IndexOf > _item2IndexOf) {
                return 1;
            }
            return 0;
        });
        if (tooltipPositionsStatesFilteredSorted.length == 0) {
            tooltipOuterElement.removeAttribute(tooltipOuterPlacementAttribute);
        }
        else {
            const tooltipPositionBestMatch = tooltipPositionsStatesFilteredSorted[0];
            if (tooltipPositionBestMatch != null) {
                updateTooltipOuterElementPosition(tooltipOuterElement, overlayContainerInnerElementDimensions, tooltipPositionBestMatch);
                tooltipOuterElement.setAttribute(tooltipOuterPlacementAttribute, getTooltipPositionString(tooltipPositionBestMatch.position));
            }
            else {
                tooltipOuterElement.removeAttribute(tooltipOuterPlacementAttribute);
            }
        }
    };
    let requestAnimationFrameLoopFlag = true;
    const requestAnimationFrameLoopCanceller = () => requestAnimationFrameLoopFlag = false;
    const requestAnimationFrameLoop = () => {
        if (!requestAnimationFrameLoopFlag) {
            return;
        }
        const _triggerElementDimensions = getDimensionsFromDomRect(triggerElement.getBoundingClientRect());
        if (checkDimensionsChanged(triggerElementDimensions, _triggerElementDimensions)) {
            triggerElementDimensions = _triggerElementDimensions;
            if (requestAnimationFrameLoopFlag) {
                initTooltipCalculationsContainer();
            }
        }
        if (requestAnimationFrameLoopFlag) {
            resetTooltipPosition();
        }
        if (requestAnimationFrameLoopFlag) {
            requestAnimationFrame(requestAnimationFrameLoop);
        }
    };
    initTooltipCalculationsContainer();
    requestAnimationFrame(requestAnimationFrameLoop);
    stateEntryComponents['overlayElement'] = {
        element: overlayElement,
        observables: {
            'mutationObserver': {
                destructor: overlayElementMutationObserverRemover
            }
        },
        listeners: {},
        loops: {}
    };
    stateEntryComponents['overlayTooltipInnerElement'] = {
        element: overlayTooltipInnerElement,
        observables: {
            'resizeObserver': {
                destructor: overlayTooltipInnerElementResizeObserverRemover
            },
            'mutationObserver': {
                destructor: overlayTooltipInnerElementMutationObserverRemover
            }
        },
        listeners: {},
        loops: {}
    };
    stateEntryComponents['triggerElement'] = {
        element: triggerElement,
        observables: {
            'resizeObserver': {
                destructor: triggerElementResizeObserverRemover
            },
            'mutationObserver': {
                destructor: triggerElementMutationObserverRemover,
            }
        },
        listeners: {},
        loops: {}
    };
    stateEntryComponents['tooltipOuterElement'] = {
        element: tooltipOuterElement,
        observables: {},
        listeners: {},
        loops: {
            'requestAnimationFrame': {
                destructor: requestAnimationFrameLoopCanceller
            }
        }
    };
    const stateEntry = {
        element: overlayElement,
        originalElement: extra?.originalElement,
        trigger: extra?.trigger,
        components: stateEntryComponents,
        componentsGroups: {}
    };
    tooltipOverlayObjectGroup.state.push(stateEntry);
}
