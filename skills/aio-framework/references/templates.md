# Optional framework templates

The report and code-review workflow applies to every stack. Templates supply implementation examples for a specific stack; they do not define the audit rules or prove readiness.

## Select a template

- Existing site: detect its stack and reuse its current layout, routing, content, and build tools. Borrow only a needed feature. Do not replace the project with a starter.
- New site with a chosen framework: use a matching maintained template if one exists. Otherwise use the framework's native setup and apply the same report/code-review workflow.
- New site without a chosen framework: infer from the user's project constraints. Ask about the framework only when the choice materially changes the result.

This repository currently ships an **Astro** starter in `templates/`. Its setup guide is `templates/README.md`; detailed recipes are in `astro-implementation.md`. These are repository-relative paths, not files bundled inside this skill. Read them only when that checkout is available and Astro work is requested. Obtain a starter checkout only when scaffolding needs it, not for ordinary audits.

Other frameworks are supported by the skill's native-code workflow. Do not claim this repository already ships tested Next.js, Nuxt, SvelteKit, WordPress, or other starters.

## Add another framework starter

Keep each additional starter self-contained, with its own framework name, dependencies, setup guide, build command, and focused validation. Do not make it depend on Astro files or commands. Select a clear framework-specific directory for each new starter; do not move existing paths as part of an unrelated site task.

Each starter should provide appropriate implementations of:

- Page metadata, canonical URLs, semantic content, and accessible controls.
- Crawl policy and sitemap behavior appropriate to its routing/rendering model.
- Accurate structured data where the page content supports it.
- Real action interfaces only when supplied by the project.
- Local verification and a documented Agent Lighthouse scan against a reachable deployment.

Share audit policy and report interpretation through the skill. Keep framework-specific rendering, routes, and tests in the starter. Optional discovery files remain optional in every stack.

Test each starter independently with factual fixture content. Record successful builds and focused behavior checks. A successful starter build does not establish a deployed Lighthouse score or feature parity with another starter.
