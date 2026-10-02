// 似た形の違い: 書いてもいいですか(私が書く)/ 書いてもらっていいですか(相手が書く)
import { C } from "../../../scripts/doodle.mjs";
export const seed = 5302;
export default function draw(d) {
  d.line(400, 30, 400, 470, { color: C.gray, w: 3 });
  // 左: 私が書く
  d.text(200, 60, "書いてもいいですか", { size: 26, color: "#B83A2A", rot: 0 });
  d.person(130, 210, { s: 0.75, mood: "happy", arms: "point", dir: 1 });
  d.poly([[220, 300], [330, 300], [330, 380], [220, 380]], { fill: "#FFFFFF", w: 4 });
  d.line(240, 325, 310, 325, { w: 3, color: C.gray });
  d.line(240, 350, 300, 350, { w: 3, color: C.gray });
  d.arrow(175, 280, 235, 320, { color: "#B83A2A", w: 4 });
  d.text(200, 450, "I write", { size: 28, color: "#B83A2A" });
  // 右: 相手が書く
  d.text(600, 60, "書いてもらっていいですか", { size: 24, color: "#2E4A7D", rot: 0 });
  d.person(500, 210, { s: 0.75, mood: "happy", arms: "point", dir: 1 });
  d.person(700, 210, { s: 0.75, mood: "surprised", arms: "down", dir: -1, hair: C.orange });
  d.poly([[560, 300], [660, 300], [660, 380], [560, 380]], { fill: "#FFFFFF", w: 4 });
  d.arrow(690, 290, 650, 320, { color: "#2E4A7D", w: 4 });
  d.text(600, 450, "You write", { size: 28, color: "#2E4A7D" });
}
