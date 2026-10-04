import { C } from "../../../scripts/doodle.mjs";
export const seed = 8302;
export default function draw(d) {
  const items = [["Where", "疑問詞", C.red], ["do", "助動詞", C.orange], ["you", "主語", C.green], ["work?", "動詞", C.blue]];
  items.forEach(([w, lab, col], i) => {
    const x = 120 + i * 190;
    d.ellipse(x, 220, 80, 55, { color: col, fill: "#fff", w: 5 });
    d.text(x, 232, w, { size: 36, color: col });
    d.text(x, 330, lab, { size: 28 });
    if (i < 3) d.arrow(x + 85, 220, x + 105, 220, { color: C.gray, w: 4 });
  });
  d.text(400, 90, "疑問詞 → 助動詞 → 主語 → 動詞", { size: 34, color: C.ink });
  d.text(400, 440, "どこで働いているの?", { size: 30 });
}
