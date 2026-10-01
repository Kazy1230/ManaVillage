import type { Metadata } from "next";
import ArticleList from "@/components/ArticleList";

export const metadata: Metadata = { title: "記事", alternates: { canonical: "/articles" } };

export default function ArticlesPage() {
  return <ArticleList />;
}
