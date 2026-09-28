# Astro implementation framework for Agent Lighthouse

Source of truth: [Agent Lighthouse](https://forkpoint.github.io/agent-lighthouse/), pinned to `4.2.2` in this repository. [checklist.md](checklist.md) derives every audit ID, category, tier, evidence grade, and weight from the published core package. Template files are implementation aids; their presence does not establish audit passes.

## Scoring and evidence

Use the engine's report. Do not calculate a separate readiness percentage from a manual checklist.

- Only eligible `scored` checks affect scores. Grade A carries weight 1.0; grade B carries 0.6. Grades C/D, advisory (`informative`), and experimental checks carry zero weight.
- Pass contributes 1, warning 0.5, and failure 0. Exclude not-applicable and unassessed results; keep their reasons.
- Category scores use the weighted assessed results. The overall score uses each category's assessed evidence mass. There are no fixed category percentages.
- Read scan validity, access, page coverage, and budget limits before comparing scores. Preserve a null/unscored result; never replace it with zero or a guessed score.
- Experimental checks require explicit opt-in and never affect the score.
- A local build check is a regression gate for the site's own contract. It cannot prove network behavior or produce a Lighthouse verdict.

See the [upstream scoring guide](https://forkpoint.github.io/agent-lighthouse/docs/scoring/) for details. Report the engine version, target URL, scan options, assessed pages, skipped checks, and evidence with each result. Scan each relevant page archetype; one URL does not establish whole-site coverage.

## access-crawl-control

Control access according to the site owner's intended crawler policy.

- Inspect `robots.txt`, robots meta tags, response headers, and live bot/WAF behavior.
- Keep key pages indexable and internal links followable when intended.
- `templates/public/robots.txt` supplies explicit AI bot rules. Review them before use; training and search access are separate business choices.
- Some per-bot checks warn when only a wildcard rule allows access. Preserve the engine's verdict and tier; do not impose a manual category penalty.
- Test deployment redirects and canonical URLs. An Apache rule does not establish CDN behavior.

## content-extraction

Make the primary content readable from HTML and usable through semantic controls.

- Use `BaseLayout.astro`, `SiteHeader.astro`, and `SiteFooter.astro` for landmarks and navigation.
- Use headings, paragraphs, lists, tables, and links for their actual purpose.
- Give images useful alt text and form controls visible labels. Keep keyboard access and accessible names.
- Emit primary content at build time. Check the rendered page and source when client code changes it.
- Run the browser smoke checks. Fix local accessibility defects based on their evidence.

## machine-discovery

Publish accurate discovery resources that fit the site.

- Generate a sitemap with canonical, reachable URLs. Use real modification dates; omit unknown dates.
- Publish RSS when the site has article content. Keep links and feeds consistent with actual pages.
- Keep canonical links and optional Markdown alternates correct.
- `llms.txt` is an optional, advisory convention. Absence without a discovery link is not a defect under the pinned rule. A declared but missing file can produce an advisory warning.
- The starter also includes `llms-full.txt`, `navigation.json`, and custom catalogs. Treat them as site conventions. Verify declared links if you keep them.

## structured-data

Describe real entities and visible page content.

- Use `templates/src/lib/schema.ts` to compose JSON-LD graphs with stable absolute IDs.
- Use Organization/WebSite/WebPage for matching site entities, Article/Person for real articles and authors, and Service for real services.
- Use Product, Offer, Review, LocalBusiness, FAQPage, or HowTo only when the content and page type justify them.
- Never invent reviews, credentials, dates, prices, or supporting facts to satisfy a check.
- Structured data for an action must describe a working action. A SearchAction declaration alone does not establish a usable search service.
- Preserve page-type applicability and the engine's evidence requirements in the report.

## answer-readiness

Write content that answers the reader's task and supports its claims.

- Put a direct answer near the relevant heading.
- Use definitions, clear units, ordered steps, and comparison tables when the content needs them.
- Cite real sources. Use accurate author information and content dates.
- Use `templates/src/data/insights.ts` and article/author templates as patterns, not invented proof.
- Evaluate the report's scored and advisory findings separately. Content patterns do not guarantee AI citations.

## agent-interfaces

Expose real, documented actions where the site provides them.

- Keep forms usable and test their real submission path, required inputs, error handling, and confirmation.
- Publish `openapi.json` only for an interface that exists and matches the document.
- `data-action` attributes and custom JSON files can describe intent. They do not implement a protocol or prove execution.
- The starter's `mcp.json` and `.well-known/mcp.json` are legacy static descriptions. They are not MCP servers or proof of MCP discovery. Remove them and their links/validator expectations when the site does not use them.
- Current MCP checks can inspect `/.well-known/mcp/servers.json`, `/.well-known/ucp`, endpoint reachability, and authentication discovery. Publish only supported, real endpoints; static JSON alone cannot satisfy those behaviors.
- WebMCP requires an actual browser interface and a supported execution environment. The starter supplies no live WebMCP implementation.
- The legacy `.well-known/ai-plugin.json` example does not establish current ChatGPT integration.

## agentic-commerce

Apply commerce checks only where the site offers products or transactions.

- Use real product identifiers, availability, prices, currency, shipping, and returns information.
- Keep visible content, structured data, and backend behavior consistent.
- Verify cart, checkout, authentication, and payment behavior on the site's actual service.
- The service-site starter does not implement a commerce backend. Mark unsupported or unassessed work explicitly; do not add fake store data to increase a score.

## operability-safety

Verify production behavior and action safeguards.

- Deploy HTTPS, appropriate headers, content types, and cache policies for the actual host.
- Use `.htaccess` for Apache or `_headers` for hosts that support it. Review CSP/HSTS and cross-origin requirements for the site's integrations.
- Publish accurate contact and security information. Keep privacy and terms text specific to the business.
- Require consent for side effects where appropriate. Document authentication, retries, and idempotency only when the service implements them.
- A static manifest cannot establish these properties. Test the service and inspect the deployed response.

## Validation workflow

1. Build the site and run its local contract: `npm run verify`.
2. Run browser checks on the deployed URL: `npm run verify:deployed`.
3. Run `npm run audit:agent -- https://your-domain.com --output terminal,html,json --output-dir reports/baseline`.
4. Read validity and coverage before the score. Keep original HTML/JSON reports and exact audit IDs.
5. Fix access blockers, then relevant scored failures. Review advisory items according to site needs.
6. Repeat with the same engine version, URL, and options in a new report directory.

Use `--page-type` only when you can establish the page type. Use `--experimental` only when experimental results are needed. Set a `--min-score` threshold after a valid baseline; there is no universal 80% promise.

The starter's optional GitHub Actions audit runs by manual dispatch with an explicit URL. It uploads reports even when the scan fails. A deployed URL scan describes that deployment; it does not establish that a pull request's changes reached the target.

## Adapting the starter

The starter is a service-site example with articles, authors, search, and optional discovery files. Its local validator intentionally checks that complete example. For a smaller site, remove unused pages/resources, their advertised links, and matching local expectations together. Do not copy the whole validator into an unrelated site and report its template-specific failures as Lighthouse failures.

Older numeric audit references in implementation recipes and template comments are historical cross-references. Use the pinned package's `migration-map.json` to resolve them. Use [checklist.md](checklist.md) for current slugs and rules.
