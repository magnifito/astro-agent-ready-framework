# Agent Lighthouse checklist

Generated from `@forkpoint/agent-lighthouse-core@4.2.2` by `npm run checklist:generate`. Do not edit the rows by hand.

215 registered checks across 8 categories: 164 scored, 48 informative (advisory), and 3 experimental. Experimental checks require opt-in and have zero scoring weight.

This is an audit inventory, not a claim that the starter passes these checks. Every site's results remain **unverified** until a scan supplies evidence. Template presence and local build validation do not establish a Lighthouse pass.

Use the linked audit rules to assess applicability, evidence requirements, and fixes. Record the report's status, page URL, tier, evidence, and remaining work for each relevant finding. Preserve not-assessed and not-applicable reasons. See [framework.md](framework.md) for scoring and validation boundaries.

Numeric references such as `1.1` in older template comments and implementation tables are legacy identifiers. Resolve them through the versioned `@forkpoint/agent-lighthouse-core/migration-map.json`; do not use them as current audit IDs.

## access-crawl-control

37 registered checks. See the [implementation guidance](framework.md#access-crawl-control).

| Audit ID | Check | Tier | Evidence grade | Weight |
|---|---|---|---|---|
| [access-crawl-control/no-nofollow](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/no-nofollow/) | No nofollow on important links | scored | A | 1 |
| [access-crawl-control/no-redirect-chains](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/no-redirect-chains/) | No redirect chains | scored | A | 1 |
| [access-crawl-control/canonical](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/canonical/) | Canonical URLs point at the right page | scored | A | 1 |
| [access-crawl-control/gptbot](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/gptbot/) | GPTBot allowed | scored | A | 1 |
| [access-crawl-control/google-extended](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/google-extended/) | Google-Extended allowed | scored | A | 1 |
| [access-crawl-control/anthropic-ai](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/anthropic-ai/) | ClaudeBot crawl access | scored | A | 1 |
| [access-crawl-control/perplexitybot](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/perplexitybot/) | PerplexityBot allowed | scored | A | 1 |
| [access-crawl-control/applebot-extended](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/applebot-extended/) | Applebot-Extended allowed | scored | A | 1 |
| [access-crawl-control/ccbot](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/ccbot/) | CCBot allowed | scored | A | 1 |
| [access-crawl-control/meta-external-agent](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/meta-external-agent/) | Meta-ExternalAgent allowed | scored | A | 1 |
| [access-crawl-control/amazonbot](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/amazonbot/) | Amazonbot allowed | scored | A | 1 |
| [access-crawl-control/ai-bot-directives](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/ai-bot-directives/) | AI bot directives are explicit | scored | B | 0.6 |
| [access-crawl-control/chatgpt-user](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/chatgpt-user/) | ChatGPT-User allowed | informative | C | 0 |
| [access-crawl-control/claude-user](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/claude-user/) | Claude-User allowed | scored | A | 1 |
| [access-crawl-control/oai-searchbot](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/oai-searchbot/) | OAI-SearchBot allowed | scored | A | 1 |
| [access-crawl-control/meta-external-fetcher](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/meta-external-fetcher/) | Meta-ExternalFetcher allowed | scored | A | 1 |
| [access-crawl-control/bravebot](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/bravebot/) | Bravebot allowed | informative | C | 0 |
| [access-crawl-control/duckassistbot](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/duckassistbot/) | DuckAssistBot allowed | scored | A | 1 |
| [access-crawl-control/mistralai-user](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/mistralai-user/) | MistralAI-User allowed | scored | A | 1 |
| [access-crawl-control/claude-searchbot](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/claude-searchbot/) | Claude-SearchBot allowed | scored | A | 1 |
| [access-crawl-control/no-blanket-block](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/no-blanket-block/) | No blanket AI block | scored | B | 0.6 |
| [access-crawl-control/sensitive-paths](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/sensitive-paths/) | Low-value URLs excluded from AI crawls | scored | A | 1 |
| [access-crawl-control/crawl-delay](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/crawl-delay/) | Crawl-delay is reasonable | informative | C | 0 |
| [access-crawl-control/robots-directives](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/robots-directives/) | Robots directives do not block AI indexing | scored | A | 1 |
| [access-crawl-control/no-bot-detection](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/no-bot-detection/) | No aggressive bot-detection blocking agents | scored | A | 1 |
| [access-crawl-control/tdm-rep](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/tdm-rep/) | TDM-Rep declaration | experimental | C | 0 |
| [access-crawl-control/agent-governance](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/agent-governance/) | AI crawler vs conversational agent separation | scored | A | 1 |
| [access-crawl-control/ai-content-declaration](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/ai-content-declaration/) | AI usage-preference declaration | experimental | D | 0 |
| [access-crawl-control/https-enabled](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/https-enabled/) | HTTPS enabled | scored | A | 1 |
| [access-crawl-control/robots-ai-group-shadowing](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/robots-ai-group-shadowing/) | robots.txt AI group shadowing | scored | A | 1 |
| [access-crawl-control/ai-crawler-edge-parity](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/ai-crawler-edge-parity/) | AI crawlers get the same response from the edge that browsers get | scored | A | 1 |
| [access-crawl-control/bot-content-delta-declared](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/bot-content-delta-declared/) | Content served to AI crawlers matches the browser, or is declared | scored | A | 1 |
| [access-crawl-control/ai-usage-signal-coherence-across-channels](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/ai-usage-signal-coherence-across-channels/) | AI usage signals agree across every channel that carries them | scored | B | 0.6 |
| [access-crawl-control/aipref-content-usage-declaration-validity](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/aipref-content-usage-declaration-validity/) | AIPREF Content-Usage declarations are valid and can be read | scored | B | 0.6 |
| [access-crawl-control/rsl-licensing-terms-conformance](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/rsl-licensing-terms-conformance/) | RSL licensing terms are discoverable and conformant | scored | B | 0.6 |
| [access-crawl-control/machine-actionable-402-paid-access](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/machine-actionable-402-paid-access/) | A 402 tells a crawler how to pay | scored | B | 0.6 |
| [access-crawl-control/web-bot-auth-request-tolerance](https://forkpoint.github.io/agent-lighthouse/audits/access-crawl-control/web-bot-auth-request-tolerance/) | A signed agent request is not rejected for being signed | scored | B | 0.6 |

## content-extraction

27 registered checks. See the [implementation guidance](framework.md#content-extraction).

| Audit ID | Check | Tier | Evidence grade | Weight |
|---|---|---|---|---|
| [content-extraction/server-responsiveness](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/server-responsiveness/) | Server responsiveness | scored | B | 0.6 |
| [content-extraction/language-attribute](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/language-attribute/) | Language attribute | scored | A | 1 |
| [content-extraction/markdown-alternate](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/markdown-alternate/) | Markdown alternate: resolvable, faithful, cheaper | scored | A | 1 |
| [content-extraction/single-h1](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/single-h1/) | Single h1 per page | scored | B | 0.6 |
| [content-extraction/sequential-headings](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/sequential-headings/) | Sequential heading hierarchy | scored | B | 0.6 |
| [content-extraction/main-element](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/main-element/) | <main> element present | scored | A | 1 |
| [content-extraction/article-element](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/article-element/) | <article> used for content | scored | A | 1 |
| [content-extraction/header-footer](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/header-footer/) | <header> and <footer> landmarks | scored | A | 1 |
| [content-extraction/aside-element](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/aside-element/) | <aside> for supplementary content | scored | B | 0.6 |
| [content-extraction/section-headings](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/section-headings/) | <section> elements have headings or labels | scored | B | 0.6 |
| [content-extraction/semantic-lists](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/semantic-lists/) | Semantic list usage | scored | B | 0.6 |
| [content-extraction/data-tables](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/data-tables/) | Data tables properly structured | scored | B | 0.6 |
| [content-extraction/code-language](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/code-language/) | Code blocks have language annotations | informative | C | 0 |
| [content-extraction/time-element](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/time-element/) | <time datetime=""> used for dates | informative | C | 0 |
| [content-extraction/content-depth](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/content-depth/) | Sufficient content depth | scored | B | 0.6 |
| [content-extraction/image-alt-text](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/image-alt-text/) | Image text-alternative coverage | scored | A | 1 |
| [content-extraction/figure-figcaption](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/figure-figcaption/) | <figure> + <figcaption> usage | informative | C | 0 |
| [content-extraction/svg-bloat](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/svg-bloat/) | SVGs not bloating agent context | scored | B | 0.6 |
| [content-extraction/token-ratio](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/token-ratio/) | Lean token-to-content ratio | scored | B | 0.6 |
| [content-extraction/fake-headings](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/fake-headings/) | No fake headings | scored | B | 0.6 |
| [content-extraction/server-rendered](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/server-rendered/) | Server-rendered content | scored | B | 0.6 |
| [content-extraction/css-hidden-ghost-content](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/css-hidden-ghost-content/) | Ghost content: CSS-hidden text ingested as visible | scored | A | 1 |
| [content-extraction/hydration-payload-share](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/hydration-payload-share/) | Inlined hydration-state payload share | scored | A | 1 |
| [content-extraction/preamble-tax](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/preamble-tax/) | Preamble tax: tokens before the first content token | scored | B | 0.6 |
| [content-extraction/boilerplate-tax](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/boilerplate-tax/) | Boilerplate tax across the crawl (unique tokens per fetch) | scored | B | 0.6 |
| [content-extraction/extraction-determinism](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/extraction-determinism/) | Extraction determinism (multi-extractor agreement) | scored | B | 0.6 |
| [content-extraction/json-ld-duplication-mass](https://forkpoint.github.io/agent-lighthouse/audits/content-extraction/json-ld-duplication-mass/) | JSON-LD duplication mass | informative | C | 0 |

## machine-discovery

24 registered checks. See the [implementation guidance](framework.md#machine-discovery).

| Audit ID | Check | Tier | Evidence grade | Weight |
|---|---|---|---|---|
| [machine-discovery/llms-txt-exists](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/llms-txt-exists/) | llms.txt exists | informative | C | 0 |
| [machine-discovery/llms-txt-structure](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/llms-txt-structure/) | llms.txt is well-formed | informative | C | 0 |
| [machine-discovery/llms-txt-link-descriptions](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/llms-txt-link-descriptions/) | llms.txt links include descriptions | informative | C | 0 |
| [machine-discovery/llms-txt-links-valid](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/llms-txt-links-valid/) | llms.txt links are valid | informative | C | 0 |
| [machine-discovery/llms-full-txt](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/llms-full-txt/) | llms-full.txt present | informative | C | 0 |
| [machine-discovery/sitemap-exists](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/sitemap-exists/) | sitemap.xml exists | scored | A | 1 |
| [machine-discovery/discovery-index-coverage](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/discovery-index-coverage/) | Pages are covered by a discovery index | scored | B | 0.6 |
| [machine-discovery/sitemap-absolute-urls](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/sitemap-absolute-urls/) | Sitemap uses absolute URLs | scored | B | 0.6 |
| [machine-discovery/sitemap-lastmod](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/sitemap-lastmod/) | Sitemap has lastmod dates | scored | A | 1 |
| [machine-discovery/rss-feed](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/rss-feed/) | RSS/Atom feed link present | scored | B | 0.6 |
| [machine-discovery/rss-feed-content](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/rss-feed-content/) | RSS feed content complete | informative | C | 0 |
| [machine-discovery/in-content-links](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/in-content-links/) | In-content internal links | scored | A | 1 |
| [machine-discovery/no-broken-links](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/no-broken-links/) | No broken internal links | scored | A | 1 |
| [machine-discovery/cors-ai-files](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/cors-ai-files/) | CORS on AI files | informative | C | 0 |
| [machine-discovery/ai-file-delivery](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/ai-file-delivery/) | AI files are delivered correctly | informative | B | 0 |
| [machine-discovery/no-broken-ai-endpoints](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/no-broken-ai-endpoints/) | No broken AI endpoints | scored | A | 1 |
| [machine-discovery/ai-crawler-surface-reachability](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/ai-crawler-surface-reachability/) | AI crawlers can reach the discovery surfaces the site advertises | scored | A | 1 |
| [machine-discovery/sitemap-lastmod-verifiability](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/sitemap-lastmod-verifiability/) | Sitemap lastmod values are verifiable against the pages | scored | A | 1 |
| [machine-discovery/agent-commerce-feed-parity](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/agent-commerce-feed-parity/) | Product pages carry the fields an agent-commerce feed needs | scored | A | 1 |
| [machine-discovery/conditional-request-support](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/conditional-request-support/) | Discovery surfaces answer conditional requests | scored | B | 0.6 |
| [machine-discovery/feed-entry-identity-and-canonical-integrity](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/feed-entry-identity-and-canonical-integrity/) | Feed entries have stable identities that resolve to their canonical pages | scored | B | 0.6 |
| [machine-discovery/root-text-file-resolution-integrity](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/root-text-file-resolution-integrity/) | The origin serves and correctly 404s root-level .txt resources | scored | B | 0.6 |
| [machine-discovery/three-way-freshness-lag](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/three-way-freshness-lag/) | The sitemap and the feed are as fresh as the site itself | scored | B | 0.6 |
| [machine-discovery/websub-hub-advertisement](https://forkpoint.github.io/agent-lighthouse/audits/machine-discovery/websub-hub-advertisement/) | Feeds advertise a WebSub hub and exactly one canonical self link | informative | C | 0 |

## structured-data

14 registered checks. See the [implementation guidance](framework.md#structured-data).

| Audit ID | Check | Tier | Evidence grade | Weight |
|---|---|---|---|---|
| [structured-data/json-ld-present](https://forkpoint.github.io/agent-lighthouse/audits/structured-data/json-ld-present/) | JSON-LD present | scored | A | 1 |
| [structured-data/schema-validation](https://forkpoint.github.io/agent-lighthouse/audits/structured-data/schema-validation/) | Schema validation | scored | A | 1 |
| [structured-data/organization-schema](https://forkpoint.github.io/agent-lighthouse/audits/structured-data/organization-schema/) | Organization schema | scored | A | 1 |
| [structured-data/breadcrumb-schema](https://forkpoint.github.io/agent-lighthouse/audits/structured-data/breadcrumb-schema/) | BreadcrumbList schema | scored | A | 1 |
| [structured-data/article-schema](https://forkpoint.github.io/agent-lighthouse/audits/structured-data/article-schema/) | Article schema | scored | A | 1 |
| [structured-data/faqpage-schema](https://forkpoint.github.io/agent-lighthouse/audits/structured-data/faqpage-schema/) | FAQPage schema | informative | C | 0 |
| [structured-data/service-schema](https://forkpoint.github.io/agent-lighthouse/audits/structured-data/service-schema/) | Service schema | scored | A | 1 |
| [structured-data/speakable-schema](https://forkpoint.github.io/agent-lighthouse/audits/structured-data/speakable-schema/) | Speakable schema | scored | B | 0.6 |
| [structured-data/howto-schema](https://forkpoint.github.io/agent-lighthouse/audits/structured-data/howto-schema/) | HowTo schema | informative | C | 0 |
| [structured-data/local-business-schema](https://forkpoint.github.io/agent-lighthouse/audits/structured-data/local-business-schema/) | LocalBusiness/ProfessionalService schema | scored | A | 1 |
| [structured-data/review-schema](https://forkpoint.github.io/agent-lighthouse/audits/structured-data/review-schema/) | Review/AggregateRating schema | scored | A | 1 |
| [structured-data/author-schema](https://forkpoint.github.io/agent-lighthouse/audits/structured-data/author-schema/) | Author schema with credentials | informative | C | 0 |
| [structured-data/advanced-product-details](https://forkpoint.github.io/agent-lighthouse/audits/structured-data/advanced-product-details/) | Advanced product details | scored | A | 1 |
| [structured-data/claimreview-advisory](https://forkpoint.github.io/agent-lighthouse/audits/structured-data/claimreview-advisory/) | ClaimReview investment advisory | informative | A | 0 |

## answer-readiness

33 registered checks. See the [implementation guidance](framework.md#answer-readiness).

| Audit ID | Check | Tier | Evidence grade | Weight |
|---|---|---|---|---|
| [answer-readiness/meta-description](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/meta-description/) | Meta description quality | scored | B | 0.6 |
| [answer-readiness/meta-author](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/meta-author/) | Meta author present | informative | C | 0 |
| [answer-readiness/unique-meta](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/unique-meta/) | Unique meta per page | informative | C | 0 |
| [answer-readiness/core-open-graph](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/core-open-graph/) | Core Open Graph tags | scored | A | 1 |
| [answer-readiness/og-type](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/og-type/) | og:type set and appropriate | scored | B | 0.6 |
| [answer-readiness/og-image-alt](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/og-image-alt/) | og:image:alt present | informative | C | 0 |
| [answer-readiness/faq-sections](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/faq-sections/) | FAQ sections present | informative | C | 0 |
| [answer-readiness/question-headings](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/question-headings/) | Question-formatted headings | informative | C | 0 |
| [answer-readiness/first-paragraph-answers](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/first-paragraph-answers/) | First paragraph answers primary question | informative | C | 0 |
| [answer-readiness/direct-definitions](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/direct-definitions/) | Definition markup on definitional pages | informative | C | 0 |
| [answer-readiness/comparison-tables](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/comparison-tables/) | Comparison tables present | informative | C | 0 |
| [answer-readiness/specific-numbers](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/specific-numbers/) | Specific numbers and data points | scored | B | 0.6 |
| [answer-readiness/dates-on-content](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/dates-on-content/) | Dates on content pages | scored | A | 1 |
| [answer-readiness/content-without-clickthrough](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/content-without-clickthrough/) | Content answers without click-through | scored | B | 0.6 |
| [answer-readiness/named-author](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/named-author/) | Named author attribution | informative | C | 0 |
| [answer-readiness/author-same-as](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/author-same-as/) | Author schema with sameAs | informative | C | 0 |
| [answer-readiness/author-page](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/author-page/) | Author page exists | informative | C | 0 |
| [answer-readiness/about-credentials](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/about-credentials/) | About page with credentials | informative | C | 0 |
| [answer-readiness/external-citations](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/external-citations/) | External citations | scored | B | 0.6 |
| [answer-readiness/brand-name](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/brand-name/) | Brand name in body text | informative | C | 0 |
| [answer-readiness/trust-signals](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/trust-signals/) | Trust and evidence signals on homepage | scored | B | 0.6 |
| [answer-readiness/review-signals](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/review-signals/) | Review/testimonial signals | scored | B | 0.6 |
| [answer-readiness/publication-date](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/publication-date/) | Publication date visible | scored | B | 0.6 |
| [answer-readiness/last-modified-schema](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/last-modified-schema/) | Last modified date in schema | scored | B | 0.6 |
| [answer-readiness/unique-data](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/unique-data/) | Unique data or statistics | scored | B | 0.6 |
| [answer-readiness/descriptive-urls](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/descriptive-urls/) | Descriptive URL slugs | informative | C | 0 |
| [answer-readiness/snippet-gate-coverage](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/snippet-gate-coverage/) | Snippet-gate coverage analysis | scored | A | 1 |
| [answer-readiness/text-fragment-addressability](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/text-fragment-addressability/) | Text-fragment citation addressability | scored | A | 1 |
| [answer-readiness/chunk-boundary-referent-integrity](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/chunk-boundary-referent-integrity/) | Chunk-boundary referent integrity | scored | B | 0.6 |
| [answer-readiness/extractor-survival-recall](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/extractor-survival-recall/) | Extractor survival recall | scored | B | 0.6 |
| [answer-readiness/section-split-risk-profile](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/section-split-risk-profile/) | Section split-risk profile | scored | B | 0.6 |
| [answer-readiness/site-wide-passage-uniqueness-ratio](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/site-wide-passage-uniqueness-ratio/) | Site-wide passage uniqueness ratio | scored | B | 0.6 |
| [answer-readiness/table-markdown-round-trip-loss](https://forkpoint.github.io/agent-lighthouse/audits/answer-readiness/table-markdown-round-trip-loss/) | Tables survive conversion to markdown | scored | B | 0.6 |

## agent-interfaces

24 registered checks. See the [implementation guidance](framework.md#agent-interfaces).

| Audit ID | Check | Tier | Evidence grade | Weight |
|---|---|---|---|---|
| [agent-interfaces/openapi-exists](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/openapi-exists/) | API description discoverable | informative | B | 0 |
| [agent-interfaces/openapi-endpoints](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/openapi-endpoints/) | OpenAPI has endpoints | scored | B | 0.6 |
| [agent-interfaces/openapi-operation-ids](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/openapi-operation-ids/) | OpenAPI has operationIds | scored | B | 0.6 |
| [agent-interfaces/openapi-servers](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/openapi-servers/) | OpenAPI servers array valid | scored | B | 0.6 |
| [agent-interfaces/openapi-schemas](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/openapi-schemas/) | OpenAPI request/response schemas | scored | B | 0.6 |
| [agent-interfaces/ai-catalog-exists](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/ai-catalog-exists/) | AI Catalog exists | informative | C | 0 |
| [agent-interfaces/ai-catalog-metadata](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/ai-catalog-metadata/) | AI Catalog complete metadata | scored | B | 0.6 |
| [agent-interfaces/ai-catalog-urls](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/ai-catalog-urls/) | AI Catalog entry URLs valid | scored | B | 0.6 |
| [agent-interfaces/agents-json](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/agents-json/) | agents.json at /.well-known/agents.json | informative | C | 0 |
| [agent-interfaces/mcp-discovery](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/mcp-discovery/) | MCP server discovery file | informative | C | 0 |
| [agent-interfaces/mcp-endpoint](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/mcp-endpoint/) | MCP endpoint functional | informative | C | 0 |
| [agent-interfaces/search-endpoint](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/search-endpoint/) | Site search reachable by agents | informative | C | 0 |
| [agent-interfaces/webmcp-registered-tools](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/webmcp-registered-tools/) | WebMCP registered tools | experimental | B | 0 |
| [agent-interfaces/webmcp-declarative-forms](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/webmcp-declarative-forms/) | WebMCP declarative form tools | scored | B | 0.6 |
| [agent-interfaces/openapi-description-quality](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/openapi-description-quality/) | OpenAPI description quality for tool-calling | scored | A | 1 |
| [agent-interfaces/cors-api-routes](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/cors-api-routes/) | CORS on declared API routes | informative | C | 0 |
| [agent-interfaces/mcp-modern-era-reachability](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/mcp-modern-era-reachability/) | Modern-Era Reachability Probe (server/discover) | scored | A | 1 |
| [agent-interfaces/mcp-oauth-discovery-chain](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/mcp-oauth-discovery-chain/) | OAuth Discovery Chain Integrity (RFC 9728 → RFC 8414) | scored | A | 1 |
| [agent-interfaces/mcp-tool-contract-validity](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/mcp-tool-contract-validity/) | Tool Contract Validity and Silent-Drop Risk | scored | A | 1 |
| [agent-interfaces/mcp-tools-list-determinism](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/mcp-tools-list-determinism/) | tools/list Determinism and Cache-Hint Compliance | scored | A | 1 |
| [agent-interfaces/mcp-version-downgrade](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/mcp-version-downgrade/) | Version Downgrade Recoverability | scored | A | 1 |
| [agent-interfaces/mcp-origin-validation-cors](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/mcp-origin-validation-cors/) | The MCP endpoint validates Origin and its CORS policy matches its auth posture | scored | B | 0.6 |
| [agent-interfaces/mcp-registry-listing-ownership](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/mcp-registry-listing-ownership/) | The MCP server is listed in the official registry under a namespace this domain owns | scored | B | 0.6 |
| [agent-interfaces/mcp-tool-description-coverage](https://forkpoint.github.io/agent-lighthouse/audits/agent-interfaces/mcp-tool-description-coverage/) | Tool Self-Description Coverage | scored | B | 0.6 |

## agentic-commerce

10 registered checks. See the [implementation guidance](framework.md#agentic-commerce).

| Audit ID | Check | Tier | Evidence grade | Weight |
|---|---|---|---|---|
| [agentic-commerce/offer-schema](https://forkpoint.github.io/agent-lighthouse/audits/agentic-commerce/offer-schema/) | Offer schema on pricing pages | scored | A | 1 |
| [agentic-commerce/product-identifiers](https://forkpoint.github.io/agent-lighthouse/audits/agentic-commerce/product-identifiers/) | Product identifiers (GTIN/UPC/MPN) | scored | A | 1 |
| [agentic-commerce/product-transaction-certainty](https://forkpoint.github.io/agent-lighthouse/audits/agentic-commerce/product-transaction-certainty/) | Product transactional certainty | scored | A | 1 |
| [agentic-commerce/acp-policy-link-surface](https://forkpoint.github.io/agent-lighthouse/audits/agentic-commerce/acp-policy-link-surface/) | ACP link-surface completeness | scored | A | 1 |
| [agentic-commerce/landed-cost-and-returns](https://forkpoint.github.io/agent-lighthouse/audits/agentic-commerce/landed-cost-and-returns/) | Landed-cost and returns machine readability | scored | A | 1 |
| [agentic-commerce/checkout-offer-field-mapping](https://forkpoint.github.io/agent-lighthouse/audits/agentic-commerce/checkout-offer-field-mapping/) | Checkout-eligible offer field mapping | scored | A | 1 |
| [agentic-commerce/agent-ua-commerce-parity](https://forkpoint.github.io/agent-lighthouse/audits/agentic-commerce/agent-ua-commerce-parity/) | Shopping agents can fetch the commerce paths | scored | A | 1 |
| [agentic-commerce/buyable-variant-resolution](https://forkpoint.github.io/agent-lighthouse/audits/agentic-commerce/buyable-variant-resolution/) | Buyable Variant Resolution | scored | B | 0.6 |
| [agentic-commerce/cart-handoff-reachability](https://forkpoint.github.io/agent-lighthouse/audits/agentic-commerce/cart-handoff-reachability/) | Cart Handoff Reachability | scored | B | 0.6 |
| [agentic-commerce/offer-truth-consistency](https://forkpoint.github.io/agent-lighthouse/audits/agentic-commerce/offer-truth-consistency/) | Offer Truth Consistency | scored | B | 0.6 |

## operability-safety

46 registered checks. See the [implementation guidance](framework.md#operability-safety).

| Audit ID | Check | Tier | Evidence grade | Weight |
|---|---|---|---|---|
| [operability-safety/contact-form](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/contact-form/) | Contact/lead form endpoint | informative | C | 0 |
| [operability-safety/no-blocking-captcha](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/no-blocking-captcha/) | Forms don't use blocking CAPTCHA | scored | A | 1 |
| [operability-safety/forms-no-js](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/forms-no-js/) | Forms work without JavaScript | informative | C | 0 |
| [operability-safety/form-actionability](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/form-actionability/) | Form backend actionability | scored | A | 1 |
| [operability-safety/aria-landmarks](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/aria-landmarks/) | ARIA landmarks complete | scored | A | 1 |
| [operability-safety/landmark-unique](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/landmark-unique/) | Landmarks are uniquely identifiable | scored | A | 1 |
| [operability-safety/label](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/label/) | Form inputs have associated labels | scored | A | 1 |
| [operability-safety/form-error-messages](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/form-error-messages/) | Form fields wired to their validation messages | scored | A | 1 |
| [operability-safety/accessible-names](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/accessible-names/) | Buttons and links have accessible names | scored | A | 1 |
| [operability-safety/dialog-name](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/dialog-name/) | Dialogs have accessible names | scored | A | 1 |
| [operability-safety/aria-hidden-body](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/aria-hidden-body/) | Page exposed to the accessibility tree | scored | A | 1 |
| [operability-safety/aria-roles](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/aria-roles/) | Valid ARIA roles | scored | A | 1 |
| [operability-safety/aria-attributes](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/aria-attributes/) | Valid ARIA attributes | scored | A | 1 |
| [operability-safety/aria-relationships](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/aria-relationships/) | Complete ARIA relationships | scored | A | 1 |
| [operability-safety/duplicate-id](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/duplicate-id/) | Unique IDs for ARIA references | scored | A | 1 |
| [operability-safety/autocomplete](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/autocomplete/) | Form fields use valid autocomplete tokens | scored | A | 1 |
| [operability-safety/nested-interactive](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/nested-interactive/) | No nested interactive controls | scored | A | 1 |
| [operability-safety/table-headers](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/table-headers/) | Data tables have header associations | scored | B | 0.6 |
| [operability-safety/document-title](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/document-title/) | Page has a non-empty <title> | scored | A | 1 |
| [operability-safety/frame-title](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/frame-title/) | Frames are titled | informative | C | 0 |
| [operability-safety/meta-refresh](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/meta-refresh/) | No time-based auto-refresh/redirect | scored | A | 1 |
| [operability-safety/tabindex](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/tabindex/) | No positive tabindex (logical focus order) | informative | C | 0 |
| [operability-safety/presentation-conflict](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/presentation-conflict/) | No presentation-role conflicts | scored | A | 1 |
| [operability-safety/security-header-hygiene](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/security-header-hygiene/) | security.txt (RFC 9116) | informative | C | 0 |
| [operability-safety/form-autofill-token-coverage](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/form-autofill-token-coverage/) | Form Autofill Token Coverage | scored | A | 1 |
| [operability-safety/native-control-substitution](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/native-control-substitution/) | Native Control Substitution Index | scored | A | 1 |
| [operability-safety/invisible-instruction-scan](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/invisible-instruction-scan/) | Invisible Instruction Payload Scan | scored | A | 1 |
| [operability-safety/aria-layer-injection-scan](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/aria-layer-injection-scan/) | Accessibility-Layer Injection Scan | scored | A | 1 |
| [operability-safety/ghost-clickable-element-ratio](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/ghost-clickable-element-ratio/) | Ghost-clickable elements: click targets an agent cannot address | scored | B | 0.6 |
| [operability-safety/stateful-control-introspectability](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/stateful-control-introspectability/) | Stateful controls: current state readable by an agent | scored | B | 0.6 |
| [operability-safety/hover-only-content-and-navigation](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/hover-only-content-and-navigation/) | Hover-only navigation and content | scored | B | 0.6 |
| [operability-safety/drag-and-slider-dependency](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/drag-and-slider-dependency/) | Gesture-only controls with no discrete alternative | scored | B | 0.6 |
| [operability-safety/url-addressable-state-and-pagination-fallback](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/url-addressable-state-and-pagination-fallback/) | Listings walkable by URL: pagination and facet fallback | scored | B | 0.6 |
| [operability-safety/first-contact-consent-gate-operability](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/first-contact-consent-gate-operability/) | First-contact consent gate: cost to get past it | informative | C | 0 |
| [operability-safety/unicode-covert-channel-scan](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/unicode-covert-channel-scan/) | Invisible codepoints carrying hidden text | scored | B | 0.6 |
| [operability-safety/third-party-dom-write-blast-radius](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/third-party-dom-write-blast-radius/) | Third-party DOM-write blast radius | scored | B | 0.6 |
| [operability-safety/unsafe-agent-triggerable-affordances](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/unsafe-agent-triggerable-affordances/) | State-changing links an agent can trigger by fetching them | scored | B | 0.6 |
| [operability-safety/reflected-parameter-injection-canary](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/reflected-parameter-injection-canary/) | Reflected-Parameter Injection Canary | scored | B | 0.6 |
| [operability-safety/ugc-trust-boundary-markers](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/ugc-trust-boundary-markers/) | UGC Trust-Boundary Markers | scored | B | 0.6 |
| [operability-safety/agent-ua-content-divergence-diff](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/agent-ua-content-divergence-diff/) | Agent-UA Content Divergence Diff | scored | B | 0.6 |
| [operability-safety/c2pa-manifest-survives-delivery](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/c2pa-manifest-survives-delivery/) | Content Credentials survive the image delivery pipeline | scored | B | 0.6 |
| [operability-safety/c2pa-signer-trust-status](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/c2pa-signer-trust-status/) | Content Credentials are signed by a certificate that can be trusted | scored | B | 0.6 |
| [operability-safety/organization-identifier-registry-resolution](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/organization-identifier-registry-resolution/) | The organization identifier resolves in the authoritative registry | scored | B | 0.6 |
| [operability-safety/synthetic-media-disclosure-validity](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/synthetic-media-disclosure-validity/) | AI-generated-image disclosure is machine-readable and self-consistent | scored | B | 0.6 |
| [operability-safety/trust-txt-reciprocity-coherence](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/trust-txt-reciprocity-coherence/) | trust.txt associations are reciprocated and agree with robots.txt | informative | C | 0 |
| [operability-safety/wikidata-round-trip-verification](https://forkpoint.github.io/agent-lighthouse/audits/operability-safety/wikidata-round-trip-verification/) | The Wikidata entity this site claims points back at this site | scored | B | 0.6 |
