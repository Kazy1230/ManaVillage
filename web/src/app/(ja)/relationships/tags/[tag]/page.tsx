import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleList from "@/components/ArticleList";
import { isSectionLive, isTagIndexable } from "@/lib/articles";

export async function generateMetadata(props: PageProps<"/relationships/tags/[tag]">): Promise<Metadata> {
  const { tag } = await props.params;
  const name = decodeURIComponent(tag);
  return {
    title: `#${name}`,
    alternates: { canonical: `/relationships/tags/${tag}` },
    ...(isTagIndexable(name, "relationships") ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function Page(props: PageProps<"/relationships/tags/[tag]">) {
  if (!isSectionLive("relationships")) notFound();
  const { tag } = await props.params;
  return <div className="section-relationships"><ArticleList section="relationships" tag={decodeURIComponent(tag)} /></div>;
}
