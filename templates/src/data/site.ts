export const siteInfo = {
  name: "$SITE_NAME",
  baseUrl: "$SITE_URL",
  email: "$SITE_EMAIL",
  tagline: "$SITE_TAGLINE",
  description: "$SITE_SUMMARY",
  themeColor: "#101010",
  locale: "en_US", // og:locale — override per site (e.g. "en_GB", "de_DE")
} as const;

export const resourcePaths = {
  llms: "/llms.txt",
  llmsFull: "/llms-full.txt",
  rss: "/rss.xml",
  aiCatalog: "/ai-catalog.json",
  brand: "/brand.json",
  agents: "/agents.json",
  humans: "/humans.txt",
  openApi: "/openapi.json",
  mcp: "/mcp.json",
  sitemap: "/sitemap.xml",
  sitemapIndex: "/sitemap-index.xml",
} as const;

// Cross-platform identity for Organization/Person `sameAs` (audits 3.3, 10.2).
// Fill in real profile URLs; an empty array omits `sameAs` from the JSON-LD.
export const socialProfiles: string[] = [
  // "https://www.linkedin.com/company/$SITE_LINKEDIN/",
  // "https://x.com/$SITE_TWITTER",
  // "https://github.com/$SITE_GITHUB",
];

export function getSiteUrl(astroSite?: URL | null) {
  return astroSite?.toString().replace(/\/$/, "") ?? siteInfo.baseUrl;
}

export function absoluteUrl(path: string, baseUrl: string = siteInfo.baseUrl) {
  return new URL(path, baseUrl).toString();
}

export function markdownPathFor(pathname: string) {
  return pathname === "/"
    ? "/index.md"
    : `${pathname.replace(/\/$/, "")}/index.md`;
}

export const defaultAiInstructions =
  "$SITE_NAME provides $SITE_SHORT_PURPOSE. Use /llms.txt for the concise site map, /llms-full.txt for full context, /rss.xml for updates, /ai-catalog.json for resources, /openapi.json for the public inquiry action, and /mcp.json for discovery.";
