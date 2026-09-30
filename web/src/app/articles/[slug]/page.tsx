import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { addComment } from "@/app/actions";
import Discussion from "@/components/Discussion";
import ReadingProgress from "@/components/ReadingProgress";
import { getAllArticles, getArticle, getRelatedArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import { getViewer } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { asPosts, getCommentCounts, POST_COLUMNS } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/env";
import { withLinkCards } from "@/lib/linkCards";
import { ORG_ID, PERSON_ID, ldScript, organizationLd, personLd } from "@/lib/jsonld";

export async function generateMetadata(props: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.summary,
      url: `/articles/${slug}`,
      publishedTime: article.date,
      tags: article.tags,
      images: [article.ogImage ? { url: article.ogImage, width: 1200, height: 630, alt: article.coreIllustrationAlt } : { url: "/og-default.png", width: 1200, height: 630, alt: "まなビレッジ" }],
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.summary, images: [article.ogImage ?? "/og-default.png"] },
    ...(article.draft ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function ArticlePage(props: PageProps<"/articles/[slug]">) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) notFound();

  const supabase = await createClient();
  const [viewer, { data }, counts] = await Promise.all([
    getViewer(),
    supabase.from("comments").select(POST_COLUMNS).eq("article_slug", slug).order("created_at", { ascending: false }),
    getCommentCounts(),
  ]);
  const related = getRelatedArticles(slug);
  const all = getAllArticles();
  const url = `${SITE_URL}/articles/${slug}`;
  const jsonLd = {
    "@type": "BlogPosting",
    headline: article.title,
    description: article.summary,
    datePublished: article.date,
    inLanguage: "ja",
    keywords: article.tags.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: `${SITE_URL}${article.ogImage ?? "/og-default.png"}`,
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
  };

  return (
    <div className="screen">
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript({ "@context": "https://schema.org", "@graph": [jsonLd, personLd, organizationLd] }) }} />
      <div className="wrap reader-grid">
        <article className="panel paper">
          <div className="crumb">
            <Link href="/articles">記事</Link>
            {article.tags[0] && (<><span>/</span><Link href={`/tags/${encodeURIComponent(article.tags[0])}`}>#{article.tags[0]}</Link></>)}
          </div>
          {article.draft && <p className="draft-badge">下書き（本番には表示されません）</p>}
          <h1>{article.title}</h1>
          <div className="byline">
            <div className="avatar" aria-hidden="true">K</div>
            <div>
              <div className="who">Kaz</div>
              <div className="sub">{formatDate(article.date)} · {article.minutes}分で読める</div>
            </div>
          </div>
          <div className="prose" dangerouslySetInnerHTML={{ __html: withLinkCards(article.html, slug) }} />
          {article.tags.length > 0 && (
            <div className="tags-foot">
              {article.tags.map((t) => <Link key={t} className="chip" href={`/tags/${encodeURIComponent(t)}`}>#{t}</Link>)}
            </div>
          )}
        </article>

        <Discussion
          title="コメント"
          rows={asPosts(data)}
          action={addComment}
          hidden={{ slug }}
          loggedIn={!!viewer}
          path={`/articles/${slug}`}
          placeholder="感想や質問をどうぞ"
          empty="まだコメントはありません。最初のコメントを書いてみませんか？"
          badge={(r) => (r.author?.is_admin ? "筆者" : null)}
        />

        {related.length > 0 && (
          <section className="related" aria-label="関連記事">
            <div className="sec-head" style={{ marginBottom: 20 }}>
              <h2>関連記事</h2>
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
