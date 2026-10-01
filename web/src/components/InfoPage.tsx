import Link from "next/link";
import { englishPagesLive } from "@/lib/articles";
import type { Lang } from "@/lib/sections";

// サイトについてのページ(まなビレッジとは、運営者、お問い合わせ、プライバシーポリシー、利用規約)の共通の枠。
// otherLang: もう一方の言語の同じページ(日本語版 ⇔ 英語版)
export default function InfoPage({
  title,
  updated,
  lang = "ja",
  otherLang,
  children,
}: {
  title: string;
  updated?: string;
  lang?: Lang;
  otherLang?: string;
  children: React.ReactNode;
}) {
  const en = lang === "en";
  return (
    <div className="screen">
      <div className="wrap reader-grid">
        <article className="panel paper">
          <div className="crumb">
            <Link href={en ? "/en/japanese" : "/"}>{en ? "Home" : "トップ"}</Link>
            <span>/</span>
            <span>{title}</span>
            {otherLang && englishPagesLive() && (
              <Link href={otherLang} lang={en ? "ja" : "en"} style={{ marginLeft: "auto" }}>
                {en ? "日本語" : "English"}
              </Link>
            )}
          </div>
          <h1>{title}</h1>
          {updated && <p className="sub" style={{ marginTop: -8, marginBottom: 32 }}>{updated}</p>}
          <div className="prose">{children}</div>
        </article>
      </div>
    </div>
  );
}
