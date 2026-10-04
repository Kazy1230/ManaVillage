// I wish: 星に願う。足元(いま)と星(願い)の間の距離
import { C } from "../../../scripts/doodle.mjs";
export const seed = 7201;
export default function draw(d) {
  d.person(200, 250, { s: 1.1, mood: "happy", arms: "up" });
  d.text(200, 460, "いま", { size: 30, color: C.gray });
  d.star(560, 90, 36);
  d.star(420, 150, 18, C.sky);
  d.star(690, 200, 20, C.sky);
  d.bubble(560, 250, 360, 120, ["I wish I could fly"], { tail: [330, 270], size: 34, color: C.blue });
  d.arrow(250, 170, 420, 110, { color: C.purple });
}
