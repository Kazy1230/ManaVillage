// 上がる=rise / 上げる=raise の対応図
import { C } from "../../../scripts/doodle.mjs";
export const seed = 7102;
export default function draw(d) {
  d.text(200, 70, "上がる = rise", { size: 40, color: C.blue });
  d.poly([[60, 330], [190, 210], [320, 330]], { color: C.green, fill: "#CDE9C8", w: 5 });
  d.sun(190, 160, 30);
  d.text(200, 400, "自分で上がる", { size: 28 });
  d.text(200, 440, "(〜を は付かない)", { size: 22, color: C.gray });
  d.line(400, 90, 400, 460, { color: C.gray, w: 3 });
  d.text(600, 70, "上げる = raise", { size: 40, color: C.blue });
  d.person(560, 170, { s: 1, mood: "happy", arms: "wave" });
  d.text(660, 230, "手を", { size: 30, color: C.red });
  d.text(600, 400, "何かを上げる", { size: 28 });
  d.text(600, 440, "(〜を が付く)", { size: 22, color: C.gray });
}
