import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleList from "@/components/ArticleList";
import { isSectionLive } from "@/lib/articles";

export const metadata: Metadata = { title: "記事", alternates: { canonical: "/articles" } };

export default function ArticlesPage() {
  if (!isSectionLive("english")) notFound();
  return <ArticleList />;
}
