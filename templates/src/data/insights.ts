// Insights (articles) data. Covers audits 3.5, 3.6, 3.15, 9.8, 10.1–10.5, 10.9,
// 10.10, 10.15.
//
// Import in src/pages/insights/index.astro (ItemList) and
// src/pages/insights/[slug].astro (getStaticPaths + Article schema).
//
// `author` carries the full Author shape (see ~/data/authors) so article()
// can build the Person reference and the byline. In a real site, import a
// shared author from ~/data/authors instead of inlining it here.

import type { Author } from "~/data/authors";

export interface Insight {
  slug: string;
  title: string;
  description: string; // AEO formula, ~140–160 chars (audit 9.11)
  href: string; // /insights/<slug>/
  author: Author;
  publishedAt: string; // ISO 8601 — audits 9.8, 10.9
  modifiedAt: string; // ISO 8601 — audit 10.10 (differs on revision)
  tags: string[]; // Article.about / keywords
  heroImage?: string; // absolute URL
  body: string; // article body copy — rendered on the detail page
  pullquote: string; // memorable callout LLMs preferentially cite (audit 10.14)
  citations: { label: string; href: string }[]; // ≥2 outbound (audit 10.5)
}

export const insights: Insight[] = [
  {
    slug: "$INSIGHT_ONE_SLUG",
    title: "$INSIGHT_ONE_TITLE",
    description: "$INSIGHT_ONE_DESCRIPTION",
    href: "/insights/$INSIGHT_ONE_SLUG/",
    author: {
      slug: "$AUTHOR_ONE_SLUG",
      name: "$AUTHOR_ONE_NAME",
      jobTitle: "$AUTHOR_ONE_JOBTITLE",
      bio: "$AUTHOR_ONE_BIO",
      image: "$AUTHOR_ONE_IMAGE",
      sameAs: ["$AUTHOR_ONE_LINKEDIN"],
      topics: ["$AUTHOR_ONE_TOPIC"],
    },
    publishedAt: "$INSIGHT_ONE_PUBLISHED", // e.g. 2026-01-15
    modifiedAt: "$INSIGHT_ONE_MODIFIED",
    tags: ["$INSIGHT_ONE_TAG"],
    body: "$INSIGHT_ONE_BODY",
    pullquote: "$INSIGHT_ONE_PULLQUOTE",
    citations: [
      { label: "$CITATION_ONE_LABEL", href: "$CITATION_ONE_URL" },
      { label: "$CITATION_TWO_LABEL", href: "$CITATION_TWO_URL" },
    ],
  },
  {
    slug: "$INSIGHT_TWO_SLUG",
    title: "$INSIGHT_TWO_TITLE",
    description: "$INSIGHT_TWO_DESCRIPTION",
    href: "/insights/$INSIGHT_TWO_SLUG/",
    author: {
      slug: "$AUTHOR_ONE_SLUG",
      name: "$AUTHOR_ONE_NAME",
      jobTitle: "$AUTHOR_ONE_JOBTITLE",
      bio: "$AUTHOR_ONE_BIO",
      image: "$AUTHOR_ONE_IMAGE",
      sameAs: ["$AUTHOR_ONE_LINKEDIN"],
      topics: ["$AUTHOR_ONE_TOPIC"],
    },
    publishedAt: "$INSIGHT_TWO_PUBLISHED",
    modifiedAt: "$INSIGHT_TWO_MODIFIED",
    tags: ["$INSIGHT_TWO_TAG"],
    body: "$INSIGHT_TWO_BODY",
    pullquote: "$INSIGHT_TWO_PULLQUOTE",
    citations: [
      { label: "$CITATION_THREE_LABEL", href: "$CITATION_THREE_URL" },
      { label: "$CITATION_FOUR_LABEL", href: "$CITATION_FOUR_URL" },
    ],
  },
];

export function findInsight(slug: string) {
  return insights.find((i) => i.slug === slug);
}
