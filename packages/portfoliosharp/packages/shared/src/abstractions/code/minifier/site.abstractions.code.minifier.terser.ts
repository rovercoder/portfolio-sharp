import { minify } from "terser";
import { SiteCodeMinifier } from "./site.abstractions.code.minifier.base.js";

export class TerserSiteCodeMinifier extends SiteCodeMinifier {
    protected onInit() {}
    protected onDestroy() {}

    async minifyCode(code: string): Promise<{ minifiedCode: string, success: true, error?: { type: string, message: string } } | { success: false, error: { type: string, message: string } }> {
        try {
            const result = await minify(code, { /*module: true, */ /*keep_fnames: true,*/ /*keep_fargs: true*/ mangle: false /** No way to mangle everything except top level and function arguments */ });
            if (!result.code) {
                return { success: false, error: { type: 'internal-error', message: 'No code output!' } };
            }
            return { success: true, minifiedCode: result.code };
        } catch (e) {
            return { success: false, error: { type: 'exception', message: e?.toString() ?? '' } };
        }
    }
}
