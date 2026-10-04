// rise と raise: 太陽が昇る(rise)/ 手を上げる(raise)
import { C } from "../../../scripts/doodle.mjs";
export const seed = 7101;
export default function draw(d) {
  d.poly([[40, 400], [180, 250], [320, 400]], { color: C.green, fill: "#CDE9C8", w: 5 });
  d.sun(180, 190, 38);
  d.arrow(180, 140, 180, 70, { color: C.orange });
  d.text(180, 450, "rise", { size: 48, color: C.blue });
  d.text(400, 250, "?", { size: 90, color: C.red });
  d.text(400, 320, "自分で? 誰かが?", { size: 26 });
  d.person(620, 190, { s: 1.1, mood: "big", arms: "wave" });
  d.arrow(700, 150, 700, 70, { color: C.orange });
  d.text(620, 450, "raise", { size: 48, color: C.blue });
}
