import { C } from "../../../scripts/doodle.mjs";
export const seed = 8802;
export default function draw(d) {
  d.text(200, 60, "単語で覚える", { size: 32, color: C.red });
  d.ellipse(120, 160, 60, 38, { color: C.gray, fill: "#fff", w: 5 }); d.text(120, 172, "do", { size: 34 });
  d.ellipse(280, 240, 70, 38, { color: C.gray, fill: "#fff", w: 5 }); d.text(280, 252, "make", { size: 34 });
  d.question(200, 330, 60, C.red);
  d.person(120, 360, { s: 0.5, mood: "sad", arms: "shrug" });
  d.line(400, 50, 400, 470, { color: C.gray, w: 3 });
  d.text(600, 60, "フレーズで覚える", { size: 32, color: C.blue });
  d.ellipse(560, 160, 120, 44, { color: C.blue, fill: "#EAF0FF", w: 6 }); d.text(560, 173, "do homework", { size: 32, color: C.blue });
  d.ellipse(580, 260, 130, 44, { color: C.blue, fill: "#EAF0FF", w: 6 }); d.text(580, 273, "make a decision", { size: 30, color: C.blue });
  d.ellipse(560, 360, 125, 44, { color: C.blue, fill: "#EAF0FF", w: 6 }); d.text(560, 373, "make a mistake", { size: 30, color: C.blue });
  d.check(720, 150, C.green);
}
