import { C } from "../../../scripts/doodle.mjs";
export const seed = 9001;
export default function draw(d) {
  d.poly([[400, 20], [250, 360], [550, 360]], { color: C.yellow, fill: "#FFF6CC", w: 4 });
  d.circle(400, 300, 48, { color: C.orange, fill: "#FFE27A" });
  d.text(400, 312, "the", { size: 38, color: C.blue });
  d.text(400, 420, "the moon", { size: 34, color: C.ink });
  d.person(130, 280, { s: 0.85, mood: "surprised", arms: "up" });
  d.question(70, 200, 40);
  d.star(700, 120, 16);
  d.line(40, 460, 760, 460, { color: C.gray, w: 4 });
}
