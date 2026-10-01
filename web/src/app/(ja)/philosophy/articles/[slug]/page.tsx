import type { Metadata } from "next";
import ArticleView, { articleMetadata } from "@/components/ArticleView";

export async function generateMetadata(props: PageProps<"/philosophy/articles/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  return articleMetadata(slug, "philosophy");
}

export default async function Page(props: PageProps<"/philosophy/articles/[slug]">) {
  const { slug } = await props.params;
  return <div className="section-philosophy"><ArticleView slug={slug} section="philosophy" /></div>;
}
