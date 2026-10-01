import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleList from "@/components/ArticleList";
import { isSectionLive } from "@/lib/articles";

export const metadata: Metadata = { title: "人間関係の記事", alternates: { canonical: "/relationships/articles" } };

export default function Page() {
  if (!isSectionLive("relationships")) notFound();
  return <div className="section-relationships"><ArticleList section="relationships" /></div>;
}
