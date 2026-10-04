import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleList from "@/components/ArticleList";
import { isSectionLive, isTagIndexable } from "@/lib/articles";

export async function generateMetadata(props: PageProps<"/tags/[tag]">): Promise<Metadata> {
  const { tag } = await props.params;
  const name = decodeURIComponent(tag);
  return {
    title: `#${name}`,
    alternates: { canonical: `/tags/${tag}` },
    ...(isTagIndexable(name) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function TagPage(props: PageProps<"/tags/[tag]">) {
  if (!isSectionLive("english")) notFound();
  const { tag } = await props.params;
  return <ArticleList tag={decodeURIComponent(tag)} />;
}
