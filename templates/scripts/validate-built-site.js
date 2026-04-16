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
  // Static search index produced by astro-pagefind. Remove if not using search.
  "pagefind/pagefind.js",
  "search/index.html",
  // Add per-page required files:
  // "services/index.html",
  // "services/index.md",
  // "insights/index.html",
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

if (process.exitCode) {
  process.exit();
}

console.log("Build validation passed.");
