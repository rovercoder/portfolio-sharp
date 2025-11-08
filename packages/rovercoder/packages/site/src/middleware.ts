// NOTE: Middleware is picked up automatically by `astro dev` command
//       due to default path of /src/middleware.ts

import { defineMiddleware } from 'astro:middleware';
import { dedupeScripts } from '../config/dedupeScripts';

export const onRequest = defineMiddleware(async (context, next) => {
    const response = await next();

    const contentType = response.headers.get('Content-Type') ?? '';
    if (!contentType.includes('text/html') || !response.body) {
        return response; // only process HTML
    }

    // Read full HTML string from the stream
    const html = await response.text();

    // Dedupe script tags
    const cleaned = dedupeScripts(html);

    console.log(`✅ Removed duplicate <script> tags from page [dev]`);

    // Return a new Response with the cleaned HTML
    return new Response(cleaned, {
        status: response.status,
        headers: response.headers,
    });
});
