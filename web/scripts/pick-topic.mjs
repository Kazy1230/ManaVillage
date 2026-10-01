// 在庫から、次に書くテーマを無作為に1つ選ぶ: node scripts/pick-topic.mjs <english|japanese> [--dry]
// 選んだ行の status を selected にし、note に選んだ日付を書く(--dry のときは書き換えない)。
// 重複や「勝てない」で見送るときは、その行の status を skip にして、もう一度実行する(planning/common.md 2-1)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILES = {
  english: path.join(root, "content/planning/inventory.csv"),
  japanese: path.join(root, "content/planning/japanese/inventory.csv"),
};
const section = process.argv[2];
const dry = process.argv.includes("--dry");
if (!FILES[section]) {
  console.error("usage: node scripts/pick-topic.mjs <english|japanese> [--dry]");
  process.exit(1);
}

// 引用符つきのセルにも対応する、小さな CSV の読み書き
function parse(text) {
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((v) => v !== "")) rows.push(row);
      row = [];
    } else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
const cell = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

const file = FILES[section];
const [head, ...rows] = parse(fs.readFileSync(file, "utf8"));
const col = (name) => head.indexOf(name);
const ideas = rows.filter((r) => r[col("status")] === "idea");
if (!ideas.length) {
  console.error("在庫に idea の行がない。在庫を増やす(.claude/skills/manavillage-weekly)");
  process.exit(1);
}
const pick = ideas[Math.floor(Math.random() * ideas.length)];
const show = (name) => `${name}: ${pick[col(name)] || "-"}`;
console.log(["id", "category", "layer", "keyword", "reader", "level", "hub", "demand"].map(show).join("\n"));
console.log(`(在庫の idea: 残り ${ideas.length - 1} 件)`);

if (!dry) {
  pick[col("status")] = "selected";
  const note = col("note");
  pick[note] = [pick[note], `selected ${new Date().toISOString().slice(0, 10)}`].filter(Boolean).join(" / ");
  fs.writeFileSync(file, [head, ...rows].map((r) => r.map(cell).join(",")).join("\n") + "\n");
}
