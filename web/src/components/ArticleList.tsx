import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { getAllArticles, getTagCounts } from "@/lib/articles";
import { getCommentCounts } from "@/lib/queries";
import { TAG_DESCRIPTIONS } from "@/lib/tags";

export default async function ArticleList({ tag }: { tag?: string }) {
  const all = getAllArticles();
  const list = tag ? all.filter((a) => a.tags.includes(tag)) : all;
  const counts = await getCommentCounts();

  return (
    <div className="screen">
      <div className="wrap">
        <div className="panel ptitle intro">
          <span className="sub">{tag ? "タグ" : "/articles"}</span>
          <h1>{tag ? `#${tag}` : "記事"}</h1>
          {tag && TAG_DESCRIPTIONS[tag] && <p style={{ maxWidth: "40em", position: "relative" }}>{TAG_DESCRIPTIONS[tag]}</p>}
          <p className="sub">{list.length}件の記事 · 新着順</p>
          <span className="deco" aria-hidden="true">Read.</span>
        </div>
        <nav className="panel toolbar" aria-label="タグで絞り込み">
          <div className="chips">
            <Link className="chip" href="/articles" aria-current={!tag ? "page" : undefined}>すべて</Link>
            {getTagCounts().map(([t, n]) => (
              <Link className="chip" key={t} href={`/tags/${encodeURIComponent(t)}`} aria-current={t === tag ? "page" : undefined}>
                #{t}<span className="n">{n}</span>
              </Link>
            ))}
          </div>
        </nav>
        {list.length === 0 ? (
          <p className="panel empty">このタグの記事はまだありません。</p>
        ) : (
          <div className="cards">
            {list.map((a) => (
              <ArticleCard key={a.slug} article={a} index={all.indexOf(a)} comments={counts.get(a.slug) ?? 0} animation="pop" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
