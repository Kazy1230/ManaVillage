import { C } from "../../../scripts/doodle.mjs";
export const seed = 8701;
export default function draw(d) {
  d.person(220, 210, { s: 1.15, mood: "big", arms: "up" });
  d.bubble(230, 90, 260, 90, ["全部わかってる!"], { tail: [225, 160], size: 28, color: C.orange });
  d.person(580, 210, { s: 1.15, mood: "wavy", arms: "shrug", hair: C.gray });
  d.bubble(590, 90, 230, 90, ["知らない…"], { tail: [585, 160], size: 30, color: C.blue });
  d.question(680, 200, 46, C.blue);
  d.star(720, 330, 20);
  d.line(60, 420, 740, 420, { color: C.gray, w: 4 });
}
