import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { addThreadPost } from "@/app/actions";
import Discussion from "@/components/Discussion";
import ReadingProgress from "@/components/ReadingProgress";
import { getViewer } from "@/lib/auth";
import { formatDate, initial } from "@/lib/format";
import { asPosts, catClass, POST_COLUMNS } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

type Thread = {
  id: number;
  title: string;
  body: string;
  user_id: string;
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

export async function generateMetadata(props: PageProps<"/boards/[category]/[threadId]">): Promise<Metadata> {
  const { threadId } = await props.params;
  const thread = await loadThread(Number(threadId));
  if (!thread) return {};
  return {
    title: thread.title,
    alternates: { canonical: `/boards/${thread.category_id}/${thread.id}` },
    // 返信がまだないスレッドは中身が薄いので、検索に出さない
    ...(thread.reply_count === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ThreadPage(props: PageProps<"/boards/[category]/[threadId]">) {
  const { category, threadId } = await props.params;
  const id = Number(threadId);
  if (!Number.isInteger(id)) notFound();
  const thread = await loadThread(id);
  if (!thread) notFound();
  if (String(thread.category_id) !== category) redirect(`/boards/${thread.category_id}/${thread.id}`);

  const supabase = await createClient();
  const [viewer, { data }] = await Promise.all([
    getViewer(),
    supabase.from("thread_posts").select(POST_COLUMNS).eq("thread_id", id).order("created_at", { ascending: false }),
  ]);
  const path = `/boards/${thread.category_id}/${thread.id}`;
  const owner = thread.author?.nickname ?? "退会したユーザー";

  return (
    <div className="screen">
      <ReadingProgress />
      <div className="wrap reader-grid">
        <article className="panel paper">
          <div className="crumb">
            <Link href="/boards">掲示板</Link>
            {thread.category && (<><span>/</span><Link href={`/boards?category=${thread.category.id}`}>{thread.category.name}</Link></>)}
          </div>
          {thread.category && <span className={catClass(thread.category.id)} style={{ marginBottom: 14 }}>{thread.category.name}</span>}
          <h1>{thread.title}</h1>
          <div className="byline" style={{ marginBottom: 28 }}>
            <div className="avatar" aria-hidden="true">{initial(owner)}</div>
            <div>
              <div className="who">{owner}</div>
              <div className="sub">{formatDate(thread.created_at)}作成 · 返信 {thread.reply_count}</div>
            </div>
          </div>
          <p className="thread-body">{thread.body}</p>
        </article>

        <Discussion
          title="返信"
          rows={asPosts(data)}
          action={addThreadPost}
          hidden={{ thread_id: String(thread.id) }}
          loggedIn={!!viewer}
          path={path}
          placeholder="このスレッドに書き込む"
          empty="まだ返信はありません。最初の返信を書いてみませんか？"
          badge={(r) => (r.user_id === thread.user_id ? "スレ主" : null)}
        />
      </div>
    </div>
  );
}
