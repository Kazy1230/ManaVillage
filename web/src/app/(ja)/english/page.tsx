import type { Metadata } from "next";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import PhraseCarousel from "@/components/PhraseCarousel";
import { getAllArticles, getTagCounts } from "@/lib/articles";
import { shortDate } from "@/lib/format";
import { catClass, getCommentCounts, listThreads } from "@/lib/queries";
import { ldScript, organizationLd, personLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "英語を学ぶ — 英語の勉強方法を、研究と経験から",
  description: "単語の覚え方、文法書の進め方、スピーキングの練習まで。研究と経験にもとづく英語の勉強法の記事と、学習者どうしで助け合える掲示板。",
  alternates: { canonical: "/english" },
};

const TICKER: [string, string][] = [
  ["Break a leg!", "がんばって！"],
  ["It's up to you.", "あなた次第だよ"],
  ["I'm on it.", "今やってるよ"],
  ["No worries.", "気にしないで"],
  ["Fair enough.", "なるほど、もっともだね"],
  ["Let's call it a day.", "今日はここまでにしよう"],
  ["I'll keep that in mind.", "覚えておくね"],
];

// 英語学習のトップ(ヘッダーの「英語を学ぶ」の行き先)。サイト全体の入口は (ja)/page.tsx
export default async function EnglishHome() {
  const articles = getAllArticles();
  const [latest, ...rest] = articles;
  const [counts, threads] = await Promise.all([getCommentCounts(), listThreads({ sort: "popular", limit: 3 })]);
  const tags = getTagCounts();

  return (
    <div className="screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript({ "@context": "https://schema.org", "@graph": [organizationLd, personLd] }) }} />
      <div className="wrap home-intro">
        <h1>英語の勉強方法を、研究と経験から。</h1>
        <p>単語の覚え方、文法書の進め方、スピーキングの練習まで。読んで、試して、つまずいたら掲示板でみんなに聞ける、英語学習のサイトです。</p>
      </div>
      {latest && (
        <div className="wrap">
          <Link className="panel hero" href={latest.url}>
            <div className="hero-text intro">
              <span className="badge-new"><i />最新記事</span>
              <h2>{latest.title}</h2>
              <p className="lead">{latest.summary}</p>
              <div className="meta">
                {latest.tags[0] && <span className="tag">#{latest.tags[0]}</span>}
                <span className="dot-sep" /><span>{shortDate(latest.date)}</span>
                <span className="dot-sep" /><span>{latest.minutes}分で読める</span>
              </div>
              <span className="btn primary" style={{ justifySelf: "start" }}>記事を読む <span className="arr">→</span></span>
            </div>
            <div className="stage">
              {[latest.keyword, ...latest.phrases.map((p) => p.key)].slice(0, 3).map((w, n) => (
                <span key={n} className={`float f${n + 1}`} aria-hidden="true">{w}</span>
              ))}
              {latest.phrases.length > 0 ? (
                <>
                  <span className="stage-label">この記事で学ぶ{latest.phrases.length}つの言い方</span>
                  <PhraseCarousel phrases={latest.phrases} />
                </>
              ) : (
                <div className="phrase in"><span className="en"><mark>{latest.keyword}</mark></span></div>
              )}
            </div>
          </Link>
        </div>
      )}

      <div className="ticker bleed" aria-label="ひとことフレーズ">
        <div className="ticker-track">
          {[...TICKER, ...TICKER].map(([e, j], n) => (
            <span className="ticker-item" key={n} aria-hidden={n >= TICKER.length}>
              <span className="en">{e}</span>{j}<span className="sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="wrap">
        <section className="block">
          <div className="sec-head reveal">
            <div><h2>新着記事</h2><p className="sub">Kaz が書いた英語学習の記事</p></div>
            <Link className="more" href="/articles">すべての記事 <span className="arr">→</span></Link>
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
              {tags.map(([t, n]) => (
                <Link className="chip" key={t} href={`/tags/${encodeURIComponent(t)}`}>#{t}<span className="n">{n}</span></Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <section className="band bleed">
        <div className="wrap band-in">
          <div className="reveal">
            <h2>掲示板</h2>
            <p>学習者どうしで質問したり、勉強の進捗を報告しあったりできます。読むだけならログインは不要です。</p>
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
