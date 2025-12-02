import { type SiteData, type SiteDataOptions, nameOf, type CustomFunction } from "@portfoliosharp/shared";
import { transformIntoSeparateFunctionsAndContext } from "../site.data.options.functions.js";
import { __siteDataOptionsFunctionsByKeyFilePath, siteDataOptionsFunctionsByKey } from "./site.data.options.functions.bykey.functions.js";

export const handleSiteDataOptionsFunctionsByKey = async function (data: SiteData, options: SiteDataOptions): Promise<SiteData> {
    if (data === undefined || data === null) {
        throw Error('Undefined data object!');
    }

    if (data.content === undefined || data.content === null) {
        throw Error('Undefined data content!');
    }

    const _data = structuredClone(data);
    
    const defaultKeyProperty = 'key';
    const defaultFunctionsObjectProperty = 'functions';

    const siteDataOptionsFunctionsByKeyTransformation = await transformIntoSeparateFunctionsAndContext<typeof siteDataOptionsFunctionsByKey>({ 
        filePath: __siteDataOptionsFunctionsByKeyFilePath, 
        exportedNameOfVariableObjectWithFunctions: nameOf(() => siteDataOptionsFunctionsByKey),
        exportedNameOfVariableFilePath: nameOf(() => __siteDataOptionsFunctionsByKeyFilePath)
    });

    if (siteDataOptionsFunctionsByKeyTransformation == null || !siteDataOptionsFunctionsByKeyTransformation.success) {
        throw Error(`Failed to transform by key functions file! Error: ${JSON.stringify(siteDataOptionsFunctionsByKeyTransformation.error)}`);
    }

    const siteDataOptionsFunctionsByKeyTransformationResult = siteDataOptionsFunctionsByKeyTransformation.result;

    for (const byKeyKey in siteDataOptionsFunctionsByKeyTransformationResult.objectWithFunctionsTransformed) {
        const entry = siteDataOptionsFunctionsByKeyTransformationResult.objectWithFunctionsTransformed[byKeyKey];
        if (entry === undefined || entry === null) {
            continue;
        }
        const keyProperty: string = ((entry?.keyProperty ?? '').toString().trim() === '') ? defaultKeyProperty : (entry.keyProperty ?? defaultKeyProperty);
        const keyValue = entry.key;
        const location: string[][] = 
            (!Array.isArray(entry.location) 
                ? ((entry.location === undefined || entry.location === null) ? [] : [entry.location]) 
                : entry.location)
            .filter(x => x !== undefined && x !== null)
            .map(x => !Array.isArray(x) ? [x] : x)
            .filter(x => x.length > 0);
        const functionsDeclarations = entry.functionsDeclarations;

        for (const locationKey in location) {
            const locationEntry = location[locationKey];

            // get full paths
            const pathsFound = findFullPathsInObjectRecursively(_data, locationEntry ?? [], keyProperty, []);
            
            for (let pathsFoundKey = 0; pathsFoundKey < pathsFound.length; pathsFoundKey++) {
                const pathFound = pathsFound[pathsFoundKey] ?? [];
                let obj: any = _data;
                let skip: boolean = false;
                for (let pathFoundKey = 0; pathFoundKey < pathFound.length; pathFoundKey++) {
                    const pathPart = pathFound[pathFoundKey];
                    if (pathPart === undefined || pathPart === null) {
                        console.error('Invalid path part! Undefined or null!');
                        skip = true;
                        break;
                    }
                    if (!(pathPart in obj)) {
                        console.error('Path part not in object!');
                        skip = true;
                        break;
                    }
                    obj = obj[pathPart];
                }
                if (skip || obj[keyProperty] !== keyValue) {
                    continue;
                }

                // loop for all functionDeclarations
                for (let functionsDeclarationIndex = 0; functionsDeclarationIndex < functionsDeclarations.length; functionsDeclarationIndex++) {
                    const functionsDeclaration = functionsDeclarations[functionsDeclarationIndex];
                    const functionsObjectPropertyLocation = 
                        (functionsDeclaration?.functionsObjectPropertyLocationNonInclusive === undefined || functionsDeclaration?.functionsObjectPropertyLocationNonInclusive === null || !Array.isArray(functionsDeclaration?.functionsObjectPropertyLocationNonInclusive) || functionsDeclaration.functionsObjectPropertyLocationNonInclusive.length === 0) 
                            ? []
                            : functionsDeclaration.functionsObjectPropertyLocationNonInclusive;
                    
                    const functionsObjectProperty = functionsDeclaration?.functionsObjectProperty ?? defaultFunctionsObjectProperty;

                    let functionsObjectPathsFound = findFullPathsInObjectRecursively(obj, functionsObjectPropertyLocation, functionsObjectProperty, []);
                    if (functionsObjectPathsFound.length === 0) {
                        functionsObjectPathsFound = [[]];
                    }

                    const customFunctions = functionsDeclaration?.functions ?? [];

                    for (let functionsObjectPathsFoundKey = 0; functionsObjectPathsFoundKey < functionsObjectPathsFound.length; functionsObjectPathsFoundKey++) {
                        const functionsObjectPathFound = functionsObjectPathsFound[functionsObjectPathsFoundKey] ?? [];
                        let obj2 = obj;
                        let skip2: boolean = false;
                        for (const functionsObjectPathFoundKey in functionsObjectPathFound) {
                            const functionsObjectPathPart = functionsObjectPathFound[functionsObjectPathFoundKey];
                            if (functionsObjectPathPart === undefined || functionsObjectPathPart === null) {
                                console.error('Invalid functions path part! Undefined or null!');
                                skip2 = true;
                                break;
                            }
                            if (!(functionsObjectPathPart in obj)) {
                                console.error('Functions path part not in object!');
                                skip2 = true;
                                break;
                            }
                            obj2 = obj2[functionsObjectPathPart];
                        }
                        if (skip2) {
                            continue;
                        }

                        const preexistentFunctions = ((obj2[functionsObjectProperty] as CustomFunction[]) || []);

                        obj2[functionsObjectProperty] = [
                            ...preexistentFunctions, 
                            ...customFunctions
                                .filter(x => (x.nameInternal == null 
                                                || !preexistentFunctions
                                                        .filter(x => x.nameInternal != null)
                                                        .some(y => y.nameInternal === x.nameInternal)
                                            ) 
                                            && !preexistentFunctions
                                                    .some(y => y.name === x.name) 
                                )
                        ] satisfies CustomFunction[];
                    }
                }
            }
        }
    }

    _data.content.keyFunctions = {
        context: ((data.content.keyFunctions?.context ?? '') + '\r\n' + siteDataOptionsFunctionsByKeyTransformationResult.context).trim()
    };

    return _data;
}

function findFullPathsInObjectRecursively(obj: any, locationSpecifiedRemaining: string[], keyProperty: string, currentLocation: string[] = []): string[][] {
    currentLocation = currentLocation ?? [];

    if (locationSpecifiedRemaining.length === 0 && currentLocation.length > 0 && currentLocation[currentLocation.length - 1] === keyProperty) {
        return [currentLocation.slice(0, currentLocation.length - 1)];
    }

    const matchedPaths: string[][] = [];

    if (typeof obj === 'object' && obj !== null) {
        for (const objKey in obj) {
            const _locationSpecifiedRemaining = 
                locationSpecifiedRemaining.length > 0 && objKey === locationSpecifiedRemaining[0]
                    ? locationSpecifiedRemaining.slice(1)
                    : [...locationSpecifiedRemaining];
            const _matchedPaths = findFullPathsInObjectRecursively(obj[objKey], _locationSpecifiedRemaining, keyProperty, [...currentLocation, objKey]);
            matchedPaths.push(..._matchedPaths);
        }
    }
    
    return matchedPaths;
}
