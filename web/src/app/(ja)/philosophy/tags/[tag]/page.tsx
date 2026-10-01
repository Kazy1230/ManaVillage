import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleList from "@/components/ArticleList";
import { isSectionLive, isTagIndexable } from "@/lib/articles";

export async function generateMetadata(props: PageProps<"/philosophy/tags/[tag]">): Promise<Metadata> {
  const { tag } = await props.params;
  const name = decodeURIComponent(tag);
  return {
    title: `#${name}`,
    alternates: { canonical: `/philosophy/tags/${tag}` },
    ...(isTagIndexable(name, "philosophy") ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function Page(props: PageProps<"/philosophy/tags/[tag]">) {
  if (!isSectionLive("philosophy")) notFound();
  const { tag } = await props.params;
  return <div className="section-philosophy"><ArticleList section="philosophy" tag={decodeURIComponent(tag)} /></div>;
}
