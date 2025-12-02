import { getCodeBundler } from '@portfoliosharp/shared/code/bundler';
import { getCodeMinifier } from '@portfoliosharp/shared/code/minifier';
import path from 'path';
import { existsSync } from 'fs';

export async function prepareInlineScript(relativeFiles: string | string[]): Promise<string> {
    const basePath = process.cwd();

    if (relativeFiles == null || (typeof relativeFiles !== 'string' && !Array.isArray(relativeFiles)) || (typeof relativeFiles === 'string' && relativeFiles.trim().length === 0) || (Array.isArray(relativeFiles) && relativeFiles.filter(x => x.toString().trim().length > 0).length > 0)) {
        throw Error('Argument Invalid: files');
    }
    const _relativeFiles = Array.isArray(relativeFiles) ? relativeFiles.map(x => x.toString().trim()) : [relativeFiles.toString().trim()];

    const _absolutePaths = _relativeFiles.map(x => path.join(basePath, x));
    _absolutePaths.forEach(x => {
        if (!existsSync(x)) {
            throw Error(`Path (${x}) does not exist!`);
        }
    });

    const codeBundler = await getCodeBundler();
    const codeMinifier = await getCodeMinifier();

    const bundledCodeStrings = [];

    for (const key in _absolutePaths) {
        const absolutePath = _absolutePaths[key];
        const bundlingResult = await codeBundler.bundleCodeFile(absolutePath);
        if (!bundlingResult.success) {
            throw new Error('Bundling Error: '+JSON.stringify(bundlingResult.error));
        }
        bundledCodeStrings.push(bundlingResult.bundledCode);
    }

    const minificationResult = await codeMinifier.minifyCode(bundledCodeStrings.join('\r\n'));
    if (!minificationResult.success) {
        throw new Error('Minification Error: '+JSON.stringify(minificationResult.error));
    }

    return minificationResult.minifiedCode;
}
