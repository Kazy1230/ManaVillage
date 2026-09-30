// ペンキの重ね塗り: 1回目は塗り残しだらけ、重ねるほど色がそろう
import { C } from "../../../scripts/doodle.mjs";
export const seed = 4002;
export default function draw(d) {
  const panels = [
    { x: 40, strokes: [[80, 0.35], [150, 0.5], [230, 0.3]], a: "1回目", b: "1冊目" },
    { x: 285, strokes: [[80, 0.8], [115, 0.6], [150, 0.9], [190, 0.7], [230, 0.85], [265, 0.5]], a: "2回目", b: "別の本・動画" },
    { x: 530, strokes: [[80, 1], [105, 1], [130, 1], [155, 1], [180, 1], [205, 1], [230, 1], [255, 1], [280, 1]], a: "3回目", b: "会話で出会う" },
  ];
  d.text(400, 36, "ペンキは、重ね塗り", { size: 28, rot: 0 });
  for (const p of panels) {
    d.poly([[p.x, 60], [p.x + 230, 60], [p.x + 230, 320], [p.x, 320]], { fill: "#fff", w: 5 });
    for (const [y, len] of p.strokes) d.line(p.x + 18, y, p.x + 18 + 194 * len, y + d.r(-4, 4), { color: C.sky, w: 22 });
    d.text(p.x + 115, 370, p.a, { size: 26, color: C.blue });
    d.text(p.x + 115, 405, p.b, { size: 20, color: C.gray });
  }
  d.arrow(272, 190, 290, 190, { color: C.gray, w: 4 });
  d.arrow(517, 190, 535, 190, { color: C.gray, w: 4 });
  // 刷毛を持った棒人間
  d.person(40, 430, { s: 0.33, mood: "happy", arms: "up", hair: C.ink });
  d.line(53, 427, 69, 397, { color: C.brown, w: 5 });
  d.poly([[61, 387], [79, 387], [79, 399], [61, 399]], { fill: C.sky, w: 3 });
  d.text(430, 465, "わからない所は、次の層で塗ればいい", { size: 22, color: C.gray, rot: 0 });
}
