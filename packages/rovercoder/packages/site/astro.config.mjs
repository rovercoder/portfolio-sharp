// @ts-check
import { defineConfig } from 'astro/config';
import { readdirSync, readFileSync, statSync, watch, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dedupeScripts } from './config/dedupeScripts.js';

// https://astro.build/config
export default defineConfig({
    integrations: [
        astroReloadBrowserOnScriptsChange(),
        astroRemoveDuplicateScriptsAfterBuild()
    ]
});

/**
 * Astro plugin to reload browser during development on changes to built scripts.
 * @returns {import('astro').AstroIntegration}
 */
function astroReloadBrowserOnScriptsChange() {
    return {
        name: "astro:reload-on-script-change",
        hooks: {
            'astro:config:setup': ({ updateConfig }) => {
                updateConfig({
                    vite: {
                        plugins: [
                            {
                                name: 'extra-watch-plugin',
                                configureServer(server) {
                                    const watcher = watch(path.resolve('./src/scripts/.tsc-build'), { recursive: true }, (event, filename) => {
                                        if (filename) {
                                            server.ws.send({ type: 'full-reload' });
                                        }
                                    });
                                    server.httpServer?.on('close', () => watcher.close());
                                }
                            }
                        ],
                    },
                });
            },
        }
    };
}

/**
 * Astro plugin to remove duplicate <script> tags after build. During development, src/middleware.ts is used to remove duplicate <script> tags.
 * @returns {import('astro').AstroIntegration}
 */
function astroRemoveDuplicateScriptsAfterBuild() {
    return {
        name: "astro:dedupe-script-tags",
        hooks: {
            "astro:build:done": async ({ dir }) => {
                const dirPath = dir.protocol === 'file:' ? fileURLToPath(dir.href) : dir.href;
                const htmlFiles = getHtmlFiles(dirPath);

                for (const file of htmlFiles) {
                    const html = readFileSync(file, "utf8");
                    const cleaned = dedupeScripts(html);
                    writeFileSync(file, cleaned, "utf8");
                }

                console.log(`✅ Removed duplicate <script> tags from ${htmlFiles.length} pages`);
            },
        },
    };
}

/**
* @param {string} dir
* @returns {string[]}
*/
function getHtmlFiles(dir) {
    const files = [];
    for (const entry of readdirSync(dir)) {
        const full = path.join(dir, entry);
        const stat = statSync(full);
        if (stat.isDirectory()) files.push(...getHtmlFiles(full));
        else if (entry.endsWith(".html")) files.push(full);
    }
    return files;
}
