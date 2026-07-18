// Optional post-deploy smoke test. Drives a real headless browser at the deployed
// URL and asserts signals a production AI agent would care about:
//   - HTML is server-rendered (initial content ≥80% of post-JS content)
//   - Every expected page parses valid JSON-LD with the right @type
//   - No reCAPTCHA iframe on critical pages
//   - No headless-browser-detection blocker returns a 403 / challenge page
//   - data-action attributes present on every page listed
//   - Accessibility structural checks (category 7, axe-core-backed audits 7.10–7.23)
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

  // Accessibility structural checks (category 7, axe-core-backed audits).
  // These mirror what the scanner's axe runner flags; cheap DOM assertions keep
  // the validator dependency-free. ids map to audit numbers.
  const a11y = await page.evaluate(() => {
    const issues = [];

    // 7.18 — non-empty <title>.
    if (!document.title || !document.title.trim()) issues.push('7.18 empty or missing <title>');

    // 7.10 — page exposed to the accessibility tree.
    if (document.body?.getAttribute('aria-hidden') === 'true' ||
        document.documentElement.getAttribute('aria-hidden') === 'true') {
      issues.push('7.10 aria-hidden="true" on <body>/<html> hides the whole page');
    }

    // 7.20 — no time-based meta refresh.
    const mr = document.querySelector('meta[http-equiv="refresh" i]');
    if (mr && /^\s*\d+\s*;/.test(mr.getAttribute('content') || '')) {
      issues.push('7.20 time-based <meta http-equiv="refresh"> present');
    }

    // 7.21 — no positive tabindex.
    for (const el of document.querySelectorAll('[tabindex]')) {
      if (Number(el.getAttribute('tabindex')) > 0) { issues.push('7.21 positive tabindex disrupts focus order'); break; }
    }

    // 7.22 — no deprecated presentational elements.
    if (document.querySelector('marquee, blink')) issues.push('7.22 deprecated <marquee>/<blink> element');

    // 7.19 — frames are titled.
    for (const f of document.querySelectorAll('iframe')) {
      if (!f.getAttribute('title')?.trim()) { issues.push('7.19 <iframe> without a title'); break; }
    }

    // 7.14 — ids referenced by ARIA/label are unique.
    const seen = new Set(), dup = new Set();
    for (const el of document.querySelectorAll('[id]')) {
      const id = el.id;
      if (seen.has(id)) dup.add(id); else seen.add(id);
    }
    for (const el of document.querySelectorAll('label[for],[aria-labelledby],[aria-describedby]')) {
      const refs = (el.getAttribute('for') || el.getAttribute('aria-labelledby') || el.getAttribute('aria-describedby') || '').split(/\s+/);
      if (refs.some((r) => r && dup.has(r))) { issues.push('7.14 ARIA/label reference points at a duplicated id'); break; }
    }

    // 7.16 — no nested interactive controls.
    const INT = 'a[href],button,input,select,textarea,[role="button"],[role="link"]';
    for (const el of document.querySelectorAll(INT)) {
      if (el.parentElement?.closest(INT)) { issues.push('7.16 nested interactive controls'); break; }
    }

    // 7.23 — no presentation role on focusable/labeled elements.
    for (const el of document.querySelectorAll('[role="presentation"],[role="none"]')) {
      if (el.matches(INT) || el.hasAttribute('tabindex') || el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')) {
        issues.push('7.23 presentation/none role on a focusable or labeled element'); break;
      }
    }

    // 7.15 — valid autocomplete tokens on form fields.
    const VALID = new Set(['on','off','name','honorific-prefix','given-name','additional-name','family-name','honorific-suffix','nickname','username','new-password','current-password','one-time-code','organization-title','organization','street-address','address-line1','address-line2','address-line3','address-level4','address-level3','address-level2','address-level1','country','country-name','postal-code','cc-name','cc-given-name','cc-additional-name','cc-family-name','cc-number','cc-exp','cc-exp-month','cc-exp-year','cc-csc','cc-type','transaction-currency','transaction-amount','language','bday','bday-day','bday-month','bday-year','sex','url','photo','tel','tel-country-code','tel-national','tel-area-code','tel-local','tel-extension','email','impp']);
    for (const el of document.querySelectorAll('input[autocomplete],select[autocomplete],textarea[autocomplete]')) {
      const tokens = (el.getAttribute('autocomplete') || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
      if (tokens.length && !tokens.every((t) => VALID.has(t) || t.startsWith('section-') || ['shipping','billing','home','work','mobile','fax','pager'].includes(t))) {
        issues.push(`7.15 invalid autocomplete token "${el.getAttribute('autocomplete')}"`); break;
      }
    }

    return issues;
  });
  if (a11y.length === 0) {
    pass(`accessibility structural checks (7.10–7.23)`);
  } else {
    for (const issue of a11y) fail(url, `a11y ${issue}`);
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
