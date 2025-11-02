import type { SiteCodeTransformer } from "./site.abstractions.code.transformer.base.js";
import { JsCodeShiftSiteCodeTransformer } from "./site.abstractions.code.transformer.jscodeshift.js";

let _transformer: SiteCodeTransformer | null = null;

export async function getCodeTransformer(): Promise<SiteCodeTransformer> {
    if (!_transformer) {
        _transformer = new JsCodeShiftSiteCodeTransformer();
        await _transformer.initialize();
    }
    return _transformer;
}

export * from "./site.abstractions.code.transformer.base.js";
