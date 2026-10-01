import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleList from "@/components/ArticleList";
import { isSectionLive } from "@/lib/articles";

export const metadata: Metadata = { title: "All guides", alternates: { canonical: "/en/japanese/articles" } };

export default function JapaneseArticlesPage() {
  if (!isSectionLive("japanese")) notFound();
  return <ArticleList section="japanese" />;
}
