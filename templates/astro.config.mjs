import tailwindcss from "@tailwindcss/vite";
import markdownForAgents from "@puralex/astro-markdown-for-agents";
import sitemap from "@astrojs/sitemap";
import compressor from "astro-compressor";
import pagefind from "astro-pagefind";
// import { ogImagesFromCollection } from "astro-og-canvas";  // wire per-page, not here
import { defineConfig } from "astro/config";

// Replace $SITE_URL with the production origin. Trailing slash matters.
export default defineConfig({
  site: "$SITE_URL",
  trailingSlash: "always",
  integrations: [
    sitemap({
      changefreq: "weekly",
      // Hide utility routes from the public sitemap.
      filter: (page) => !page.includes("/thank-you/"),
      lastmod: new Date(),
      priority: 0.8,
    }),
    markdownForAgents(),
    // Static search index. Makes WebSite.SearchAction real (audit 3.4, 5.16).
    // Add a /search/ page that loads `import { PagefindUI } from '@pagefind/default-ui'`.
    pagefind(),
    // gzip + brotli pre-compression of HTML/CSS/JS for static hosts
    // without server-side compression (Netlify, Cloudflare Pages).
    // Must be the LAST integration so it sees final build output.
    compressor({ gzip: true, brotli: true }),
  ],
  build: {
    format: "directory",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
