import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { getAllArticles, getTagCounts } from "@/lib/articles";
import { t } from "@/lib/i18n";
import { getCommentCounts } from "@/lib/queries";
import { SECTIONS, type SectionKey } from "@/lib/sections";
import { TAG_DESCRIPTIONS } from "@/lib/tags";

export default async function ArticleList({ tag, section = "english" }: { tag?: string; section?: SectionKey }) {
  const sec = SECTIONS[section];
  const s = t(sec.lang);
  const all = getAllArticles(section);
  const list = tag ? all.filter((a) => a.tags.includes(tag)) : all;
  const counts = await getCommentCounts();
  const desc = section === "english" && tag ? TAG_DESCRIPTIONS[tag] : undefined;

  return (
    <div className="screen">
      <div className="wrap">
        <div className="panel ptitle intro">
          <span className="sub">{tag ? s.tag : sec.articles}</span>
          <h1>{tag ? `#${tag}` : s.articles}</h1>
          {desc && <p style={{ maxWidth: "40em", position: "relative" }}>{desc}</p>}
          <p className="sub">{s.articleCount(list.length)}</p>
          <span className="deco" aria-hidden="true">Read.</span>
        </div>
        <nav className="panel toolbar" aria-label={s.filterByTag}>
          <div className="chips">
            <Link className="chip" href={sec.articles} aria-current={!tag ? "page" : undefined}>{s.all}</Link>
            {getTagCounts(section).map(([tg, n]) => (
              <Link className="chip" key={tg} href={`${sec.tags}/${encodeURIComponent(tg)}`} aria-current={tg === tag ? "page" : undefined}>
                #{tg}<span className="n">{n}</span>
              </Link>
            ))}
          </div>
        </nav>
        {list.length === 0 ? (
          <p className="panel empty">{s.noArticles}</p>
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
