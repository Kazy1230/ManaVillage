import Link from "next/link";
import type { ArticleMeta } from "@/lib/articles";
import { shortDate } from "@/lib/format";
import { t } from "@/lib/i18n";
import { SECTIONS } from "@/lib/sections";

const PASTEL = ["var(--p1)", "var(--p2)", "var(--p3)", "var(--p4)", "var(--p5)", "var(--p6)"];

export default function ArticleCard({
  article,
  index,
  comments,
  animation = "reveal",
}: {
  article: ArticleMeta;
  index: number;
  comments: number;
  animation?: "reveal" | "pop";
}) {
  const lang = SECTIONS[article.section].lang;
  const s = t(lang);
  return (
    <Link
      className={`card ${animation}`}
      href={article.url}
      style={animation === "pop" ? { animationDelay: `${index * 0.06}s` } : undefined}
    >
      <div className="thumb" style={{ background: PASTEL[index % PASTEL.length] }}>
        {article.coreIllustration ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.coreIllustration} alt="" loading="lazy" />
        ) : (
          <span className="en">{article.keyword}</span>
        )}
      </div>
      <div className="card-body">
        <div className="meta">
          {article.tags[0] && <span className="tag">#{article.tags[0]}</span>}
          <span className="dot-sep" />
          <span>{shortDate(article.date, lang)}</span>
          <span className="dot-sep" />
          <span>{s.minutes(article.minutes)}</span>
        </div>
        <h3 dangerouslySetInnerHTML={{ __html: article.titleHtml }} />
      </div>
      <div className="card-foot">
        <span>💬 {s.comments(comments)}</span>
        <span className="go">{s.read}</span>
      </div>
    </Link>
  );
}
