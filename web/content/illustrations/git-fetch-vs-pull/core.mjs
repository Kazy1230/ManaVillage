import { C } from "../../../scripts/doodle.mjs";
export const seed = 8601;
export default function draw(d) {
  d.cloud(130, 110, 1.3);
  d.text(130, 175, "リモート", { size: 28, color: C.ink });
  d.arrow(210, 140, 330, 250, { color: C.orange, w: 6 });
  d.poly([[340, 330], [340, 280], [410, 280], [410, 330]], { color: C.brown, fill: "#F3E3C8", w: 5 });
  d.text(375, 312, "荷物", { size: 24 });
  d.line(280, 340, 460, 340, { color: C.gray, w: 6 });
  d.text(375, 400, "fetch", { size: 44, color: C.blue });
  d.text(375, 440, "玄関に届く", { size: 24, color: C.gray });
  d.line(500, 200, 500, 420, { color: C.gray, w: 3 });
  d.poly([[540, 420], [540, 220], [760, 220], [760, 420]], { color: C.ink, fill: "#F9F6EE", w: 5 });
  d.poly([[620, 340], [620, 290], [690, 290], [690, 340]], { color: C.brown, fill: "#F3E3C8", w: 5 });
  d.text(655, 322, "荷物", { size: 24 });
  d.person(580, 300, { s: 0.55, mood: "big", arms: "up" });
  d.text(650, 465, "pull", { size: 44, color: C.blue });
  d.text(650, 200, "部屋の中まで", { size: 24, color: C.gray });
}
