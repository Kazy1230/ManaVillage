import { C } from "../../../scripts/doodle.mjs";
export const seed = 9002;
export default function draw(d) {
  // the: スポットライト
  d.poly([[135, 40], [60, 270], [210, 270]], { color: C.yellow, fill: "#FFF6CC", w: 4 });
  d.circle(135, 250, 32, { color: C.orange, fill: "#FFE27A" });
  d.text(135, 335, "the moon", { size: 28, color: C.blue });
  d.text(135, 375, "光が当たっている", { size: 22, color: C.gray });
  d.line(270, 60, 270, 440, { color: C.gray, w: 3 });
  // a: 形のある犬
  d.ellipse(400, 215, 70, 38, { color: C.brown, fill: "#F3E3C8", w: 5 });
  d.circle(480, 180, 30, { color: C.brown, fill: "#F3E3C8", w: 5 });
  d.line(360, 245, 355, 290, { color: C.brown, w: 6 }); d.line(440, 245, 445, 290, { color: C.brown, w: 6 });
  d.dot(490, 175, 4);
  d.text(430, 335, "a dog", { size: 28, color: C.blue });
  d.text(420, 375, "形のある一匹", { size: 22, color: C.gray });
  d.line(560, 60, 560, 440, { color: C.gray, w: 3 });
  // 冠詞なし: 形のない塊
  d.cloud(660, 215, 1.3, "#EDEDED");
  d.text(660, 335, "dog", { size: 28, color: C.blue });
  d.text(670, 375, "形のない素材", { size: 22, color: C.gray });
  }
