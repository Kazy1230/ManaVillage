// 記事のイラストを作る: node scripts/illustrate.mjs <slug> [<slug> ...]
// content/illustrations/<slug>/*.mjs（描画コード）→ 同じ場所に .svg（原本）→ public/illustrations/<slug>/*.webp（公開用）
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { canvas } from "./doodle.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error("usage: node scripts/illustrate.mjs <slug> [...]");
  process.exit(1);
}

for (const slug of slugs) {
  const src = path.join(root, "content", "illustrations", slug);
  const out = path.join(root, "public", "illustrations", slug);
  fs.mkdirSync(out, { recursive: true });
  const scenes = fs.readdirSync(src).filter((f) => f.endsWith(".mjs"));
  if (!scenes.length) console.warn(`no scene files in ${src}`);
  for (const [i, file] of scenes.entries()) {
    const name = file.replace(/\.mjs$/, "");
    const { default: draw, seed = 1000 + i } = await import(pathToFileURL(path.join(src, file)).href);
    const d = canvas(seed);
    draw(d);
    const svg = d.toString();
    fs.writeFileSync(path.join(src, `${name}.svg`), svg);
    const png = new Resvg(svg, { font: { loadSystemFonts: true, defaultFontFamily: "Yu Gothic" }, fitTo: { mode: "width", value: 1200 } }).render().asPng();
    const webp = await sharp(png).webp({ quality: 82 }).toBuffer();
    fs.writeFileSync(path.join(out, `${name}.webp`), webp);
    console.log(`${slug}/${name}.webp  ${(webp.length / 1024).toFixed(1)} KB`);
  }
}
