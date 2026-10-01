import type { MetadataRoute } from "next";
import { englishPagesLive, getAllArticles, getTagCounts, isTagIndexable, liveSections } from "@/lib/articles";
import { SITE_URL } from "@/lib/env";
import { SECTIONS } from "@/lib/sections";

export default function sitemap(): MetadataRoute.Sitemap {
  // 公開済みの記事がある科目だけ(本番では下書きは getAllArticles から外れる)
  const sections = liveSections().filter((k) => getAllArticles(k).some((a) => !a.draft));
  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    ...sections.flatMap((k) => {
      const sec = SECTIONS[k];
      return [
        { url: `${SITE_URL}${sec.top}`, changeFrequency: "daily" as const, priority: 0.9 },
        { url: `${SITE_URL}${sec.articles}`, changeFrequency: "daily" as const, priority: 0.8 },
        ...getAllArticles(k).filter((a) => !a.draft).map((a) => ({ url: `${SITE_URL}${a.url}`, lastModified: a.updatedAt || a.date, changeFrequency: "monthly" as const, priority: 0.8 })),
        ...getTagCounts(k).filter(([t]) => isTagIndexable(t, k)).map(([t]) => ({ url: `${SITE_URL}${sec.tags}/${encodeURIComponent(t)}`, changeFrequency: "weekly" as const, priority: 0.5 })),
      ];
    }),
    { url: `${SITE_URL}/boards`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/operator`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    // 英語のサイトについてのページ(英語で書く科目が公開されてから)
    ...(englishPagesLive() && sections.some((k) => k === "japanese")
      ? ["/about", "/operator", "/contact", "/privacy", "/terms"].map((p) => ({ url: `${SITE_URL}/en${p}`, changeFrequency: "yearly" as const, priority: 0.3 }))
      : []),
  ];
}
