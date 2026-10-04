import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { SECTIONS, SECTION_ORDER, type SectionKey } from "@/lib/sections";

export type Phrase = { key: string; rest: string; ja: string; level?: string };
// 日本語学習の記事の例文(トップのヒーローに出す)。jp はルビの記法 {漢字|かんじ} を HTML にしたもの
export type JaPhrase = { jp: string; romaji: string; en: string };

export type ArticleMeta = {
  slug: string;
  section: SectionKey;
  url: string;
  title: string;
  // 表示用(日本語学習の記事では、漢字にルビが付く)。title と summary は検索・共有用の素の文字
  titleHtml: string;
  date: string;
  updatedAt: string;
  tags: string[];
  summary: string;
  summaryHtml: string;
  keyword: string;
  phrases: Phrase[];
  jaPhrases: JaPhrase[];
  minutes: number;
  draft: boolean;
  type: "general" | "experience";
  // 署名。kaz(既定)/ yukina(架空のキャラクター)
  author: "kaz" | "yukina";
  primaryKeyword: string;
  hub: string;
  // ハブ記事のとき、検索を譲らせる（noindex にする）タグ
  hubTag: string;
  coreIllustration: string | null;
  ogImage: string | null;
  coreIllustrationAlt: string;
  related: string[];
};

export type TocItem = { id: string; text: string };
export type Article = ArticleMeta & { html: string; toc: TocItem[] };

const CONTENT = path.join(process.cwd(), "content");

// 本文の画像に、寸法(イラストはすべて 8:5)と遅延読み込みを付ける。レイアウトのずれと、初回表示の重さを防ぐ
let tocCollector: TocItem[] | null = null;
marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const inner = this.parser.parseInline(tokens);
      if (depth !== 2 || !tocCollector) return `<h${depth}>${inner}</h${depth}>
`;
      const id = `sec-${tocCollector.length + 1}`;
      tocCollector.push({ id, text: inner.replace(/<[^>]+>/g, "") });
      return `<h2 id="${id}">${inner}</h2>
`;
    },
    image({ href, title, text }) {
      const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
      const illust = /^\/(illustrations|articles)\//.test(href);
      return `<img src="${esc(href)}" alt="${esc(text)}"${title ? ` title="${esc(title)}"` : ""}${illust ? ' width="800" height="500"' : ""} loading="lazy" decoding="async">`;
    },
  },
});
const isProd = process.env.NODE_ENV === "production";
const today = () => new Date().toISOString().slice(0, 10);
const str = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : v == null ? "" : String(v));
const list = (v: unknown) => (Array.isArray(v) ? v.map(String).filter(Boolean) : []);
const escHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ルビの記法 {漢字|かんじ}。日本語学習の記事では、漢字にはすべて読みを付ける(scripts/check-article.mjs が確かめる)
const RUBY = /\{([^{}|\n]+)\|([^{}|\n]+)\}/g;
export const rubyToHtml = (s: string) => s.replace(RUBY, "<ruby>$1<rt>$2</rt></ruby>");
export const rubyToPlain = (s: string) => s.replace(RUBY, "$1");

// 旧形式（date / summary / draft）と、制作ワークフローの新形式（publishedAt / description / status）の両方を読む
function load(section: SectionKey, file: string): Article {
  const { lang, dir, articles } = SECTIONS[section];
  const slug = file.replace(/\.md$/, "");
  const { data, content } = matter(fs.readFileSync(path.join(CONTENT, dir, file), "utf8"));
  const ruby = lang === "en";
  let body = content.replace(/==([^=\n]+)==/g, '<mark class="hl">$1</mark>');
  if (ruby) body = rubyToHtml(body);
  const draft = data.status ? data.status !== "published" : data.draft === true;
  const core = str(data.coreIllustration);
  const rawTitle = str(data.title);
  const rawSummary = str(data.description) || str(data.summary);
  const toc: TocItem[] = [];
  tocCollector = toc;
  const html = marked.parse(body, { async: false });
  tocCollector = null;
  const words = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return {
    slug,
    section,
    url: `${articles}/${slug}`,
    title: ruby ? rubyToPlain(rawTitle) : rawTitle,
    titleHtml: ruby ? rubyToHtml(escHtml(rawTitle)) : escHtml(rawTitle),
    date: str(data.publishedAt) || str(data.date) || today(),
    updatedAt: str(data.updatedAt),
    tags: list(data.tags),
    summary: ruby ? rubyToPlain(rawSummary) : rawSummary,
    summaryHtml: ruby ? rubyToHtml(escHtml(rawSummary)) : escHtml(rawSummary),
    keyword: str(data.keyword) || str(data.primaryKeyword) || rawTitle,
    phrases: ruby ? [] : (data.phrases ?? []),
    jaPhrases: ruby ? (data.phrases ?? []).map((p: Record<string, unknown>) => ({ jp: rubyToHtml(escHtml(str(p.jp))), romaji: str(p.romaji), en: str(p.en) })) : [],
    draft,
    type: data.type === "experience" ? "experience" : "general",
    author: data.author === "yukina" ? "yukina" : "kaz",
    primaryKeyword: str(data.primaryKeyword),
    hub: str(data.hub),
    hubTag: str(data.hubTag),
    coreIllustration: core ? `/illustrations/${slug}/${core}` : null,
    ogImage: core ? `/illustrations/${slug}/${core.replace(/\.[a-z]+$/, "")}-og.png` : null,
    coreIllustrationAlt: str(data.coreIllustrationAlt),
    related: list(data.related),
    // 日本語は約500字/分、英語は約200語/分として概算
    minutes: Math.max(1, Math.round(lang === "ja" ? content.length / 500 : words / 200)),
    html,
    toc,
  };
}

const cache = new Map<SectionKey, Article[]>();

export function getAllArticles(section: SectionKey = "english"): Article[] {
  const hit = cache.get(section);
  if (hit && isProd) return hit;
  const dir = path.join(CONTENT, SECTIONS[section].dir);
  const articles = (fs.existsSync(dir) ? fs.readdirSync(dir) : [])
    .filter((f) => f.endsWith(".md"))
    .map((f) => load(section, f))
    // 下書きは本番のサイト表示・sitemap・内部リンクから除外する。ローカルでは Kaz のレビュー用に表示する
    .filter((a) => !a.draft || !isProd)
    .sort((a, b) => b.date.localeCompare(a.date));
  cache.set(section, articles);
  return articles;
}

export function getArticle(slug: string, section: SectionKey = "english") {
  return getAllArticles(section).find((a) => a.slug === slug) ?? null;
}

// コメントやマイページのように、slug だけから記事を探すとき(slug は科目をまたいで重複させない)
export function findArticle(slug: string) {
  for (const s of SECTION_ORDER) {
    const a = getArticle(slug, s);
    if (a) return a;
  }
  return null;
}

// 公開済みの記事がまだない科目は、本番ではメニューにもページにも出さない(ローカルでは下書きの確認のため出す)
export function isSectionLive(section: SectionKey) {
  return !isProd || getAllArticles(section).some((a) => !a.draft);
}

export function liveSections() {
  return SECTION_ORDER.filter(isSectionLive);
}

export function getTagCounts(section: SectionKey = "english") {
  const counts = new Map<string, number>();
  for (const a of getAllArticles(section).filter((x) => !x.draft || !isProd)) for (const t of a.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

// タグページを検索に出さない条件：記事が3本未満、または同じテーマのハブ記事が公開済み
export function isTagIndexable(tag: string, section: SectionKey = "english") {
  const published = getAllArticles(section).filter((a) => !a.draft);
  const count = published.filter((a) => a.tags.includes(tag)).length;
  const hasHub = published.some((a) => a.hubTag === tag);
  return count >= 3 && !hasHub;
}

// frontmatter の related を優先し、足りない分をタグの重なりで補う。関連記事は同じ科目の中から選ぶ
export function getRelatedArticles(slug: string, section: SectionKey = "english", limit = 3) {
  const all = getAllArticles(section);
  const self = all.find((a) => a.slug === slug);
  if (!self) return [];
  const others = all.filter((a) => a.slug !== slug && !a.draft);
  const picked = self.related.map((s) => others.find((a) => a.slug === s)).filter((a): a is Article => !!a);
  const rest = others
    .filter((a) => !picked.includes(a))
    .map((a) => ({ a, score: a.tags.filter((t) => self.tags.includes(t)).length }))
    .sort((x, y) => y.score - x.score || y.a.date.localeCompare(x.a.date))
    .map(({ a }) => a);
  return [...picked, ...rest].slice(0, limit);
}

// 英語のページ(/en/login、/en/about など)を出すか。英語で書く科目が1つでも公開されていれば出す
export function englishPagesLive() {
  return liveSections().some((k) => SECTIONS[k].lang === "en");
}

// サイトについてのページなどの、言語ごとの URL。英語のページを出していない間は、日本語の URL だけ
export function pageAlternates(path: string, lang: "ja" | "en" = "ja") {
  const canonical = lang === "en" ? `/en${path}` : path;
  return englishPagesLive() ? { canonical, languages: { ja: path, en: `/en${path}` } } : { canonical };
}
