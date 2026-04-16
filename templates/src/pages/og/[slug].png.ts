// Per-page OG image generator. Satisfies audits 4.6 (core OG tags — og:image)
// and 4.9 (og:image:alt). Produces a unique image per service/insight so shares
// don't all use the same hero. Zero Node at runtime — all at build time.
//
// Usage in SeoHead: pass `image={absoluteUrl(`/og/${slug}.png`, siteUrl)}`.
// Add `imageAlt` alongside.
//
// Requires: astro-og-canvas + canvaskit-wasm (in package.json template).
// Replace `entries` with the real set of pages for which you want OG images.

import { OGImageRoute } from "astro-og-canvas";
import { services } from "~/data/services";
import { insights } from "~/data/insights";

const pages = Object.fromEntries([
  ...services.map((s) => [
    s.slug,
    { title: s.title, description: s.intro, tag: "Service" },
  ]),
  ...insights.map((i) => [
    i.slug,
    { title: i.title, description: i.description, tag: i.label ?? "Insight" },
  ]),
]);

export const { getStaticPaths, GET } = OGImageRoute({
  param: "slug",
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    logo: { path: "./public/logo.png" },  // optional
    bgGradient: [[16, 16, 16]],
    border: { color: [215, 255, 77], width: 24, side: "inline-start" },
    font: {
      title: { color: [255, 255, 255], weight: "ExtraBold", size: 72 },
      description: { color: [215, 215, 215], weight: "Normal", size: 32 },
    },
    padding: 80,
  }),
});
