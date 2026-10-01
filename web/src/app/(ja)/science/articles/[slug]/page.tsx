import type { Metadata } from "next";
import ArticleView, { articleMetadata } from "@/components/ArticleView";

export async function generateMetadata(props: PageProps<"/science/articles/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  return articleMetadata(slug, "science");
}

export default async function Page(props: PageProps<"/science/articles/[slug]">) {
  const { slug } = await props.params;
  return <div className="section-science"><ArticleView slug={slug} section="science" /></div>;
}
