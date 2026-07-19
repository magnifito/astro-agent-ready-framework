// Typed JSON-LD @graph builders. Covers category 3 (Structured Data & Schema).
//
// Per-page hand-written JSON rots the cross-linked @ids from framework.md §3.
// These builders emit each node once with the canonical @id and reference
// sub-entities by @id instead of duplicating them. Compose with `graph(...)`:
//
//   import { graph, organization, webSite, webPage, breadcrumbs } from "~/lib/schema";
//   const structuredData = graph(
//     organization(siteUrl),
//     webSite(siteUrl),
//     webPage({ siteUrl, canonicalHref, title, description }),
//     breadcrumbs([{ name: siteInfo.name, item: `${siteUrl}/` }]),
//   );
//   // then <SeoHead structuredData={structuredData} /> (or via BaseLayout).
//
// @id conventions (framework.md §3):
//   ${siteUrl}/#organization
//   ${siteUrl}/#website
//   ${canonicalHref}#webpage
//   ${siteUrl}/#services-catalog
//   ${canonicalHref}#service | #article

import type { Author } from "~/data/authors";
import { getSiteUrl, siteInfo, socialProfiles } from "~/data/site";

type Node = Record<string, unknown>;

const orgRef = (siteUrl: string): Node => ({ "@id": `${siteUrl}/#organization` });
const websiteRef = (siteUrl: string): Node => ({ "@id": `${siteUrl}/#website` });

// —— Organization / ProfessionalService (audits 3.1–3.3, 3.10, 3.12) ——
export function organization(siteUrl: string = getSiteUrl()): Node {
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${siteUrl}/#organization`,
    name: siteInfo.name,
    url: `${siteUrl}/`,
    logo: `${siteUrl}/logo.svg`, // audit 3.3 requires a logo URL
    email: siteInfo.email,
    description: siteInfo.description,
    slogan: siteInfo.tagline,
    areaServed: "Worldwide",
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: siteInfo.email,
        contactType: "new business inquiries",
        availableLanguage: ["English"],
      },
    ],
    hasOfferCatalog: { "@id": `${siteUrl}/#services-catalog` },
    // audit 3.3 / 10.2 — cross-platform identity, omitted when empty.
    ...(socialProfiles.length ? { sameAs: socialProfiles } : {}),
    potentialAction: {
      // audit 3.10 — top-level agentic action
      "@type": "ContactAction",
      name: "Start a project",
      target: `${siteUrl}/#contact`,
    },
  };
}

// —— WebSite with SearchAction (audit 3.4) ——
export function webSite(siteUrl: string = getSiteUrl()): Node {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: siteInfo.name,
    description: siteInfo.description,
    publisher: orgRef(siteUrl),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// —— OfferCatalog (audit 3.7; homepage services catalog) ——
// Organization.hasOfferCatalog references this node by @id (${siteUrl}/#services-catalog).
// itemListElement wraps each service in an Offer whose itemOffered points at the
// Service node by @id — build those Service nodes with service() in the SAME
// graph so the refs resolve. Pass the ~/data/services array (needs .title + .href).
export function offerCatalog(
  services: { title: string; href: string }[],
  siteUrl: string = getSiteUrl(),
): Node {
  return {
    "@type": "OfferCatalog",
    "@id": `${siteUrl}/#services-catalog`,
    name: `${siteInfo.name} services`,
    itemListElement: services.map((s, i) => ({
      "@type": "Offer",
      position: i + 1,
      itemOffered: {
        "@id": `${new URL(s.href, `${siteUrl}/`).toString()}#service`,
      },
    })),
  };
}

// —— SpeakableSpecification (audit 3.9) ——
// cssSelector values MUST resolve to elements that actually exist on the page.
export function speakable(cssSelector: string[]): Node {
  return { "@type": "SpeakableSpecification", cssSelector };
}

export interface WebPageInput {
  canonicalHref: string;
  title: string;
  description: string;
  speakable?: string[]; // css selectors — see speakable()
  about?: Node; // @id ref; defaults to the organization
  siteUrl?: string;
}

// —— WebPage (audits 3.5, 3.9) ——
export function webPage({
  canonicalHref,
  title,
  description,
  speakable: cssSelector,
  about,
  siteUrl = getSiteUrl(),
}: WebPageInput): Node {
  return {
    "@type": "WebPage",
    "@id": `${canonicalHref}#webpage`,
    url: canonicalHref,
    name: title,
    description,
    isPartOf: websiteRef(siteUrl),
    about: about ?? orgRef(siteUrl),
    ...(cssSelector ? { speakable: speakable(cssSelector) } : {}),
  };
}

// —— BreadcrumbList (audit 3.5) ——
export function breadcrumbs(items: { name: string; item: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
  };
}

export interface ServiceInput {
  canonicalHref: string;
  name: string;
  description: string;
  siteUrl?: string;
}

// —— Service with potentialAction (audits 3.5, 3.10) ——
export function service({
  canonicalHref,
  name,
  description,
  siteUrl = getSiteUrl(),
}: ServiceInput): Node {
  return {
    "@type": "Service",
    "@id": `${canonicalHref}#service`,
    name,
    description,
    url: canonicalHref,
    provider: orgRef(siteUrl),
    areaServed: "Worldwide",
    serviceType: name,
    potentialAction: {
      // audit 3.10 — per-service action
      "@type": "ContactAction",
      name: `Enquire about ${name}`,
      target: `${siteUrl}/#contact`,
    },
    // audit 3.14 — add an Offer when pricing/tier is public:
    // offers: { "@type": "Offer", price: "0", priceCurrency: "USD", url: canonicalHref, availability: "https://schema.org/InStock" },
  };
}

// —— Person (audits 3.15, 10.1–10.3) ——
// Emits the node article() references by @id, and the node an author page uses.
export function person(author: Author, siteUrl: string = getSiteUrl()): Node {
  const url = `${siteUrl}/authors/${author.slug}/`;
  return {
    "@type": "Person",
    "@id": `${url}#person`,
    name: author.name,
    url,
    image: author.image,
    jobTitle: author.jobTitle,
    description: author.bio,
    knowsAbout: author.topics,
    sameAs: author.sameAs,
    affiliation: orgRef(siteUrl),
    ...(author.credentials ? { hasCredential: author.credentials } : {}),
  };
}

export interface ArticleInput {
  canonicalHref: string;
  headline: string;
  description: string;
  datePublished: string; // ISO 8601 — audit 10.9
  dateModified: string; // audit 10.10 (differs from published on revision)
  author: Author;
  about?: string[]; // tags/topics
  image?: string | string[]; // absolute URL(s)
  siteUrl?: string;
}

// —— Article (audits 3.5, 3.6, 3.15, 10.1, 10.2, 10.10) ——
// Reference the author node by @id — build it once with person().
export function article({
  canonicalHref,
  headline,
  description,
  datePublished,
  dateModified,
  author,
  about,
  image,
  siteUrl = getSiteUrl(),
}: ArticleInput): Node {
  return {
    "@type": "Article",
    "@id": `${canonicalHref}#article`,
    headline,
    description,
    url: canonicalHref,
    datePublished,
    dateModified,
    author: { "@id": `${siteUrl}/authors/${author.slug}/#person` },
    publisher: orgRef(siteUrl),
    mainEntityOfPage: { "@id": `${canonicalHref}#webpage` },
    ...(about ? { about } : {}),
    ...(image ? { image: Array.isArray(image) ? image : [image] } : {}),
  };
}

// —— FAQPage (audit 3.7) ——
export function faqPage(
  faqs: { question: string; answer: string }[],
  siteUrl: string = getSiteUrl(),
): Node {
  return {
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export interface CollectionInput {
  canonicalHref: string;
  title: string;
  description: string;
  items: { name: string; url: string; description?: string }[];
  siteUrl?: string;
}

// —— ConfirmAction (audit 3.16; thank-you / confirmation pages) ——
// Framework §3 "Confirmation / thank-you" archetype: a WebPage carrying a
// potentialAction ConfirmAction so agents can verify a submission completed.
// Compose it onto a webPage() node as its potentialAction:
//   graph({ ...webPage({ ... }), potentialAction: confirmAction(canonicalHref) })
export function confirmAction(
  target: string,
  name: string = "Confirm submission",
): Node {
  return { "@type": "ConfirmAction", name, target };
}

// —— CollectionPage + ItemList (audit 3.5) ——
export function collectionPage({
  canonicalHref,
  title,
  description,
  items,
  siteUrl = getSiteUrl(),
}: CollectionInput): Node {
  return {
    "@type": "CollectionPage",
    "@id": `${canonicalHref}#webpage`,
    url: canonicalHref,
    name: title,
    description,
    isPartOf: websiteRef(siteUrl),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: it.url,
        name: it.name,
        ...(it.description ? { description: it.description } : {}),
      })),
    },
  };
}

// —— @graph wrapper ——
// Wrap the composed nodes: graph(organization(), webSite(), webPage({...})).
export function graph(...nodes: Node[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
