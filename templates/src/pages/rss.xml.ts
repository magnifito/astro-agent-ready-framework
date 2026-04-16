import rss from "@astrojs/rss";
import type { APIContext } from "astro";
// import { insights } from "~/data/insights";

// Full-content RSS (content:encoded). Satisfies audit check 1.12.
// Replace `insights` with your article data array.
//
// function insightContent(insight: (typeof insights)[number]) {
//   const paragraphs = [insight.summary, ...insight.body]
//     .map((paragraph) => `<p>${paragraph}</p>`)
//     .join("\n");
//   const points = insight.points.map((point) => `<li>${point}</li>`).join("\n");
//   return `${paragraphs}\n<h2>${insight.sectionTitle}</h2>\n<ul>\n${points}\n</ul>`;
// }

export function GET(context: APIContext) {
  const site = context.site?.toString() ?? "$SITE_URL/";

  return rss({
    title: "$SITE_NAME | Insights",
    description: "$RSS_DESCRIPTION",
    site,
    xmlns: { content: "http://purl.org/rss/1.0/modules/content/" },
    customData: "<language>en-us</language>",
    items: [
      // insights.map((insight) => ({
      //   title: insight.title,
      //   description: insight.description,
      //   content: insightContent(insight),
      //   link: insight.href,
      //   pubDate: new Date(insight.publishedAt),
      //   categories: [...insight.tags],
      // })),
    ],
  });
}
