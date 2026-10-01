// 記事の機械的なチェック（指示書 3-5 のうち、機械で判定できる項目）: node scripts/check-article.mjs <slug>
// 英語学習(content/articles/)と日本語学習(content/japanese/articles/、英語で書く)の両方に使える。科目はファイルの場所で決まる
// 判断が必要な項目（薄さ・事実・捏造）はチェックエージェントが行う。このスクリプトはその前提条件を確かめる。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const slug = process.argv[2];
const SECTIONS = {
  english: { dir: path.join(root, "content", "articles"), base: "/articles/", lang: "ja" },
  japanese: { dir: path.join(root, "content", "japanese", "articles"), base: "/en/japanese/articles/", lang: "en" },
  it: { dir: path.join(root, "content", "it", "articles"), base: "/it/articles/", lang: "ja" },
  philosophy: { dir: path.join(root, "content", "philosophy", "articles"), base: "/philosophy/articles/", lang: "ja" },
  science: { dir: path.join(root, "content", "science", "articles"), base: "/science/articles/", lang: "ja" },
  relationships: { dir: path.join(root, "content", "relationships", "articles"), base: "/relationships/articles/", lang: "ja" },
};
const sectionKey = Object.keys(SECTIONS).find((k) => fs.existsSync(path.join(SECTIONS[k].dir, `${slug}.md`))) ?? "english";
const SEC = SECTIONS[sectionKey];
const ART = SEC.dir;
const isJa = SEC.lang === "en"; // 日本語学習(英語で書く)の記事
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
// slug は科目をまたいで重複させない(コメントは slug で記事にひも付くため)
for (const [k, s] of Object.entries(SECTIONS)) {
  if (k !== sectionKey && fs.existsSync(path.join(s.dir, `${slug}.md`))) {
    console.error(`slug「${slug}」が ${k} の記事と重複している`);
    process.exit(1);
  }
}
const all = fs.readdirSync(ART).filter((f) => f.endsWith(".md")).map((f) => ({ slug: f.slice(0, -3), ...read(f.slice(0, -3)) }));
const self = all.find((a) => a.slug === slug);
if (!self) {
  console.error(`${slug}.md が、どの科目の記事フォルダ(content/articles/、content/<科目>/articles/)にも見つかりません`);
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
if (isJa && fm.type !== "general") err("日本語学習の記事は type: general だけ(体験談は使わない。例え話と例文で書く)");
if (!["draft", "published"].includes(fm.status)) err(`frontmatter: status は draft / published のどちらか`);
if (fm.status === "published" && !fm.publishedAt) err("frontmatter: 公開済みなのに publishedAt が空");
if (fm.type === "experience" && !(fm.materialsUsed ?? []).length) err("experience 記事なのに materialsUsed が空");
if (fm.type === "general" && (fm.materialsUsed ?? []).length) warn("general 記事に materialsUsed がある（学習の体験談を入れていないか確認）");

const desc = String(fm.description ?? "");
info.push(`description: ${desc.length}字`);
if (isJa) {
  // 英語の description は、検索結果で切れにくい 110〜160 文字を目安にする
  if (desc.length < 110 || desc.length > 160) warn(`description は英語で110〜160文字が目安（今は${desc.length}文字）`);
} else if (desc.length < 90 || desc.length > 150) warn(`description は120字前後が目安（今は${desc.length}字）`);

// タグ：既存から選ぶ、3〜5個、主キーワードをそのままタグにしない
const tags = (fm.tags ?? []).map(String);
const known = new Set(others.flatMap((a) => (a.data.tags ?? []).map(String)));
if (tags.length < 3 || tags.length > 5) err(`tags は3〜5個（今は${tags.length}個）`);
// 日本語学習のタグは固定の一覧(planning/japanese/workflow.md 8章)
const JA_TAGS = new Set(["Particles", "Grammar", "Synonyms", "Politeness", "Phrases", "Beginner", "Intermediate", "Advanced", "N5", "N4", "N3", "N2", "N1", "Verbs", "Adjectives", "Conversation", "Business"]);
if (isJa) {
  for (const t of tags) if (!JA_TAGS.has(t)) err(`タグ「${t}」は日本語学習のタグの一覧にない(workflow 8章)`);
  if (tags.filter((t) => ["Beginner", "Intermediate", "Advanced"].includes(t)).length !== 1) err("レベルのタグ(Beginner / Intermediate / Advanced)を1つだけ付ける");
  if (tags.filter((t) => /^N[1-5]$/.test(t)).length > 1) err("JLPT のタグは0〜1つ");
  if (!["Particles", "Grammar", "Synonyms", "Politeness", "Phrases"].includes(String(fm.hub))) err("hub は Particles / Grammar / Synonyms / Politeness / Phrases のどれか");
} else for (const t of tags) if (!known.has(t)) warn(`新しいタグ「${t}」。既存タグと意味が重なっていないか確認（既存: ${[...known].join("、")}）`);
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
// サムネ(核のイラスト)は、記事ページがタイトルと本文の間に自動で出す。本文に書くと2回出るので不合格
if (fm.coreIllustration && content.includes(core)) err(`サムネ（${core}）が本文に入っている。サムネはタイトルの下に自動で出るので、本文からは外す`);

const linkRe = new RegExp(`\\]\\(${SEC.base}([a-z0-9-]+)\\)`, "g");
const links = [...new Set([...content.matchAll(linkRe)].map((m) => m[1]))];
const linkable = (s) => {
  const o = others.find((a) => a.slug === s);
  return o && isPublished(o.data);
};
info.push(`本文内の内部リンク: ${links.length}本（${links.join(", ")}）`);
// 公開済みの記事がまだ少ない科目(立ち上げ時)は、本数の不足を「要確認」にとどめる
const publishedOthers = others.filter((a) => isPublished(a.data)).length;
const few = (m) => (publishedOthers < 3 ? warn(`${m}(この科目の公開済み記事が${publishedOthers}本のため、要確認にとどめる)`) : err(m));
if (links.length < 2) few("本文内の内部リンクが2本未満");
for (const s of links) if (!linkable(s)) err(`内部リンク先 ${s} が存在しないか、公開済みでない`);
for (const s of fm.related ?? []) if (!linkable(s)) err(`related の ${s} が存在しないか、公開済みでない`);
if ((fm.related ?? []).length < 2) few("related が2本未満");

// ---------- ルビ(日本語学習の記事は、漢字にすべて読みを付ける) ----------
const RUBY = /\{([^{}|\n]+)\|([^{}|\n]+)\}/g;
const unruby = (s) => String(s).replace(RUBY, "$1");
if (isJa) {
  const KANJI = /[一-鿿㐀-䶿々]/;
  const bare = (label, s) => {
    const rest = String(s ?? "").replace(RUBY, "").replace(/<rt>[\s\S]*?<\/rt>/g, "").replace(/\]\([^)]*\)/g, "]");
    const found = [...new Set(rest.match(new RegExp(KANJI.source, "g")) ?? [])];
    if (found.length) err(`${label}に読み(ルビ)のない漢字がある: ${found.join("")}(記法 {漢字|かんじ})`);
  };
  bare("title ", fm.title);
  bare("description ", fm.description);
  bare("本文", content);
  for (const [i, ph] of (fm.phrases ?? []).entries()) bare(`phrases[${i}].jp `, ph.jp);
  if (/<ruby>/.test(content)) warn("本文に <ruby> タグを直接書いている。記法 {漢字|かんじ} にそろえる");
}

// ---------- 主キーワード ----------
const kw = String(fm.primaryKeyword ?? "").split(/[\s　]+/).filter(Boolean);
const plain = content.replace(/<[^>]+>/g, "").replace(/!\[[^\]]*\]\([^)]*\)/g, "");
const intro = plain.split(/\n##\s/)[0];
for (const w of kw) {
  const has = (s) => (isJa ? unruby(s).toLowerCase().includes(w.toLowerCase()) : s.includes(w));
  if (!has(String(fm.title))) err(`主キーワードの語「${w}」が title にない`);
  if (!has(intro)) err(`主キーワードの語「${w}」が導入（最初の h2 より前）にない`);
}

// ---------- 分量と表現 ----------
if (isJa) {
  const words = unruby(plain).split(/\s+/).filter(Boolean).length;
  info.push(`本文: 約${words}語(英語。水増しより短さを優先)`);
  if (words < 800) warn("本文が800語未満。内容が足りているか確認");
} else {
  const chars = plain.replace(/\s/g, "").length;
  info.push(`本文: 約${chars}字（目安5000字。水増しより短さを優先）`);
  if (chars < 2500) warn("本文が2500字未満。内容が足りているか確認");
}
for (const bad of ["Kazです", "僕の学習メモ", "Kaz式"]) if (content.includes(bad) || String(fm.title).includes(bad)) err(`個人ブログに見える表現「${bad}」がある`);
if (/僕/.test(plain)) warn("「僕」がある。体験談は「運営者の体験」の囲みで書く");
if (fm.type === "experience" && !content.includes('class="voice"')) err("experience 記事なのに「運営者の体験」の囲み（class=\"voice\"）がない");
if (fm.type === "general" && content.includes('class="voice"')) err("general 記事に「運営者の体験」の囲みがある");
if (!isJa && content.includes('class="analogy"')) warn("英語学習の記事に例え話の囲み(class=\"analogy\")がある。日本語学習の記事用の部品");

// ---------- topic-map ----------
const mapFile = sectionKey === "english" ? path.join(root, "content", "planning", "topic-map.md") : path.join(root, "content", "planning", sectionKey, "topic-map.md");
if (sectionKey !== "english" && !fs.existsSync(mapFile)) warn(`この科目の topic-map(content/planning/${sectionKey}/topic-map.md)がまだない`);
else if (fs.existsSync(mapFile)) {
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
