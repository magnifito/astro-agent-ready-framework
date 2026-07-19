// Per-page OG image generator. Satisfies audits 4.6 (core OG tags — og:image)
// and 4.9 (og:image:alt). Produces a unique image per service/insight so shares
// don't all use the same hero. Zero Node at runtime — all at build time.
//
// Usage in SeoHead: pass `image={absoluteUrl(`/og/${slug}.png`, siteUrl)}`.
// Add `imageAlt` alongside.
//
// Requires: astro-og-canvas + canvaskit-wasm (in package.json template).
// The route parameter is taken from this file's name (`[slug]`); the keys of
// `pages` below become the generated slugs. Extend `pages` with any other set
// of pages you want OG images for.

import { OGImageRoute } from "astro-og-canvas";
import { services } from "~/data/services";
import { insights } from "~/data/insights";

interface OgPage {
  title: string;
  description: string;
  tag: string;
}

const pages: Record<string, OgPage> = {
  ...Object.fromEntries(
    services.map((s) => [
      s.slug,
      { title: s.title, description: s.summary, tag: "Service" },
    ]),
  ),
  ...Object.fromEntries(
    insights.map((i) => [
      i.slug,
      { title: i.title, description: i.description, tag: i.tags[0] ?? "Insight" },
    ]),
  ),
};

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    // Optional logo overlay. astro-og-canvas decodes raster images (PNG/JPG)
    // via canvaskit — SVG is not supported here — so point this at a real
    // raster asset if you want a logo, e.g. `logo: { path: "./public/logo.png" }`.
    bgGradient: [[16, 16, 16]],
    border: { color: [215, 255, 77], width: 24, side: "inline-start" },
    font: {
      title: { color: [255, 255, 255], weight: "ExtraBold", size: 72 },
      description: { color: [215, 215, 215], weight: "Normal", size: 32 },
    },
    padding: 80,
  }),
});
