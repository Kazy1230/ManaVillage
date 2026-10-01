// 全体の入口(/)の「人間関係を学ぶ」のカード: 話を聴き合うふたり
import { C } from "../../../scripts/doodle.mjs";
export const seed = 5106;
export default function draw(d) {
  d.person(250, 250, { s: 1.05, mood: "happy", arms: "wave", dir: 1 });
  d.person(550, 250, { s: 1.05, mood: "happy", arms: "down", dir: -1, hair: C.orange });
  d.bubble(250, 110, 230, 90, ["ありがとう"], { tail: [255, 175], size: 32, color: "#C8553D" });
  d.bubble(560, 110, 200, 90, ["うんうん"], { tail: [550, 175], size: 32, color: "#C8553D" });
  d.heart(400, 230, 26, "#F28C7A");
  d.line(60, 470, 740, 470, { color: C.green, w: 4 });
}
