import { C } from "../../../scripts/doodle.mjs";
export const seed = 8801;
export default function draw(d) {
  d.person(160, 230, { s: 1.1, mood: "big", arms: "up" });
  d.bubble(230, 90, 250, 90, ["宿題をする"], { tail: [180, 170], size: 34, color: C.orange });
  d.arrow(345, 100, 430, 100, { color: C.gray, w: 5 });
  d.ellipse(580, 100, 120, 48, { color: C.blue, fill: "#EAF0FF", w: 6 });
  d.text(580, 114, "do homework", { size: 38, color: C.blue });
  d.text(580, 190, "ひとつの塊で、浮かぶ", { size: 26 });
  d.line(60, 420, 740, 420, { color: C.gray, w: 4 });
  d.text(400, 465, "make と do で迷わない人の頭の中", { size: 28, color: C.ink });
  d.star(700, 250, 20);
}
