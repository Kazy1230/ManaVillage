// 全体の入口(/)の「Learn Japanese」のカード: 鳥居の前で「こんにちは」
import { C } from "../../../scripts/doodle.mjs";
export const seed = 5102;
export default function draw(d) {
  d.torii(590, 150, 1.6);
  d.person(230, 250, { s: 1.1, mood: "big", arms: "wave" });
  d.bubble(300, 110, 330, 130, ["こんにちは"], { tail: [255, 190], size: 48, color: "#D2452F" });
  d.sakura(450, 400, 16);
  d.sakura(730, 430, 13);
  d.sakura(110, 430, 12);
  d.line(40, 470, 760, 470, { color: C.green, w: 5 });
}
