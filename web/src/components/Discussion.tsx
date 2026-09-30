import Link from "next/link";
import ActionForm from "@/components/ActionForm";
import ReplyToggle from "@/components/ReplyToggle";
import { initial, timeAgo } from "@/lib/format";
import type { ActionState, PostRow } from "@/lib/types";

type Props = {
  title: string;
  rows: PostRow[];
  action: (state: ActionState, fd: FormData) => Promise<ActionState>;
  hidden: Record<string, string>;
  loggedIn: boolean;
  path: string;
  placeholder: string;
  empty: string;
  badge: (row: PostRow) => string | null;
};

// 返信は根のコメントの下にまとめ、古い順に並べる。根のコメントは新着順。
function buildTree(rows: PostRow[]) {
  const byId = new Map(rows.map((r) => [r.id, r]));
  const rootOf = (r: PostRow) => {
    let cur = r;
    const seen = new Set<number>();
    while (cur.parent_id && byId.has(cur.parent_id) && !seen.has(cur.id)) {
      seen.add(cur.id);
      cur = byId.get(cur.parent_id)!;
    }
    return cur.id;
  };
  const roots = rows.filter((r) => !r.parent_id).sort((a, b) => b.created_at.localeCompare(a.created_at));
  const replies = new Map<number, PostRow[]>();
  for (const r of rows) {
    if (!r.parent_id) continue;
    const root = rootOf(r);
    replies.set(root, [...(replies.get(root) ?? []), r]);
  }
  for (const list of replies.values()) list.sort((a, b) => a.created_at.localeCompare(b.created_at));
  return { roots, replies, byId };
}

export default function Discussion({ title, rows, action, hidden, loggedIn, path, placeholder, empty, badge }: Props) {
  const { roots, replies, byId } = buildTree(rows);
  const loginHref = `/login?next=${encodeURIComponent(path)}`;
  const name = (r: PostRow) => r.author?.nickname ?? "退会したユーザー";

  const Post = ({ row, isReply }: { row: PostRow; isReply?: boolean }) => {
    const parent = row.parent_id ? byId.get(row.parent_id) : undefined;
    const label = badge(row);
    return (
      <div className="cmt" id={`p-${row.id}`}>
        <div className="avatar" aria-hidden="true">{initial(name(row))}</div>
        <div className="cmt-body">
          <div className="who">
            {name(row)}
            {label && <span className="author">{label}</span>}
            <span className="sub">{timeAgo(row.created_at)}</span>
          </div>
          {isReply && parent && parent.parent_id && <span className="to">→ {name(parent)}さんへ</span>}
          <p>{row.body}</p>
          <ReplyToggle action={action} hidden={hidden} parentId={row.id} to={name(row)} loggedIn={loggedIn} loginHref={loginHref} />
        </div>
        {!isReply && replies.get(row.id) && (
          <div className="replies">
            {replies.get(row.id)!.map((r) => <Post key={r.id} row={r} isReply />)}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="panel comments reveal" id="comments">
      <div className="c-head">
        <h2>{title} <span className="sub">{rows.length}件 · 新着順</span></h2>
      </div>
      <div className="c-body">
        {loggedIn ? (
          <ActionForm action={action} submitLabel="投稿する" className="compose" buttonClass="btn primary" footNote="投稿後は編集・削除できません">
            {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
            <label className="sr-only" htmlFor="compose-body">{title}を書く</label>
            <textarea id="compose-body" name="body" required maxLength={2000} placeholder={placeholder} />
          </ActionForm>
        ) : (
          <div className="prompt">
            <span>投稿するにはログインしてください。読むだけならそのままでOKです。</span>
            <Link className="btn primary" href={loginHref}>ログイン</Link>
          </div>
        )}
        {roots.length === 0 ? <p className="empty">{empty}</p> : roots.map((r) => <Post key={r.id} row={r} />)}
      </div>
    </section>
  );
}
