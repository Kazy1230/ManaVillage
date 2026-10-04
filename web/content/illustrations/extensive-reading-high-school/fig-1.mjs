// 本のレベルの階段: 「やさしすぎる」が最初の段
import { C } from "../../../scripts/doodle.mjs";
export const seed = 7302;
export default function draw(d) {
  const steps = [["やさしすぎる", 110, "#DFF1DC"], ["ちょうどいい", 230, "#FFF0C2"], ["ちょっと難しい", 350, "#FAD9D0"]];
  steps.forEach(([t, h, fill], i) => {
    const x = 70 + i * 230;
    d.poly([[x, 460], [x, 460 - h], [x + 220, 460 - h], [x + 220, 460]], { color: C.ink, fill, w: 5 });
    d.text(x + 110, 460 - h + 50, t, { size: 28 });
  });
  d.person(180, 220, { s: 0.8, mood: "big", arms: "hold" });
  d.check(180, 140, C.green);
  d.text(410, 60, "まずは、いちばん下の段から", { size: 32, color: C.blue });
}
