import { getCodeBundler, getCodeMinifier, getCodeTransformer, type SiteData, type SiteDataOptions, type Replace, type SiteDataOptionsFunctionsDeclarations, type CustomFunction, createModule, type SiteDataOptionsFunction, fieldsNonOptional, fields } from "@portfoliosharp/shared";
import { handleSiteDataOptionsFunctionsByKey } from "./bykey/site.data.options.functions.bykey.js";
import { handleSiteDataOptionsFunctionsUtilities } from "./utilities/site.data.options.functions.utilities.js";

export const handleSiteDataOptionsFunctions = async function (data: SiteData, options: SiteDataOptions): Promise<SiteData> {
    if (data === undefined || data === null) {
        throw Error('Undefined data object!');
    }

    if (data.content === undefined || data.content === null) {
        throw Error('Undefined data content!');
    }

    const dataWithUtilities = await handleSiteDataOptionsFunctionsUtilities(data, options);
    const dataWithUtilitiesAndByKeyFunctions = await handleSiteDataOptionsFunctionsByKey(dataWithUtilities, options);

    return dataWithUtilitiesAndByKeyFunctions;
}

export const getFunctionDetails = async function(func: Function | string): Promise<{ functionName: string | null, parameterNames: string[], body: string, bodyMinified?: string } | undefined> {
    if (func === undefined || func === null) {
        return;
    }

    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*.*?\*\/))/mg;
    const STRIP_KEYWORDS = /^(\s*async\s*|\s*function\s*)+/;
    const FUNCTION_NAME = /\s*([a-zA-Z0-9_$]*?)\s*\(/;
    const ARGUMENT_NAMES = /\((?:([^)]*)\)\s*=>)|(?:([a-zA-Z0-9_$]+)\s*=>)|[a-zA-Z0-9_$]+\(([^)]*)\)|\(([^)]*)\)/;
    const ARROW_FUNCTION_WITHOUT_CURLY_BRACES = { 
        matches: /^\s*(?:(?:\((?:(?:[^)]*)\))|(?:[a-zA-Z0-9_$]+))\s*=>\s*[^{\s]+)/, 
        returnStatementAddition: { 
            searchValue: /^(.*?)(?:[\;\s]*?)?$/, 
            replacementValue: 'return \($1\)' 
        } 
    };
    const ARGUMENT_SPLIT = /[ ,\n\r\t]+/;
    const FUNCTION_BODY = /^\s*(?:\{\s*(.*)\s*\})|(?:(.*))\s*$/s;

    const functionString = func.toString();
    let body = null;

    const fnStr = functionString.toString()
        .replace(STRIP_COMMENTS, '')
        .replace(STRIP_KEYWORDS, '')
        .trim();

    const functionNameMatches = FUNCTION_NAME.exec(fnStr);
    let functionNameMatch;
    if (functionNameMatches) {
        for (let i = 1; i < functionNameMatches.length; i++) {
            if (functionNameMatches[i]) {
                functionNameMatch = functionNameMatches[i];
                break;
            } 
        }
    }
    const functionName = functionNameMatch == null || functionNameMatch == '' ? null : functionNameMatch;

    const parameterMatches = ARGUMENT_NAMES.exec(fnStr);
    let parameterMatch;
    if (parameterMatches) {
        for (let i = 1; i < parameterMatches.length; i++) {
            if (parameterMatches[i]) {
                parameterMatch = parameterMatches[i];
                break;
            } 
        }
    }
    const parameterNames = parameterMatch === undefined ? [] : parameterMatch.split(ARGUMENT_SPLIT).filter(part => part !== "");

    const isArrowFunctionWithoutCurlyBraces = ARROW_FUNCTION_WITHOUT_CURLY_BRACES.matches.exec(fnStr) != null;
    
    const fnStrForBody = fnStr.replace(ARGUMENT_NAMES, '');

    const bodyMatches = FUNCTION_BODY.exec(fnStrForBody);
    let bodyMatch;
    if (bodyMatches) {
        for (let i = 1; i < bodyMatches.length; i++) {
            if (bodyMatches[i]) {
                bodyMatch = bodyMatches[i];
                break;
            } 
        }
    }
    let functionBody = bodyMatch !== undefined && bodyMatch !== null ? bodyMatch.trim() : '';

    if (isArrowFunctionWithoutCurlyBraces) {
        // add return statement and brackets
        functionBody = functionBody.replace(ARROW_FUNCTION_WITHOUT_CURLY_BRACES.returnStatementAddition.searchValue, ARROW_FUNCTION_WITHOUT_CURLY_BRACES.returnStatementAddition.replacementValue);
    }

    let minifiedFunctionBody = functionBody.toString();

    const codeMinifier = await getCodeMinifier();

    const functionStringAlt = `function _noOneNamesAFunctionLikeThisFunctionName(${parameterMatch}) { ${functionBody} }`;
    const minifiedFunctionResult = await codeMinifier.minifyCode(functionStringAlt);
    if (minifiedFunctionResult.success) {
        const minifiedFunctionBodyNeedsRegexMatching = minifiedFunctionResult.minifiedCode
            .replace(STRIP_COMMENTS, '')
            .replace(STRIP_KEYWORDS, '')
            .replace(ARGUMENT_NAMES, '');

        const minifiedBodyMatches = FUNCTION_BODY.exec(minifiedFunctionBodyNeedsRegexMatching);
        let minifiedBodyMatch;
        if (minifiedBodyMatches) {
            for (let i = 1; i < minifiedBodyMatches.length; i++) {
                if (minifiedBodyMatches[i] != null) {
                    minifiedBodyMatch = minifiedBodyMatches[i];
                    break;
                }
            }
        }

        if (minifiedBodyMatch !== undefined && minifiedBodyMatch !== null) {
            minifiedFunctionBody = minifiedBodyMatch.trim();
        }
    }
    
    return { functionName, parameterNames, body: functionBody, bodyMinified: minifiedFunctionBody };
}

export async function transformIntoSeparateFunctionsAndContext<ObjectWithFunctionsType>(obj: { filePath: string, exportedNameOfVariableObjectWithFunctions: string, exportedNameOfVariableFilePath: string }): Promise<{ success: true, result: { context: string, objectWithFunctionsTransformed: Replace<ObjectWithFunctionsType, SiteDataOptionsFunctionsDeclarations, CustomFunction[]> } } | { success: false, error: { type: string, message: string } }> {
    if (obj == null || typeof obj !== 'object') {
        throw Error('Arguments are invalid!');
    }

    if (obj.filePath == null || typeof obj.filePath !== 'string' || obj.filePath.trim().length === 0) {
        throw Error('Arguments: Filepath is invalid!');
    }

    if (obj.exportedNameOfVariableObjectWithFunctions == null || typeof obj.exportedNameOfVariableObjectWithFunctions !== 'string' || obj.exportedNameOfVariableObjectWithFunctions.trim().length === 0) {
        throw Error('Arguments: exportedNameOfObjectWithFunctions is invalid!');
    }

    if (obj.exportedNameOfVariableFilePath == null || typeof obj.exportedNameOfVariableFilePath !== 'string' || obj.exportedNameOfVariableFilePath.trim().length === 0) {
        throw Error('Arguments: exportedNameOfVariableFilePath is invalid!');
    }

    const codeBundler = await getCodeBundler();
    const codeMinifier = await getCodeMinifier();
    const codeTransformer = await getCodeTransformer();
    
    const bundlingResult = await codeBundler.bundleCodeFile(obj.filePath);
    if (bundlingResult == null || !bundlingResult.success) {
        return { success: false, error: { type: bundlingResult?.error?.type ?? 'general', message: bundlingResult?.error?.message ?? 'Error occurred during bundling!' } };
    }

    const originallyParsedCodeResult = codeTransformer.parseCode(bundlingResult.bundledCode);
    
    if (originallyParsedCodeResult == null || !originallyParsedCodeResult.success) {
        return { success: false, error: { type: originallyParsedCodeResult?.error?.type ?? 'general', message: originallyParsedCodeResult?.error?.message ?? 'Bundled code not parsed successfully!' } };
    }
    
    const originallyParsedCode = originallyParsedCodeResult.instance;
    
    const importDeclarations = originallyParsedCode.findAllImportDeclarations();
    if (importDeclarations.length > 0) {
        console.warn(`Warning: Import declarations found after bundling:\r\n${importDeclarations.map(x => x.toSource()).join('\r\n')}\r\n`);
    }
    
    const importExpressions = originallyParsedCode.findAllImportExpressions();
    if (importExpressions.length > 0) {
        console.warn(`Warning: Import expressions found after bundling:\r\n${importExpressions.map(x => `Function: ${x.getFunctionSignature() ?? 'N/A (Possibly in global scope)'} | Code: "${x.toSource()}"`).join('\r\n')}\r\n`);
    }
    
    const minifiedCodeResult = await codeMinifier.minifyCode(bundlingResult.bundledCode);
    
    if (minifiedCodeResult == null || !minifiedCodeResult.success) {
        return { success: false, error: { type: minifiedCodeResult?.error?.type ?? 'general', message: minifiedCodeResult?.error?.message ?? 'Code not minified successfully!' } };
    }

    const code = minifiedCodeResult.minifiedCode;
    
    const codeModule = await createModule(code);

    const objectWithFunctions = codeModule[obj.exportedNameOfVariableObjectWithFunctions];

    if (objectWithFunctions == null || typeof objectWithFunctions !== 'object') {
        return { success: false, error: { type: 'general', message: 'Object with functions not found to be exported from instanciated code!' } }
    }

    const parsedCodeResult = codeTransformer.parseCode(code);
    
    if (parsedCodeResult == null || !parsedCodeResult.success) {
        return { success: false, error: { type: parsedCodeResult?.error?.type ?? 'general', message: parsedCodeResult?.error?.message ?? 'Bundled and minified code not parsed successfully!' } };
    }
    
    const parsedCode = parsedCodeResult.instance;

    // recurse transforming objectWithFunctions to objectWithFunctionsTransformed
    const objectWithFunctionsTransformedResult = await _transformObjectWithFunctions(objectWithFunctions);
    const objectWithFunctionsTransformed: Replace<ObjectWithFunctionsType, SiteDataOptionsFunctionsDeclarations, CustomFunction[]> = objectWithFunctionsTransformedResult.objResult;
    const functionsNamesToRemove: string[] = objectWithFunctionsTransformedResult.functionsNamesToRemove;
    
    // remove functions from javascript code to get global scope
    for (let i = 0; i < functionsNamesToRemove.length; i++) {
        const funcNameInternal = functionsNamesToRemove[i];
        // NOTE: functions directly assigned to variables (without former declaration with a name) don't have a function name here (after getFunctionDetails call), and therefore are not removed
        if (funcNameInternal != null) {
            parsedCode.removeGlobalExportNamedDeclarationByExportedName(funcNameInternal);
            parsedCode.removeGlobalExportNamedDeclarationSpecifierByLocalName(funcNameInternal);
            parsedCode.removeGlobalFunctionDeclarationByName(funcNameInternal);
            parsedCode.removeGlobalFunctionVariableDeclaratorByName(funcNameInternal);
        }
    }

    // remove export declarations and specifiers for these variables
    parsedCode.removeGlobalExportNamedDeclarationByExportedName(obj.exportedNameOfVariableObjectWithFunctions);
    parsedCode.removeGlobalExportNamedDeclarationSpecifierByExportedName(obj.exportedNameOfVariableObjectWithFunctions);
    parsedCode.removeGlobalExportNamedDeclarationByExportedName(obj.exportedNameOfVariableFilePath);
    parsedCode.removeGlobalExportNamedDeclarationSpecifierByExportedName(obj.exportedNameOfVariableFilePath);

    const finalCode = await codeMinifier.minifyCode(parsedCode.toSource().trim());
    if (finalCode == null || !finalCode.success) {
        return { success: false, error: { type: finalCode?.error?.type ?? 'general', message: finalCode?.error?.message ?? 'Unsuccessful minification after amends!' } };
    }

    return { success: true, result: { context: finalCode.minifiedCode, objectWithFunctionsTransformed } };
}

async function _transformObjectWithFunctions(obj: any): Promise<{ objResult: any, functionsNamesToRemove: string[] }> {
    if (typeof obj !== 'object') {
        return { objResult: obj, functionsNamesToRemove: [] };
    }

    const transformedObj: { [key: string | number | symbol]: any } | any[] = Array.isArray(obj) ? [] : {};

    const objKeys = Object.keys(obj);

    if (objKeys.every(x => typeof x === 'string') && objKeys.every(x => _checkObjectMatchesSiteDataOptionsFunction(obj[x]))) {
        const customFunctions = await Promise.all(objKeys.map(async functionName => { 
            const entryValue = obj[functionName] as SiteDataOptionsFunction;
            const functionDetails = await getFunctionDetails(entryValue.function);
            // NOTE: functions directly assigned to variables (without former declaration with a name) don't have a function name here (after getFunctionDetails call)
            return { 
                name: functionName, 
                ...((functionDetails?.functionName != null && functionDetails?.functionName.toString().trim() != '') ? { nameInternal: functionDetails?.functionName } : {}),
                arguments: functionDetails?.parameterNames.join(',') ?? '', 
                body: functionDetails?.bodyMinified ?? functionDetails?.body ?? '', 
                canBeCalledFromOtherFunctions: entryValue.canBeAccessedFromOtherFunctions 
            } satisfies CustomFunction;
        }));
        return { 
            objResult: customFunctions,
            functionsNamesToRemove: customFunctions.map(x => x.nameInternal).filter(x => x != null && typeof x === 'string' && x.trim().length > 0) as string[]
        };
    }

    const functionsNamesToRemove: string[] = [];

    for (const key in obj) {
        const entryValue = obj[key];

        if (typeof entryValue === 'object') {
            const result = await _transformObjectWithFunctions(obj[key]);
            transformedObj[key as any] = result.objResult;
            functionsNamesToRemove.push(...result.functionsNamesToRemove);
        } else {
            transformedObj[key as any] = obj[key];
        }
    }

    return { objResult: transformedObj, functionsNamesToRemove: functionsNamesToRemove.filter((x, i) => functionsNamesToRemove.indexOf(x) === i) /** removing duplicates */ };
}

function _checkObjectMatchesSiteDataOptionsFunction(functionObject: any): boolean {
    if (typeof functionObject !== 'object') {
        return false;
    }

    const optionsFunctionDeclarations: { [P in keyof Required<SiteDataOptionsFunction>]: { sampleValue: SiteDataOptionsFunction[P], checkFunction: (value: any) => boolean } } = {
        function: { 
            sampleValue: () => {}, 
            checkFunction: x => typeof x === 'function' 
        },
        canBeAccessedFromOtherFunctions: { 
            sampleValue: true, 
            checkFunction: x => typeof x === 'boolean' 
        }
    };

    const optionsFunctionNonOptionalProperties = fieldsNonOptional<SiteDataOptionsFunction>({ 
        function: optionsFunctionDeclarations.function.sampleValue, 
        canBeAccessedFromOtherFunctions: optionsFunctionDeclarations.canBeAccessedFromOtherFunctions.sampleValue 
    });
    const optionsFunctionNonOptionalPropertiesKeys = Object.keys(optionsFunctionNonOptionalProperties);
    const optionsFunctionAllProperties = fields<SiteDataOptionsFunction>({ 
        function: optionsFunctionDeclarations.function.sampleValue, 
        canBeAccessedFromOtherFunctions: optionsFunctionDeclarations.canBeAccessedFromOtherFunctions.sampleValue 
    });
    const optionsFunctionAllPropertiesKeys = Object.keys(optionsFunctionAllProperties);

    const objectWithFunctionsKeys = Object.keys(functionObject);
    const objectWithFunctionsKeysNonOptionalRemoved = objectWithFunctionsKeys.filter(x => !optionsFunctionNonOptionalPropertiesKeys.some(y => y === x && optionsFunctionDeclarations[x as keyof typeof optionsFunctionDeclarations] != null && optionsFunctionDeclarations[x as keyof typeof optionsFunctionDeclarations].checkFunction(functionObject[x])));
    const objectWithFunctionsKeysAllPropertiesRemoved = objectWithFunctionsKeys.filter(x => !optionsFunctionAllPropertiesKeys.some(y => y === x && optionsFunctionDeclarations[x as keyof typeof optionsFunctionDeclarations] != null && optionsFunctionDeclarations[x as keyof typeof optionsFunctionDeclarations].checkFunction(functionObject[x])));
    
    return objectWithFunctionsKeys.length - objectWithFunctionsKeysNonOptionalRemoved.length === optionsFunctionNonOptionalPropertiesKeys.length && objectWithFunctionsKeysAllPropertiesRemoved.length === 0;
}
