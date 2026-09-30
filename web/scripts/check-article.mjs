// 記事の機械的なチェック（指示書 3-5 のうち、機械で判定できる項目）: node scripts/check-article.mjs <slug>
// 判断が必要な項目（薄さ・事実・捏造）はチェックエージェントが行う。このスクリプトはその前提条件を確かめる。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ART = path.join(root, "content", "articles");
const slug = process.argv[2];
if (!slug) {
  console.error("usage: node scripts/check-article.mjs <slug>");
  process.exit(1);
}

const errors = [];
const warnings = [];
const info = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const read = (s) => matter(fs.readFileSync(path.join(ART, `${s}.md`), "utf8"));
const isPublished = (d) => (d.status ? d.status === "published" : d.draft !== true);
const all = fs.readdirSync(ART).filter((f) => f.endsWith(".md")).map((f) => ({ slug: f.slice(0, -3), ...read(f.slice(0, -3)) }));
const self = all.find((a) => a.slug === slug);
if (!self) {
  console.error(`content/articles/${slug}.md が見つかりません`);
  process.exit(1);
}
const { data: fm, content } = self;
const others = all.filter((a) => a.slug !== slug);

// ---------- frontmatter ----------
const REQUIRED = ["title", "description", "slug", "type", "status", "primaryKeyword", "searchIntent", "targetReader", "hub", "tags", "coreIllustration", "coreIllustrationAlt", "related", "sources", "materialsUsed"];
for (const k of REQUIRED) if (!(k in fm)) err(`frontmatter: ${k} がない`);
for (const k of ["title", "description", "primaryKeyword", "searchIntent", "targetReader", "hub", "coreIllustration", "coreIllustrationAlt"]) {
  if (k in fm && !String(fm[k] ?? "").trim()) err(`frontmatter: ${k} が空`);
}
if (fm.slug !== slug) err(`frontmatter: slug（${fm.slug}）がファイル名（${slug}）と一致しない`);
if (!["general", "experience"].includes(fm.type)) err(`frontmatter: type は general / experience のどちらか`);
if (!["draft", "published"].includes(fm.status)) err(`frontmatter: status は draft / published のどちらか`);
if (fm.status === "published" && !fm.publishedAt) err("frontmatter: 公開済みなのに publishedAt が空");
if (fm.type === "experience" && !(fm.materialsUsed ?? []).length) err("experience 記事なのに materialsUsed が空");
if (fm.type === "general" && (fm.materialsUsed ?? []).length) warn("general 記事に materialsUsed がある（学習の体験談を入れていないか確認）");

const desc = String(fm.description ?? "");
info.push(`description: ${desc.length}字`);
if (desc.length < 90 || desc.length > 150) warn(`description は120字前後が目安（今は${desc.length}字）`);

// タグ：既存から選ぶ、3〜5個、主キーワードをそのままタグにしない
const tags = (fm.tags ?? []).map(String);
const known = new Set(others.flatMap((a) => (a.data.tags ?? []).map(String)));
if (tags.length < 3 || tags.length > 5) err(`tags は3〜5個（今は${tags.length}個）`);
for (const t of tags) if (!known.has(t)) warn(`新しいタグ「${t}」。既存タグと意味が重なっていないか確認（既存: ${[...known].join("、")}）`);
if (tags.some((t) => t === fm.primaryKeyword)) err("主キーワードをそのままタグにしている");

// title / description の重複
for (const o of others) {
  if (o.data.title && o.data.title === fm.title) err(`title が ${o.slug} と同じ`);
  const od = o.data.description ?? o.data.summary;
  if (od && od === desc) err(`description が ${o.slug} と同じ`);
}

// ---------- 見出し・画像・リンク ----------
const lines = content.split("\n");
let inCode = false;
let seenH2 = false;
let last = 1;
for (const line of lines) {
  if (line.startsWith("```")) inCode = !inCode;
  if (inCode) continue;
  const m = line.match(/^(#{1,6})\s/);
  if (!m) continue;
  const level = m[1].length;
  if (level === 1) err("本文に h1（# 見出し）がある。h1 はタイトルだけ");
  if (level === 3 && !seenH2) err("h2 より前に h3 がある");
  if (level > last + 1) err(`見出しが h${last} から h${level} に飛んでいる`);
  if (level === 2) seenH2 = true;
  last = level;
}

const images = [...content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
const htmlImages = [...content.matchAll(/<img\b[^>]*>/g)];
for (const [, alt, src] of images) {
  if (!alt.trim()) err(`画像に alt がない: ${src}`);
  if (src.startsWith("/") && !fs.existsSync(path.join(root, "public", src))) err(`画像ファイルがない: ${src}`);
}
for (const [tag] of htmlImages) if (!/alt="[^"]+"/.test(tag)) err(`img タグに alt がない: ${tag.slice(0, 60)}`);
const core = `/illustrations/${slug}/${fm.coreIllustration}`;
if (fm.coreIllustration && !fs.existsSync(path.join(root, "public", core))) err(`核のイラストがない: public${core}（node scripts/illustrate.mjs ${slug}）`);
if (fm.coreIllustration && !content.includes(core)) err(`核のイラスト（${core}）が本文に入っていない`);

const links = [...new Set([...content.matchAll(/\]\(\/articles\/([a-z0-9-]+)\)/g)].map((m) => m[1]))];
const linkable = (s) => {
  const o = others.find((a) => a.slug === s);
  return o && isPublished(o.data);
};
info.push(`本文内の内部リンク: ${links.length}本（${links.join(", ")}）`);
if (links.length < 2) err("本文内の内部リンクが2本未満");
for (const s of links) if (!linkable(s)) err(`内部リンク先 ${s} が存在しないか、公開済みでない`);
for (const s of fm.related ?? []) if (!linkable(s)) err(`related の ${s} が存在しないか、公開済みでない`);
if ((fm.related ?? []).length < 2) err("related が2本未満");

// ---------- 主キーワード ----------
const kw = String(fm.primaryKeyword ?? "").split(/[\s　]+/).filter(Boolean);
const plain = content.replace(/<[^>]+>/g, "").replace(/!\[[^\]]*\]\([^)]*\)/g, "");
const intro = plain.split(/\n##\s/)[0];
for (const w of kw) {
  if (!String(fm.title).includes(w)) err(`主キーワードの語「${w}」が title にない`);
  if (!intro.includes(w)) err(`主キーワードの語「${w}」が導入（最初の h2 より前）にない`);
}

// ---------- 分量と表現 ----------
const chars = plain.replace(/\s/g, "").length;
info.push(`本文: 約${chars}字（目安5000字。水増しより短さを優先）`);
if (chars < 2500) warn("本文が2500字未満。内容が足りているか確認");
for (const bad of ["Kazです", "僕の学習メモ", "Kaz式"]) if (content.includes(bad) || String(fm.title).includes(bad)) err(`個人ブログに見える表現「${bad}」がある`);
if (/僕/.test(plain)) warn("「僕」がある。体験談は「運営者の体験」の囲みで書く");
if (fm.type === "experience" && !content.includes('class="voice"')) err("experience 記事なのに「運営者の体験」の囲み（class=\"voice\"）がない");
if (fm.type === "general" && content.includes('class="voice"')) err("general 記事に「運営者の体験」の囲みがある");

// ---------- topic-map ----------
const mapFile = path.join(root, "content", "planning", "topic-map.md");
if (fs.existsSync(mapFile)) {
  const rows = fs.readFileSync(mapFile, "utf8").split("\n").filter((l) => /^\|\s*[A-Z]+-?\d+/.test(l)).map((l) => l.split("|").map((c) => c.trim()));
  const row = rows.find((r) => r[2] === slug);
  if (!row) err("topic-map に、この slug の行がない");
  else if (row[4] !== fm.primaryKeyword) err(`topic-map の主キーワード（${row[4]}）と frontmatter（${fm.primaryKeyword}）が違う`);
  const dup = rows.filter((r) => r[4] === fm.primaryKeyword && r[2] !== slug);
  for (const r of dup) err(`主キーワードが topic-map の ${r[1]}（${r[2]}）と同じ`);
} else err("content/planning/topic-map.md がない");

// ---------- 結果 ----------
console.log(`\n# check-article: ${slug}`);
for (const m of info) console.log(`  ・${m}`);
console.log(errors.length ? `\n不合格（${errors.length}件）` : "\n合格（機械チェック）");
for (const m of errors) console.log(`  ✗ ${m}`);
if (warnings.length) console.log(`\n要確認（${warnings.length}件）`);
for (const m of warnings) console.log(`  △ ${m}`);
process.exit(errors.length ? 1 : 0);
