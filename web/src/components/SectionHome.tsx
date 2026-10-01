import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import { getAllArticles, getTagCounts, isSectionLive } from "@/lib/articles";
import { shortDate } from "@/lib/format";
import { catClass, getCommentCounts, listThreads } from "@/lib/queries";
import { SECTION_PAGES } from "@/lib/sectionPages";
import { SECTIONS, type SectionKey } from "@/lib/sections";

// 科目のトップ(IT、哲学、科学、人間関係)。並びは英語学習のトップと同じ:
// h1 の帯 → 最新記事のヒーロー → 用語の帯 → 新着記事 → タグ → 掲示板
export default async function SectionHome({ section }: { section: SectionKey }) {
  const page = SECTION_PAGES[section];
  if (!page || !isSectionLive(section)) notFound();
  const sec = SECTIONS[section];
  const articles = getAllArticles(section);
  const [latest, ...rest] = articles;
  const [counts, threads] = await Promise.all([getCommentCounts(), listThreads({ sort: "popular", limit: 3 })]);
  const tags = getTagCounts(section);

  return (
    <div className={`screen ${page.theme}`}>
      <div className="wrap home-intro">
        <h1>{page.h1}</h1>
        <p>{page.intro}</p>
      </div>
      <div className="wrap">
        {latest ? (
          <Link className="panel hero" href={latest.url}>
            <div className="hero-text intro">
              <span className="badge-new"><i />最新記事</span>
              <h2 dangerouslySetInnerHTML={{ __html: latest.titleHtml }} />
              <p className="lead">{latest.summary}</p>
              <div className="meta">
                {latest.tags[0] && <span className="tag">#{latest.tags[0]}</span>}
                <span className="dot-sep" /><span>{shortDate(latest.date)}</span>
                <span className="dot-sep" /><span>{latest.minutes}分で読める</span>
              </div>
              <span className="btn primary" style={{ justifySelf: "start" }}>記事を読む <span className="arr">→</span></span>
            </div>
            <div className="stage" aria-hidden="true">
              <span className="stage-label">{page.stageLabel}</span>
              <div className="phrase in"><span className="code"><mark>{latest.keyword}</mark></span></div>
            </div>
          </Link>
        ) : (
          <div className="panel hero">
            <div className="hero-text intro">
              <span className="badge-new"><i />準備中</span>
              <h2>最初の記事を準備しています。</h2>
              <p className="lead">記事が公開されるまで、掲示板で質問や話し合いができます。</p>
              <Link className="btn primary" href="/boards" style={{ justifySelf: "start" }}>掲示板をひらく <span className="arr">→</span></Link>
            </div>
            <div className="stage" aria-hidden="true">
              <span className="stage-label">COMING SOON</span>
              <div className="phrase in"><span className="code"><mark>{sec.label}</mark></span></div>
            </div>
          </div>
        )}
      </div>

      <div className="ticker bleed" aria-label="用語">
        <div className="ticker-track">
          {[...page.ticker, ...page.ticker].map(([term, desc], n) => (
            <span className="ticker-item" key={n} aria-hidden={n >= page.ticker.length}>
              <span className="code">{term}</span>{desc}<span className="sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="wrap">
        <section className="block">
          <div className="sec-head reveal">
            <div><h2>新着記事</h2><p className="sub">{page.newSub}</p></div>
            <Link className="more" href={sec.articles}>すべての記事 <span className="arr">→</span></Link>
          </div>
          {rest.length === 0 ? (
            <p className="panel empty">記事はまだこれだけです。更新をお待ちください。</p>
          ) : (
            <div className="cards">
              {rest.slice(0, 6).map((a, i) => <ArticleCard key={a.slug} article={a} index={i + 1} comments={counts.get(a.slug) ?? 0} />)}
            </div>
          )}
        </section>

        {tags.length > 0 && (
          <section className="block">
            <div className="sec-head reveal">
              <div><h2>タグから探す</h2><p className="sub">記事が増えるたびにタグも増えていきます</p></div>
            </div>
            <div className="chips reveal">
              {tags.map(([tg, n]) => (
                <Link className="chip" key={tg} href={`${sec.tags}/${encodeURIComponent(tg)}`}>#{tg}<span className="n">{n}</span></Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <section className="band bleed">
        <div className="wrap band-in">
          <div className="reveal">
            <h2>掲示板</h2>
            <p>{page.boardText}</p>
            <Link className="btn" href="/boards">掲示板をひらく <span className="arr">→</span></Link>
          </div>
          <div className="band-list">
            {threads.length === 0 ? (
              <p className="empty">まだスレッドはありません。最初のスレッドを作ってみませんか？</p>
            ) : (
              threads.map((t) => (
                <Link className="band-item reveal" key={t.id} href={`/boards/${t.category_id}/${t.id}`}>
                  <span className="t">{t.title}</span>
                  <span className="n">返信 {t.reply_count}</span>
                  {t.category && <span className={catClass(t.category.id)}>{t.category.name}</span>}
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
