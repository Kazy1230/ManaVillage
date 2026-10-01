import type { Metadata } from "next";
import ArticleView, { articleMetadata } from "@/components/ArticleView";

export async function generateMetadata(props: PageProps<"/it/articles/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  return articleMetadata(slug, "it");
}

export default async function Page(props: PageProps<"/it/articles/[slug]">) {
  const { slug } = await props.params;
  return <div className="section-it"><ArticleView slug={slug} section="it" /></div>;
}
