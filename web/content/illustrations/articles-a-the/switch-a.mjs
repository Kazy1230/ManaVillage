// 切り替え部品: a dog(形のある、1匹の犬)
import { C } from "../../../scripts/doodle.mjs";
export const seed = 9011;
export default function draw(d) {
  d.ellipse(400, 235, 120, 58, { color: C.brown, fill: "#F3E3C8", w: 6 });
  d.circle(528, 190, 48, { color: C.brown, fill: "#F3E3C8", w: 6 });
  d.poly([[505, 158], [492, 108], [532, 150]], { color: C.brown, fill: "#E5CBA3", w: 5 });
  d.line(325, 285, 320, 365, { color: C.brown, w: 8 });
  d.line(385, 292, 383, 368, { color: C.brown, w: 8 });
  d.line(435, 292, 438, 368, { color: C.brown, w: 8 });
  d.line(480, 282, 486, 362, { color: C.brown, w: 8 });
  d.curve([[290, 215], [262, 180], [276, 150]], { color: C.brown, w: 8 });
  d.dot(540, 182, 5);
  d.dot(572, 200, 7);
  d.curve([[538, 218], [552, 228], [566, 222]], { color: C.ink, w: 3.5 });
  d.line(120, 395, 680, 395, { color: C.gray, w: 4 });
  d.text(400, 462, "a dog", { size: 60, color: C.blue });
}
