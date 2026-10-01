import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { addComment } from "@/app/actions";
import ArticleCard from "@/components/ArticleCard";
import Discussion from "@/components/Discussion";
import ReadingProgress from "@/components/ReadingProgress";
import ReadingToggle from "@/components/ReadingToggle";
import { getAllArticles, getArticle, getRelatedArticles, isSectionLive } from "@/lib/articles";
import { getViewer } from "@/lib/auth";
import { SITE_URL } from "@/lib/env";
import { formatDate } from "@/lib/format";
import { t } from "@/lib/i18n";
import { ORG_ID, PERSON_ID, ldScript, organizationLd, personLd } from "@/lib/jsonld";
import { withLinkCards } from "@/lib/linkCards";
import { asPosts, getCommentCounts, POST_COLUMNS } from "@/lib/queries";
import { SECTIONS, type SectionKey } from "@/lib/sections";
import { createClient } from "@/lib/supabase/server";

// 記事ページ(どの科目でも同じ作り)。英語学習は /articles/[slug]、日本語学習は /en/japanese/articles/[slug]
export function articleMetadata(slug: string, section: SectionKey): Metadata {
  const article = isSectionLive(section) ? getArticle(slug, section) : null;
  if (!article) return {};
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: article.url },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.summary,
      url: article.url,
      publishedTime: article.date,
      tags: article.tags,
      images: [article.ogImage ? { url: article.ogImage, width: 1200, height: 630, alt: article.coreIllustrationAlt } : { url: "/og-default.png", width: 1200, height: 630, alt: "まなビレッジ" }],
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.summary, images: [article.ogImage ?? "/og-default.png"] },
    ...(article.draft ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function ArticleView({ slug, section }: { slug: string; section: SectionKey }) {
  const sec = SECTIONS[section];
  const article = isSectionLive(section) ? getArticle(slug, section) : null;
  if (!article) notFound();
  const s = t(sec.lang);

  const supabase = await createClient();
  const [viewer, { data }, counts] = await Promise.all([
    getViewer(),
    supabase.from("comments").select(POST_COLUMNS).eq("article_slug", slug).order("created_at", { ascending: false }),
    getCommentCounts(),
  ]);
  const related = getRelatedArticles(slug, section);
  const all = getAllArticles(section);
  const url = `${SITE_URL}${article.url}`;
  const jsonLd = {
    "@type": "BlogPosting",
    headline: article.title,
    description: article.summary,
    datePublished: article.date,
    dateModified: article.updatedAt || article.date,
    inLanguage: sec.lang,
    keywords: article.tags.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: `${SITE_URL}${article.ogImage ?? "/og-default.png"}`,
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
  };
  const breadcrumbLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: sec.label, item: `${SITE_URL}${sec.top}` },
      { "@type": "ListItem", position: 2, name: s.articles, item: `${SITE_URL}${sec.articles}` },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  };
  const updated = article.updatedAt && article.updatedAt !== article.date ? ` · ${s.updatedOn(formatDate(article.updatedAt, sec.lang))}` : "";

  return (
    <div className="screen">
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript({ "@context": "https://schema.org", "@graph": [jsonLd, breadcrumbLd, personLd, organizationLd] }) }} />
      <div className="wrap reader-grid">
        <article className="panel paper">
          <div className="crumb">
            <Link href={sec.articles}>{s.articles}</Link>
            {article.tags[0] && (<><span>/</span><Link href={`${sec.tags}/${encodeURIComponent(article.tags[0])}`}>#{article.tags[0]}</Link></>)}
          </div>
          {article.draft && <p className="draft-badge">下書き（本番には表示されません）</p>}
          <h1 dangerouslySetInnerHTML={{ __html: article.titleHtml }} />
          <div className="byline">
            <div className="avatar" aria-hidden="true">K</div>
            <div>
              <div className="who">Kaz</div>
              <div className="sub">{formatDate(article.date, sec.lang)} · {s.minutesRead(article.minutes)}{updated}</div>
            </div>
          </div>
          {/* サムネ(核のイラスト)は、どの科目でもタイトルと本文の間に出す。本文には書かない */}
          {article.coreIllustration && (
            <figure className="cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.coreIllustration} alt={article.coreIllustrationAlt} width={800} height={500} fetchPriority="high" decoding="async" />
            </figure>
          )}
          {sec.lang === "en" && <ReadingToggle />}
          <div className="prose" dangerouslySetInnerHTML={{ __html: withLinkCards(article.html, article) }} />
          {article.tags.length > 0 && (
            <div className="tags-foot">
              {article.tags.map((tg) => <Link key={tg} className="chip" href={`${sec.tags}/${encodeURIComponent(tg)}`}>#{tg}</Link>)}
            </div>
          )}
        </article>

        <Discussion
          title={s.commentsTitle}
          rows={asPosts(data)}
          action={addComment}
          hidden={{ slug }}
          loggedIn={!!viewer}
          path={article.url}
          placeholder={s.commentPlaceholder}
          empty={s.commentEmpty}
          badge={(r) => (r.author?.is_admin ? s.authorBadge : null)}
          lang={sec.lang}
        />

        {related.length > 0 && (
          <section className="related" aria-label={s.related}>
            <div className="sec-head" style={{ marginBottom: 20 }}>
              <h2>{s.related}</h2>
            </div>
            <div className="cards">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} index={all.indexOf(a)} comments={counts.get(a.slug) ?? 0} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
