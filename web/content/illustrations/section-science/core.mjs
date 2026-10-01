// 全体の入口(/)の「科学を学ぶ」のカード: フラスコと虫めがねで確かめる人
import { C } from "../../../scripts/doodle.mjs";
export const seed = 5105;
export default function draw(d) {
  d.person(220, 240, { s: 1.05, mood: "big", arms: "point", dir: 1 });
  // フラスコ
  d.poly([[520, 160], [570, 160], [570, 250], [640, 390], [450, 390], [520, 250]], { fill: "#E4EEF8", w: 6 });
  d.poly([[485, 330], [605, 330], [640, 390], [450, 390]], { fill: "#9FD0FF", color: null });
  d.circle(530, 300, 9, { color: "#1F6FB2", w: 3 });
  d.circle(565, 270, 6, { color: "#1F6FB2", w: 3 });
  // 虫めがね
  d.circle(700, 180, 45, { color: C.ink, fill: "#FFFFFF", w: 6 });
  d.line(732, 212, 780, 262, { w: 9 });
  d.text(220, 110, "ためしてみよう!", { size: 34, color: "#1F6FB2" });
}
