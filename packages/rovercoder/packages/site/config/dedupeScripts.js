import * as parse5 from 'parse5';

/**
 * Astro plugin to remove duplicate <script> tags by parsing HTML (no regex).
 * @param {string} html
 * @returns { string }
 */
export function dedupeScripts(html) {
    // parse as fragment so we don't need a full <html> wrapper
    const document = parse5.parse(html, { sourceCodeLocationInfo: false });

    // Helper: produce a canonical key representing a <script> node
    /**
     * @param { parse5.DefaultTreeAdapterTypes.ChildNode } node
     */
    function scriptKey(node) {
        // attributes as map sorted by name
        const attrs = (('attrs' in node ? node.attrs : []) || []).slice().sort((a, b) => a.name.localeCompare(b.name));
        const attrsStr = attrs.map(a => `${a.name}="${a.value}"`).join('|');

        // detect inline vs external
        const srcAttr = attrs.find(a => a.name === 'src')?.value;
        if (srcAttr) {
            // external script: identify by src + other attrs
            return `external::src=${srcAttr}::${attrsStr}`;
        } else {
            // inline script: get text content (concatenate text child nodes)
            const text = (('childNodes' in node ? node.childNodes : []) || [])
                .filter(n => n.nodeName === '#text' && 'value' in n)
                .map(n => n.value)
                .join('')
                .trim();
            return `inline::${text}::${attrsStr}`;
        }
    }

    // Find and dedupe script nodes in the tree (walk recursively)
    /** @type {{ [key: string]: Function[] }} */
    const seen = {};

    /**
     * @param { parse5.DefaultTreeAdapterTypes.Document | parse5.DefaultTreeAdapterTypes.ChildNode } parent
     */
    function walkAndAddDedupeFunction(parent) {
        if (!('childNodes' in parent) || !parent.childNodes) return;
        // iterate over a copy, because we may mutate childNodes
        const children = parent.childNodes.slice();
        for (let i = 0; i < children.length; i++) {
            const node = children[i];
            if ('tagName' in node && node.tagName === 'script') {
                const key = scriptKey(node);
                var allKeys = Object.keys(seen);

                var fn = () => {
                    // remove node from parent's childNodes
                    const idx = parent.childNodes.indexOf(node);
                    if (idx !== -1) parent.childNodes.splice(idx, 1);
                };
                if (allKeys.includes(key)) {
                    seen[key].push(fn);
                } else {
                    seen[key] = [fn];
                }
            }
            // recurse
            walkAndAddDedupeFunction(node);
        }
    }

    walkAndAddDedupeFunction(document);

    // Execute dedupe functions for keys with multiple entries
    // Leave the last occurrence only
    for (const key in seen) {
        const fns = seen[key];
        if (fns.length > 1) {
            // keep last, remove the rest
            for (let i = 0; i < fns.length - 1; i++) {
                fns[i]();
            }
        }
    }

    // serialize back to HTML
    const result = parse5.serialize(document);
    
    return result;
}
