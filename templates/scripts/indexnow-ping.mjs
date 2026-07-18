#!/usr/bin/env node
// IndexNow ping — notify participating search engines (Bing, Yandex, Seznam,
// Naver, Yep, …) that URLs have changed, so they recrawl sooner.
//
// Zero dependencies. Reads the built sitemap(s) from dist/, extracts every
// <loc> URL, and POSTs them in one batch to the IndexNow API.
//
//   Run after a build:  node scripts/indexnow-ping.mjs
//   (wired as `npm run indexnow`)
//
// Key setup: IndexNow requires a key file served at $SITE_URL/<key>.txt whose
// body is exactly the key. `scripts/init.mjs` generates the key and writes that
// file into public/. The key is read here from the INDEXNOW_KEY env var, or
// falls back to the $INDEXNOW_KEY placeholder const that init.mjs replaces.
//
// Graceful by design: if the key is unset / still a placeholder, or dist is
// missing, it prints a clear message and exits 0 (never fails a deploy).

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");

// init.mjs replaces $INDEXNOW_KEY / $SITE_URL below with real values. The
// PLACEHOLDER_KEY literal is assembled at runtime ("$" + "INDEXNOW_KEY") so
// init's token replacer never rewrites it — it stays the sentinel we compare
// against to detect an un-initialised key. Env var still wins over the const.
const PLACEHOLDER_KEY = "$" + "INDEXNOW_KEY";
const SITE_URL = "$SITE_URL";
const key = process.env.INDEXNOW_KEY || "$INDEXNOW_KEY";

function skip(message) {
  console.log(`indexnow: ${message} — skipping.`);
  process.exit(0);
}

// --- Preconditions -----------------------------------------------------------

if (!key || key === PLACEHOLDER_KEY) {
  skip("no IndexNow key (set INDEXNOW_KEY or run `npm run init`)");
}
if (!fs.existsSync(dist)) {
  skip("dist/ not found (run a build first)");
}

// --- Locate sitemaps ---------------------------------------------------------

// Prefer a plain sitemap.xml; fall back to sitemap-index.xml. Either may be a
// <sitemapindex> pointing at sub-sitemaps, which we resolve from dist locally
// (never over the network — the files are already on disk).
function firstExisting(names) {
  for (const name of names) {
    const file = path.join(dist, name);
    if (fs.existsSync(file)) return file;
  }
  return null;
}

const entry = firstExisting(["sitemap.xml", "sitemap-index.xml"]);
if (!entry) {
  skip("no sitemap.xml or sitemap-index.xml in dist/");
}

// --- Extract <loc> URLs ------------------------------------------------------

function readLocs(xml) {
  const locs = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    locs.push(decodeXml(m[1]));
  }
  return locs;
}

function decodeXml(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

// Resolve a sitemap <loc> URL to a local dist file path (strip the origin).
function distFileForUrl(url) {
  try {
    const { pathname } = new URL(url);
    return path.join(dist, pathname.replace(/^\/+/, ""));
  } catch {
    return null;
  }
}

function collectUrls(file, seen = new Set()) {
  if (seen.has(file)) return [];
  seen.add(file);

  const xml = fs.readFileSync(file, "utf8");
  const isIndex = /<sitemapindex[\s>]/i.test(xml);
  const locs = readLocs(xml);

  if (!isIndex) return locs; // urlset — these are page URLs

  // sitemapindex — each <loc> is a sub-sitemap; resolve locally and recurse.
  const urls = [];
  for (const loc of locs) {
    const subFile = distFileForUrl(loc);
    if (subFile && fs.existsSync(subFile)) {
      urls.push(...collectUrls(subFile, seen));
    } else {
      console.log(`indexnow: sub-sitemap not found locally: ${loc}`);
    }
  }
  return urls;
}

const urlList = [...new Set(collectUrls(entry))];
if (urlList.length === 0) {
  skip("no <loc> URLs found in sitemap(s)");
}

// --- Derive host + keyLocation ----------------------------------------------

// Host from SITE_URL if replaced, else from the first sitemap URL.
function hostFrom(url) {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

const host = hostFrom(SITE_URL) || hostFrom(urlList[0]);
if (!host) {
  skip("could not determine host");
}

const origin =
  hostFrom(SITE_URL) && !SITE_URL.includes("$")
    ? SITE_URL.replace(/\/+$/, "")
    : new URL(urlList[0]).origin;

const keyLocation = `${origin}/${key}.txt`;

// --- POST to IndexNow ---------------------------------------------------------

const body = { host, key, keyLocation, urlList };

console.log(`indexnow: submitting ${urlList.length} URL(s) for ${host}`);

try {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  // 200 OK / 202 Accepted are success. Others are informative, not fatal.
  if (res.ok) {
    console.log(`indexnow: submitted OK (HTTP ${res.status}).`);
  } else {
    const text = await res.text().catch(() => "");
    console.log(
      `indexnow: endpoint returned HTTP ${res.status}${text ? ` — ${text.trim()}` : ""}`,
    );
  }
} catch (err) {
  // Network failure should not break a deploy pipeline.
  console.log(`indexnow: request failed — ${err?.message || err}`);
}

process.exit(0);
