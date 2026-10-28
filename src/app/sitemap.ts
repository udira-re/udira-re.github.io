import type { MetadataRoute } from "next";
import { articles } from "@/content/articles";
import { caseStudies, site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, lastModified: site.updated, changeFrequency: "monthly", priority: 1 },
    ...caseStudies.map((c) => ({ url: `${site.url}/work/${c.slug}/`, lastModified: site.updated, priority: 0.8 })),
    { url: `${site.url}/writing/`, lastModified: site.updated, priority: 0.7 },
    ...articles.map((a) => ({ url: `${site.url}/writing/${a.slug}/`, lastModified: a.published, priority: 0.7 })),
  ];
}
