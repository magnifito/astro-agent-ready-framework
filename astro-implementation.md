# Astro Implementation Guide

How each framework requirement maps to concrete Astro files, config, and integrations. Pair with the `templates/` folder for drop-in starters.

## Recommended Astro integrations

Install the base set for every AIO site. Add variant-specific plugins only when the site needs them.

### Base set (install on every AIO Astro site)

| Plugin | Purpose | Audit coverage |
|---|---|---|
| `@astrojs/sitemap` | Auto-generated sitemap + sitemap-index | 1.7–1.10 |
| `@astrojs/rss` | Full-content RSS (content:encoded) | 1.11, 1.12, 4.16 |
| `@astrojs/check` | Type + content check in `astro build` | build enforcement |
| `@puralex/astro-markdown-for-agents` | Per-page `.md` alternates | 4.15 |
| `astro-pagefind` + `pagefind` | Static search index. Makes `WebSite.SearchAction` real. | 3.4, 5.16 |
| `astro-compressor` | gzip + brotli pre-compression. Essential for Netlify / CF Pages. | 8.14, 1.19 |
| `astro-og-canvas` + `canvaskit-wasm` | Per-page OG image generation | 4.6, 4.9 |
| `playwright` (dev) | Drives `validate-headless.js` post-deploy smoke | 8.13, 3.1–3.4, 5.17 |

### Variant add-ons

| Plugin | When | Covers |
|---|---|---|
| `@astrojs/partytown` | Any site with analytics / third-party tracking | 13.4, 8.14 (move trackers off main thread) |
| `astro-icon` | Any site w/ icon-only CTAs | 7.8 |
| `@astrojs/mdx` | Publisher / media / docs variant | content authoring |
| `@astrojs/image` or `astro:assets` (built-in) | Multi-modal §11 (responsive images) | 11.3, 8.15 |

### Explicitly declined

| Plugin | Why not |
|---|---|
| `astro-seo` | Our hand-rolled `SeoHead.astro` covers more head elements (llms, MCP, OpenAPI, ai-catalog, ai-instructions) than `astro-seo` exposes. |
| `astro-robots-txt` | Static `public/robots.txt` with per-bot `Allow` is explicit and readable. Plugin adds churn. |
| `astro-breadcrumbs` | BreadcrumbList JSON-LD pattern in `structured-data-patterns.md` is the critical part. Visible breadcrumbs are a one-liner per page. |
| `puppeteer` | Playwright covers headless smoke testing. No need for both. |
| `cheerio` / `helmet` / `compression` / `cors` (express-land) | Static Astro emits HTML at build. Edge (Apache / Netlify / Cloudflare / Vercel) handles headers + compression. |

## Edge platform header files

Framework ships two interchangeable edge configs:

| Platform | File | Notes |
|---|---|---|
| Apache shared hosting | `public/.htaccess` | Used by Moesica (FTP deploy). Handles everything including trailing-slash rewrites. |
| Netlify, Cloudflare Pages | `public/_headers` | Header syntax only. Use platform's `_redirects` for rewrites. |

Ship only the one for your hosting target. Delete the other.

---

## Astro version

- `astro@^6`
- `@astrojs/sitemap@^3`
- `@astrojs/rss@^4`
- `@puralex/astro-markdown-for-agents@^0.2`

Plus `@astrojs/check` in dev deps so `npm run build` runs a type + content check.

## Project layout

```
project-root/
├── public/                     # served verbatim at site root
│   ├── llms.txt
│   ├── llms-full.txt
│   ├── robots.txt
│   ├── humans.txt
│   ├── ai-catalog.json
│   ├── brand.json
│   ├── mcp.json
│   ├── navigation.json
│   ├── openapi.json
│   ├── favicon.svg
│   ├── .htaccess
│   └── .well-known/
│       └── security.txt
├── scripts/
│   ├── validate-built-site.js  # build-time asserts on dist/
│   └── deploy.js               # optional
├── src/
│   ├── components/
│   │   ├── SeoHead.astro
│   │   ├── SiteHeader.astro
│   │   └── SiteFooter.astro
│   ├── data/
│   │   ├── site.ts             # siteInfo, resourcePaths, helpers
│   │   ├── services.ts         # service data array
│   │   └── insights.ts         # article data array
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├── thank-you.astro
│   │   ├── rss.xml.ts          # feed API route
│   │   ├── sitemap.xml.ts      # hard-coded sitemap (integration also emits sitemap-index.xml)
│   │   ├── services/
│   │   │   ├── index.astro     # collection page
│   │   │   └── [slug].astro    # dynamic service page
│   │   └── insights/
│   │       ├── index.astro
│   │       └── [slug].astro
│   └── styles/
│       └── index.css
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## `astro.config.mjs`

Key settings:

```js
export default defineConfig({
  site: "https://example.com/",       // must be set; absolute URLs rely on it
  trailingSlash: "always",             // matches sitemap + canonical convention
  build: { format: "directory" },      // emits /services/slug/index.html — markdown-for-agents hooks here
  integrations: [
    sitemap({
      changefreq: "weekly",
      filter: (page) => !page.includes("/thank-you/"),
      lastmod: new Date(),
      priority: 0.8,
    }),
    markdownForAgents(),               // emits /path/index.md next to index.html
  ],
});
```

**Why `format: "directory"`** — every page lands at `/slug/index.html`, which lets the markdown-for-agents integration put a clean `/slug/index.md` sibling. URL stays identical for humans; agents hit the markdown alternate.

**Why `trailingSlash: "always"`** — consistent canonicalization. Paired with `.htaccess` redirect, there is exactly one URL per page.

## `package.json` scripts

```json
{
  "dev": "astro dev",
  "build": "astro check && astro build",
  "validate:build": "node scripts/validate-built-site.js",
  "verify": "npm run build && npm run validate:build",
  "deploy": "npm run build && node scripts/deploy.js"
}
```

`npm run verify` is the single command the site owner runs before deploying. Failing the validator fails the deploy.

## `src/data/site.ts` — central site config

One place to change brand, URLs, resource paths, AI instructions. Everything else imports from here.

```ts
export const siteInfo = {
  name: "…",
  baseUrl: "https://…",
  email: "hello@…",
  tagline: "…",
  description: "…",
  themeColor: "#101010",
} as const;

export const resourcePaths = {
  llms: "/llms.txt",
  llmsFull: "/llms-full.txt",
  rss: "/rss.xml",
  aiCatalog: "/ai-catalog.json",
  brand: "/brand.json",
  humans: "/humans.txt",
  openApi: "/openapi.json",
  mcp: "/mcp.json",
  sitemap: "/sitemap.xml",
  sitemapIndex: "/sitemap-index.xml",
} as const;

export function absoluteUrl(path: string, baseUrl = siteInfo.baseUrl) {
  return new URL(path, baseUrl).toString();
}
export function markdownPathFor(pathname: string) {
  return pathname === "/" ? "/index.md" : `${pathname.replace(/\/$/, "")}/index.md`;
}
export const defaultAiInstructions = "…one-sentence agent hint…";
```

## `src/components/SeoHead.astro`

Single source for:
- `<title>`, `<meta name="description">`
- canonical
- viewport, theme-color, generator
- `ai-content-declaration`, `ai-instructions` metas
- `robots` only if explicitly passed
- `rel="alternate"` for llms.txt, llms-full.txt, markdown, RSS, ai-catalog, brand, openapi, mcp
- `rel="author"` → humans.txt
- `rel="service-desc"` → openapi.json
- `rel="sitemap"` when `includeSitemaps` prop is true
- Open Graph + Twitter
- JSON-LD `<script type="application/ld+json">` when `structuredData` prop is passed
- optional `preconnect` hints

Prop surface:

```ts
interface Props {
  title: string;
  description: string;
  canonicalPath?: string;
  canonicalHref?: string;
  markdownPath?: string | null;  // null opts out
  image?: string;
  type?: "website" | "article";
  robots?: string;
  structuredData?: unknown;
  aiInstructions?: string;
  includeSitemaps?: boolean;
  preconnectImages?: boolean;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
}
```

Every page imports this component, passes 2–6 props. One place to audit head output across the site.

## `src/components/SiteHeader.astro` & `SiteFooter.astro`

- Header emits `.skip-link` (category 7), `<header>` landmark, `<nav aria-label="Primary navigation">`, and the primary CTA with `data-action` attributes.
- Footer emits `<footer>` landmark and `<nav aria-label="Footer navigation">` with machine-readable links to `/llms.txt`, `/sitemap.xml`, email.

Variant prop (`fixed` | `solid`) on the header handles the homepage overlay vs. inner-page solid background, so the same component is reused everywhere.

## Dynamic pages — service / article pattern

`src/data/services.ts`:

```ts
export interface Service {
  slug: string;
  title: string;
  href: string;       // "/services/<slug>/"
  body: string;       // card description
  intro: string;      // hero paragraph
  outcomes: string[];
}
export const services: Service[] = [
  { slug: "…", title: "…", href: "/services/…/", body: "…", intro: "…", outcomes: […] },
  …
];
```

`src/pages/services/[slug].astro`:

```ts
export function getStaticPaths() {
  return services.map((service) => ({
    params: { slug: service.slug },
    props: { service },
  }));
}
```

Every service page emits:
- `SeoHead` with `Service` + `BreadcrumbList` + `WebPage` + `Organization` graph.
- Markdown alternate via default `markdownPathFor(pathname)`.
- `data-action` CTAs.

Same pattern for `insights/[slug].astro` with `Article` graph.

## Sitemap strategy

Two sitemaps coexist:

1. **`@astrojs/sitemap` integration** — emits `/sitemap-index.xml` and `/sitemap-0.xml` automatically. Respects `trailingSlash: "always"`. Filter hides utility pages.
2. **`src/pages/sitemap.xml.ts`** — explicit sitemap of hand-rolled routes with custom priority/lastmod. Useful if deployment target only inspects `/sitemap.xml`.

Both are referenced in `robots.txt`. The audit's "Sitemap exists" check tolerates either.

## RSS strategy

`src/pages/rss.xml.ts` uses `@astrojs/rss`:

```ts
return rss({
  title, description, site,
  xmlns: { content: "http://purl.org/rss/1.0/modules/content/" },
  customData: "<language>en-us</language>",
  items: insights.map((i) => ({
    title: i.title,
    description: i.description,
    content: insightContent(i),   // full article body as HTML
    link: i.href,
    pubDate: new Date(i.publishedAt),
    categories: i.tags,
  })),
});
```

Emitting `content:encoded` via the `content` option satisfies audit check 1.12 (RSS feed content complete).

## Markdown alternates

`@puralex/astro-markdown-for-agents` is a zero-config integration. Once added, every `.astro` page emits a `.md` sibling containing the visible text content of the page. Works because `build.format: "directory"` produces `/slug/index.html` + `/slug/index.md`.

The `SeoHead.astro` component links to the markdown alternate via:

```astro
<link rel="alternate" type="text/markdown" href={markdownHref} />
```

`markdownPath={null}` opts a page out (useful for utility routes).

## Build validator

`scripts/validate-built-site.js` asserts post-build:

1. Every required file exists in `dist/` (index.html, llms.txt, all JSON endpoints, sitemap, RSS, per-page index.md, .well-known/security.txt).
2. Every required text fragment exists in the relevant HTML/text file (e.g. homepage must contain `FAQPage`, `SpeakableSpecification`, `OfferCatalog`, `data-action="contact"`, and absolute URLs to `/llms.txt`, `/openapi.json`, `/mcp.json`, `/brand.json`).
3. Every JSON endpoint has the required top-level keys (`ai-catalog.json` has `resources` and `actions`, etc.).

Run as `npm run validate:build`. Exits non-zero on any failure, which fails CI and deploy.

Extend it per site: add new required pages, new text fragments, new JSON keys as the site grows. This is your AI-readiness regression test.

## Apache `.htaccess` (or equivalent)

`public/.htaccess` handles:
- trailing-slash enforcement (single-hop redirect)
- security headers (HSTS intentionally omitted from `.htaccess` when running behind Cloudflare — set there instead to avoid double-setting)
- CORS on AI files + `/.well-known/`
- long cache on `/_astro/`
- short cache + `text/markdown` MIME for `.md`

For Nginx, mirror the directives. For Netlify/Cloudflare Pages, use `public/_headers`:

```
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/llms.txt
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=86400

/*.json
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=86400
```

## Semantic HTML conventions

Conventions per page archetype. These cannot be enforced via the validator — they are author discipline backed by a few helper components.

### Article body

```astro
<article>
  <header>
    <p class="text-mint text-sm font-semibold">{insight.label}</p>
    <h1>{insight.title}</h1>
    <p class="text-muted">
      By <a href={`/authors/${insight.author.slug}/`} rel="author">{insight.author.name}</a>
      · Published <time datetime={insight.publishedAt}>{formatDate(insight.publishedAt)}</time>
      · Updated <time datetime={insight.modifiedAt}>{formatDate(insight.modifiedAt)}</time>
    </p>
  </header>

  <p class="article-summary">{insight.summary}</p>

  <!-- body paragraphs -->

  <aside class="related">
    <h2>Related</h2>
    <ul>
      {related.map((r) => <li><a href={r.href}>{r.title}</a></li>)}
    </ul>
  </aside>
</article>
```

Covers audits 6.4 (`<article>`), 6.6 (`<aside>`), 6.11 (`<time datetime>`), 9.8/9.10 (visible publication + modified dates), 10.1/10.9/10.10.

### Glossary / definition pattern

```astro
<dl>
  <dt><dfn>AI-enabled growth system</dfn></dt>
  <dd>An operating model combining strategy, AI, and automation into one connected set of workflows.</dd>
</dl>
```

Covers audits 6.13 (definitions) and 9.4 (direct definitions for key terms).

### Comparison / pricing table

```astro
<table>
  <caption>Plan comparison</caption>
  <thead>
    <tr><th scope="col">Feature</th><th scope="col">Starter</th><th scope="col">Pro</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Price</th><td>$10/mo</td><td>$49/mo</td></tr>
  </tbody>
</table>
```

Covers audits 6.9 (data tables) and 9.5 (comparison tables).

### Procedural content

```astro
<ol>
  <li>Create an account at yoursite.com/signup</li>
  <li>Configure your API key in the dashboard</li>
  <li>Make your first API call using the quickstart guide</li>
</ol>
```

Covers audits 6.8 (semantic lists) and 9.6 (numbered steps). Pair with `HowTo` JSON-LD (audit 3.11).

### Contact block

```astro
<address>
  <a href={`mailto:${siteInfo.email}`}>{siteInfo.email}</a><br />
  <a href="tel:+15555555555">+1 (555) 555-5555</a><br />
  123 Main St, City, ST 12345
</address>
```

Covers audit 6.12.

## Author / E-E-A-T pattern

Covers audits 3.15 (Person credentials), 10.1 (named attribution), 10.2 (sameAs), 10.3 (author page), 4.2 (meta author).

1. Declare authors in `src/data/authors.ts`:

   ```ts
   export interface Author {
     slug: string;
     name: string;
     jobTitle: string;
     bio: string;
     image: string;
     sameAs: string[];       // LinkedIn/Twitter/GitHub/personal URLs
     topics: string[];       // knowsAbout
     credentials?: string[];
   }
   export const authors: Author[] = [/* ... */];
   ```

2. Each `Insight` / article references an author by slug:

   ```ts
   export interface Insight {
     ...
     authorSlug: string;
   }
   ```

3. Article page hydrates the author from `authors.ts`, passes `author={author.name}` to `SeoHead`, and emits a `Person` JSON-LD entity referenced by the `Article` via `@id`.

4. Author pages live at `/authors/<slug>/` and emit `ProfilePage` + `Person` + `BreadcrumbList` JSON-LD. Templates: `src/pages/authors/[slug].astro` and `src/pages/authors/index.astro`.

5. Visible byline in the article template: `<a rel="author" href={`/authors/${author.slug}/`}>{author.name}</a>`.

## Pagination pattern

When building a paginated listing (blog index with >20 posts, search results, etc.):

```astro
---
const currentPage = Number(Astro.params.page ?? "1");
const prevHref = currentPage > 1 ? `/insights/page/${currentPage - 1}/` : undefined;
const nextHref = currentPage < totalPages ? `/insights/page/${currentPage + 1}/` : undefined;
---
<SeoHead
  title={title}
  description={description}
  prevHref={prevHref}
  nextHref={nextHref}
/>
```

Covers audit 10.12.

## Content-edit workflow

Every content change flows through typed data files, never hand-edited HTML:

1. Add service → append to `src/data/services.ts`.
2. Add insight → append to `src/data/insights.ts`.
3. Update llms.txt / llms-full.txt / ai-catalog.json to reflect new page.
4. Run `npm run verify`. Validator catches missing entries.

This keeps the machine-readable surface in sync with the rendered site — the single most common cause of AIO audit regressions.
