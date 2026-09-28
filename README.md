# AIO Framework for Astro Static Sites

Astro starter files and implementation guidance aligned with [Agent Lighthouse](https://forkpoint.github.io/agent-lighthouse/). Agent Lighthouse owns the audit rules, categories, evidence grades, and scores. This repository supplies site patterns and local regression checks.

The integration pins Agent Lighthouse **4.2.2**. Its published registry contains **215 checks across 8 categories**: 164 scored, 48 advisory (`informative`), and 3 experimental. These are registry counts, not passes or a promise of complete template coverage.

## Use the framework

1. Read [framework.md](framework.md) for the eight categories and the limits of static templates.
2. For a new site, copy `templates/` into its own directory. Run `npm run init` there. Use real business facts and finish the remaining content tokens.
3. For an existing site, keep its pages and conventions. Add only the pieces supported by real gaps.
4. Run `npm install`, commit the generated lockfile in the site repository, then run `npm run verify`. This builds the site and checks its local starter contract.
5. After deployment, run `npm run verify:deployed` for the browser smoke checks.
6. Run `npm run audit:agent -- https://your-domain.com --output terminal,html,json --output-dir reports/baseline` for the Agent Lighthouse report. Scan other relevant page URLs separately. Keep the URL, options, tool version, coverage, and report with each result.
7. Fix relevant scored failures. Read advisory findings separately. Repeat the scan with the same options and compare its evidence.

The audit command sends requests to the supplied URL. Use a reachable deployed or staging site. Local `dist/` checks cannot prove deployed headers, crawler access, or action execution.

## Files

| File | Purpose |
|---|---|
| [framework.md](framework.md) | Current categories, scoring rules, priorities, and implementation boundaries. |
| [checklist.md](checklist.md) | Generated inventory of current audit IDs, tiers, grades, and weights. |
| [astro-implementation.md](astro-implementation.md) | Astro configuration, integrations, components, and hosting recipes. |
| [structured-data-patterns.md](structured-data-patterns.md) | JSON-LD examples; use only types and facts that match visible content. |
| [templates/](templates/) | Service-site starter, schema builders, local validators, and deployed audit command. |
| [skills/aio-framework/SKILL.md](skills/aio-framework/SKILL.md) | Stack-neutral report assessment, code review, and verified fixes for coding agents. |

## What the starter proves

A passing build validator proves its configured file, text, and structure checks. It does not produce an Agent Lighthouse score. The starter includes optional conventions such as `llms.txt`, custom resource catalogs, and static action descriptions. Their presence does not prove consumer support, citations, or working MCP/WebMCP tools.

Keep crawler permissions consistent with the site owner's policy. Publish API descriptions only for real interfaces. A static site can describe an external action, but its operator must supply and test that service.

Commerce, authentication, payments, live MCP endpoints, and other server behavior need site-specific work. No readiness score guarantees AI mentions, rankings, or successful transactions.

## Maintain the audit inventory

From this repository root:

```sh
npm ci
npm run checklist:check
# After an intentional Agent Lighthouse version update:
npm run checklist:generate
```

Update the exact core dependency here and CLI dependency in `templates/package.json` together. Review upstream rule changes, regenerate the checklist, and rerun validation. Keep the generated root lockfile in version control.

The [scoring guide](https://forkpoint.github.io/agent-lighthouse/docs/scoring/) and [CLI reference](https://forkpoint.github.io/agent-lighthouse/docs/cli/) explain report interpretation and scan options. The package version used for a run controls its behavior.

## Use the skill on any stack

The `aio-framework` skill accepts a URL, an Agent Lighthouse report, or a local project. It reads the report, traces findings through the code and hosting settings, and proposes or applies fixes within the requested scope. It does not require Astro or a clone of this repository. Its scan and code-review references ship inside the skill folder.

Example requests:

- “Audit this website with Agent Lighthouse and check the code behind its findings.”
- “Use this report to fix the confirmed issues in this project. Verify the changes.”
- “Review this local project for AI readiness. No deployment exists yet.”

Local-only reviews produce code findings without an invented Lighthouse score. Templates are optional and may target different frameworks. The repo currently ships the Astro starter in `templates/`. For other stacks, the skill uses the project’s native tools; additional starters can be added and verified independently. See the [template selection guide](skills/aio-framework/references/templates.md).
