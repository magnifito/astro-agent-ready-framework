# AIO Checklist — All 200 Audits

Complete coverage of the canonical audit metadata (`ucp-analysis/apps/audit/src/data/audit-metadata.json`).

Legend:
- ✅ Framework covers it when templates are copied and the build validator passes.
- ⚠️ Framework provides the scaffold; site owner must fill in content (text, data, images).
- 🔧 Requires site-specific configuration (hosting, headers, bot protection, CDN).
- 💠 Applies per page archetype — implement when the page type exists (pricing, HowTo, reviews, etc.).
- ❌ Out of scope until the site has the relevant page type (commerce, local business, etc.).

All entries cite the `fix` or `impact` guidance from `audit-metadata.json`.

---

## 1. Content Discoverability (15% — 23 audits)

| # | Prio | Check | Coverage |
|---|---|---|---|
| 1.1 | critical | llms.txt exists | ✅ `templates/public/llms.txt` (H1 + blockquote + H2 sections + linked resources) |
| 1.2 | medium | llms.txt blockquote summary | ✅ template includes `>` line immediately after H1 |
| 1.3 | medium | llms.txt H2 sections | ✅ `## Core Pages`, `## Services`, `## Insights`, `## Machine-Readable Resources`, `## Contact` |
| 1.4 | medium | llms.txt link descriptions | ✅ `: description` suffix on every link |
| 1.5 | high | llms.txt links valid | ✅ `validate-built-site.js` asserts each declared URL resolves to a dist file |
| 1.6 | high | llms-full.txt present | ✅ `templates/public/llms-full.txt` |
| 1.7 | critical | sitemap.xml exists | ✅ `@astrojs/sitemap` + `src/pages/sitemap.xml.ts` |
| 1.8 | medium | Sitemap includes all key pages | ✅ `@astrojs/sitemap` auto-includes every built page (incl. `[slug]` routes); `src/pages/sitemap.xml.ts` lists key index routes and can map `services[]`/`insights[]` (opt-in, commented) |
| 1.9 | high | Sitemap absolute URLs | ✅ `new URL(route.loc, site).toString()` |
| 1.10 | medium | Sitemap lastmod | ✅ `<lastmod>` emitted **only** from a real content date, never build-time stamped; entries with no known date omit it (framework §14) |
| 1.11 | medium | RSS/Atom link present | ✅ `SeoHead.astro` emits `rel="alternate" type="application/rss+xml"` |
| 1.12 | medium | RSS feed content complete | ✅ `rss.xml.ts` uses `content:encoded` with full body text |
| 1.13 | critical | No noindex on homepage | ✅ `SeoHead.astro` only emits `meta robots` when `robots` prop set |
| 1.14 | high | No nofollow on important links | ⚠️ convention — audit anchor `rel` attributes |
| 1.15 | medium | Internal linking structure | ⚠️ every service/article template cross-links; site must populate 3–5 links per page |
| 1.16 | medium | No redirect chains | ✅ `.htaccess` enforces trailing slash single-hop |
| 1.17 | medium | Canonical links | ✅ `SeoHead.astro` always emits canonical |
| 1.18 | medium | Mobile friendly | ✅ viewport meta emitted |
| 1.19 | medium | Fast page load | 🔧 hosting/CDN (Cloudflare, Fastly). Framework supplies Cache-Control |
| 1.20 | high | No broken internal links | ✅ validator asserts declared URLs exist in `dist/` |
| 1.21 | medium | navigation.json present | ✅ `templates/public/navigation.json` |
| 1.22 | medium | No orphan pages | ⚠️ populate `services.ts` / `insights.ts` / `authors.ts` — auto-indexed everywhere |
| 1.23 | medium | Critical commerce links | 💠 non-commerce: link `/privacy/`, `/terms/`, `/contact/`. Commerce: also `/returns/`, `/shipping/` |

---

## 2. AI Crawler Permissions (8% — 26 audits)

| # | Prio | Check | Coverage |
|---|---|---|---|
| 2.1 | medium | GPTBot allowed | ✅ robots.txt |
| 2.2 | medium | Google-Extended allowed | ✅ robots.txt |
| 2.3 | medium | anthropic-ai / ClaudeBot allowed | ✅ robots.txt (both entries) |
| 2.4 | medium | PerplexityBot allowed | ✅ robots.txt |
| 2.5 | medium | Applebot-Extended allowed | ✅ robots.txt |
| 2.6 | medium | CCBot allowed | ✅ robots.txt |
| 2.7 | medium | Meta-ExternalAgent allowed | ✅ robots.txt |
| 2.8 | medium | Amazonbot allowed | ✅ robots.txt |
| 2.9 | medium | Bytespider allowed | ✅ robots.txt |
| 2.10 | medium | cohere-ai allowed | ✅ robots.txt |
| 2.11 | medium | YouBot allowed | ✅ robots.txt |
| 2.12 | medium | Diffbot allowed | ✅ robots.txt |
| 2.13 | medium | AI2Bot allowed | ✅ robots.txt |
| 2.14 | medium | ChatGPT-User allowed | ✅ robots.txt |
| 2.15 | medium | Claude-User allowed | ✅ robots.txt |
| 2.16 | medium | OAI-SearchBot allowed | ✅ robots.txt |
| 2.17 | medium | Meta-ExternalFetcher allowed | ✅ robots.txt |
| 2.18 | medium | Bravebot allowed | ✅ robots.txt |
| 2.19 | medium | DuckAssistBot allowed | ✅ robots.txt |
| 2.20 | medium | MistralAI-User allowed | ✅ robots.txt |
| 2.21 | medium | Claude-SearchBot allowed | ✅ robots.txt |
| 2.22 | critical | No blanket AI block | ✅ template has no `Disallow: /` |
| 2.23 | high | Sensitive paths protected | ⚠️ add `Disallow: /admin/`, `/api/internal/`, etc. per site |
| 2.24 | high | Crawl-delay reasonable | ✅ no Crawl-delay in template |
| 2.25 | high | meta robots not blocking | ✅ SeoHead only emits when explicitly opted in |
| 2.26 | high | No aggressive bot-detection | 🔧 CDN/WAF — allowlist AI user-agents at Cloudflare/Akamai |

---

## 3. Structured Data & Schema Markup (12% — 19 audits)

| # | Prio | Check | Coverage |
|---|---|---|---|
| 3.1 | critical | JSON-LD present | ✅ every archetype — `structured-data-patterns.md` |
| 3.2 | critical | Schema validation | ✅ `@graph` with `@context` + `@type`; `JSON.stringify` via `<script is:inline set:html>` |
| 3.3 | high | Organization schema | ✅ `Organization` with `name`, `url`, `logo`, `sameAs`, `contactPoint` in homepage graph |
| 3.4 | high | WebSite schema with SearchAction | ✅ homepage graph includes `WebSite.potentialAction: SearchAction` with `urlTemplate` + `query-input` |
| 3.5 | medium | BreadcrumbList | ✅ every non-home archetype |
| 3.6 | high | Article schema | ✅ article/insight archetype with `headline`, `datePublished`, `dateModified`, `author` |
| 3.7 | medium | FAQPage schema | ✅ `src/pages/index.astro` emits `FAQPage` from its `faqs[]` array (same array renders the visible FAQ) |
| 3.8 | medium | Service/Product schema | ✅ `Service` on every service page; `Product` pattern for commerce |
| 3.9 | low | Speakable schema | ✅ every archetype emits `speakable.cssSelector` |
| 3.10 | medium | potentialAction on service pages | ✅ `ContactAction` on `Organization` + per-`Service` (patterns doc updated) |
| 3.11 | low | HowTo schema | 💠 pattern in `structured-data-patterns.md` §HowTo — apply per tutorial page |
| 3.12 | medium | LocalBusiness / ProfessionalService | 💠 homepage pattern — swap `ProfessionalService` with `LocalBusiness` + `PostalAddress` + `telephone` + `openingHours` if physical |
| 3.13 | medium | Review / AggregateRating | 💠 pattern in `structured-data-patterns.md` §Review. Apply when testimonials exist |
| 3.14 | medium | Offer schema on pricing pages | 💠 pattern §Pricing — `Offer` with `price`, `priceCurrency`, `availability`, `priceValidUntil` |
| 3.15 | medium | Author schema with credentials | ✅ `Person` with `jobTitle`, `sameAs`, `affiliation`, `hasCredential` in article graph; author page template |
| 3.16 | low | ConfirmAction / ReserveAction | ✅ `src/pages/thank-you.astro` ships — `WebPage` + `potentialAction: ConfirmAction` (via `confirmAction()` in `schema.ts`), `robots="noindex, follow"`; astro.config already excludes `/thank-you/` from the sitemap |
| 3.21 | high | Product identifiers (GTIN/UPC/MPN) | ❌ commerce only — pattern §Commerce includes `sku`, `gtin13`, `mpn` |
| 3.22 | medium | Advanced product details | ❌ commerce only — pattern includes `brand`, `category`, `availability` |
| 3.23 | low | Product reviews and ratings | ❌ commerce only — pattern includes `aggregateRating`, `review[]` |

> **On the 3.17–3.20 ID gap:** category 3 has exactly **19 audits** (3.1–3.16,
> 3.21–3.23). IDs 3.17–3.20 are **not present** in the canonical
> `audit-metadata.json` (`structured-data` category, 19 entries; file
> `totalAudits: 199`) — the audit engine's numbering skips them, so there are no
> audits to enumerate there. They are left as reserved gaps, not omissions.
> Homepage-archetype structured-data rows (3.3, 3.4, 3.7, 3.9, plus the
> OfferCatalog) are satisfied by `src/pages/index.astro`, which emits the full
> homepage `@graph` (Organization + WebSite/SearchAction + WebPage/speakable +
> OfferCatalog + per-Service nodes + FAQPage).

---

## 4. Meta Tags & AI Head Elements (8% — 20 audits)

All emitted by `SeoHead.astro`:

| # | Prio | Check | Coverage |
|---|---|---|---|
| 4.1 | high | Meta description | ✅ `description` prop required |
| 4.2 | medium | Meta author present | ✅ `author` prop → `<meta name="author">`; E-E-A-T signal (pair with GEO 10.1) |
| 4.3 | high | Canonical URL | ✅ always emitted |
| 4.4 | high | Language attribute | ✅ `<html lang="en">` in every page template (outside SeoHead) |
| 4.5 | high | Unique meta per page | ⚠️ convention — each page declares own `title` / `description` |
| 4.6 | high | Core Open Graph tags | ✅ og:title/type/description/image/url/site_name |
| 4.7 | medium | og:type | ✅ `type` prop (`website` \| `article`) |
| 4.8 | medium | og:site_name | ✅ pulled from `site.ts` |
| 4.9 | medium | og:image:alt | ✅ emitted when `imageAlt` prop set |
| 4.10 | medium | Twitter Card | ✅ twitter:card/title/description/image |
| 4.11 | high | llms.txt link in head | ✅ |
| 4.12 | medium | llms-full.txt link in head | ✅ |
| 4.13 | medium | ai-content-declaration meta | ✅ |
| 4.14 | medium | ai-instructions meta | ✅ default from `site.ts`, overridable per page |
| 4.15 | medium | Markdown alternate link | ✅ `markdownPathFor(pathname)` computes it |
| 4.16 | medium | RSS feed link in head | ✅ |
| 4.17 | low | MCP discovery link in head | ✅ |
| 4.18 | low | OpenAPI spec link in head | ✅ |
| 4.19 | low | AI Catalog link in head | ✅ |
| 4.20 | critical | meta robots not blocking | ✅ only emitted when explicitly opted in |

---

## 5. AI Agent Tools & Action Surfaces (18% — 25 audits)

| # | Prio | Check | Coverage |
|---|---|---|---|
| 5.1 | high | OpenAPI spec exists | ✅ `templates/public/openapi.json` |
| 5.2 | high | OpenAPI has endpoints | ✅ template documents `/submit` |
| 5.3 | medium | OpenAPI operationIds | ✅ `operationId: submit<Site>Inquiry` |
| 5.4 | medium | x-ai-instructions in OpenAPI | ✅ `info.x-ai-instructions` placeholder in template |
| 5.5 | high | OpenAPI servers array valid | ✅ `servers[].url` + `.description` |
| 5.6 | medium | Request/response schemas | ✅ typed schemas for every field |
| 5.7 | medium | AI Catalog exists | ✅ `public/ai-catalog.json` |
| 5.8 | medium | AI Catalog complete metadata | ✅ name/url/updated/summary/contact/resources/actions |
| 5.9 | medium | AI Catalog service URLs valid | ✅ generated from `services.ts` |
| 5.10 | medium | agents.json exists | ✅ `templates/public/agents.json` (resources + actions + contact); `SeoHead.astro` emits its `rel="alternate"` head link, CORS-enabled in `.htaccess`/`_headers` |
| 5.11 | medium | ai-plugin.json exists | ✅ `templates/public/.well-known/ai-plugin.json` |
| 5.12 | medium | MCP server discovery file | ✅ `public/mcp.json` (also copied to `public/.well-known/mcp.json`) |
| 5.13 | high | MCP endpoint functional | ⚠️ static discovery satisfies the check; live MCP server optional |
| 5.14 | medium | MCP advertises capabilities | ✅ `resources` + `tools` arrays |
| 5.15 | high | Contact/lead form endpoint | ✅ OpenAPI documents it; `mcp.json` lists it as a tool |
| 5.16 | medium | Search endpoint functional | ❌ only when site search exists. If added, document in OpenAPI + `WebSite.SearchAction` (audit 3.4) already references the endpoint |
| 5.17 | low | data-action attributes on CTAs | ✅ `data-action` / `data-action-type` / `data-action-label` triplet on every template CTA — homepage hero, service/insight links (`view-service`/`read-insight`), and contact form (`data-action="contact"`) |
| 5.18 | high | Forms don't use blocking CAPTCHA | ✅ honeypot (`botcheck` hidden input), no CAPTCHA |
| 5.19 | medium | Forms work without JavaScript | ✅ pure HTML `action="POST"` form |
| 5.20 | high | WebMCP discovery manifest | ✅ `mcp.json` |
| 5.21 | high | WebMCP declarative form tools | ✅ `mcp.json` tool entry with `inputSchema` |
| 5.22 | medium | WebMCP tool input quality | ✅ JSON Schema with types + `format: email` |
| 5.23 | low | WebMCP tool naming conventions | ✅ `submit_project_inquiry` snake_case verb_noun |
| 5.24 | medium | WebMCP tool safety annotations | ✅ `x-webmcp-safety` block (`idempotent`, `destructive`, `requiresUserConsent`) in template |
| 5.25 | medium | WebMCP commerce action coverage | ❌ non-commerce. Commerce: add `cart_add`, `order_create`, `order_track` tools |

---

## 6. Semantic HTML & Content Structure (8% — 17 audits)

| # | Prio | Check | Coverage |
|---|---|---|---|
| 6.1 | high | Single h1 per page | ⚠️ convention — every template has exactly one `<h1>` |
| 6.2 | high | Sequential heading hierarchy | ⚠️ author discipline — no h2→h4 skips |
| 6.3 | high | `<main>` element present | ✅ every page wraps in `<main id="main">` |
| 6.4 | medium | `<article>` used for content | ⚠️ wrap every blog post / card / self-contained block in `<article>`. RAG chunking boundary |
| 6.5 | medium | header/footer landmarks | ✅ `SiteHeader.astro` / `SiteFooter.astro` |
| 6.6 | low | `<aside>` for supplementary content | ⚠️ wrap sidebars, callouts, related-links, pull quotes in `<aside>` |
| 6.7 | medium | Sections have headings/labels | ⚠️ convention — every `<section>` gets `<h2>` or `aria-label` |
| 6.8 | medium | Semantic list usage | ⚠️ convention — `<ul>` / `<ol>` not styled `<div>` stacks |
| 6.9 | medium | Data tables properly structured | ⚠️ `<table>` with `<thead>`, `<tbody>`, `<th scope>` |
| 6.10 | low | Code blocks with language annotations | ⚠️ `<pre><code class="language-xxx">`. Prism/Highlight.js emit this automatically |
| 6.11 | medium | `<time datetime>` for dates | ⚠️ wrap all dates — `<time datetime="2026-04-16">April 16, 2026</time>`. Pairs with 9.8/10.9/10.10 |
| 6.12 | low | `<address>` for contact info | ⚠️ wrap email/phone/postal in `<address>` — footer or contact section. Author template includes this pattern |
| 6.13 | low | Definition elements | ⚠️ `<dl><dt><dfn>Term</dfn></dt><dd>Definition</dd></dl>` for glossaries/FAQs |
| 6.14 | medium | Sufficient content depth | ⚠️ content task — >300 words on key pages |
| 6.15 | high | Image alt text coverage | ⚠️ convention — every `<img>` has `alt` |
| 6.16 | medium | Decorative images marked | ⚠️ empty `alt=""` on decorative images |
| 6.17 | medium | figure + figcaption | ⚠️ convention for meaningful image groups |

---

## 7. Accessibility & Agent Interaction (7% — 23 audits)

> 7.10–7.23 are axe-core-backed structural checks (added when the scanner moved
> to axe-core). They are mostly authoring conventions — get them right once in
> the templates and every page passes. `scripts/validate-headless.js` runs the
> **real `@axe-core/playwright` engine** (`wcag2a`/`wcag2aa` tags + the explicit
> 7.10–7.23 rule set) for production-scanner parity, degrading to a hand-rolled
> DOM fallback covering the same audits when the dependency is absent. The 🔧
> rows below depend on site-authored markup (tables, iframes, form fields, ARIA
> widgets) — axe-core verifies them on the deployed page.

| # | Prio | Check | Coverage |
|---|---|---|---|
| 7.1 | medium | Skip navigation link | ✅ `SiteHeader.astro` emits `.skip-link` |
| 7.2 | high | ARIA landmarks complete | ✅ header / main / footer / labeled nav |
| 7.3 | medium | nav has aria-label | ✅ primary + footer both labeled |
| 7.4 | medium | Multiple nav distinguished | ✅ distinct `aria-label` values |
| 7.5 | high | Form inputs have labels | ✅ `<label for>` on every input (incl. search) |
| 7.6 | medium | Form error messages linked | ⚠️ when adding JS validation, wire `aria-describedby` + `role="alert"` |
| 7.7 | high | Buttons/links accessible names | ⚠️ convention |
| 7.8 | high | Icon-only elements labels | ⚠️ `aria-label` or `.sr-only` text |
| 7.9 | high | Modal dialogs role="dialog" | ❌ only when modals exist |
| 7.10 | critical | Page exposed to a11y tree | ✅ never `aria-hidden="true"` on `<body>`/root |
| 7.11 | high | Valid / non-misused ARIA roles | ✅ convention — only valid role tokens, no abstract roles |
| 7.12 | high | Valid ARIA attributes | ✅ convention — only valid `aria-*` names + values |
| 7.13 | medium | Complete ARIA relationships | 🔧 give ARIA widgets their required attrs + required child/parent roles |
| 7.14 | medium | Unique IDs for ARIA references | 🔧 every `id` referenced by `for`/`aria-*`/`labelledby` is unique per page |
| 7.15 | high | Valid autocomplete tokens | 🔧 use valid tokens (`email`, `given-name`, `postal-code`, `cc-number`…) on form fields |
| 7.16 | medium | No nested interactive controls | 🔧 never nest focusable elements (no `<a>`/`<button>` inside `<button>`) |
| 7.17 | medium | Data tables have header associations | 🔧 `<th scope="col"\|"row">` (or `headers`/`id`) on every data table |
| 7.18 | high | Non-empty `<title>` | ✅ `SeoHead.astro` always emits a unique, descriptive `<title>` |
| 7.19 | low | Frames are titled | 🔧 unique, descriptive `title` on every `<iframe>` (maps, embeds) |
| 7.20 | medium | No time-based auto-refresh/redirect | ✅ no `<meta http-equiv="refresh">`; use 3xx server redirects |
| 7.21 | low | No positive tabindex | ✅ convention — only `tabindex="0"`/`"-1"`, rely on DOM order |
| 7.22 | low | No deprecated presentational elements | ✅ no `<marquee>`/`<blink>`; CSS for motion |
| 7.23 | low | No presentation-role conflicts | ✅ no `role="presentation"\|"none"` on focusable/labeled elements |

---

## 8. Technical Readiness & Security (9% — 21 audits)

| # | Prio | Check | Coverage |
|---|---|---|---|
| 8.1 | critical | HTTPS enabled | 🔧 hosting |
| 8.2 | high | HSTS header | 🔧 `.htaccess` line commented — enable once HTTPS-only |
| 8.3 | high | Content-Security-Policy | 🔧 `.htaccess` stub — tune per site |
| 8.4 | medium | X-Content-Type-Options nosniff | ✅ `.htaccess` |
| 8.5 | medium | Referrer-Policy | ✅ `.htaccess` |
| 8.6 | medium | Permissions-Policy | ✅ `.htaccess` |
| 8.7 | low | security.txt exists | ✅ `public/.well-known/security.txt` |
| 8.8 | medium | CORS on AI files | ✅ `.htaccess` `<FilesMatch>` |
| 8.9 | medium | CORS on API routes | ⚠️ per site — static site APIs live elsewhere |
| 8.10 | medium | Correct Content-Types | ✅ `.htaccess` `AddType` |
| 8.11 | low | Cache headers on AI files | ✅ `.htaccess` 86400 for AI files |
| 8.12 | high | Fast response time | 🔧 hosting/CDN — target TTFB <800ms |
| 8.13 | critical | Server-rendered content | ✅ Astro default pre-renders HTML |
| 8.14 | medium | No render-blocking resources | ⚠️ keep CSS bundle small; no blocking `<head>` scripts |
| 8.15 | medium | Images have explicit dimensions | ⚠️ convention — `width` / `height` on every `<img>` |
| 8.16 | high | LCP element not lazy-loaded | ⚠️ hero gets `fetchpriority="high"`, no `loading="lazy"` |
| 8.17 | low | Preconnect hints | ✅ `SeoHead.astro` `preconnectImages` prop |
| 8.18 | high | No broken AI endpoints | ✅ validator asserts every AI file exists in dist |
| 8.19 | medium | Privacy policy exists | ✅ `src/pages/privacy.astro` stub shipped (`WebPage` + `BreadcrumbList` + `<time>`); replace `$PRIVACY_*` / `$LEGAL_LAST_UPDATED` copy before launch |
| 8.20 | medium | Terms of service exists | ✅ `src/pages/terms.astro` stub shipped; replace `$TERMS_*` / `$LEGAL_LAST_UPDATED` copy before launch |
| 8.21 | low | Frontend framework detection | ✅ Astro sets `<meta name="generator">` automatically |

---

## 9. Answer Engine Optimization (7% — 11 audits)

| # | Prio | Check | Coverage |
|---|---|---|---|
| 9.1 | medium | FAQ sections present | ⚠️ `src/pages/index.astro` ships the FAQ section (question-formatted `<h3>`s); fill the `$FAQ_*` copy |
| 9.2 | medium | Question-formatted headings | ⚠️ content task — "What is X?", "How does X work?" |
| 9.3 | high | First paragraph answers primary question | ⚠️ content task — enforce in review |
| 9.4 | medium | Direct definitions for key terms | ⚠️ content task — pair with `<dfn>`/`<dl>` (audit 6.13) |
| 9.5 | low | Comparison tables present | ⚠️ convert comparison content to `<table>` markup (pairs with 6.9) |
| 9.6 | low | Numbered steps for processes | ⚠️ convert procedural content to `<ol>` lists (pairs with 6.8, 3.11) |
| 9.7 | medium | Specific numbers / data points | ⚠️ content task — quote real numbers where possible |
| 9.8 | medium | Dates on content pages | ⚠️ every article shows `<time datetime>` near title. Template uses `article-summary` pattern |
| 9.9 | high | Content answers without click-through | ⚠️ content task |
| 9.10 | medium | Visible "Last updated" indicator | ⚠️ article template renders `<time datetime={modifiedAt}>` near byline |
| 9.11 | high | Meta description AEO formula | ⚠️ per-page — `<entity> is a <thing> that does <value>.` pattern |

---

## 10. Generative Engine Optimization (8% — 15 audits)

| # | Prio | Check | Coverage |
|---|---|---|---|
| 10.1 | high | Named author attribution | ✅ `data/authors.ts` + `SeoHead author` prop + JSON-LD `Person` with `name` + `jobTitle`. Never "Staff" or "Admin" |
| 10.2 | medium | Author schema with sameAs | ✅ `authors.ts` has `sameAs[]` field surfaced in article JSON-LD |
| 10.3 | medium | Author page exists | ✅ `src/pages/authors/[slug].astro` + `src/pages/authors/index.astro` templates |
| 10.4 | medium | About page with credentials | ⚠️ homepage about section or `/about/` page — populate with clients, experience, positioning |
| 10.5 | medium | External citations | ⚠️ content task — ≥2 outbound links per content page to authoritative sources |
| 10.6 | medium | Brand name in body text | ⚠️ `src/pages/index.astro` places `$SITE_NAME` 4–5× in body copy (hero, sections, contact); keep it natural when you fill copy |
| 10.7 | medium | Trust signals on homepage | ⚠️ `src/pages/index.astro` ships a trust-signals `<aside>` placeholder — fill with real client logos, testimonials, metrics. Do not fabricate |
| 10.8 | medium | Review/testimonial signals | ⚠️ when testimonials exist, use `Review`/`AggregateRating` JSON-LD **or** attributed `<blockquote cite>` with `<cite>` and `<footer>` (pattern in `structured-data-patterns.md`) |
| 10.9 | medium | Publication date visible | ✅ article template renders `<time datetime={publishedAt}>` |
| 10.10 | medium | dateModified in schema | ✅ article JSON-LD includes `dateModified`; must be updated on revision |
| 10.11 | high | Internal cross-linking | ⚠️ convention — related services/articles surfaced at bottom of each page |
| 10.12 | low | Pagination links | ✅ `SeoHead.astro` `prevHref` / `nextHref` props emit `<link rel="prev">` / `<link rel="next">` |
| 10.13 | medium | Unique data or statistics | ⚠️ content task — publish internal metrics, proprietary research |
| 10.14 | low | Blockquote / callout usage | ✅ convention — home uses `<blockquote>` for memorable lines |
| 10.15 | high | Descriptive URL slugs | ✅ human-readable slugs in `services.ts` / `insights.ts` / `authors.ts` |

---

---

## Extension categories (beyond canonical 200)

Signals flagged by production audit engines (`agenticstorefront/AIAgentOptimizationService.ts`) that aren't in the canonical 200 but affect AI-agent readiness in practice. Apply when relevant.

### 11. Multi-Modal Capabilities

| # | Check | Coverage |
|---|---|---|
| 11.1 | Every `<img>` has descriptive alt (>5 chars) | ⚠️ convention |
| 11.2 | Decorative `alt=""` | ⚠️ convention |
| 11.3 | Responsive images (`srcset`, `<picture>`) | ⚠️ use `astro:assets <Image />` |
| 11.4 | Video `<track kind="captions">` with WebVTT | ⚠️ per video |
| 11.5 | Audio transcript linked or inline | ⚠️ per audio |
| 11.6 | `ImageObject` JSON-LD on hero/product images | ⚠️ add to `structured-data-patterns.md` graph |
| 11.7 | `VideoObject` JSON-LD on embedded video | ⚠️ add when video present |

### 12. Voice / Conversational Optimization

| # | Check | Coverage |
|---|---|---|
| 12.1 | At least one `<ol>` or `<ul>` per content page | ⚠️ content task |
| 12.2 | Comparison `<table>` when content compares options | ⚠️ pairs with 9.5 |
| 12.3 | Conversational phrasing ("how to", "near me", "best") | ⚠️ content task |
| 12.4 | Direct 50-word answer below each question heading | ⚠️ content task — voice assistants read first ~40 words |
| 12.5 | Local variant: `<address>`, `<time>` hours, `tel:` | ⚠️ per local-business site |

### 13. Personalization Readiness

| # | Check | Coverage |
|---|---|---|
| 13.1 | GDPR/CCPA-compliant cookie consent | ❌ add per site if tracking |
| 13.2 | Recommendation `<aside>` blocks | ⚠️ per site |
| 13.3 | User account system (`/login/`, `/signup/`, `/account/`) | ❌ non-static variant |
| 13.4 | Behavioral tracking declared in privacy policy | ❌ per site |
| 13.5 | Content tagging / categorization exposed in URL + JSON-LD `keywords` | ⚠️ add `tags` field to content data |

### 14. Real-Time Data & Freshness Signals

| # | Check | Coverage |
|---|---|---|
| 14.1 | `ETag` + `Last-Modified` on HTML | ✅ Apache default when enabled |
| 14.2 | `dateModified` differs from `datePublished` on revision | ✅ article JSON-LD pattern |
| 14.3 | Visible "Last updated" `<time>` | ⚠️ article template pattern |
| 14.4 | Live data (inventory/pricing) exposed via OpenAPI | ❌ per site |
| 14.5 | WebSocket/SSE endpoint documented in OpenAPI | ❌ per site |
| 14.6 | Short cache on frequently-updated pages (`max-age` ≤ 3600 for pricing) | 🔧 `.htaccess` tuning |

---

## Industry variants

| Variant | Extra pages required | Extra JSON-LD required |
|---|---|---|
| **Services agency** (default) | `/services/`, `/insights/`, `/about/`, `/authors/` | `Organization` + `ProfessionalService` + `Service` + `OfferCatalog` |
| **Ecommerce** | `/products/`, `/cart/`, `/checkout/`, `/returns/`, `/shipping/` | `Product` w/ `sku`/`gtin13`/`mpn`/`brand`/`category`, `Offer` w/ `availability`, `AggregateRating` + `Review`. WebMCP commerce tools (`cart_add`, `order_create`) |
| **SaaS** | `/pricing/`, `/docs/`, `/api/`, `/changelog/`, `/status/`, `/login/`, `/signup/` | `SoftwareApplication`, `Offer` per plan, `FAQPage`, `HowTo` for onboarding |
| **Local business** | `/locations/`, optional per-location pages | `LocalBusiness` (+ `Restaurant`/`Store`/etc.) w/ `PostalAddress`, `telephone`, `openingHours`, `geo`, `sameAs` → Google Business Profile |
| **Publisher / media** | `/authors/`, `/categories/`, `/archive/` | `NewsArticle`, `Person` per author w/ `sameAs`, `NewsMediaOrganization` |
| **Docs / knowledge base** | `/docs/`, `/api/`, `/guides/` | `TechArticle`, `HowTo`, `APIReference`. Add `llms-docs.txt` for deep LLM context |

Pick one variant, apply its extras on top of the base framework. All variants inherit full 200-audit coverage.

---

## Coverage summary

| Category | Audits | ✅ | ⚠️ | 🔧 | 💠 | ❌ |
|---|---|---|---|---|---|---|
| Content Discoverability | 23 | 18 | 3 | 1 | 1 | 0 |
| AI Crawler Permissions | 26 | 24 | 1 | 1 | 0 | 0 |
| Structured Data | 19 | 12 | 0 | 0 | 4 | 3* (*commerce) |
| Meta Tags | 20 | 19 | 1 | 0 | 0 | 0 |
| Agent Tools | 25 | 22 | 1 | 0 | 0 | 2 |
| Semantic HTML | 17 | 2 | 15 | 0 | 0 | 0 |
| Accessibility | 23 | 13 | 3 | 6 | 0 | 1 |
| Technical Readiness | 21 | 13 | 4 | 4 | 0 | 0 |
| Answer Engine | 11 | 0 | 11 | 0 | 0 | 0 |
| Generative Engine | 15 | 8 | 7 | 0 | 0 | 0 |
| **Total** | **200** | **131** | **46** | **12** | **5** | **6** |

Counts are exact — each category row sums to its Audits value, and the tally
columns sum to 200. The framework carries 200 audits; the canonical
`audit-metadata.json` lists 199 (its `accessibility` category holds 22 to the
framework's 23 — the framework counts 7.1–7.23 explicitly). `❌` totals 6:
the three commerce-only structured-data rows (3.21–3.23), the two commerce/
account agent-tool rows (5.16, 5.25), and one accessibility row (7.9, modals).

Interpretation:
- **131 ✅** pass automatically once templates are copied and the build validator runs.
- **46 ⚠️** require content discipline — data files populated, semantic markup used, dates added, bylines written.
- **12 🔧** require hosting/CDN/WAF configuration (HTTPS, CSP, CDN, bot-detection allowlist, and the axe-core structural rows that depend on site-authored markup).
- **5 💠** apply per page archetype — activate when pricing / HowTo / testimonials / local-business pages exist, plus the commerce-links row.
- **6 ❌** out of scope for non-commerce sites — activate on stores (Product + GTIN/UPC/MPN + brand/category/availability + reviews + WebMCP commerce tools), search/account/live-data variants, and modal dialogs.

Target: running `npm run verify` after copying templates + populating content data → site scores 80%+ on audit. Filling the ⚠️ content-discipline items reliably pushes past 90%.
