---
name: aio-framework
description: Make any Astro static site AI-ready (AIO/AEO/GEO) using the magnifito AIO framework — scaffold a new AI-optimized site from templates, retrofit an existing Astro site, or audit any built site/URL against the framework's 200-audit checklist. Use this whenever the user mentions AI-readiness, AIO, AEO, GEO, llms.txt, AI crawlers/bots (GPTBot, ClaudeBot, PerplexityBot), agent-ready or agent-friendly sites, structured data / JSON-LD coverage, "SEO for AI", getting cited by ChatGPT/Claude/Perplexity, or wants a new Astro site that AI agents can discover and act on — even if they don't name the framework.
---

# AIO Framework

Framework for making Astro static sites discoverable, quotable, and actionable by AI agents. Source of truth is the repo — clone it fresh at the start of every task so templates and docs are current:

```bash
git clone --depth 1 https://github.com/magnifito/astro-agent-ready-framework.git /tmp/aio-framework
```

Key repo files (read on demand, not all upfront):
- `framework.md` — the 10 scored categories + 4 extensions, per-category requirements and Astro wiring. Read the categories relevant to your task.
- `checklist.md` — all 200 audits with coverage status. Use for audits and gap analysis.
- `templates/` — copy-paste Astro starter (components, layouts, pages, public files, validators). `templates/README.md` documents every `$TOKEN` placeholder and which file covers which audit.
- `structured-data-patterns.md` — JSON-LD graphs per page archetype; shipped as typed builders in `templates/src/lib/schema.ts`.

Category weights (drive priority in every workflow): Agent surfaces 18% > Content discoverability 15% > Structured data 12% > Technical/security 9% > Crawler permissions, Meta tags, Semantic HTML, GEO 8% each > AEO, Accessibility 7% each.

## Pick the workflow

- **Scaffold** — user starts a new site → copy templates, replace tokens, fill content.
- **Retrofit** — user has an existing Astro site → gap analysis, then graft framework pieces in weight order.
- **Audit** — user has a built site (dist/ or live URL) → run validators + checklist walk, deliver scored report.

## Scaffold a new site

1. Collect from the user (or infer from context): site name, production origin URL, business email, tagline, 1–2 sentence summary, form endpoint (Web3Forms etc. — if none, use a placeholder endpoint and flag it). Don't block on optional values; derive sensible ones.
2. Copy `templates/` into the project root (`rsync -a /tmp/aio-framework/templates/ ./`).
3. Non-interactive token replacement: write a `site.config.json` with the collected values, then `node scripts/init.mjs`. It replaces core `$TOKEN`s, generates the IndexNow key file, and prints remaining content tokens as a TODO list.
4. Fill every remaining content token (`$FAQ_*`, `$SERVICE_*`, `$INSIGHT_*`, `$AUTHOR_*`, `$PRIVACY_*`, `$TERMS_*`, `$CITATION_*`…) with real content written from the user's business context. This is deliberate: the build validator fails on ANY leftover `$TOKEN` — placeholder copy shipping to production is worse than no page. Write real FAQ answers, real service descriptions; ask the user only when you can't infer.
5. Verify: `npm install && npm run verify` (build + `validate-built-site.js`). Fix every failure — the validator is the contract. If the environment can't install/build, say so explicitly and list what remains unverified.
6. Deployment headers: keep `public/.htaccess` for Apache or `public/_headers` for Netlify/Cloudflare Pages; delete the other. Remind the user HSTS/CSP are commented opt-ins.

## Retrofit an existing Astro site

Never bulk-overwrite a working site. Graft incrementally, verifying the site still builds after each stage.

1. **Gap analysis** — check the site for: `public/llms.txt`, `robots.txt` AI-bot allows, sitemap + RSS, JSON-LD on key pages, canonical/meta head coverage, `data-action` attributes, OpenAPI/MCP/agents manifests, semantic landmarks, validators. Map findings to `checklist.md` categories; report the gaps with weights before changing anything.
2. **Graft in weight order**, adapting to what exists:
   - Category 5 (18%): copy `public/openapi.json`, `mcp.json`, `.well-known/*`, `ai-catalog.json`, `agents.json`, `navigation.json`; point the OpenAPI at the site's real form endpoint; add `data-action`/`data-action-type`/`data-action-label` to existing CTAs.
   - Category 1 (15%): `llms.txt` + `llms-full.txt` written from the site's actual pages; add `@astrojs/sitemap` + `@puralex/astro-markdown-for-agents` integrations; RSS if there's article content.
   - Category 3 (12%): copy `src/lib/schema.ts`, add `@graph` JSON-LD per page archetype (see `structured-data-patterns.md` for the archetype table).
   - Category 4/2: merge the template's head elements into the site's existing head component (don't replace it wholesale unless it's trivial); merge `robots.txt` bot allows into the existing file.
   - Remaining categories per `framework.md` as budget allows.
3. **Wire enforcement**: copy `scripts/validate-built-site.js` (+ `validate-headless.js`), add the `verify` script to package.json, trim the validator's `requiredFiles`/`requiredText` to match this site's real pages, then run it to green.
4. Respect the site's conventions — its formatter, its component patterns, its content source (MDX/CMS). The framework is content-source-agnostic by design.

## Audit a site

1. Built output available: run `node /tmp/aio-framework/templates/scripts/validate-built-site.js` from the site root (needs `dist/`). Note: its `SITE_URL` const and required-file list assume the template site — read failures with judgment, distinguishing "missing AI artifact" from "template-specific expectation".
2. Live URL: `node /tmp/aio-framework/templates/scripts/validate-headless.js <url>` (needs `playwright`; `@axe-core/playwright` optional for full a11y parity). Also fetch `/llms.txt`, `/robots.txt`, `/openapi.json`, `/mcp.json` directly and check CORS headers.
3. Manual walk: for each of the 10 categories in `framework.md`, sample the relevant pages/files and score what's present vs required. `checklist.md` is the per-audit reference. Category 2 doctrine: a permissive `User-agent: * / Allow: /` robots.txt is NOT full credit — the audit warns when AI bots (GPTBot, ClaudeBot, PerplexityBot, …) are not explicitly named with their own `Allow: /` records. Explicit allows are a positive welcome signal; absence of blocking is merely neutral. Flag it as a gap and dock the category.
4. Deliver the report in this shape:

```markdown
# AI-Readiness Audit — <site>
**Overall: <n>% weighted**

| Category | Weight | Score | Key gaps |
|---|---|---|---|
| 5. Agent surfaces | 18% | … | … |
| 1. Content discoverability | 15% | … | … |
| … all 10 rows, weight order …

## Top fixes by impact
1. <fix> — category, weight, effort, exact artifact to add
2. …
```

Score each category as the fraction of its applicable audits passing; weight-sum for the overall. Mark inapplicable audits (commerce on a non-store) as excluded, not failed.

## Gotchas that cost real points

- `trailingSlash: "always"` + `build.format: "directory"` — mismatched URLs create redirect chains (audit 1.x) and break canonical/markdown-alternate links.
- JSON-LD must go through `JSON.stringify` (`set:html`) — hand-written blocks with unescaped chars fail parsing and zero out category 3.
- `lastmod` only from real content dates. Never stamp build time — crawlers learn to distrust it.
- COOP/COEP/CORP headers are commented out in the templates on purpose: `require-corp` silently breaks cross-origin images/fonts.
- `speakable` cssSelectors must match elements that exist on the page.
- The placeholder scan in the validator is the final gate: any `$TOKEN` in dist fails the build, including content tokens init.mjs tolerates.
- Forms must work without JS and without CAPTCHA (honeypot instead) — CAPTCHA blocks the agents category 5 is courting.
