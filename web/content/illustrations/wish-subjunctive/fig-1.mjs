// 事実から1歩離れる: I have a car → I wish I had a car
import { C } from "../../../scripts/doodle.mjs";
export const seed = 7202;
export default function draw(d) {
  d.text(200, 60, "I have a car.", { size: 34, color: C.blue });
  d.person(110, 180, { s: 0.9, mood: "happy", arms: "down" });
  d.poly([[200, 330], [200, 290], [250, 260], [330, 260], [370, 290], [390, 295], [390, 330]], { color: C.red, fill: "#F7C5BA", w: 5 });
  d.circle(240, 335, 18, { color: C.ink, fill: "#ddd" });
  d.circle(350, 335, 18, { color: C.ink, fill: "#ddd" });
  d.text(200, 440, "いまの事実", { size: 28 });
  d.arrow(410, 270, 500, 270, { color: C.purple });
  d.text(455, 245, "1歩", { size: 28, color: C.purple });
  d.bubble(640, 150, 280, 150, ["I wish", "I had a car."], { tail: [660, 260], size: 32, color: C.blue });
  d.poly([[540, 330], [540, 290], [590, 260], [670, 260], [710, 290], [730, 295], [730, 330]], { color: C.gray, fill: "#F3F3F3", w: 4 });
  d.text(640, 440, "事実から離れた世界", { size: 28 });
}
