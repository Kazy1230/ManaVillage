// 科目(セクション)の定義。科目を増やすときは、ここに1つ足す。
// 言語は科目ごとに決まる(記事ごとには持たない)。URL は「日本語は接頭辞なし、英語だけ /en/」(docs/02-architecture.md)。

export type SectionKey = "english" | "japanese";
export type Lang = "ja" | "en";

export type Section = {
  key: SectionKey;
  lang: Lang;
  // ヘッダーのメニューと、全体の入口(/)のカードに出す名前。読者の言語で書く
  label: string;
  top: string;
  articles: string;
  tags: string;
  // web/content/ からの記事フォルダ
  dir: string;
};

export const SECTIONS: Record<SectionKey, Section> = {
  english: { key: "english", lang: "ja", label: "英語を学ぶ", top: "/english", articles: "/articles", tags: "/tags", dir: "articles" },
  japanese: { key: "japanese", lang: "en", label: "Learn Japanese", top: "/en/japanese", articles: "/en/japanese/articles", tags: "/en/japanese/tags", dir: "japanese/articles" },
};

export const SECTION_ORDER: SectionKey[] = ["english", "japanese"];

// パスが、どの科目のページか(全体の入口や掲示板など、どの科目でもないときは null)
export function sectionOfPath(pathname: string): SectionKey | null {
  if (pathname.startsWith("/en/japanese")) return "japanese";
  if (pathname.startsWith("/english") || pathname.startsWith("/articles") || pathname.startsWith("/tags")) return "english";
  return null;
}
