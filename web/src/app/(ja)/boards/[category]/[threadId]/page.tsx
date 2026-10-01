import type { Metadata } from "next";
import { ThreadView, threadMetadata } from "@/components/pages/BoardViews";

export async function generateMetadata(props: PageProps<"/boards/[category]/[threadId]">): Promise<Metadata> {
  const { threadId } = await props.params;
  return threadMetadata(threadId, "ja");
}

export default async function Page(props: PageProps<"/boards/[category]/[threadId]">) {
  const { category, threadId } = await props.params;
  return <ThreadView lang="ja" category={category} threadId={threadId} />;
}
