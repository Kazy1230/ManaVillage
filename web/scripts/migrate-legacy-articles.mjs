// 導入前の公開記事を、新しい形式へ移す(一度きりの移行): node scripts/migrate-legacy-articles.mjs
// - イラスト public/articles/<slug>/N.svg → public/illustrations/<slug>/core.webp (+ core-og.png)。原本の svg は content/illustrations/<slug>/ へ
// - frontmatter を、topic-map の情報を使って新形式(ワークフロー4章)へ
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ART = path.join(root, "content", "articles");
const PUB = path.join(root, "public");
const str = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v == null ? "" : String(v));

// topic-map の行(ID | slug | タイトル | 主キーワード | 検索意図 | 想定読者 | type | 状態 | ハブ)
const map = {};
for (const line of fs.readFileSync(path.join(root, "content", "planning", "topic-map.md"), "utf8").split("\n")) {
  const c = line.split("|").map((x) => x.trim());
  if (/^A-\d+$/.test(c[1] ?? "")) map[c[2]] = { kw: c[4], intent: c[5], reader: c[6], type: c[7], hub: c[9] };
}

const files = fs.readdirSync(ART).filter((f) => f.endsWith(".md"));
const parsed = Object.fromEntries(files.map((f) => [f.slice(0, -3), matter(fs.readFileSync(path.join(ART, f), "utf8"))]));
const isPublishedNow = (slug) => parsed[slug] && !(parsed[slug].data.status ? parsed[slug].data.status !== "published" : parsed[slug].data.draft === true);

let migrated = 0;
for (const slug of Object.keys(parsed)) {
  const { data, content } = parsed[slug];
  if (data.status || data.draft === true) continue; // 新形式、または下書きは触らない
  const info = map[slug];
  if (!info) { console.warn("topic-map にない:", slug); continue; }

  let body = content;
  let coreAlt = "";
  const refs = [...body.matchAll(/!\[([^\]]*)\]\(\/articles\/([a-z0-9-]+)\/(\d+)\.svg\)/g)];
  for (const [whole, alt, s, n] of refs) {
    const name = n === "1" ? "core" : `fig${n}`;
    const srcSvg = path.join(PUB, "articles", s, `${n}.svg`);
    const outDir = path.join(PUB, "illustrations", s);
    const archDir = path.join(root, "content", "illustrations", s);
    fs.mkdirSync(outDir, { recursive: true });
    fs.mkdirSync(archDir, { recursive: true });
    const svg = fs.readFileSync(srcSvg, "utf8");
    const png = new Resvg(svg, { font: { loadSystemFonts: true, defaultFontFamily: "Yu Gothic" }, fitTo: { mode: "width", value: 1200 } }).render().asPng();
    fs.writeFileSync(path.join(outDir, `${name}.webp`), await sharp(png).resize({ width: 900 }).webp({ quality: 80 }).toBuffer());
    if (name === "core") {
      fs.writeFileSync(path.join(outDir, "core-og.png"), await sharp(png).resize(1200, 630, { fit: "contain", background: "#ffffff" }).png().toBuffer());
      coreAlt = alt;
    }
    fs.copyFileSync(srcSvg, path.join(archDir, `${name}.svg`));
    body = body.replace(whole, `![${alt}](/illustrations/${s}/${name}.webp)`);
    fs.unlinkSync(srcSvg);
  }
  if (refs.length) {
    const left = path.join(PUB, "articles", slug);
    if (fs.existsSync(left) && !fs.readdirSync(left).length) fs.rmdirSync(left);
  }

  // related: 本文中の内部リンクの先(公開済みのもの)を優先し、足りなければ同じハブの記事から
  const linked = [...new Set([...body.matchAll(/\]\(\/articles\/([a-z0-9-]+)\)/g)].map((m) => m[1]))].filter((s) => s !== slug && isPublishedNow(s));
  const related = linked.slice(0, 3);
  for (const s of Object.keys(parsed)) {
    if (related.length >= 2) break;
    if (s !== slug && !related.includes(s) && isPublishedNow(s) && map[s]?.hub === info.hub) related.push(s);
  }

  const fm = {
    title: str(data.title),
    description: str(data.summary),
    slug,
    type: info.type,
    status: "published",
    publishedAt: str(data.date),
    primaryKeyword: info.kw,
    searchIntent: info.intent,
    targetReader: info.reader,
    hub: info.hub,
    tags: (data.tags ?? []).map(String),
    coreIllustration: refs.length ? "core.webp" : "",
    coreIllustrationAlt: coreAlt,
    related,
    sources: [],
    materialsUsed: info.type === "experience" ? ["content/materials/learning-philosophy.md"] : [],
    keyword: str(data.keyword),
    ...(data.phrases ? { phrases: data.phrases } : {}),
  };
  fs.writeFileSync(path.join(ART, `${slug}.md`), matter.stringify(body.replace(/^\n+/, "\n"), fm));
  migrated++;
  console.log("migrated", slug, refs.length ? `(${refs.length} img)` : "(no img)", "related:", related.join(","));
}
console.log(`done: ${migrated}`);
