// サイト共通の共有画像(1200x630)を作る: node scripts/make-og.mjs → public/og-default.png
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#F3F5FA"/>
<rect x="60" y="60" width="1080" height="510" rx="32" fill="#FFFFFF" stroke="#E2E6EE" stroke-width="3"/>
<rect x="120" y="150" width="34" height="34" rx="9" fill="#2F6BFF"/>
<text x="176" y="186" font-family="Yu Gothic, Meiryo, sans-serif" font-weight="700" font-size="64" fill="#222735">まなビレッジ</text>
<text x="120" y="300" font-family="Georgia, serif" font-style="italic" font-size="46" fill="#2F6BFF">For Everyone's Learning, For Everyone's Help</text>
<text x="120" y="390" font-family="Yu Gothic, Meiryo, sans-serif" font-weight="700" font-size="40" fill="#222735">英語の勉強方法の記事と、</text>
<text x="120" y="450" font-family="Yu Gothic, Meiryo, sans-serif" font-weight="700" font-size="40" fill="#222735">学習者どうしで助け合える掲示板</text>
<text x="120" y="525" font-family="Georgia, serif" font-size="30" fill="#667085">manavillage.online</text>
<rect x="900" y="110" width="200" height="8" rx="4" fill="#FFE27A"/>
</svg>`;
const png = new Resvg(svg, { font: { loadSystemFonts: true, defaultFontFamily: "Yu Gothic" } }).render().asPng();
fs.writeFileSync(path.join(root, "public", "og-default.png"), png);
console.log("og-default.png", (png.length / 1024).toFixed(0), "KB");
