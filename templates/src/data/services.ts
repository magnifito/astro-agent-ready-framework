// Services data. Covers audits 3.5, 3.10, 10.11 (cross-linking), 10.15 (slugs).
//
// Import in src/pages/services/index.astro (ItemList) and
// src/pages/services/[slug].astro (getStaticPaths + Service schema).
// Human-readable slugs keep URLs descriptive (audit 10.15).

export interface Service {
  slug: string;
  title: string;
  summary: string; // one line — card copy + Service.description
  body: string; // longer detail-page description
  href: string; // /services/<slug>/
  related?: string[]; // slugs of related services (audit 10.11)
}

export const services: Service[] = [
  {
    slug: "$SERVICE_ONE_SLUG",
    title: "$SERVICE_ONE_TITLE",
    summary: "$SERVICE_ONE_SUMMARY",
    body: "$SERVICE_ONE_BODY",
    href: "/services/$SERVICE_ONE_SLUG/",
    related: ["$SERVICE_TWO_SLUG"],
  },
  {
    slug: "$SERVICE_TWO_SLUG",
    title: "$SERVICE_TWO_TITLE",
    summary: "$SERVICE_TWO_SUMMARY",
    body: "$SERVICE_TWO_BODY",
    href: "/services/$SERVICE_TWO_SLUG/",
    related: ["$SERVICE_ONE_SLUG"],
  },
];

export function findService(slug: string) {
  return services.find((s) => s.slug === slug);
}
