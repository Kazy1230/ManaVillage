// 掲示板の一覧・スレッドを作る・スレッドの画面。日本語(/boards)と英語(/en/boards)で共通。中身(投稿)は同じ
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { addThreadPost, createThread } from "@/app/actions";
import ActionForm from "@/components/ActionForm";
import Discussion from "@/components/Discussion";
import ReadingProgress from "@/components/ReadingProgress";
import { getViewer, requireViewer } from "@/lib/auth";
import { formatDate, initial, timeAgo } from "@/lib/format";
import { lp } from "@/lib/paths";
import { asPosts, catClass, listCategories, listThreads, POST_COLUMNS } from "@/lib/queries";
import type { Lang } from "@/lib/sections";
import { createClient } from "@/lib/supabase/server";

type SP = Record<string, string | string[] | undefined>;

const T = {
  ja: {
    board: "掲示板",
    boardSub: "学習者どうしで質問・相談・報告ができる場所です。カテゴリはスレッドを作る人が自由に追加できます。",
    all: "すべて",
    categories: "カテゴリ",
    sortLabel: "並び替え",
    newest: "新着順",
    popular: "人気順",
    newThread: "＋ スレッドを作る",
    empty: "まだスレッドがありません。",
    firstThread: "最初のスレッドを作る",
    replies: "返信",
    deleted: "退会したユーザー",
    newTitle: "スレッドを作る",
    newCrumb: "新しいスレッド",
    newSub: "返信がつくと登録メールアドレスにお知らせします。",
    create: "スレッドを作成する",
    creating: "作成中…",
    pickCat: "カテゴリを選ぶ",
    choose: "選択してください",
    or: "または",
    newCat: "新しいカテゴリを作る",
    newCatPh: "例：発音の悩み",
    newCatHint: "入力すると、上で選んだカテゴリより優先されます。同じ名前のカテゴリがあればそちらに入ります。",
    title: "タイトル",
    titlePh: "例：英語日記を続けるコツを教えてください",
    titleHint: "一覧に表示されます。内容がひと目でわかるタイトルにしましょう。",
    body: "本文",
    bodyPh: "聞きたいこと、話したいことを書いてください",
    created: (d: string, n: number) => `${d}作成 · 返信 ${n}`,
    replyTitle: "返信",
    replyPh: "このスレッドに書き込む",
    replyEmpty: "まだ返信はありません。最初の返信を書いてみませんか？",
    owner: "スレ主",
  },
  en: {
    board: "Board",
    boardSub: "A place where learners ask questions, talk things over, and share progress. Anyone starting a thread can add a new category. Posts are shared with our Japanese-speaking learners, so you’ll see both languages.",
    all: "All",
    categories: "Categories",
    sortLabel: "Sort",
    newest: "Newest",
    popular: "Popular",
    newThread: "+ Start a thread",
    empty: "No threads yet.",
    firstThread: "Start the first thread",
    replies: "replies",
    deleted: "Deleted user",
    newTitle: "Start a thread",
    newCrumb: "New thread",
    newSub: "We’ll email you when someone replies.",
    create: "Create the thread",
    creating: "Creating…",
    pickCat: "Choose a category",
    choose: "Select one",
    or: "or",
    newCat: "Create a new category",
    newCatPh: "e.g. Kanji questions",
    newCatHint: "If you fill this in, it takes priority over the category above. If a category with the same name exists, your thread goes there.",
    title: "Title",
    titlePh: "e.g. How do you keep a Japanese diary going?",
    titleHint: "Shown in the list. Make it clear what the thread is about.",
    body: "Message",
    bodyPh: "Write what you want to ask or talk about",
    created: (d: string, n: number) => `Started ${d} · ${n} ${n === 1 ? "reply" : "replies"}`,
    replyTitle: "Replies",
    replyPh: "Write a reply to this thread",
    replyEmpty: "No replies yet. Why not write the first one?",
    owner: "Thread starter",
  },
} as const;

// ---------- 一覧 ----------

export async function BoardsView({ lang, sp }: { lang: Lang; sp: SP }) {
  const s = T[lang];
  const sort = sp.sort === "popular" ? "popular" : "new";
  const categoryId = Number(sp.category) || undefined;
  const [categories, threads] = await Promise.all([listCategories(), listThreads({ categoryId, sort })]);
  const base = lp(lang, "/boards");

  const href = (next: { category?: number; sort?: string }) => {
    const q = new URLSearchParams();
    const c = "category" in next ? next.category : categoryId;
    const so = next.sort ?? sort;
    if (c) q.set("category", String(c));
    if (so === "popular") q.set("sort", "popular");
    const qs = q.toString();
    return qs ? `${base}?${qs}` : base;
  };

  return (
    <div className="screen">
      <div className="wrap">
        <div className="panel ptitle intro">
          <span className="sub">{base}</span>
          <h1>{s.board}</h1>
          <p className="sub">{s.boardSub}</p>
          <span className="deco" aria-hidden="true">Talk.</span>
        </div>

        <div className="panel toolbar">
          <nav className="chips" aria-label={s.categories}>
            <Link className="chip" href={href({ category: undefined })} aria-current={!categoryId ? "page" : undefined}>{s.all}</Link>
            {categories.map((c) => (
              <Link className="chip" key={c.id} href={href({ category: c.id })} aria-current={c.id === categoryId ? "page" : undefined}>{c.name}</Link>
            ))}
          </nav>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <nav className="seg" aria-label={s.sortLabel}>
              <Link href={href({ sort: "new" })} aria-current={sort === "new" ? "page" : undefined}>{s.newest}</Link>
              <Link href={href({ sort: "popular" })} aria-current={sort === "popular" ? "page" : undefined}>{s.popular}</Link>
            </nav>
            <Link className="btn primary" href={lp(lang, "/boards/new")}>{s.newThread}</Link>
          </div>
        </div>

        {threads.length === 0 ? (
          <div className="panel empty">
            <p style={{ marginBottom: 16 }}>{s.empty}</p>
            <Link className="btn primary" href={lp(lang, "/boards/new")}>{s.firstThread}</Link>
          </div>
        ) : (
          <div className="board-list">
            {threads.map((t, i) => (
              <Link className="panel board-row pop" key={t.id} href={lp(lang, `/boards/${t.category_id}/${t.id}`)} style={{ animationDelay: `${i * 0.05}s` }}>
                <span className="t">{t.title}</span>
                <span className="n"><b>{t.reply_count}</b>{s.replies}</span>
                <span className="chev" aria-hidden="true">›</span>
                <span className="info">
                  {t.category && <span className={catClass(t.category.id)}>{t.category.name}</span>}
                  {t.author?.nickname ?? s.deleted} · {timeAgo(sort === "popular" ? t.last_activity_at : t.created_at, lang)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- スレッドを作る ----------

export async function NewThreadView({ lang }: { lang: Lang }) {
  const s = T[lang];
  await requireViewer(lp(lang, "/boards/new"), lang);
  const categories = await listCategories();

  return (
    <div className="screen">
      <div className="wrap reader-grid">
        <div className="panel paper intro">
          <div className="crumb"><Link href={lp(lang, "/boards")}>{s.board}</Link><span>/</span><span>{s.newCrumb}</span></div>
          <h1 style={{ marginBottom: 8 }}>{s.newTitle}</h1>
          <p className="sub" style={{ marginBottom: 32 }}>{s.newSub}</p>
          <ActionForm action={createThread} submitLabel={s.create} pendingLabel={s.creating}>
            <input type="hidden" name="lang" value={lang} />
            {categories.length > 0 && (
              <label className="field" htmlFor="nt-cat">
                {s.pickCat}
                <select id="nt-cat" name="category_id" defaultValue="">
                  <option value="">{s.choose}</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
            )}
            {categories.length > 0 && <div className="or">{s.or}</div>}
            <label className="field" htmlFor="nt-newcat">
              {s.newCat}
              <input id="nt-newcat" name="new_category" maxLength={30} placeholder={s.newCatPh} />
              <span className="hint">{s.newCatHint}</span>
            </label>
            <label className="field" htmlFor="nt-title">
              {s.title}
              <input id="nt-title" name="title" required maxLength={100} placeholder={s.titlePh} />
              <span className="hint">{s.titleHint}</span>
            </label>
            <label className="field" htmlFor="nt-body">
              {s.body}
              <textarea id="nt-body" name="body" required maxLength={5000} placeholder={s.bodyPh} />
            </label>
          </ActionForm>
        </div>
      </div>
    </div>
  );
}

// ---------- スレッド ----------

type Thread = {
  id: number;
  title: string;
  body: string;
  user_id: string | null;
  created_at: string;
  reply_count: number;
  category_id: number;
  category: { id: number; name: string } | null;
  author: { nickname: string } | null;
};

async function loadThread(id: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("threads")
    .select("id, title, body, user_id, created_at, reply_count, category_id, category:board_categories(id, name), author:profiles(nickname)")
    .eq("id", id)
    .maybeSingle();
  return data as unknown as Thread | null;
}

export async function threadMetadata(threadId: string, lang: Lang): Promise<Metadata> {
  const thread = await loadThread(Number(threadId));
  if (!thread) return {};
  const path = `/boards/${thread.category_id}/${thread.id}`;
  return {
    title: thread.title,
    // 英語の画面は日本語の画面と中身(投稿)が同じなので、検索には日本語の URL だけを出す
    alternates: { canonical: path },
    ...(thread.reply_count === 0 || lang === "en" ? { robots: { index: false, follow: true } } : {}),
  };
}

export async function ThreadView({ lang, category, threadId }: { lang: Lang; category: string; threadId: string }) {
  const s = T[lang];
  const id = Number(threadId);
  if (!Number.isInteger(id)) notFound();
  const thread = await loadThread(id);
  if (!thread) notFound();
  const path = lp(lang, `/boards/${thread.category_id}/${thread.id}`);
  if (String(thread.category_id) !== category) redirect(path);

  const supabase = await createClient();
  const [viewer, { data }] = await Promise.all([
    getViewer(),
    supabase.from("thread_posts").select(POST_COLUMNS).eq("thread_id", id).order("created_at", { ascending: false }),
  ]);
  const owner = thread.author?.nickname ?? s.deleted;

  return (
    <div className="screen">
      <ReadingProgress />
      <div className="wrap reader-grid">
        <article className="panel paper">
          <div className="crumb">
            <Link href={lp(lang, "/boards")}>{s.board}</Link>
            {thread.category && (<><span>/</span><Link href={`${lp(lang, "/boards")}?category=${thread.category.id}`}>{thread.category.name}</Link></>)}
          </div>
          {thread.category && <span className={catClass(thread.category.id)} style={{ marginBottom: 14 }}>{thread.category.name}</span>}
          <h1>{thread.title}</h1>
          <div className="byline" style={{ marginBottom: 28 }}>
            <div className="avatar" aria-hidden="true">{initial(owner)}</div>
            <div>
              <div className="who">{owner}</div>
              <div className="sub">{s.created(formatDate(thread.created_at, lang), thread.reply_count)}</div>
            </div>
          </div>
          <p className="thread-body">{thread.body}</p>
        </article>

        <Discussion
          title={s.replyTitle}
          rows={asPosts(data)}
          action={addThreadPost}
          hidden={{ thread_id: String(thread.id), lang }}
          loggedIn={!!viewer}
          path={path}
          placeholder={s.replyPh}
          empty={s.replyEmpty}
          badge={(r) => (r.user_id && r.user_id === thread.user_id ? s.owner : null)}
          lang={lang}
        />
      </div>
    </div>
  );
}
