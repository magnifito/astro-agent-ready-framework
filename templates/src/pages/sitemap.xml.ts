import type { APIContext } from "astro";
import { insights } from "~/data/insights";
import { services } from "~/data/services";

// Hard-coded routes + data-driven routes. The @astrojs/sitemap integration
// also emits /sitemap-index.xml automatically. This file provides an explicit
// /sitemap.xml that some crawlers prefer.
// `lastmod` is supplied ONLY from a real content date (here, each insight's
// `modifiedAt`). Never fall back to build time — that fakes freshness. Add a
// date field to your service data and map it in below if you want service
// `lastmod` too.
type SitemapRoute = { loc: string; priority: string; lastmod?: string };

const routes: SitemapRoute[] = [
  { loc: "/", priority: "1.0" },
  { loc: "/services/", priority: "0.9" },
  ...services.map((service) => ({
    loc: service.href,
    priority: "0.8",
  })),
  { loc: "/insights/", priority: "0.8" },
  ...insights.map((insight) => ({
    loc: insight.href,
    priority: "0.8",
    lastmod: insight.modifiedAt, // ISO date string from real content data
  })),
  { loc: "/authors/", priority: "0.5" },
];

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET(context: APIContext) {
  const site =
    context.site?.toString().replace(/\/$/, "") ?? "$SITE_URL";
  const entries = routes
    .map((route) => {
      const lastmod = route.lastmod
        ? `\n    <lastmod>${escapeXml(route.lastmod)}</lastmod>`
        : "";
      return `  <url>
    <loc>${escapeXml(new URL(route.loc, site).toString())}</loc>${lastmod}
    <changefreq>weekly</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    })
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    },
  );
}
