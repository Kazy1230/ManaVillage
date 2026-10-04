import { C } from "../../../scripts/doodle.mjs";
export const seed = 8102;
export default function draw(d) {
  d.text(200, 70, "finish = やり終える", { size: 36, color: C.blue });
  d.person(200, 200, { s: 1, mood: "big", arms: "up" });
  d.star(110, 150, 16); d.star(290, 140, 14, C.sky);
  d.text(200, 440, "宿題・本・ごはん", { size: 28 });
  d.line(400, 90, 400, 470, { color: C.gray, w: 3 });
  d.text(600, 70, "end = そこで終わり", { size: 36, color: C.blue });
  d.line(470, 360, 650, 270, { color: C.gray, w: 14 });
  d.cross(700, 250, C.red);
  d.text(600, 440, "道・期間・計画・会議", { size: 28 });
}
