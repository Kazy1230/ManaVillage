import { C } from "../../../scripts/doodle.mjs";
export const seed = 8902;
export default function draw(d) {
  d.text(100, 70, "日本語", { size: 32, color: C.red });
  d.ellipse(300, 130, 150, 45, { color: C.blue, fill: "#EAF0FF", w: 5 }); d.text(300, 143, "私が昨日会った", { size: 32, color: C.blue });
  d.arrow(455, 130, 560, 130, { color: C.ink, w: 6 });
  d.ellipse(640, 130, 60, 45, { color: C.orange, fill: "#FFF1D6", w: 5 }); d.text(640, 143, "人", { size: 36, color: C.orange });
  d.text(400, 205, "説明を、名詞の前に置く", { size: 26 });
  d.line(60, 250, 740, 250, { color: C.gray, w: 3 });
  d.text(100, 310, "英語", { size: 32, color: C.red });
  d.ellipse(230, 380, 80, 45, { color: C.orange, fill: "#FFF1D6", w: 5 }); d.text(230, 393, "a man", { size: 32, color: C.orange });
  d.arrow(315, 380, 400, 380, { color: C.ink, w: 6 });
  d.ellipse(590, 380, 160, 45, { color: C.blue, fill: "#EAF0FF", w: 5 }); d.text(590, 393, "that I met yesterday", { size: 26, color: C.blue });
  d.text(400, 455, "名詞を言ってから、説明を後ろに足す", { size: 26 });
}
