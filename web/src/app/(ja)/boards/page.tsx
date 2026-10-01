import type { Metadata } from "next";
import { BoardsView } from "@/components/pages/BoardViews";

// 英語の画面は中身(投稿)が日本語の画面と同じなので、検索には日本語の /boards だけを出す
export const metadata: Metadata = { title: "掲示板", alternates: { canonical: "/boards" } };

export default async function Page(props: PageProps<"/boards">) {
  return <BoardsView lang="ja" sp={await props.searchParams} />;
}
