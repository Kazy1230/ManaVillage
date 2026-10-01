import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleList from "@/components/ArticleList";
import { isSectionLive } from "@/lib/articles";

export const metadata: Metadata = { title: "科学の記事", alternates: { canonical: "/science/articles" } };

export default function Page() {
  if (!isSectionLive("science")) notFound();
  return <div className="section-science"><ArticleList section="science" /></div>;
}
