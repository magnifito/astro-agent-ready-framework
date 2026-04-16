# AIO Framework for Astro Static Sites

A pragmatic framework for making Astro static sites AI-ready. Every item is tied to a specific audit from the canonical audit metadata (`ucp-analysis/apps/audit/src/data/audit-metadata.json` — **189 audits** across 10 categories) and to a concrete artifact (file, component, integration, header) that produces it.

Terminology:
- **AIO** — AI Optimization. Umbrella term covering classic SEO + the following:
- **AEO** — Answer Engine Optimization. Direct, answer-formatted content for AI assistants.
- **GEO** — Generative Engine Optimization. Cross-linking, trust signals, unique data so LLMs cite you.
- **AI crawler surface** — robots.txt directives, CORS, permissions for LLM bots.
- **Agent surface** — OpenAPI, MCP discovery, WebMCP manifest, `data-action` attributes.

## Why this framework

The Moesica.com audit (see `context/audit.md`) scored 18 of 156 executed audits on first pass. The canonical metadata defines 189 total audits (the extra 33 activate on specific page types — commerce, HowTo, local business, authored content, pricing). Applying this framework covers all 189 audits by producing:
- `llms.txt`, `llms-full.txt`, per-page Markdown alternates
- Sitemap (generated + static), RSS with full content
- JSON-LD graph: `Organization` (w/ logo + `sameAs` + `potentialAction`), `WebSite` with `SearchAction`, `WebPage`, `OfferCatalog`, `Service` (w/ `potentialAction`), `Article` (w/ `datePublished` + `dateModified` + `Person` author), `Person` with `jobTitle` + `sameAs` + `affiliation`, `FAQPage`, `BreadcrumbList`, `SpeakableSpecification`, `ConfirmAction`, `HowTo`, `LocalBusiness`, `Offer`, `Review`/`AggregateRating`, `Product` (w/ GTIN/UPC/MPN/brand/category)
- Machine-readable endpoints: `ai-catalog.json`, `brand.json`, `mcp.json`, `openapi.json`, `navigation.json`, `humans.txt`, `.well-known/security.txt`
- Head links to every machine-readable resource (`rel="alternate"`, `rel="service-desc"`, `rel="sitemap"`, `rel="prev"` / `rel="next"` for pagination)
- `data-action-*` attributes on every CTA for agent action discovery
- `<meta name="author">` on every content page, named `Person` bylines with author pages at `/authors/<slug>/`
- `<article>`, `<aside>`, `<time datetime>`, `<dfn>`/`<dl>`, `<address>`, `<table>` and `<ol>` conventions for RAG-friendly chunking + freshness signals
- robots.txt with explicit AI bot allows
- Apache `.htaccess` with security headers, CORS on AI files, long-cache on `_astro/`
- Build validator (`scripts/validate-built-site.js`) that fails the build if any of the above regress

## Files in this folder

| File | Purpose |
|---|---|
| `framework.md` | The ten categories, what each means, what passes it, what it requires of the Astro site. |
| `checklist.md` | Every check from the audit (156), grouped, with status against this framework and the fix. |
| `astro-implementation.md` | How Astro config, integrations, components, and `public/` files map to the checks. |
| `structured-data-patterns.md` | JSON-LD graph skeletons per page archetype (home, service, service index, article, collection, confirm, 404). |
| `templates/` | Copy-paste starter files. Replace `$SITE_*` placeholders. |

## How to use on a new Astro site

1. Read `framework.md` to understand the ten categories.
2. Copy `templates/` into the new site, rewrite placeholders.
3. Wire the integrations in `templates/astro.config.mjs` (sitemap + `@puralex/astro-markdown-for-agents`).
4. Adopt the `SeoHead.astro` component on every page.
5. Add `structured-data-patterns.md` graphs per page archetype.
6. Run `npm run verify` (build + validate). The validator enforces the critical surface.
7. Re-run the external AIO audit. Target 80%+ readiness.

## Non-goals

- No opinion on CSS, frontend framework, or content system. This framework assumes Astro but works with any content source (MDX, CMS, file-based data).
- No dynamic server endpoints. Everything here works for pure static output deployed to Apache, Nginx, or a CDN.
- Commerce checks (products, reviews, return policy) are scoped out unless the site is a store. The framework notes where to extend.
# astro-agent-ready-framework
