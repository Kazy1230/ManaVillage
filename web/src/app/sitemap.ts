import type { MetadataRoute } from "next";
import { getAllArticles, getTagCounts, isTagIndexable } from "@/lib/articles";
import { SITE_URL } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles().filter((a) => !a.draft);
  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/articles`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/boards`, changeFrequency: "daily", priority: 0.7 },
    ...articles.map((a) => ({ url: `${SITE_URL}/articles/${a.slug}`, lastModified: a.date, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...getTagCounts().filter(([t]) => isTagIndexable(t)).map(([t]) => ({ url: `${SITE_URL}/tags/${encodeURIComponent(t)}`, changeFrequency: "weekly" as const, priority: 0.5 })),
  ];
}
