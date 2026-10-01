import type { Metadata } from "next";
import ArticleView, { articleMetadata } from "@/components/ArticleView";

export async function generateMetadata(props: PageProps<"/relationships/articles/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  return articleMetadata(slug, "relationships");
}

export default async function Page(props: PageProps<"/relationships/articles/[slug]">) {
  const { slug } = await props.params;
  return <div className="section-relationships"><ArticleView slug={slug} section="relationships" /></div>;
}
