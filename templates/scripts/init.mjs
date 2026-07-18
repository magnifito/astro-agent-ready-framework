#!/usr/bin/env node
// Site bootstrap — replaces the error-prone sed workflow.
//
//   npm run init
//
// Collects your site's core values (from ./site.config.json if present, else
// interactive prompts), derives the rest (PascalCase name, dates, IndexNow
// key, …), then walks every text file in the project rewriting each `$TOKEN`
// it has a value for. Content tokens ($FAQ_*, $SERVICE_*, $INSIGHT_*, …) are
// intentionally left in place and reported as a TODO list for you to fill in.
//
// Zero dependencies. Safe to re-run: an already-initialised tree is a no-op.
//
// site.config.json (all optional — anything omitted is prompted / derived):
//   {
//     "SITE_NAME": "Acme",
//     "SITE_URL": "https://acme.com",
//     "SITE_DOMAIN": "acme.com",
//     "SITE_EMAIL": "hello@acme.com",
//     "SITE_TAGLINE": "…",
//     "SITE_SUMMARY": "…",
//     "FORM_ENDPOINT": "https://api.web3forms.com/submit",
//     "FORM_SERVER_URL": "https://api.web3forms.com",
//     "SITE_PASCAL_NAME": "Acme",         // override derived
//     "SITE_SNAKE_NAME": "acme",          // override derived
//     "SITE_PACKAGE_NAME": "acme.com",    // override derived
//     "INDEXNOW_KEY": "…"                 // override generated
//   }

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const root = process.cwd();

// Directories never walked or written into.
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", ".astro"]);

// Token names that are content placeholders — expected to remain after init
// and edited by hand. Matched as prefixes (a trailing token segment may vary).
const CONTENT_TOKEN_PREFIXES = [
  "FAQ_",
  "SERVICE_",
  "INSIGHT_",
  "AUTHOR_",
  "CITATION_",
  "PRIVACY_",
  "TERMS_",
  "AUDIENCE_",
  "PAGE_HOME_DESC",
  "RSS_DESCRIPTION",
  "LEGAL_LAST_UPDATED",
  "SITE_LONG_DESCRIPTION",
  "SITE_SHORT_PURPOSE",
  "SITE_POSITIONING",
];

const TOKEN_RE = /\$[A-Z][A-Z0-9_]*/g;

// --- Small helpers -----------------------------------------------------------

function pascalCase(name) {
  return name
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function snakeCase(name) {
  return name
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase())
    .join("_");
}

function isValidSiteUrl(url) {
  if (typeof url !== "string") return false;
  if (/\/$/.test(url)) return false; // no trailing slash
  let u;
  try {
    u = new URL(url);
  } catch {
    return false;
  }
  // absolute https origin, no path/query/hash
  return (
    u.protocol === "https:" &&
    !!u.host &&
    (u.pathname === "" || u.pathname === "/") &&
    url === u.origin &&
    !u.search &&
    !u.hash
  );
}

function today() {
  return new Date();
}

function isoDate(d) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function isoExpires(d) {
  const y = new Date(d);
  y.setUTCFullYear(y.getUTCFullYear() + 1);
  return `${isoDate(y)}T00:00:00Z`;
}

function newIndexNowKey() {
  return crypto.randomUUID().replace(/-/g, "");
}

// Detect a text file by reading a chunk and rejecting NUL bytes.
function isTextFile(file) {
  let fd;
  try {
    fd = fs.openSync(file, "r");
    const buf = Buffer.alloc(8192);
    const bytes = fs.readSync(fd, buf, 0, buf.length, 0);
    for (let i = 0; i < bytes; i++) {
      if (buf[i] === 0) return false;
    }
    return true;
  } catch {
    return false;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), files);
    } else if (entry.isFile()) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

// --- Gather configuration ----------------------------------------------------

let config = {};
const configPath = path.join(root, "site.config.json");
const haveConfigFile = fs.existsSync(configPath);
if (haveConfigFile) {
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    console.log(`init: loaded values from ${path.relative(root, configPath)}`);
  } catch (err) {
    console.error(`init: could not parse site.config.json — ${err.message}`);
    process.exit(1);
  }
}

let rl = null;
if (!haveConfigFile) {
  if (!input.isTTY) {
    console.error(
      "init: no site.config.json and no interactive terminal.\n" +
        "      Create a site.config.json (see the header of this script) and re-run.",
    );
    process.exit(1);
  }
  rl = readline.createInterface({ input, output });
}

// ask(): return config value if provided, else prompt (or the default).
async function ask(name, { prompt, def, validate } = {}) {
  const fromConfig = config[name];
  if (fromConfig !== undefined && fromConfig !== null && fromConfig !== "") {
    if (validate && !validate(fromConfig)) {
      console.error(`init: site.config.json ${name} is invalid: ${fromConfig}`);
      process.exit(1);
    }
    return String(fromConfig);
  }
  if (!rl) return def ?? "";

  const label = def ? `${prompt} [${def}]: ` : `${prompt}: `;
  // Loop until valid (or a default is accepted).
  for (;;) {
    const raw = (await rl.question(label)).trim();
    const value = raw || def || "";
    if (validate && value && !validate(value)) {
      console.log("  ↳ invalid, try again.");
      continue;
    }
    if (!value) {
      console.log("  ↳ required, please enter a value.");
      continue;
    }
    return value;
  }
}

console.log("\nInitialising AIO framework site…\n");

const values = {};

values.SITE_NAME = await ask("SITE_NAME", {
  prompt: "Site / brand name",
});
values.SITE_URL = await ask("SITE_URL", {
  prompt: "Site URL (absolute https origin, no trailing slash)",
  validate: isValidSiteUrl,
});

const derivedDomain = new URL(values.SITE_URL).host;
values.SITE_DOMAIN = await ask("SITE_DOMAIN", {
  prompt: "Bare domain",
  def: derivedDomain,
});
values.SITE_EMAIL = await ask("SITE_EMAIL", {
  prompt: "Public contact email",
  def: `hello@${values.SITE_DOMAIN}`,
});
values.SITE_TAGLINE = await ask("SITE_TAGLINE", {
  prompt: "Short tagline",
});
values.SITE_SUMMARY = await ask("SITE_SUMMARY", {
  prompt: "1–2 sentence summary",
});
values.FORM_ENDPOINT = await ask("FORM_ENDPOINT", {
  prompt: "Contact form endpoint (full POST URL)",
  def: "https://api.web3forms.com/submit",
});
values.FORM_SERVER_URL = await ask("FORM_SERVER_URL", {
  prompt: "Form processor origin (no path)",
  def: (() => {
    try {
      return new URL(values.FORM_ENDPOINT).origin;
    } catch {
      return "https://api.web3forms.com";
    }
  })(),
});
values.FORM_ACCESS_KEY = await ask("FORM_ACCESS_KEY", {
  prompt: "Form processor public access key (contact form hidden input)",
});

// Derived identifiers (with override option).
values.SITE_PASCAL_NAME = await ask("SITE_PASCAL_NAME", {
  prompt: "PascalCase name (operationIds)",
  def: pascalCase(values.SITE_NAME) || "Site",
});
values.SITE_SNAKE_NAME = await ask("SITE_SNAKE_NAME", {
  prompt: "snake_case name",
  def: snakeCase(values.SITE_NAME) || "site",
});
values.SITE_PACKAGE_NAME = await ask("SITE_PACKAGE_NAME", {
  prompt: "npm package name",
  def: values.SITE_DOMAIN,
});

// Dates.
const now = today();
values.UPDATED_ISO_DATE = isoDate(now);
values.EXPIRES_ISO = isoExpires(now);

// IndexNow key (with override option).
values.INDEXNOW_KEY = await ask("INDEXNOW_KEY", {
  prompt: "IndexNow key (32 hex chars)",
  def: newIndexNowKey(),
});

if (rl) rl.close();

// --- Report chosen values ----------------------------------------------------

console.log("\nUsing:");
for (const [k, v] of Object.entries(values)) {
  console.log(`  $${k} = ${v}`);
}
console.log("");

// --- Replace tokens across the tree -----------------------------------------

const files = walk(root);
let filesChanged = 0;
let replacements = 0;

// Replace by literal substring (like the old `sed` workflow) rather than by a
// whole-token regex, so intentional concatenations such as
// `submit$SITE_PASCAL_NAMEInquiry` → `submitAcmeInquiry` still resolve. Sort
// longest-name-first so no token is partially consumed by a shorter one (none
// of the core tokens is a substring of another, but this is belt-and-braces).
const replaceList = Object.entries(values).sort(
  (a, b) => b[0].length - a[0].length,
);

for (const file of files) {
  // Skip the config file itself.
  if (file === configPath) continue;
  if (!isTextFile(file)) continue;

  let content;
  try {
    content = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }
  if (!content.includes("$")) continue;

  let next = content;
  let localCount = 0;
  for (const [name, value] of replaceList) {
    const placeholder = `$${name}`;
    if (!next.includes(placeholder)) continue;
    const parts = next.split(placeholder);
    localCount += parts.length - 1;
    next = parts.join(value);
  }

  if (localCount > 0 && next !== content) {
    fs.writeFileSync(file, next);
    filesChanged++;
    replacements += localCount;
  }
}

console.log(
  `init: replaced ${replacements} token(s) across ${filesChanged} file(s).`,
);

// --- Write the IndexNow key file --------------------------------------------

const publicDir = path.join(root, "public");
if (fs.existsSync(publicDir)) {
  const keyFile = path.join(publicDir, `${values.INDEXNOW_KEY}.txt`);
  if (!fs.existsSync(keyFile)) {
    fs.writeFileSync(keyFile, values.INDEXNOW_KEY);
    console.log(`init: wrote IndexNow key file public/${values.INDEXNOW_KEY}.txt`);
  } else {
    console.log(`init: IndexNow key file already present (public/${values.INDEXNOW_KEY}.txt)`);
  }
} else {
  console.log("init: no public/ dir — skipped IndexNow key file.");
}

// --- Report remaining tokens (TODO) -----------------------------------------

const remaining = new Map(); // token -> Set(relative file)
for (const file of files) {
  if (file === configPath) continue;
  if (!isTextFile(file)) continue;
  let content;
  try {
    content = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }
  const matches = content.match(TOKEN_RE);
  if (!matches) continue;
  for (const m of matches) {
    const name = m.slice(1);
    if (Object.prototype.hasOwnProperty.call(values, name)) continue; // handled
    if (!remaining.has(name)) remaining.set(name, new Set());
    remaining.get(name).add(path.relative(root, file));
  }
}

function isContentToken(name) {
  return CONTENT_TOKEN_PREFIXES.some(
    (p) => name === p || name.startsWith(p),
  );
}

if (remaining.size === 0) {
  console.log("\ninit: no remaining tokens — fully initialised. ✅");
} else {
  const content = [];
  const other = [];
  for (const name of [...remaining.keys()].sort()) {
    (isContentToken(name) ? content : other).push(name);
  }

  console.log(
    "\ninit: remaining tokens to fill in by hand (init does not fail on these):",
  );
  if (content.length) {
    console.log("\n  Content placeholders (expected — edit with your copy):");
    for (const name of content) {
      const where = [...remaining.get(name)].sort().join(", ");
      console.log(`    $${name}  →  ${where}`);
    }
  }
  if (other.length) {
    console.log("\n  Other unreplaced tokens (review these):");
    for (const name of other) {
      const where = [...remaining.get(name)].sort().join(", ");
      console.log(`    $${name}  →  ${where}`);
    }
  }
  console.log("");
}
