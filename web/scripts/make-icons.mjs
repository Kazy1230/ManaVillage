// サイトのアイコンを作る: node scripts/make-icons.mjs
// content/brand/icon-source.jpg(まなVのロゴ)から、src/app/favicon.ico(16/32/48)、icon.png(512)、apple-icon.png(180)を書き出す。
// 元の画像が小さい(150px)ので、大きいサイズは少しやわらかくなる。大きい元画像に差し替えて再実行すると、くっきりする
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "content/brand/icon-source.jpg");
const app = path.join(root, "src/app");
const png = (size) => sharp(src).resize(size, size, { fit: "cover", kernel: "lanczos3" }).ensureAlpha().png().toBuffer(); // .ico に入れる PNG は RGBA(透明度つき)が必要

// .ico は、PNG をそのまま入れた形で書く(16/32/48)
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
const head = Buffer.alloc(6);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = images.map((buf, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i], 0); e.writeUInt8(sizes[i], 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(buf.length, 8); e.writeUInt32LE(offset, 12);
  offset += buf.length;
  return e;
});
fs.writeFileSync(path.join(app, "favicon.ico"), Buffer.concat([head, ...entries, ...images]));
fs.writeFileSync(path.join(app, "icon.png"), await png(512));
fs.writeFileSync(path.join(app, "apple-icon.png"), await png(180));
console.log("favicon.ico (16/32/48), icon.png (512), apple-icon.png (180)");
