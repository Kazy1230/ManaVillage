import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleList from "@/components/ArticleList";
import { isSectionLive, isTagIndexable } from "@/lib/articles";

export async function generateMetadata(props: PageProps<"/science/tags/[tag]">): Promise<Metadata> {
  const { tag } = await props.params;
  const name = decodeURIComponent(tag);
  return {
    title: `#${name}`,
    alternates: { canonical: `/science/tags/${tag}` },
    ...(isTagIndexable(name, "science") ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function Page(props: PageProps<"/science/tags/[tag]">) {
  if (!isSectionLive("science")) notFound();
  const { tag } = await props.params;
  return <div className="section-science"><ArticleList section="science" tag={decodeURIComponent(tag)} /></div>;
}
