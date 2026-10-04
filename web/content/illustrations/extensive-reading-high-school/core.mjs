// 多読(高校生): 並んで、やさしい本を読む。積んだ難しい本には×
import { C } from "../../../scripts/doodle.mjs";
export const seed = 7301;
export default function draw(d) {
  d.person(190, 190, { s: 1.05, mood: "happy", arms: "hold", legs: "sit" });
  d.person(330, 200, { s: 1.0, mood: "big", arms: "hold", dir: -1, legs: "sit", hair: C.brown });
  d.poly([[200, 290], [260, 270], [320, 290], [320, 330], [260, 312], [200, 330]], { color: C.blue, fill: "#DCE8FA", w: 4 });
  d.text(260, 305, "Easy", { size: 22, color: C.blue });
  d.line(60, 450, 440, 450, { color: C.brown, w: 6 });
  d.poly([[520, 450], [520, 410], [700, 410], [700, 450]], { color: C.gray, fill: "#EEE", w: 4 });
  d.poly([[535, 410], [535, 372], [690, 372], [690, 410]], { color: C.gray, fill: "#E4E4E4", w: 4 });
  d.poly([[550, 372], [550, 336], [680, 336], [680, 372]], { color: C.gray, fill: "#EEE", w: 4 });
  d.text(610, 395, "Very Hard", { size: 22, color: C.gray });
  d.cross(610, 270, C.red);
  d.star(130, 90, 16);
  d.star(430, 100, 14, C.sky);
}
