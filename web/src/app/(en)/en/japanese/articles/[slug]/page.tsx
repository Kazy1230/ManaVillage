import type { Metadata } from "next";
import ArticleView, { articleMetadata } from "@/components/ArticleView";

export async function generateMetadata(props: PageProps<"/en/japanese/articles/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  return articleMetadata(slug, "japanese");
}

export default async function JapaneseArticlePage(props: PageProps<"/en/japanese/articles/[slug]">) {
  const { slug } = await props.params;
  return <ArticleView slug={slug} section="japanese" />;
}
