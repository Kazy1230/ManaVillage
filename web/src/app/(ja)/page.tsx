import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles, liveSections } from "@/lib/articles";
import { catClass, listThreads } from "@/lib/queries";
import { ldScript, organizationLd, personLd, websiteLd } from "@/lib/jsonld";
import { PORTAL_CARDS } from "@/lib/sectionPages";
import { SECTIONS } from "@/lib/sections";
import { SITE_TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "まなビレッジ — 学び、つまずき、助け合う。" },
  alternates: { canonical: "/" },
};

// まなビレッジ全体の入口。科目のトップ(/english、/en/japanese)とは別のページ
export default async function Portal() {
  const threads = await listThreads({ sort: "popular", limit: 3 });
  return (
    <div className="screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript({ "@context": "https://schema.org", "@graph": [websiteLd, organizationLd, personLd] }) }} />
      <div className="wrap home-intro portal-intro intro">
        <h1>学び、つまずき、助け合う。<br />まなビレッジ。</h1>
        <p className="tagline en">{SITE_TAGLINE}</p>
        <p>
          科目ごとに、読みものと、学習者どうしで助け合える掲示板があります。
          <br />
          <span className="sub" lang="en">Guides for each subject, and a board where everyone helps each other.</span>
        </p>
      </div>

      <div className="wrap subjects-grid">
        {liveSections().map((key) => {
          const sec = SECTIONS[key];
          const card = PORTAL_CARDS[key];
          const articles = getAllArticles(key);
          return (
            <section key={key} className={`panel subject reveal ${key === "japanese" ? "wa" : `subject-${key}`}`} lang={sec.lang}>
              <Link className="subject-art" href={sec.top} style={{ background: card.bg }} tabIndex={-1} aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/illustrations/section-${key}/core.webp`} alt="" width={800} height={500} />
              </Link>
              <div className="subject-body">
                <span className="who">{card.who}</span>
                <h2><Link href={sec.top}>{sec.label}</Link></h2>
                <p>{card.desc}</p>
                {articles.length > 0 && (
                  <ul className="subject-latest">
                    {articles.slice(0, 3).map((a) => (
                      <li key={a.slug}><Link href={a.url} dangerouslySetInnerHTML={{ __html: a.titleHtml }} /></li>
                    ))}
                  </ul>
                )}
                <div className="subject-foot">
                  <span className="sub">{card.count(articles.filter((a) => !a.draft).length)}</span>
                  <Link className="btn primary" href={sec.top}>{card.btn} <span className="arr">→</span></Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="band bleed">
        <div className="wrap band-in">
          <div className="reveal">
            <h2>掲示板 <span className="en band-en">/ Board</span></h2>
            <p>科目ごとのカテゴリで、質問したり、進み具合を報告したりできます。読むだけならログインは不要です。</p>
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
