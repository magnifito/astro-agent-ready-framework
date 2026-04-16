# Structured Data Patterns

JSON-LD `@graph` skeletons per page archetype. Drop into the `structuredData` prop of `SeoHead.astro`. Replace `SITE_URL`, `CANONICAL`, and entity fields.

All graphs share stable `@id`s so entities cross-reference:

- `${siteUrl}/#organization`
- `${siteUrl}/#website`
- `${canonicalHref}#webpage`
- `${siteUrl}/#services-catalog`
- `${canonicalHref}#service`
- `${canonicalHref}#article`

---

## Homepage

Covers audits 3.1, 3.2, 3.3 (Organization), 3.4 (WebSite + SearchAction), 3.7 (FAQPage), 3.9 (Speakable), 3.10 (potentialAction), 3.12 (ProfessionalService/LocalBusiness).

```ts
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${siteUrl}/#organization`,
      name: siteInfo.name,
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,         // audit 3.3 requires a logo URL
      email: siteInfo.email,
      description: siteInfo.description,
      slogan: siteInfo.tagline,
      areaServed: "Worldwide",
      knowsAbout: [...pillars, ...services.map((s) => s.title)],
      serviceType: [/* one-liner per capability */],
      sameAs: [                            // audit 3.3 / 10.2 cross-platform identity
        "https://linkedin.com/company/…",
        "https://twitter.com/…",
        "https://github.com/…",
      ],
      contactPoint: [{
        "@type": "ContactPoint",
        email: siteInfo.email,
        contactType: "new business inquiries",
        availableLanguage: ["English"],
      }],
      hasOfferCatalog: { "@id": `${siteUrl}/#services-catalog` },
      potentialAction: {                   // audit 3.10 — top-level agentic action
        "@type": "ContactAction",
        target: `${siteUrl}/#contact`,
        name: "Start a project",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteInfo.name,
      description: siteInfo.description,
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {                   // audit 3.4 — sitelinks SearchAction
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/search/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${canonicalHref}#webpage`,
      url: canonicalHref,
      name: title,
      description,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "#services h2", "#contact h2"],
      },
    },
    {
      "@type": "OfferCatalog",
      "@id": `${siteUrl}/#services-catalog`,
      name: `${siteInfo.name} services`,
      itemListElement: services.map((service, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.body,
          provider: { "@id": `${siteUrl}/#organization` },
          areaServed: "Worldwide",
          url: new URL(service.href, siteUrl).toString(),
        },
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};
```

If the business has a physical presence, replace `["Organization", "ProfessionalService"]` with `["Organization", "LocalBusiness"]` and add (audit 3.12):

```ts
{
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Main St",
    addressLocality: "City",
    addressRegion: "ST",
    postalCode: "12345",
    addressCountry: "US",
  },
  telephone: "+1-555-555-5555",
  openingHours: "Mo-Fr 09:00-17:00",
  geo: { "@type": "GeoCoordinates", latitude: 0, longitude: 0 },
}
```

---

## Service detail page

```ts
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteInfo.name,
      url: siteUrl,
      email: siteInfo.email,
    },
    {
      "@type": "Service",
      "@id": `${canonicalHref}#service`,
      name: service.title,
      description,
      url: canonicalHref,
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: "Worldwide",
      serviceType: service.title,
      potentialAction: {                    // audit 3.10 per-service action
        "@type": "ContactAction",
        name: `Enquire about ${service.title}`,
        target: `${siteUrl}/#contact`,
      },
      // audit 3.14 — include Offer when pricing/tier is public
      // offers: {
      //   "@type": "Offer",
      //   price: "0",
      //   priceCurrency: "USD",
      //   url: canonicalHref,
      //   availability: "https://schema.org/InStock",
      // },
    },
    {
      "@type": "WebPage",
      "@id": `${canonicalHref}#webpage`,
      url: canonicalHref,
      name: title,
      description,
      about: { "@id": `${canonicalHref}#service` },
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: siteInfo.name,
        url: siteUrl,
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".service-summary"],
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: siteInfo.name, item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services/` },
        { "@type": "ListItem", position: 3, name: service.title, item: canonicalHref },
      ],
    },
  ],
};
```

---

## Service index / collection page

```ts
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${canonicalHref}#webpage`,
      url: canonicalHref,
      name: title,
      description,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: siteInfo.name,
        url: siteUrl,
      },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: services.map((service, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: new URL(service.href, siteUrl).toString(),
          name: service.title,
          description: service.body,
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: siteInfo.name, item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Services", item: canonicalHref },
      ],
    },
  ],
};
```

---

## Article / insight page

Covers audits 3.5, 3.6, 3.15, 10.1, 10.2, 10.3, 10.10. Uses a named `Person` author with `sameAs` and `url` to lift E-E-A-T trust scoring.

```ts
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteInfo.name,
      url: siteUrl,
      email: siteInfo.email,
      logo: `${siteUrl}/logo.png`,
    },
    {
      "@type": "Person",                         // audit 3.15 / 10.1 / 10.2 / 10.3
      "@id": `${siteUrl}/authors/${insight.author.slug}/#person`,
      name: insight.author.name,
      url: `${siteUrl}/authors/${insight.author.slug}/`,
      jobTitle: insight.author.jobTitle,
      sameAs: insight.author.sameAs,              // ["https://linkedin.com/…", …]
      affiliation: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "Article",
      "@id": `${canonicalHref}#article`,
      headline: insight.title,
      description: insight.description,
      url: canonicalHref,
      datePublished: insight.publishedAt,         // ISO 8601 — audit 10.9
      dateModified: insight.modifiedAt,           // audit 10.10 (must differ on revision)
      author: { "@id": `${siteUrl}/authors/${insight.author.slug}/#person` },
      publisher: { "@id": `${siteUrl}/#organization` },
      about: insight.tags,
      mainEntityOfPage: { "@id": `${canonicalHref}#webpage` },
      image: insight.heroImage && [insight.heroImage],  // absolute URL
    },
    {
      "@type": "WebPage",
      "@id": `${canonicalHref}#webpage`,
      url: canonicalHref,
      name: insight.seoTitle,
      description: insight.description,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: siteInfo.name,
        url: siteUrl,
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".article-summary"],
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: siteInfo.name, item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Insights", item: `${siteUrl}/insights/` },
        { "@type": "ListItem", position: 3, name: insight.title, item: canonicalHref },
      ],
    },
  ],
};
```

Pair with `articlePublishedTime` and `articleModifiedTime` props on `SeoHead` so `<meta property="article:published_time">` and `article:modified_time` are emitted.

---

## Article index / collection page

Same shape as service index but with `insights` and `/insights/` breadcrumb.

---

## Thank-you / confirmation page

```ts
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  description,
  url: canonicalHref,
  potentialAction: {
    "@type": "ConfirmAction",
    name: "Project inquiry received",
    target: canonicalHref,
  },
};
```

Pass `robots="noindex, follow"` on this page — it should not appear in search results but the confirmation link should still be crawlable.

Covers audit check 3.16.

---

## Author page (`/authors/<slug>/`)

Covers audits 3.15, 10.3. Create one page per content creator.

```ts
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${canonicalHref}#webpage`,
      url: canonicalHref,
      mainEntity: { "@id": `${canonicalHref}#person` },
      isPartOf: { "@id": `${siteUrl}/#website` },
    },
    {
      "@type": "Person",
      "@id": `${canonicalHref}#person`,
      name: author.name,
      url: canonicalHref,
      image: author.image,
      jobTitle: author.jobTitle,
      description: author.bio,
      knowsAbout: author.topics,
      sameAs: author.sameAs,
      affiliation: { "@id": `${siteUrl}/#organization` },
      alumniOf: author.education,          // optional
      hasCredential: author.credentials,   // optional
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: siteInfo.name, item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Authors", item: `${siteUrl}/authors/` },
        { "@type": "ListItem", position: 3, name: author.name, item: canonicalHref },
      ],
    },
  ],
};
```

---

## HowTo page (tutorials, step-by-step guides)

Covers audit 3.11.

```ts
const structuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to X",
  description: "…",
  totalTime: "PT10M",
  estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
  supply: [{ "@type": "HowToSupply", name: "…" }],
  tool: [{ "@type": "HowToTool", name: "…" }],
  step: steps.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title,
    text: s.body,
    url: `${canonicalHref}#step-${i + 1}`,
    image: s.image,
  })),
};
```

Pair with visible `<ol>` markup on the page (audit 9.6).

---

## Pricing page

Covers audit 3.14.

```ts
const structuredData = {
  "@context": "https://schema.org",
  "@graph": plans.map((plan, i) => ({
    "@type": "Offer",
    "@id": `${canonicalHref}#plan-${plan.slug}`,
    name: plan.name,
    description: plan.description,
    price: plan.price,
    priceCurrency: plan.currency,          // "USD", "EUR"
    availability: "https://schema.org/InStock",
    priceValidUntil: plan.validUntil,       // ISO date
    url: canonicalHref,
    seller: { "@id": `${siteUrl}/#organization` },
  })),
};
```

For multi-tier plans, wrap in an `AggregateOffer` with `lowPrice`/`highPrice`/`offerCount`.

---

## Review / testimonial section

Covers audits 3.13, 10.8.

```ts
{
  "@type": "Product",           // or Service
  "@id": `${canonicalHref}#service`,
  name: service.title,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "42",
    bestRating: "5",
    worstRating: "1",
  },
  review: testimonials.map((t) => ({
    "@type": "Review",
    author: { "@type": "Person", name: t.authorName, jobTitle: t.authorRole },
    reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: "5" },
    reviewBody: t.body,
    datePublished: t.date,
  })),
}
```

Paired visible markup:

```html
<blockquote cite="https://example.com/review">
  <p>"Great product — reduced deployment time by 50%."</p>
  <footer>— <cite>Jane Smith, CEO at Company</cite></footer>
</blockquote>
```

---

## 404 page

```ts
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Not found",
  description: "Page could not be located.",
  url: canonicalHref,
};
```

Pass `robots="noindex, follow"`. Link back to `/` and to `/llms.txt` so an agent that lands on a 404 can still find the site map.

---

## Commerce extension (only for stores)

Covers audits 3.8, 3.13, 3.14, 3.21 (GTIN/UPC/MPN), 3.22 (brand/category/availability), 3.23 (reviews/ratings).

```ts
{
  "@type": "Product",
  "@id": `${canonicalHref}#product`,
  name: product.name,
  image: product.images,                   // absolute URLs
  description: product.description,
  sku: product.sku,                         // audit 3.21 — internal SKU
  gtin13: product.gtin13,                   // audit 3.21 — barcode (EAN/UPC-13)
  mpn: product.mpn,                         // audit 3.21 — manufacturer part number
  brand: {                                  // audit 3.22
    "@type": "Brand",
    name: product.brand,
  },
  category: product.category,               // audit 3.22 — "Electronics > Smartphones"
  offers: {
    "@type": "Offer",
    price: product.price,
    priceCurrency: product.currency,
    availability: product.availability,     // audit 3.22 — schema.org ItemAvailability enum
    itemCondition: "https://schema.org/NewCondition",
    url: canonicalHref,
    priceValidUntil: product.priceValidUntil,
    seller: { "@id": `${siteUrl}/#organization` },
  },
  aggregateRating: product.rating && {      // audit 3.23
    "@type": "AggregateRating",
    ratingValue: product.rating.value,
    reviewCount: product.rating.count,
    bestRating: "5",
  },
  review: product.reviews?.map((r) => ({    // audit 3.23
    "@type": "Review",
    author: { "@type": "Person", name: r.author },
    reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: "5" },
    reviewBody: r.body,
    datePublished: r.date,
  })),
}
```

Availability enum values: `InStock`, `OutOfStock`, `PreOrder`, `BackOrder`, `Discontinued`, `LimitedAvailability`.

---

## Validation rules

1. Wrap every page's graph in `<script is:inline type="application/ld+json" set:html={JSON.stringify(structuredData)}>`. `set:html` + `JSON.stringify` avoids Astro escaping quotes.
2. Every entity must have `@type`.
3. `@id`s must be absolute URLs and stable across rebuilds.
4. `speakable.cssSelector` must match actual elements. Verify after layout changes.
5. Run output through Google Rich Results Test and Schema.org Validator in CI (optional but recommended).
