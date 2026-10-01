// 全体の入口(/)の「英語を学ぶ」のカード: 英語で話しかける人
import { C } from "../../../scripts/doodle.mjs";
export const seed = 5101;
export default function draw(d) {
  d.person(250, 250, { s: 1.1, mood: "big", arms: "wave" });
  d.bubble(510, 150, 330, 150, ["Hello!"], { tail: [330, 215], size: 64, color: C.blue });
  d.star(680, 330, 22);
  d.star(120, 110, 16, C.sky);
}
