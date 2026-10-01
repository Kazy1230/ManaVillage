import type { Metadata } from "next";
import Link from "next/link";
import { logout, updateNickname } from "@/app/actions";
import ActionForm from "@/components/ActionForm";
import { findArticle } from "@/lib/articles";
import { requireViewer } from "@/lib/auth";
import { formatDate, initial, timeAgo } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "マイページ" };

type Item = { key: string; kind: string; cls: string; text: string; context: string; href: string; at: string };

export default async function MyPage() {
  const viewer = await requireViewer("/mypage");
  const supabase = await createClient();

  const [comments, threads, posts, profile] = await Promise.all([
    supabase.from("comments").select("id, article_slug, body, created_at", { count: "exact" }).eq("user_id", viewer.id).order("created_at", { ascending: false }).limit(20),
    supabase.from("threads").select("id, title, category_id, reply_count, created_at", { count: "exact" }).eq("user_id", viewer.id).order("created_at", { ascending: false }).limit(20),
    supabase.from("thread_posts").select("id, body, created_at, thread:threads(id, title, category_id)", { count: "exact" }).eq("user_id", viewer.id).order("created_at", { ascending: false }).limit(20),
    supabase.from("profiles").select("created_at").eq("id", viewer.id).single(),
  ]);

  const items: Item[] = [
    ...(comments.data ?? []).map((c) => {
      const a = findArticle(c.article_slug);
      return { key: `c${c.id}`, kind: "記事へのコメント", cls: "cat c0", text: c.body, context: a?.title ?? c.article_slug, href: `${a?.url ?? `/articles/${c.article_slug}`}#p-${c.id}`, at: c.created_at };
    }),
    ...(threads.data ?? []).map((t) => ({
      key: `t${t.id}`, kind: "スレッド", cls: "cat c1", text: t.title, context: `返信 ${t.reply_count}`, href: `/boards/${t.category_id}/${t.id}`, at: t.created_at,
    })),
    ...(posts.data ?? []).map((p) => {
      const t = p.thread as unknown as { id: number; title: string; category_id: number } | null;
      return { key: `p${p.id}`, kind: "スレッドへの書き込み", cls: "cat c2", text: p.body, context: t?.title ?? "", href: t ? `/boards/${t.category_id}/${t.id}#p-${p.id}` : "/boards", at: p.created_at };
    }),
  ].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 30);

  return (
    <div className="screen">
      <div className="wrap">
        <div className="panel profile intro">
          <div className="avatar" aria-hidden="true">{initial(viewer.nickname)}</div>
          <div>
            <h1>{viewer.nickname}</h1>
            {profile.data && <p className="sub">{formatDate(profile.data.created_at)}から参加</p>}
          </div>
          <div className="stats">
            <div><b>{comments.count ?? 0}</b><span>コメント</span></div>
            <div><b>{threads.count ?? 0}</b><span>スレッド</span></div>
            <div><b>{posts.count ?? 0}</b><span>書き込み</span></div>
          </div>
        </div>

        <div className="my-grid">
          <section className="panel list-panel reveal">
            <div className="c-head"><h2>自分の投稿</h2></div>
            {items.length === 0 ? (
              <p className="empty">まだ投稿はありません。記事にコメントしたり、掲示板でスレッドを作ったりしてみましょう。</p>
            ) : (
              items.map((it) => (
                <Link className="my-item" key={it.key} href={it.href}>
                  <span className={it.cls}>{it.kind}</span>
                  <span className="t">{it.text}</span>
                  <span className="sub">{it.context} · {timeAgo(it.at)}</span>
                </Link>
              ))
            )}
          </section>

          <div style={{ display: "grid", gap: 28 }}>
            <section className="panel side-form reveal">
              <h2 style={{ fontSize: 18 }}>プロフィール</h2>
              <ActionForm action={updateNickname} submitLabel="保存する" buttonClass="btn">
                <label className="field" htmlFor="my-nick">
                  ニックネーム
                  <input id="my-nick" name="nickname" required maxLength={30} defaultValue={viewer.nickname} />
                </label>
              </ActionForm>
              <p className="sub">返信がつくと {viewer.email} にお知らせが届きます。</p>
            </section>
            <section className="panel side-form reveal">
              <h2 style={{ fontSize: 18 }}>アカウント</h2>
              <Link className="btn" href="/update-password">パスワードを変更する</Link>
              <form action={logout}><button className="btn block-btn" type="submit">ログアウト</button></form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
