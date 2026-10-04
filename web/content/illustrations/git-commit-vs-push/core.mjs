import { C } from "../../../scripts/doodle.mjs";
export const seed = 8401;
export default function draw(d) {
  d.poly([[60, 360], [60, 200], [330, 200], [330, 360]], { color: C.ink, fill: "#F3F5FA", w: 6 });
  d.line(30, 380, 360, 380, { color: C.ink, w: 8 });
  d.text(195, 270, "自分のPC", { size: 34 });
  d.text(195, 330, "commit", { size: 40, color: C.blue });
  d.cloud(620, 170, 1.6);
  d.text(620, 260, "リモート", { size: 34, color: C.ink });
  d.arrow(350, 270, 530, 200, { color: C.orange, w: 7 });
  d.text(500, 290, "push", { size: 40, color: C.orange });
  d.star(120, 120, 16);
}
