// Authors data. Covers audits 3.15, 10.1, 10.2, 10.3.
//
// Import in article pages to populate Person schema and bylines, and in
// src/pages/authors/[slug].astro (generated) and src/pages/authors/index.astro.

export interface Author {
  slug: string;
  name: string;
  jobTitle: string;
  bio: string;              // 1–3 sentences
  image: string;            // absolute URL to a headshot
  sameAs: string[];         // LinkedIn, Twitter/X, GitHub, personal site
  topics: string[];         // maps to schema.org knowsAbout
  credentials?: string[];   // optional — degrees, certifications
  email?: string;
}

export const authors: Author[] = [
  // {
  //   slug: "jane-smith",
  //   name: "Jane Smith",
  //   jobTitle: "Principal Engineer",
  //   bio: "Jane has 15 years of experience building distributed systems.",
  //   image: "https://example.com/authors/jane.jpg",
  //   sameAs: [
  //     "https://linkedin.com/in/janesmith",
  //     "https://twitter.com/janesmith",
  //     "https://github.com/janesmith",
  //   ],
  //   topics: ["distributed systems", "observability", "reliability"],
  // },
];

export function findAuthor(slug: string) {
  return authors.find((a) => a.slug === slug);
}
