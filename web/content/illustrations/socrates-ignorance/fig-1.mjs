import { C } from "../../../scripts/doodle.mjs";
export const seed = 8702;
export default function draw(d) {
  d.text(200, 60, "知らないのに", { size: 30 });
  d.text(200, 100, "知っていると思う", { size: 30, color: C.red });
  d.person(200, 200, { s: 0.95, mood: "big", arms: "up" });
  d.cross(320, 160, C.red);
  d.line(400, 50, 400, 440, { color: C.gray, w: 3 });
  d.text(600, 60, "知らないことを", { size: 30 });
  d.text(600, 100, "知っているとは思わない", { size: 30, color: C.blue });
  d.person(600, 200, { s: 0.95, mood: "happy", arms: "shrug", hair: C.gray });
  d.check(720, 160, C.green);
  d.text(400, 470, "ソクラテスは、この違いで「いちばん賢い」と言われた", { size: 24 });
}
