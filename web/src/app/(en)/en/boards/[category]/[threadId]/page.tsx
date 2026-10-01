import type { Metadata } from "next";
import { ThreadView, threadMetadata } from "@/components/pages/BoardViews";

export async function generateMetadata(props: PageProps<"/en/boards/[category]/[threadId]">): Promise<Metadata> {
  const { threadId } = await props.params;
  return threadMetadata(threadId, "en");
}

export default async function Page(props: PageProps<"/en/boards/[category]/[threadId]">) {
  const { category, threadId } = await props.params;
  return <ThreadView lang="en" category={category} threadId={threadId} />;
}
