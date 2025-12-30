import type { SiteDataOptionsFunctionsDeclarations } from "../site.data.options.functions.types.v1_0_0.js";

export type SiteDataOptionsFunctionsByKey = Array<
    {
        location?: string[]|string[][];
        keyProperty?: string; // default is "key"
        key: string;
        functionsDeclarations: Array<{
            functionsObjectPropertyLocationNonInclusive?: string[],
            functionsObjectProperty?: string; // default is "functions"
            functions: SiteDataOptionsFunctionsDeclarations
        }>
    }>;
