import { C } from "../../../scripts/doodle.mjs";
export const seed = 8101;
export default function draw(d) {
  d.person(170, 190, { s: 1.1, mood: "big", arms: "up" });
  d.check(170, 120, C.green);
  d.poly([[90, 420], [90, 400], [250, 400], [250, 420]], { color: C.brown, fill: "#F3E3C8", w: 4 });
  d.text(170, 470, "finish", { size: 46, color: C.blue });
  d.line(400, 90, 400, 460, { color: C.gray, w: 3 });
  d.line(470, 420, 640, 330, { color: C.gray, w: 12 });
  d.line(640, 330, 650, 320, { color: C.red, w: 8 });
  d.cross(700, 300, C.red);
  d.text(580, 470, "end", { size: 46, color: C.blue });
}
