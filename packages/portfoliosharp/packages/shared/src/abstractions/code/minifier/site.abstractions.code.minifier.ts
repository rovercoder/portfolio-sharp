import type { SiteCodeMinifier } from "./site.abstractions.code.minifier.base.js";
import { UglifyJsSiteCodeMinifier } from "./site.abstractions.code.minifier.uglifyjs.js";

let _minifier: SiteCodeMinifier | null = null;

export async function getCodeMinifier(): Promise<SiteCodeMinifier> {
    if (!_minifier) {
        _minifier = new UglifyJsSiteCodeMinifier();
        await _minifier.initialize();
    }
    return _minifier;
}

export * from "./site.abstractions.code.minifier.base.js";
