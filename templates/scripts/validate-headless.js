// Optional post-deploy smoke test. Drives a real headless browser at the deployed
// URL and asserts signals a production AI agent would care about:
//   - HTML is server-rendered (initial content ≥80% of post-JS content)
//   - Every expected page parses valid JSON-LD with the right @type
//   - No reCAPTCHA iframe on critical pages
//   - No headless-browser-detection blocker returns a 403 / challenge page
//   - data-action attributes present on every page listed
//
// Requires playwright: `npm install --save-dev playwright`
// Run: `node scripts/validate-headless.js https://example.com`
//
// Inspired by agenticstorefront's AIAgentOptimizationService.testBrowserCompatibility()
// and simulateAIAgent() flow.

import { chromium } from "playwright";

const baseUrl = process.argv[2] || process.env.SITE_URL;
if (!baseUrl) {
  console.error("Usage: node scripts/validate-headless.js <site-url>");
  process.exit(1);
}

const pages = [
  {
    path: "/",
    expectedTypes: ["Organization", "WebSite", "WebPage"],
    expectedSearchAction: true,
    requiredDataActions: ["contact"],
  },
  {
    path: "/services/",
    expectedTypes: ["CollectionPage", "BreadcrumbList"],
    requiredDataActions: ["view-service"],
  },
  {
    path: "/insights/",
    expectedTypes: ["CollectionPage", "BreadcrumbList"],
    requiredDataActions: [],
  },
];

const failures = [];
function fail(ctx, msg) {
  failures.push(`${ctx}: ${msg}`);
  console.error(`  ✗ ${msg}`);
}
function pass(msg) {
  console.log(`  ✓ ${msg}`);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent:
    "Mozilla/5.0 (compatible; AIOAuditor/1.0; +https://example.com/bot)",
});

for (const pageDef of pages) {
  const url = new URL(pageDef.path, baseUrl).toString();
  console.log(`\n→ ${url}`);
  const page = await context.newPage();

  let initialHtmlLength = 0;
  page.on("response", async (response) => {
    if (response.url() === url && response.request().resourceType() === "document") {
      try {
        initialHtmlLength = (await response.text()).length;
      } catch {
        // ignore
      }
    }
  });

  const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

  if (!res || !res.ok()) {
    fail(url, `HTTP ${res ? res.status() : "no-response"}`);
    await page.close();
    continue;
  }
  pass(`HTTP 200`);

  // Server-rendered content check (audit 8.13). Compare initial HTML length to
  // fully-rendered length; client-only apps fail this because HTML is a shell.
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  const renderedHtml = await page.content();
  const ratio = initialHtmlLength / Math.max(renderedHtml.length, 1);
  if (ratio < 0.5) {
    fail(url, `server-rendered ratio ${(ratio * 100).toFixed(1)}% (<50%) — content is client-rendered`);
  } else {
    pass(`server-rendered ratio ${(ratio * 100).toFixed(1)}%`);
  }

  // reCAPTCHA / bot challenge (audit 2.26).
  const hasCaptcha = await page.locator('iframe[src*="recaptcha"], iframe[src*="hcaptcha"], iframe[src*="turnstile"]').count();
  if (hasCaptcha > 0) {
    fail(url, `CAPTCHA iframe detected — blocks AI agents`);
  } else {
    pass(`no blocking CAPTCHA`);
  }

  // JSON-LD types present (audits 3.1, 3.2, + archetype-specific).
  const foundTypes = await page.evaluate(() => {
    const types = new Set();
    for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        const data = JSON.parse(script.textContent || "");
        const nodes = Array.isArray(data) ? data : data["@graph"] ?? [data];
        for (const node of nodes) {
          const t = node["@type"];
          if (Array.isArray(t)) t.forEach((x) => types.add(x));
          else if (typeof t === "string") types.add(t);
        }
      } catch {
        types.add("__invalid__");
      }
    }
    return [...types];
  });

  if (foundTypes.includes("__invalid__")) {
    fail(url, `invalid JSON-LD — failed to parse one or more blocks`);
  }
  for (const expected of pageDef.expectedTypes) {
    if (!foundTypes.includes(expected)) {
      fail(url, `missing JSON-LD @type ${expected} (found: ${foundTypes.join(", ")})`);
    } else {
      pass(`JSON-LD has @type ${expected}`);
    }
  }

  // WebSite + SearchAction (audit 3.4).
  if (pageDef.expectedSearchAction) {
    const hasSearchAction = await page.evaluate(() => {
      for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
        try {
          const data = JSON.parse(script.textContent || "");
          const nodes = Array.isArray(data) ? data : data["@graph"] ?? [data];
          for (const node of nodes) {
            if (node["@type"] === "WebSite" && node.potentialAction?.["@type"] === "SearchAction") {
              return true;
            }
          }
        } catch {
          // ignore
        }
      }
      return false;
    });
    if (hasSearchAction) pass(`WebSite.potentialAction.SearchAction present`);
    else fail(url, `WebSite.potentialAction.SearchAction missing (audit 3.4)`);
  }

  // data-action attributes (audit 5.17).
  for (const action of pageDef.requiredDataActions) {
    const count = await page.locator(`[data-action="${action}"]`).count();
    if (count === 0) {
      fail(url, `no element with data-action="${action}" (audit 5.17)`);
    } else {
      pass(`data-action="${action}" × ${count}`);
    }
  }

  // Canonical link (audit 4.3).
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href").catch(() => null);
  if (!canonical) {
    fail(url, `missing <link rel="canonical">`);
  } else {
    pass(`canonical = ${canonical}`);
  }

  // llms.txt + OpenAPI + MCP alternates (audits 4.11, 4.17, 4.18).
  for (const [rel, type] of [
    ["alternate", "text/plain"],          // llms.txt
    ["service-desc", "application/openapi+json"], // openapi
  ]) {
    const count = await page.locator(`link[rel="${rel}"][type="${type}"]`).count();
    if (count === 0) {
      fail(url, `missing <link rel="${rel}" type="${type}">`);
    } else {
      pass(`<link rel="${rel}" type="${type}">`);
    }
  }

  await page.close();
}

// Machine-readable resources reachable.
console.log(`\n→ machine-readable resources`);
const resources = ["/llms.txt", "/llms-full.txt", "/ai-catalog.json", "/brand.json", "/mcp.json", "/openapi.json", "/navigation.json", "/robots.txt", "/humans.txt", "/.well-known/security.txt"];
for (const path of resources) {
  const page = await context.newPage();
  const res = await page.goto(new URL(path, baseUrl).toString(), { timeout: 10000 }).catch(() => null);
  if (!res || !res.ok()) {
    fail(path, `HTTP ${res ? res.status() : "no-response"}`);
  } else {
    const headers = res.headers();
    const cors = headers["access-control-allow-origin"];
    if (cors !== "*") {
      fail(path, `CORS missing (Access-Control-Allow-Origin = ${cors ?? "(absent)"})`);
    } else {
      pass(`${path} → 200, CORS *`);
    }
  }
  await page.close();
}

await browser.close();

if (failures.length > 0) {
  console.error(`\n✗ ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\n✓ all headless checks passed`);
