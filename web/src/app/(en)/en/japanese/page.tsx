import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import JaPhraseCarousel from "@/components/JaPhraseCarousel";
import { getAllArticles, getTagCounts, isSectionLive, rubyToHtml } from "@/lib/articles";
import { shortDate } from "@/lib/format";
import { catClass, getCommentCounts, listThreads } from "@/lib/queries";
import { SECTIONS } from "@/lib/sections";

const SEC = SECTIONS.japanese;

export const metadata: Metadata = {
  title: { absolute: "Learn Japanese — Japanese grammar, explained with things you already know | Mana Village" },
  description: "Practical guides to Japanese particles, verb forms, and words that look alike — each one built around a simple analogy and real example sentences, with furigana and romaji.",
  alternates: { canonical: SEC.top },
};

// フレーズの帯。漢字にはルビを付ける(記法 {漢字|かんじ})
const TICKER: [string, string][] = [
  ["いただきます", "Let’s eat"],
  ["お{疲|つか}れさまです", "Thanks for your hard work"],
  ["よろしくお{願|ねが}いします", "Nice to work with you"],
  ["ちょっと{待|ま}って", "Wait a sec"],
  ["なるほど", "I see"],
  ["{気|き}にしないで", "No worries"],
  ["また{明日|あした}", "See you tomorrow"],
];

export default async function JapaneseHome() {
  if (!isSectionLive("japanese")) notFound();
  const articles = getAllArticles("japanese");
  const [latest, ...rest] = articles;
  const [counts, threads] = await Promise.all([getCommentCounts(), listThreads({ sort: "popular", limit: 3 })]);
  const tags = getTagCounts("japanese");

  return (
    <div className="screen">
      <div className="wrap home-intro">
        <h1>Japanese grammar, explained with things you already know.</h1>
        <p>Particles, verb forms, and words that look alike — each guide is built around a simple analogy and real example sentences. Read it, try it, and ask the community on the board when you get stuck.</p>
      </div>
      {latest && (
        <div className="wrap">
          <Link className="panel hero" href={latest.url}>
            <div className="hero-text intro">
              <span className="badge-new"><i />Latest guide</span>
              <h2 dangerouslySetInnerHTML={{ __html: latest.titleHtml }} />
              <p className="lead" dangerouslySetInnerHTML={{ __html: latest.summaryHtml }} />
              <div className="meta">
                {latest.tags[0] && <span className="tag">#{latest.tags[0]}</span>}
                <span className="dot-sep" /><span>{shortDate(latest.date, "en")}</span>
                <span className="dot-sep" /><span>{latest.minutes} min read</span>
              </div>
              <span className="btn primary" style={{ justifySelf: "start" }}>Read the guide <span className="arr">→</span></span>
            </div>
            <div className="stage">
              {latest.jaPhrases.length > 0 ? (
                <>
                  <span className="stage-label">{latest.jaPhrases.length} {latest.jaPhrases.length === 1 ? "SENTENCE" : "SENTENCES"} IN THIS GUIDE</span>
                  <JaPhraseCarousel phrases={latest.jaPhrases} />
                </>
              ) : (
                <div className="phrase in"><span className="en"><mark>{latest.keyword}</mark></span></div>
              )}
            </div>
          </Link>
        </div>
      )}

      <div className="ticker bleed" aria-label="Everyday phrases">
        <div className="ticker-track">
          {[...TICKER, ...TICKER].map(([jp, en], n) => (
            <span className="ticker-item" key={n} aria-hidden={n >= TICKER.length}>
              <span className="jp" lang="ja" dangerouslySetInnerHTML={{ __html: rubyToHtml(jp) }} />{en}<span className="sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="wrap">
        <section className="block">
          <div className="sec-head reveal">
            <div><h2>New guides</h2><p className="sub">Practical grammar and word-choice guides, written in English</p></div>
            <Link className="more" href={SEC.articles}>All articles <span className="arr">→</span></Link>
          </div>
          {rest.length === 0 ? (
            <p className="panel empty">More guides are on the way.</p>
          ) : (
            <div className="cards">
              {rest.slice(0, 6).map((a, i) => <ArticleCard key={a.slug} article={a} index={i + 1} comments={counts.get(a.slug) ?? 0} />)}
            </div>
          )}
        </section>

        {tags.length > 0 && (
          <section className="block">
            <div className="sec-head reveal">
              <div><h2>Browse by tag</h2><p className="sub">More tags appear as new guides are added</p></div>
            </div>
            <div className="chips reveal">
              {tags.map(([tg, n]) => (
                <Link className="chip" key={tg} href={`${SEC.tags}/${encodeURIComponent(tg)}`}>#{tg}<span className="n">{n}</span></Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <section className="band bleed">
        <div className="wrap band-in">
          <div className="reveal">
            <h2>Board</h2>
            <p>Ask questions, check your sentences, and share your progress with other learners. No login needed to read. (The board is shared with our Japanese-speaking learners, so you’ll see both languages.)</p>
            <Link className="btn" href="/boards">Open the board <span className="arr">→</span></Link>
          </div>
          <div className="band-list">
            {threads.length === 0 ? (
              <p className="empty">No threads yet. Why not start the first one?</p>
            ) : (
              threads.map((t) => (
                <Link className="band-item reveal" key={t.id} href={`/boards/${t.category_id}/${t.id}`}>
                  <span className="t">{t.title}</span>
                  <span className="n">{t.reply_count} {t.reply_count === 1 ? "reply" : "replies"}</span>
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
