import * as parse5 from 'parse5';

export function sanitizeRenderedGeneratedHTMLFragment(htmlString: string) {
    var htmlParsed = parse5.parseFragment(htmlString);

    function traverseAndRemoveAttributes(parent: parse5.DefaultTreeAdapterTypes.Document | parse5.DefaultTreeAdapterTypes.DocumentFragment | parse5.DefaultTreeAdapterTypes.ChildNode, removeAttributeNameRegexes: RegExp[]): void {
        if ('attrs' in parent) {
            parent.attrs = parent.attrs.filter(x => !removeAttributeNameRegexes.some(y => y.test(x.name)));
        }

        if (!('childNodes' in parent) || !parent.childNodes) return;

        for (let i = 0; i < parent.childNodes.length; i++) {
            var childNode = parent.childNodes[i];
            traverseAndRemoveAttributes(childNode, removeAttributeNameRegexes);
        }
    }

    traverseAndRemoveAttributes(htmlParsed, [ /^(data-astro-source).*$/ ]);

    return parse5.serialize(htmlParsed);
}
