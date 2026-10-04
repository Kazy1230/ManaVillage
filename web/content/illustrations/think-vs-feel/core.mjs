import { C } from "../../../scripts/doodle.mjs";
export const seed = 8201;
export default function draw(d) {
  d.person(190, 200, { s: 1.1, mood: "flat", arms: "point", dir: -1 });
  d.circle(190, 110, 36, { color: C.gray, fill: "#EEE" });
  d.text(190, 124, "⚙", { size: 40, color: C.gray });
  d.text(190, 440, "think", { size: 46, color: C.blue });
  d.text(400, 270, "?", { size: 90, color: C.red });
  d.person(610, 200, { s: 1.1, mood: "happy", arms: "hold", blush: true });
  d.heart(660, 130, 22);
  d.heart(540, 120, 14, C.pink);
  d.text(610, 440, "feel", { size: 46, color: C.blue });
}
