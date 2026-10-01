// は と が: 舞台(は = 話題)と、ひとりに当たるスポットライト(が = どれか)
import { C } from "../../../scripts/doodle.mjs";
export const seed = 5201;
export default function draw(d) {
  // 舞台の幕(定式幕)
  const stripes = ["#2B2B2B", "#3C7A4A", "#C9562A"];
  for (let i = 0; i < 9; i++) d.poly([[i * 89, 20], [(i + 1) * 89, 20], [(i + 1) * 89, 62], [i * 89, 62]], { fill: stripes[i % 3], color: null });
  d.line(10, 18, 790, 18, { w: 5 });
  // 舞台の床
  d.line(30, 440, 770, 440, { color: C.brown, w: 6 });
  // スポットライトの光
  d.poly([[200, 80], [240, 80], [330, 430], [110, 430]], { fill: "#FFE9A3", color: C.yellow, w: 3 });
  d.poly([[196, 66], [244, 66], [244, 92], [196, 92]], { fill: C.gray, w: 4 });
  // 光の中の人(が)と、舞台の上のほかの人
  d.person(220, 280, { s: 0.9, mood: "big", arms: "wave" });
  d.person(470, 290, { s: 0.8, mood: "happy", arms: "down", color: C.gray });
  d.person(630, 290, { s: 0.8, mood: "happy", arms: "down", color: C.gray });
  d.text(220, 480, "が = this one!", { size: 30, color: "#D2452F" });
  d.text(560, 130, "は = the stage", { size: 34, color: C.blue });
  d.sakura(400, 400, 13);
  d.sakura(740, 390, 11);
}
