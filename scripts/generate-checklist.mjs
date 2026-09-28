// Keep audit identity and scoring metadata owned by Agent Lighthouse.
import { defaultConfig } from '@forkpoint/agent-lighthouse-core';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const root = new URL('../', import.meta.url);
const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
const version = pkg.devDependencies['@forkpoint/agent-lighthouse-core'];
const require = createRequire(import.meta.url);
const entry = pathToFileURL(require.resolve('@forkpoint/agent-lighthouse-core'));
const installed = JSON.parse(readFileSync(new URL('../package.json', entry), 'utf8'));
const template = JSON.parse(readFileSync(new URL('templates/package.json', root), 'utf8'));
if (installed.version !== version || template.devDependencies['@forkpoint/agent-lighthouse'] !== version) {
  throw new Error('Installed core, root core pin, and template CLI pin must match. Run npm ci after updating both pins.');
}
const audits = Object.values(defaultConfig.audits).flat().map(({ meta }) => meta);
const counts = Object.fromEntries(['scored', 'informative', 'experimental'].map(
  (tier) => [tier, audits.filter((audit) => audit.tier === tier).length],
));
const cell = (text) => String(text).replaceAll('|', '\\|').replaceAll('\n', ' ');
const sections = Object.entries(defaultConfig.audits).map(([category, entries]) => {
  const rows = entries.map(({ meta }) =>
    `| [${meta.id}](https://forkpoint.github.io/agent-lighthouse/audits/${meta.id}/) | ${cell(meta.title)} | ${meta.tier} | ${meta.evidenceGrade} | ${meta.weight} |`,
  );
  return `## ${category}\n\n${entries.length} registered checks. See the [implementation guidance](framework.md#${category}).\n\n| Audit ID | Check | Tier | Evidence grade | Weight |\n|---|---|---|---|---|\n${rows.join('\n')}`;
});
const output = `# Agent Lighthouse checklist\n\nGenerated from \`@forkpoint/agent-lighthouse-core@${version}\` by \`npm run checklist:generate\`. Do not edit the rows by hand.\n\n${audits.length} registered checks across ${sections.length} categories: ${counts.scored} scored, ${counts.informative} informative (advisory), and ${counts.experimental} experimental. Experimental checks require opt-in and have zero scoring weight.\n\nThis is an audit inventory, not a claim that the starter passes these checks. Every site's results remain **unverified** until a scan supplies evidence. Template presence and local build validation do not establish a Lighthouse pass.\n\nUse the linked audit rules to assess applicability, evidence requirements, and fixes. Record the report's status, page URL, tier, evidence, and remaining work for each relevant finding. Preserve not-assessed and not-applicable reasons. See [framework.md](framework.md) for scoring and validation boundaries.\n\nNumeric references such as \`1.1\` in older template comments and implementation tables are legacy identifiers. Resolve them through the versioned \`@forkpoint/agent-lighthouse-core/migration-map.json\`; do not use them as current audit IDs.\n\n${sections.join('\n\n')}\n`;
const target = new URL('checklist.md', root);
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8') !== output) {
    console.error('checklist.md differs from the pinned Agent Lighthouse registry. Run npm run checklist:generate.');
    process.exitCode = 1;
  } else {
    console.log(`Checklist matches Agent Lighthouse ${version}: ${audits.length} checks, ${sections.length} categories.`);
  }
} else {
  writeFileSync(target, output);
  console.log(`Generated ${audits.length} checks from Agent Lighthouse ${version}.`);
}
