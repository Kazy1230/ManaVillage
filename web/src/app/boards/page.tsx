import type { Metadata } from "next";
import Link from "next/link";
import { timeAgo } from "@/lib/format";
import { catClass, listCategories, listThreads } from "@/lib/queries";

export const metadata: Metadata = { title: "掲示板", alternates: { canonical: "/boards" } };

export default async function BoardsPage(props: PageProps<"/boards">) {
  const sp = await props.searchParams;
  const sort = sp.sort === "popular" ? "popular" : "new";
  const categoryId = Number(sp.category) || undefined;
  const [categories, threads] = await Promise.all([listCategories(), listThreads({ categoryId, sort })]);

  const href = (next: { category?: number; sort?: string }) => {
    const q = new URLSearchParams();
    const c = "category" in next ? next.category : categoryId;
    const s = next.sort ?? sort;
    if (c) q.set("category", String(c));
    if (s === "popular") q.set("sort", "popular");
    const qs = q.toString();
    return qs ? `/boards?${qs}` : "/boards";
  };

  return (
    <div className="screen">
      <div className="wrap">
        <div className="panel ptitle intro">
          <span className="sub">/boards</span>
          <h1>掲示板</h1>
          <p className="sub">学習者どうしで質問・相談・報告ができる場所です。カテゴリはスレッドを作る人が自由に追加できます。</p>
          <span className="deco" aria-hidden="true">Talk.</span>
        </div>

        <div className="panel toolbar">
          <nav className="chips" aria-label="カテゴリ">
            <Link className="chip" href={href({ category: undefined })} aria-current={!categoryId ? "page" : undefined}>すべて</Link>
            {categories.map((c) => (
              <Link className="chip" key={c.id} href={href({ category: c.id })} aria-current={c.id === categoryId ? "page" : undefined}>{c.name}</Link>
            ))}
          </nav>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <nav className="seg" aria-label="並び替え">
              <Link href={href({ sort: "new" })} aria-current={sort === "new" ? "page" : undefined}>新着順</Link>
              <Link href={href({ sort: "popular" })} aria-current={sort === "popular" ? "page" : undefined}>人気順</Link>
            </nav>
            <Link className="btn primary" href="/boards/new">＋ スレッドを作る</Link>
          </div>
        </div>

        {threads.length === 0 ? (
          <div className="panel empty">
            <p style={{ marginBottom: 16 }}>まだスレッドがありません。</p>
            <Link className="btn primary" href="/boards/new">最初のスレッドを作る</Link>
          </div>
        ) : (
          <div className="board-list">
            {threads.map((t, i) => (
              <Link className="panel board-row pop" key={t.id} href={`/boards/${t.category_id}/${t.id}`} style={{ animationDelay: `${i * 0.05}s` }}>
                <span className="t">{t.title}</span>
                <span className="n"><b>{t.reply_count}</b>返信</span>
                <span className="chev" aria-hidden="true">›</span>
                <span className="info">
                  {t.category && <span className={catClass(t.category.id)}>{t.category.name}</span>}
                  {t.author?.nickname ?? "退会したユーザー"} · {timeAgo(sort === "popular" ? t.last_activity_at : t.created_at)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
