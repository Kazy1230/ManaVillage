// マイページ。日本語(/mypage)と英語(/en/mypage)で共通
import Link from "next/link";
import { logout, updateNickname } from "@/app/actions";
import ActionForm from "@/components/ActionForm";
import { findArticle } from "@/lib/articles";
import { requireViewer } from "@/lib/auth";
import { formatDate, initial, timeAgo } from "@/lib/format";
import { lp } from "@/lib/paths";
import type { Lang } from "@/lib/sections";
import { createClient } from "@/lib/supabase/server";

const T = {
  ja: {
    comment: "記事へのコメント",
    thread: "スレッド",
    post: "スレッドへの書き込み",
    replies: (n: number) => `返信 ${n}`,
    joined: (d: string) => `${d}から参加`,
    comments: "コメント",
    threads: "スレッド",
    posts: "書き込み",
    mine: "自分の投稿",
    none: "まだ投稿はありません。記事にコメントしたり、掲示板でスレッドを作ったりしてみましょう。",
    profile: "プロフィール",
    save: "保存する",
    saving: "送信中…",
    nickname: "ニックネーム",
    notify: (email: string | null) => `返信がつくと ${email} にお知らせが届きます。`,
    account: "アカウント",
    changePw: "パスワードを変更する",
    logout: "ログアウト",
  },
  en: {
    comment: "Comment on an article",
    thread: "Thread",
    post: "Post in a thread",
    replies: (n: number) => `${n} ${n === 1 ? "reply" : "replies"}`,
    joined: (d: string) => `Joined ${d}`,
    comments: "Comments",
    threads: "Threads",
    posts: "Posts",
    mine: "Your posts",
    none: "You haven’t posted anything yet. Try commenting on an article or starting a thread on the board.",
    profile: "Profile",
    save: "Save",
    saving: "Saving…",
    nickname: "Nickname",
    notify: (email: string | null) => `When someone replies, we’ll let you know at ${email}.`,
    account: "Account",
    changePw: "Change password",
    logout: "Log out",
  },
} as const;

type Item = { key: string; kind: string; cls: string; text: string; context: string; href: string; at: string };

export default async function MyPageView({ lang }: { lang: Lang }) {
  const s = T[lang];
  const viewer = await requireViewer(lp(lang, "/mypage"), lang);
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
      return { key: `c${c.id}`, kind: s.comment, cls: "cat c0", text: c.body, context: a?.title ?? c.article_slug, href: `${a?.url ?? `/articles/${c.article_slug}`}#p-${c.id}`, at: c.created_at };
    }),
    ...(threads.data ?? []).map((t) => ({
      key: `t${t.id}`, kind: s.thread, cls: "cat c1", text: t.title, context: s.replies(t.reply_count), href: lp(lang, `/boards/${t.category_id}/${t.id}`), at: t.created_at,
    })),
    ...(posts.data ?? []).map((p) => {
      const t = p.thread as unknown as { id: number; title: string; category_id: number } | null;
      return { key: `p${p.id}`, kind: s.post, cls: "cat c2", text: p.body, context: t?.title ?? "", href: t ? lp(lang, `/boards/${t.category_id}/${t.id}#p-${p.id}`) : lp(lang, "/boards"), at: p.created_at };
    }),
  ].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 30);

  return (
    <div className="screen">
      <div className="wrap">
        <div className="panel profile intro">
          <div className="avatar" aria-hidden="true">{initial(viewer.nickname)}</div>
          <div>
            <h1>{viewer.nickname}</h1>
            {profile.data && <p className="sub">{s.joined(formatDate(profile.data.created_at, lang))}</p>}
          </div>
          <div className="stats">
            <div><b>{comments.count ?? 0}</b><span>{s.comments}</span></div>
            <div><b>{threads.count ?? 0}</b><span>{s.threads}</span></div>
            <div><b>{posts.count ?? 0}</b><span>{s.posts}</span></div>
          </div>
        </div>

        <div className="my-grid">
          <section className="panel list-panel reveal">
            <div className="c-head"><h2>{s.mine}</h2></div>
            {items.length === 0 ? (
              <p className="empty">{s.none}</p>
            ) : (
              items.map((it) => (
                <Link className="my-item" key={it.key} href={it.href}>
                  <span className={it.cls}>{it.kind}</span>
                  <span className="t">{it.text}</span>
                  <span className="sub">{it.context} · {timeAgo(it.at, lang)}</span>
                </Link>
              ))
            )}
          </section>

          <div style={{ display: "grid", gap: 28 }}>
            <section className="panel side-form reveal">
              <h2 style={{ fontSize: 18 }}>{s.profile}</h2>
              <ActionForm action={updateNickname} submitLabel={s.save} pendingLabel={s.saving} buttonClass="btn">
                <input type="hidden" name="lang" value={lang} />
                <label className="field" htmlFor="my-nick">
                  {s.nickname}
                  <input id="my-nick" name="nickname" required maxLength={30} defaultValue={viewer.nickname} />
                </label>
              </ActionForm>
              <p className="sub">{s.notify(viewer.email)}</p>
            </section>
            <section className="panel side-form reveal">
              <h2 style={{ fontSize: 18 }}>{s.account}</h2>
              <Link className="btn" href={lp(lang, "/update-password")}>{s.changePw}</Link>
              <form action={logout}>
                <input type="hidden" name="lang" value={lang} />
                <button className="btn block-btn" type="submit">{s.logout}</button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
