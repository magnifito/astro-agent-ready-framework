// Build-time AI-readiness regression test.
// Run after `astro build`. Fails the build if any required file,
// text fragment, or JSON key is missing from dist/.
//
// Extend per site: add new pages, schemas, and required phrases.

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");

const SITE_URL = "$SITE_URL";

const requiredFiles = [
  "index.html",
  "index.md",
  "llms.txt",
  "llms-full.txt",
  "robots.txt",
  "rss.xml",
  "sitemap.xml",
  "sitemap-index.xml",
  "ai-catalog.json",
  "brand.json",
  "mcp.json",
  "navigation.json",
  "openapi.json",
  "humans.txt",
  ".well-known/security.txt",
  "agents.json",
  ".well-known/ai-plugin.json",
  ".well-known/mcp.json",
  "404.html",
  "privacy/index.html",
  "terms/index.html",
  "thank-you/index.html",
  "services/index.html",
  "insights/index.html",
  // Static search index produced by astro-pagefind. Remove if not using search.
  "pagefind/pagefind.js",
  "search/index.html",
  // Add per-page required files:
  // "services/index.md",
  // "insights/index.md",
];

const requiredText = {
  "index.html": [
    "FAQPage",
    "SpeakableSpecification",
    'data-action="contact"',
    `${SITE_URL}/llms.txt`,
    `${SITE_URL}/openapi.json`,
    `${SITE_URL}/mcp.json`,
    `${SITE_URL}/brand.json`,
  ],
  "llms.txt": [
    "# $SITE_NAME",
    "## Core Pages",
    `${SITE_URL}/llms-full.txt`,
  ],
  "llms-full.txt": [
    "# $SITE_NAME Full LLM Context",
  ],
  "rss.xml": ["<rss", "xmlns:content"],
  "sitemap.xml": [
    "<urlset",
    `${SITE_URL}/`,
    "<lastmod>",
  ],
  "robots.txt": [
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `AI-Content-Map: ${SITE_URL}/llms.txt`,
  ],
};

const requiredJsonKeys = {
  "ai-catalog.json": ["resources", "actions"],
  "brand.json": ["name", "machineReadable"],
  "mcp.json": ["resources", "tools"],
  "navigation.json": ["primary", "machineReadable"],
  "openapi.json": ["openapi", "paths"],
};

function fail(message) {
  console.error(`Build validation failed: ${message}`);
  process.exitCode = 1;
}

function readFile(relativePath) {
  return fs.readFileSync(path.join(dist, relativePath), "utf8");
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(dist, file))) {
    fail(`missing dist/${file}`);
  }
}

for (const [file, patterns] of Object.entries(requiredText)) {
  if (!fs.existsSync(path.join(dist, file))) continue;

  const text = readFile(file);
  for (const pattern of patterns) {
    if (!text.includes(pattern)) {
      fail(`dist/${file} does not include ${pattern}`);
    }
  }
}

for (const [file, keys] of Object.entries(requiredJsonKeys)) {
  if (!fs.existsSync(path.join(dist, file))) continue;

  let parsed;
  try {
    parsed = JSON.parse(readFile(file));
  } catch (error) {
    fail(`dist/${file} is not valid JSON: ${error.message}`);
    continue;
  }

  for (const key of keys) {
    if (!(key in parsed)) {
      fail(`dist/${file} is missing key ${key}`);
    }
  }
}

// Recursive walk that returns absolute paths of files matching `filter`.
function walk(dir, filter) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full, filter));
    } else if (filter(full)) {
      out.push(full);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// 1. llms.txt link validation (makes checklist claim 1.5 real).
//    Parse markdown links [text](url) from the llms manifests and confirm every
//    same-origin target actually exists in dist/. External + mailto: are skipped.
// ---------------------------------------------------------------------------
const linkManifests = ["llms.txt", "llms-full.txt"];
const MD_LINK = /\[[^\]]*\]\(([^)\s]+)/g;
for (const file of linkManifests) {
  if (!fs.existsSync(path.join(dist, file))) continue;
  const text = readFile(file);
  let match;
  while ((match = MD_LINK.exec(text)) !== null) {
    const url = match[1].trim();
    if (!url || url.startsWith("mailto:")) continue;
    // Same-origin only — compare by prefix (SITE_URL may still be a placeholder).
    if (!url.startsWith(SITE_URL)) continue;
    // Strip the origin, then drop any #fragment / ?query.
    let rest = url.slice(SITE_URL.length).split("#")[0].split("?")[0];
    rest = rest.replace(/^\/+/, "");
    let targets;
    if (rest === "") {
      targets = ["index.html"]; // origin root (e.g. $SITE_URL/ or $SITE_URL/#contact)
    } else if (rest.endsWith("/")) {
      targets = [`${rest}index.html`]; // trailing-slash → directory index
    } else if (/\.[a-z0-9]+$/i.test(rest)) {
      targets = [rest]; // has a file extension → the file itself
    } else {
      // Extensionless pretty URL — accept either directory index or flat .html.
      targets = [`${rest}/index.html`, `${rest}.html`];
    }
    if (!targets.some((t) => fs.existsSync(path.join(dist, t)))) {
      fail(`dist/${file} links to ${url} but ${targets.map((t) => `dist/${t}`).join(" / ")} does not exist`);
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Placeholder-leak scan. Catches forgotten sed replacements in the shipped
//    output. (The script's own SITE_URL const is a placeholder pre-replacement;
//    that is fine — this scan targets dist/ files only.)
//    Generic $TOKEN pattern: $ + UPPER word + at least one _SEGMENT. Catches
//    every token family — $SITE_*, $PAGE_*, $LEGAL_*, $INSIGHT_*, $AUTHOR_*,
//    $CITATION_*, $PRIVACY_*, $TERMS_*, $INDEXNOW_KEY, $SERVICE_*, etc.
//    NOTE: this is the FINAL gate. Content tokens that init.mjs is allowed to
//    leave as TODOs (privacy/terms body, example insight/service copy) MUST be
//    resolved before build — they still fail here by design; that is intended.
// ---------------------------------------------------------------------------
const TEXT_EXTENSIONS = new Set([".html", ".md", ".txt", ".json", ".xml", ".js", ".css"]);
const PLACEHOLDER = /\$[A-Z][A-Z0-9]*_[A-Z0-9_]+/g;
// Hashed bundle output (dist/_astro/**) and the Pagefind search index
// (dist/pagefind/**) are machine-generated and can legitimately contain
// `$UPPER_UPPER` identifiers (minified vars, indexed tokens) that look like our
// $TOKEN placeholders. Template-authored placeholders never survive into those
// by path — they live in HTML/MD/JSON/XML/TXT and root-level generated JS — so
// exclude both dirs to avoid false positives.
const PLACEHOLDER_SKIP_DIRS = new Set(["_astro", "pagefind"]);
// Exact `$TOKEN` strings that are legitimately part of shipped output and must
// NOT fail the leak scan. Keep this EMPTY unless a real, unavoidable false
// positive appears — the default posture is that no template placeholder
// survives into dist/. Add entries as exact strings, e.g. "$EXAMPLE_TOKEN".
const PLACEHOLDER_ALLOWLIST = [];
for (const full of walk(dist, (f) => TEXT_EXTENSIONS.has(path.extname(f).toLowerCase()))) {
  const rel = path.relative(dist, full);
  if (PLACEHOLDER_SKIP_DIRS.has(rel.split(path.sep)[0])) continue;
  const text = fs.readFileSync(full, "utf8");
  const leaked = new Set();
  let m;
  PLACEHOLDER.lastIndex = 0;
  while ((m = PLACEHOLDER.exec(text)) !== null) leaked.add(m[0]);
  for (const token of leaked) {
    if (PLACEHOLDER_ALLOWLIST.includes(token)) continue;
    fail(`dist/${rel} contains unreplaced template token ${token}`);
  }
}

// ---------------------------------------------------------------------------
// 3. Static HTML lint. Zero-dependency structural pass over Astro's own build
//    output (careful regexes are acceptable here — it is not arbitrary HTML).
//    Per-file opt-outs live in HTML_LINT_SKIP: map filename → skipped check ids.
//    Check ids: h1, heading-order, img-alt, main, header, footer, title, canonical.
// ---------------------------------------------------------------------------
const HTML_LINT_SKIP = {
  "404.html": ["canonical"],
};
for (const full of walk(dist, (f) => f.toLowerCase().endsWith(".html"))) {
  const rel = path.relative(dist, full);
  // Skip pagefind's generated search fragments.
  if (rel.split(path.sep)[0] === "pagefind") continue;
  const skip = new Set(HTML_LINT_SKIP[rel] || []);
  const html = fs.readFileSync(full, "utf8");

  // exactly one <h1>
  if (!skip.has("h1")) {
    const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
    if (h1Count !== 1) fail(`dist/${rel}: expected exactly one <h1>, found ${h1Count}`);
  }

  // no heading-level skips (e.g. h2 → h4)
  if (!skip.has("heading-order")) {
    let prev = 0;
    for (const h of html.matchAll(/<h([1-6])[\s>]/gi)) {
      const level = Number(h[1]);
      if (prev && level > prev + 1) {
        fail(`dist/${rel}: heading level skip h${prev}→h${level}`);
        break;
      }
      prev = level;
    }
  }

  // every <img …> has an alt attribute (empty allowed)
  if (!skip.has("img-alt")) {
    for (const img of html.match(/<img\b[^>]*>/gi) || []) {
      if (!/\balt\s*=/i.test(img)) {
        fail(`dist/${rel}: <img> without alt attribute`);
        break;
      }
    }
  }

  // structural landmarks present
  for (const tag of ["main", "header", "footer"]) {
    if (!skip.has(tag) && !new RegExp(`<${tag}[\\s>]`, "i").test(html)) {
      fail(`dist/${rel}: missing <${tag}>`);
    }
  }

  // non-empty <title>
  if (!skip.has("title")) {
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (!title || !title[1].trim()) fail(`dist/${rel}: empty or missing <title>`);
  }

  // <link rel="canonical"> present
  if (!skip.has("canonical") && !/<link\b[^>]*\brel=["']?canonical\b/i.test(html)) {
    fail(`dist/${rel}: missing <link rel="canonical">`);
  }
}

if (process.exitCode) {
  process.exit();
}

console.log("Build validation passed.");
