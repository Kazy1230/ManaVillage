// 切り替え部品: 冠詞なしの dog(形のない、素材のような犬 = 犬の肉)
import { C } from "../../../scripts/doodle.mjs";
export const seed = 9012;
export default function draw(d) {
  d.ellipse(400, 225, 175, 100, { color: C.red, fill: "#F7B7C5", w: 6 });
  d.curve([[290, 195], [350, 170], [430, 200], [510, 172]], { color: "#FFFFFF", w: 14 });
  d.curve([[280, 250], [350, 225], [440, 262], [525, 232]], { color: "#FFFFFF", w: 12 });
  d.curve([[320, 285], [400, 270], [470, 292]], { color: "#FFFFFF", w: 10 });
  d.cloud(150, 120, 0.7, "#EDEDED");
  d.cloud(660, 110, 0.7, "#EDEDED");
  d.line(120, 360, 680, 360, { color: C.gray, w: 4 });
  d.text(400, 462, "dog", { size: 60, color: C.blue });
}
