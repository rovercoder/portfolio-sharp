import { transformIntoSeparateFunctionsAndContext } from '../site.data.options.functions.js';
import { siteDataOptionsFunctionsUtilities, __siteDataOptionsFunctionsUtilitiesFilePath } from './site.data.options.functions.utilities.functions.js';
import { type CustomFunctionsWithContext, type SiteData, type SiteDataOptions } from '@portfoliosharp/shared/data/latest';
import { nameOf } from '@portfoliosharp/shared/helpers/general';

export const handleSiteDataOptionsFunctionsUtilities = async function (data: SiteData, options: SiteDataOptions): Promise<SiteData> {
    if (data === undefined || data === null) {
        throw Error('Undefined data object!');
    }

    if (data.content === undefined || data.content === null) {
        throw Error('Undefined data content!');
    }

    const siteDataOptionsFunctionsUtilitiesTransformation = await transformIntoSeparateFunctionsAndContext<typeof siteDataOptionsFunctionsUtilities>({ 
        filePath: __siteDataOptionsFunctionsUtilitiesFilePath, 
        exportedNameOfVariableObjectWithFunctions: nameOf(() => siteDataOptionsFunctionsUtilities),
        exportedNameOfVariableFilePath: nameOf(() => __siteDataOptionsFunctionsUtilitiesFilePath)
    });

    if (siteDataOptionsFunctionsUtilitiesTransformation == null || !siteDataOptionsFunctionsUtilitiesTransformation.success) {
        throw Error(`Failed to transform utility functions file! Error: ${JSON.stringify(siteDataOptionsFunctionsUtilitiesTransformation.error)}`);
    }

    const siteDataOptionsFunctionsUtilitiesTransformationResult = siteDataOptionsFunctionsUtilitiesTransformation.result;

    const preexistentFunctions = (data.content.utilityFunctions?.functions ?? []);

    const utilityFunctions: CustomFunctionsWithContext = { 
        context: ((data.content.utilityFunctions?.context ?? '') + '\r\n' + siteDataOptionsFunctionsUtilitiesTransformationResult.context).trim(), 
        functions: [
            ...preexistentFunctions,
            ...siteDataOptionsFunctionsUtilitiesTransformationResult.objectWithFunctionsTransformed
                .filter(x => (x.nameInternal == null 
                                || !preexistentFunctions
                                        .filter(x => x.nameInternal != null)
                                        .some(y => y.nameInternal === x.nameInternal)
                            ) 
                            && !preexistentFunctions
                                    .some(y => y.name === x.name) 
                )
        ].filter(x => !!x) 
    };

    const _data = structuredClone(data);
    _data.content.utilityFunctions = { 
        context: utilityFunctions.context, 
        functions: utilityFunctions.functions
    };
    return _data;
}
