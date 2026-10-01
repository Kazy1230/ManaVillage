// 全体の入口(/)の「哲学を学ぶ」のカード: 腕を組んで「なぜ?」と考える人
import { C } from "../../../scripts/doodle.mjs";
export const seed = 5104;
export default function draw(d) {
  d.person(300, 240, { s: 1.1, mood: "surprised", arms: "down" });
  d.bubble(520, 150, 260, 120, ["なぜ?"], { tail: [350, 210], size: 54, color: "#5B4B8A" });
  d.question(690, 330, 70, "#5B4B8A");
  d.question(140, 150, 50, C.gray);
  d.line(60, 470, 740, 470, { color: C.gray, w: 4 });
}
