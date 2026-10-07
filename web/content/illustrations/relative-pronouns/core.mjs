import { C } from "../../../scripts/doodle.mjs";
export const seed = 8901;
export default function draw(d) {
  d.person(130, 230, { s: 1.1, mood: "surprised", arms: "up" });
  d.bubble(160, 90, 220, 80, ["つながった!"], { tail: [140, 160], size: 32, color: C.orange });
  d.ellipse(400, 150, 110, 40, { color: C.gray, fill: "#fff", w: 5 }); d.text(400, 162, "I know a man.", { size: 28 });
  d.ellipse(400, 260, 110, 40, { color: C.gray, fill: "#fff", w: 5 }); d.text(400, 272, "He lives here.", { size: 28 });
  d.arrow(520, 200, 590, 200, { color: C.orange, w: 6 });
  d.ellipse(660, 200, 120, 75, { color: C.blue, fill: "#EAF0FF", w: 6 });
  d.text(660, 188, "I know a man", { size: 26, color: C.blue });
  d.text(660, 224, "who lives here.", { size: 26, color: C.blue });
  d.star(120, 400, 18);
  d.line(60, 440, 740, 440, { color: C.gray, w: 4 });
}
