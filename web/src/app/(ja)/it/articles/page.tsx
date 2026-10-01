import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleList from "@/components/ArticleList";
import { isSectionLive } from "@/lib/articles";

export const metadata: Metadata = { title: "ITの記事", alternates: { canonical: "/it/articles" } };

export default function Page() {
  if (!isSectionLive("it")) notFound();
  return <div className="section-it"><ArticleList section="it" /></div>;
}
