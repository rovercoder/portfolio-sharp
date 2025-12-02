import { nodeResolve } from "@rollup/plugin-node-resolve";
import { rollup, type InputOptionsWithPlugins, type OutputOptions } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { isFileUrl } from "../../../helpers/helpers.files.js";
import { fileURLToPath } from "url";
import { SiteCodeBundler } from "./site.abstractions.code.bundler.base.js";

export class RollupWithPluginsSiteCodeBundler extends SiteCodeBundler {
    protected onInit() {};
    protected onDestroy() {};
    async bundleCodeFile(inputFilePath: string): Promise<{ bundledCode: string, success: true, error?: { type: string, message: string } } | { success: false, error: { type: string, message: string } }> {

        if (inputFilePath == null) {
            return { success: false, error: { type: 'arguments-invalid', message: 'Invalid input file path!' } };
        }

        const _inputFilePath = isFileUrl(inputFilePath) ? fileURLToPath(inputFilePath) : inputFilePath;

        let bundle;
        let error: any;
        try {
            const inputOptions: InputOptionsWithPlugins = {
                input: _inputFilePath,
                external: [
                    // // Mark all Node.js built-ins as external
                    // 'fs', 'path', 'url', 'os', 'util', 'stream', 'events', 'module', 'process'
                    // // Other plugins
                    // 'fsevents', 
                    // // Also mark all node_modules as external (optional but recommended for Node apps)
                    // ...Object.keys(pkg.dependencies || {}),
                    // ...Object.keys(pkg.peerDependencies || {}),
                ],
                plugins: [
                    nodeResolve({ 
                        browser: true, 
                        preferBuiltins: false
                    }), 
                    ((commonjs as any) as typeof commonjs.default)(), 
                    ((json as any) as typeof json.default)()
                ]
            };

            const outputOptions: OutputOptions = {
                format: 'es'
            };

            bundle = await rollup(inputOptions);
            const { output } = await bundle.generate(outputOptions);
            return {
                bundledCode: output.filter(x => x.type !== 'asset').map(x => x.code).join('\r\n'),
                success: true
            };
        } catch (error) {
            error = error;
            console.error(error);
        } finally {
            if (bundle) {
                // closes the bundle
                await bundle.close();
            }
        }
        return {
            success: false,
            error: { type: 'exception', message: error != null ? JSON.stringify(error) : '' }
        };
    }
}
