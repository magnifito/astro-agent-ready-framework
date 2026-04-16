# Templates

Copy-paste starters. Replace placeholders, then build.

## Placeholder reference

| Token | Replace with |
|---|---|
| `$SITE_NAME` | Human brand name, e.g. `Acme` |
| `$SITE_PASCAL_NAME` | PascalCase name used in operationIds, e.g. `Acme` |
| `$SITE_PACKAGE_NAME` | npm package name, e.g. `acme.com` |
| `$SITE_URL` | Absolute origin, no trailing slash, e.g. `https://acme.com` |
| `$SITE_DOMAIN` | Bare domain, e.g. `acme.com` |
| `$SITE_EMAIL` | Public business email, e.g. `hello@acme.com` |
| `$SITE_TAGLINE` | Short tagline |
| `$SITE_SUMMARY` | 1–2 sentence summary (used as meta description baseline) |
| `$SITE_LONG_DESCRIPTION` | Paragraph-length positioning |
| `$SITE_SHORT_PURPOSE` | Filler for `ai-instructions` default |
| `$SITE_POSITIONING` | 1-sentence positioning |
| `$PAGE_HOME_DESC` | llms.txt homepage description |
| `$RSS_DESCRIPTION` | Feed description |
| `$FORM_ENDPOINT` | Absolute URL the contact form POSTs to (e.g. Web3Forms `https://api.web3forms.com/submit`) |
| `$FORM_SERVER_URL` | Form processor origin without path (e.g. `https://api.web3forms.com`) |
| `$UPDATED_ISO_DATE` | Today's date `YYYY-MM-DD` |
| `$EXPIRES_ISO` | security.txt Expires datetime, e.g. `2027-04-15T00:00:00Z` |
| `$AUDIENCE_1/2/3` | Target audience bullets |
| `$FAQ_N_QUESTION/ANSWER` | FAQ entries |
| `$SERVICE_A_TITLE/LONG_DESCRIPTION` | Service entries |

## Suggested replace workflow

A simple site-bootstrap script using `sed` (mac/BSD):

```bash
SITE_NAME="Acme"
SITE_URL="https://acme.com"
SITE_EMAIL="hello@acme.com"
# ... set the rest ...

cd new-site-root
rsync -a /path/to/aio-framework/templates/ ./
grep -rlZ '$SITE_URL' . | xargs -0 sed -i '' "s|\$SITE_URL|$SITE_URL|g"
grep -rlZ '$SITE_NAME' . | xargs -0 sed -i '' "s|\$SITE_NAME|$SITE_NAME|g"
# ... repeat for each placeholder ...
```

## What's in here

| Path | Purpose | Audit coverage |
|---|---|---|
| `astro.config.mjs` | `@astrojs/sitemap`, `markdownForAgents`, `astro-pagefind`, `astro-compressor` | 1.17, 1.7, 4.15, 3.4, 5.16, 8.14 |
| `package.json` | Scripts incl. `verify` + `verify:deployed` | framework enforcement |
| `public/_headers` | Netlify / Cloudflare Pages headers (alt to `.htaccess`) | 8.2–8.8 |
| `public/robots.txt` | Every AI bot explicitly allowed | 2.1–2.24 |
| `public/humans.txt` | Ownership/context | 8.21-adjacent |
| `public/.well-known/security.txt` | Security contact | 8.7 |
| `public/llms.txt` | H1 + blockquote + H2 sections + links | 1.1–1.5 |
| `public/llms-full.txt` | Full context | 1.6 |
| `public/ai-catalog.json` | Resources + actions | 5.7–5.9 |
| `public/brand.json` | Brand profile | GEO, 4.19 |
| `public/mcp.json` | MCP discovery | 5.12, 5.14, 5.20–5.24 |
| `public/navigation.json` | Nav + resources | 1.21 |
| `public/openapi.json` | Contact action | 5.1–5.6, 5.15 |
| `public/.htaccess` | Headers, CORS, cache, MIME | 2.23, 8.4–8.11 |
| `src/components/SeoHead.astro` | All head elements | 4.1–4.19 |
| `src/components/SiteHeader.astro` | Skip-link, `<header>`, labeled nav | 6.5, 7.1–7.4 |
| `src/components/SiteFooter.astro` | `<footer>`, labeled nav | 6.5 |
| `src/data/site.ts` | Centralized site config | helper |
| `src/data/authors.ts` | Author records w/ `jobTitle`, `sameAs[]`, `topics[]`, `credentials[]` | 3.15, 10.1, 10.2, 10.3 |
| `src/pages/authors/[slug].astro` | Per-author `ProfilePage` + `Person` JSON-LD + bio + `sameAs` links | 3.15, 10.3 |
| `src/pages/authors/index.astro` | Author index (`CollectionPage` + `ItemList`) | 3.5, 10.3 |
| `src/pages/sitemap.xml.ts` | Hard-coded `/sitemap.xml` | 1.7–1.10 |
| `src/pages/rss.xml.ts` | Full-content RSS | 1.11, 1.12, 4.16 |
| `src/pages/search.astro` | Static search page powered by pagefind | 5.16, 3.4 |
| `src/pages/og/[slug].png.ts` | Per-page OG image generator (astro-og-canvas) | 4.6, 4.9 |
| `scripts/validate-built-site.js` | Build-time regression test | enforcement |
| `scripts/validate-headless.js` | Post-deploy Playwright smoke — SSR ratio, JSON-LD types, SearchAction, data-action, canonical, CORS on AI files | 8.13, 3.1–3.4, 5.17, 4.3, 4.11, 4.18, 8.8 |
