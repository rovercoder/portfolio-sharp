import type { SiteData, SiteDataOptions } from '@portfoliosharp/shared/data/latest';
import { handleSiteDataOptionsFunctions } from './functions/site.data.options.functions.js';

export const siteDataOptions: SiteDataOptions = {};

export const handleSiteDataOptions = async function (data: SiteData, options: SiteDataOptions): Promise<SiteData> {
    if (data === undefined || data === null) {
        throw Error('Undefined data object!');
    }

    if (data.content === undefined || data.content === null) {
        throw Error('Undefined data content!');
    }
    
    const dataWithFunctions = await handleSiteDataOptionsFunctions(data, options);

    return dataWithFunctions;
};
