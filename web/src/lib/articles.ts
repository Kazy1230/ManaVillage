import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type Phrase = { key: string; rest: string; ja: string; level?: string };

export type ArticleMeta = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  keyword: string;
  phrases: Phrase[];
  minutes: number;
  draft: boolean;
  type: "general" | "experience";
  primaryKeyword: string;
  hub: string;
  // ハブ記事のとき、検索を譲らせる（noindex にする）タグ
  hubTag: string;
  coreIllustration: string | null;
  ogImage: string | null;
  coreIllustrationAlt: string;
  related: string[];
};

export type Article = ArticleMeta & { html: string };

const DIR = path.join(process.cwd(), "content", "articles");

// 本文の画像に、寸法(イラストはすべて 8:5)と遅延読み込みを付ける。レイアウトのずれと、初回表示の重さを防ぐ
marked.use({
  renderer: {
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

// 旧形式（date / summary / draft）と、制作ワークフローの新形式（publishedAt / description / status）の両方を読む
function load(file: string): Article {
  const slug = file.replace(/\.md$/, "");
  const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
  const withMarks = content.replace(/==([^=\n]+)==/g, '<mark class="hl">$1</mark>');
  const draft = data.status ? data.status !== "published" : data.draft === true;
  const core = str(data.coreIllustration);
  return {
    slug,
    title: str(data.title),
    date: str(data.publishedAt) || str(data.date) || today(),
    tags: list(data.tags),
    summary: str(data.description) || str(data.summary),
    keyword: str(data.keyword) || str(data.primaryKeyword) || str(data.title),
    phrases: data.phrases ?? [],
    draft,
    type: data.type === "experience" ? "experience" : "general",
    primaryKeyword: str(data.primaryKeyword),
    hub: str(data.hub),
    hubTag: str(data.hubTag),
    coreIllustration: core ? `/illustrations/${slug}/${core}` : null,
    ogImage: core ? `/illustrations/${slug}/${core.replace(/\.[a-z]+$/, "")}-og.png` : null,
    coreIllustrationAlt: str(data.coreIllustrationAlt),
    related: list(data.related),
    // 日本語の読書速度を約500字/分として概算
    minutes: Math.max(1, Math.round(content.length / 500)),
    html: marked.parse(withMarks, { async: false }),
  };
}

let cache: Article[] | null = null;

export function getAllArticles(): Article[] {
  if (cache && isProd) return cache;
  cache = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(load)
    // 下書きは本番のサイト表示・sitemap・内部リンクから除外する。ローカルでは Kaz のレビュー用に表示する
    .filter((a) => !a.draft || !isProd)
    .sort((a, b) => b.date.localeCompare(a.date));
  return cache;
}

export function getArticle(slug: string) {
  return getAllArticles().find((a) => a.slug === slug) ?? null;
}

export function getTagCounts() {
  const counts = new Map<string, number>();
  for (const a of getAllArticles().filter((x) => !x.draft)) for (const t of a.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

// タグページを検索に出さない条件：記事が3本未満、または同じテーマのハブ記事が公開済み
export function isTagIndexable(tag: string) {
  const count = getTagCounts().find(([t]) => t === tag)?.[1] ?? 0;
  const hasHub = getAllArticles().some((a) => !a.draft && a.hubTag === tag);
  return count >= 3 && !hasHub;
}

// frontmatter の related を優先し、足りない分をタグの重なりで補う
export function getRelatedArticles(slug: string, limit = 3) {
  const all = getAllArticles().filter((a) => !a.draft || !isProd);
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
