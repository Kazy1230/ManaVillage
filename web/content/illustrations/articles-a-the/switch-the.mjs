// 切り替え部品: the moon(スポットライトが当たっているもの)
import { C } from "../../../scripts/doodle.mjs";
export const seed = 9013;
export default function draw(d) {
  d.poly([[400, 18], [235, 395], [565, 395]], { color: C.yellow, fill: "#FFF6CC", w: 4 });
  d.circle(400, 300, 62, { color: C.orange, fill: "#FFE27A", w: 6 });
  d.star(150, 90, 18);
  d.star(660, 150, 14, C.sky);
  d.star(700, 60, 12);
  d.line(120, 400, 680, 400, { color: C.gray, w: 4 });
  d.text(400, 462, "the moon", { size: 60, color: C.blue });
}
