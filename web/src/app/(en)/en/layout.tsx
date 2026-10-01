import { notFound } from "next/navigation";
import { englishPagesLive } from "@/lib/articles";

// 英語のページ(/en/...)は、英語で書く科目(日本語学習)に公開済みの記事が出るまで、本番では出さない
export default function EnLayout({ children }: { children: React.ReactNode }) {
  if (!englishPagesLive()) notFound();
  return children;
}
