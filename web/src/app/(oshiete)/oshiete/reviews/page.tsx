import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "レビュー一覧", robots: { index: false } };

type Review = { id: number; user_id: string | null; rating: number; best: string | null; hard: string | null; created_at: string };

// 体験版のあとのレビュー(管理者=Kaz だけが見られる。読み取りは RLS でも管理者に限っている)
export default async function Page() {
  const viewer = await requireViewer("/oshiete/reviews");
  if (!viewer.isAdmin) notFound();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("oshiete_reviews")
    .select("id, user_id, rating, best, hard, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  const rows = (data ?? []) as Review[];
  const avg = rows.length ? (rows.reduce((a, r) => a + r.rating, 0) / rows.length).toFixed(2) : "-";
  return (
    <main className="page">
      <h1>おしえて英語のレビュー</h1>
      {error ? <p>読み込めませんでした：{error.message}</p> : <p>{rows.length}件・平均 ★{avg}</p>}
      {rows.map((r) => (
        <div key={r.id} className="card">
          <span className="stars-s" aria-label={`★${r.rating}`}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
          <span className="meta">
            {new Date(r.created_at).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}・{r.user_id ? "ログインした人" : "ログインしていない人"}
          </span>
          <dl>
            <dt>いちばんよかったところ</dt>
            <dd>{r.best || "（空）"}</dd>
            <dt>分かりにくかった・やりにくかったところ</dt>
            <dd>{r.hard || "（空）"}</dd>
          </dl>
        </div>
      ))}
    </main>
  );
}
