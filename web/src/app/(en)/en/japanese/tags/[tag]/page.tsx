import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleList from "@/components/ArticleList";
import { isSectionLive, isTagIndexable } from "@/lib/articles";

export async function generateMetadata(props: PageProps<"/en/japanese/tags/[tag]">): Promise<Metadata> {
  const { tag } = await props.params;
  const name = decodeURIComponent(tag);
  return {
    title: `#${name}`,
    alternates: { canonical: `/en/japanese/tags/${tag}` },
    ...(isTagIndexable(name, "japanese") ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function JapaneseTagPage(props: PageProps<"/en/japanese/tags/[tag]">) {
  if (!isSectionLive("japanese")) notFound();
  const { tag } = await props.params;
  return <ArticleList section="japanese" tag={decodeURIComponent(tag)} />;
}
