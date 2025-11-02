import type { SiteCodeBundler } from "./site.abstractions.code.bundler.base.js";
import { RollupWithPluginsSiteCodeBundler } from "./site.abstractions.code.bundler.rollupwithplugins.js";

let _bundler: SiteCodeBundler | null = null;

export async function getCodeBundler(): Promise<SiteCodeBundler> {
    if (!_bundler) {
        _bundler = new RollupWithPluginsSiteCodeBundler();
        await _bundler.initialize();
    }
    return _bundler;
}

export * from "./site.abstractions.code.bundler.base.js";
