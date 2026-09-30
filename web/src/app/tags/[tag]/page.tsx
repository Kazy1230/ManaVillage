import type { Metadata } from "next";
import ArticleList from "@/components/ArticleList";
import { isTagIndexable } from "@/lib/articles";

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
  const { tag } = await props.params;
  return <ArticleList tag={decodeURIComponent(tag)} />;
}
