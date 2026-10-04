import { C } from "../../../scripts/doodle.mjs";
export const seed = 8202;
export default function draw(d) {
  d.text(200, 70, "think", { size: 40, color: C.blue });
  d.person(200, 190, { s: 1, mood: "flat", arms: "down" });
  d.bubble(300, 110, 150, 70, ["考えた!"], { tail: [230, 170], size: 24, color: C.gray });
  d.text(200, 430, "頭で考えて思う", { size: 28 });
  d.line(400, 90, 400, 470, { color: C.gray, w: 3 });
  d.text(600, 70, "feel", { size: 40, color: C.blue });
  d.person(600, 190, { s: 1, mood: "wavy", arms: "hold" });
  d.bubble(700, 110, 150, 70, ["なんとなく…"], { tail: [630, 170], size: 22, color: C.pink });
  d.text(600, 430, "なんとなく、気がする", { size: 28 });
}
