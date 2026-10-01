import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleList from "@/components/ArticleList";
import { isSectionLive, isTagIndexable } from "@/lib/articles";

export async function generateMetadata(props: PageProps<"/it/tags/[tag]">): Promise<Metadata> {
  const { tag } = await props.params;
  const name = decodeURIComponent(tag);
  return {
    title: `#${name}`,
    alternates: { canonical: `/it/tags/${tag}` },
    ...(isTagIndexable(name, "it") ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function Page(props: PageProps<"/it/tags/[tag]">) {
  if (!isSectionLive("it")) notFound();
  const { tag } = await props.params;
  return <div className="section-it"><ArticleList section="it" tag={decodeURIComponent(tag)} /></div>;
}
