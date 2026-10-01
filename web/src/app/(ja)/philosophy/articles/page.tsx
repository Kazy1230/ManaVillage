import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleList from "@/components/ArticleList";
import { isSectionLive } from "@/lib/articles";

export const metadata: Metadata = { title: "哲学の記事", alternates: { canonical: "/philosophy/articles" } };

export default function Page() {
  if (!isSectionLive("philosophy")) notFound();
  return <div className="section-philosophy"><ArticleList section="philosophy" /></div>;
}
