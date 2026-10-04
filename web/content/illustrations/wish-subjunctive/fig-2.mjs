// 3つの形: いま=過去形 / 過去=過去完了 / 相手の行動=would
import { C } from "../../../scripts/doodle.mjs";
export const seed = 7203;
export default function draw(d) {
  const rows = [
    ["いまの願い", "I wish I had …", "過去形"],
    ["過去の後悔", "I wish I had been …", "過去完了"],
    ["相手や物の行動", "I wish you would …", "would"],
  ];
  rows.forEach(([a, b, c], i) => {
    const y = 90 + i * 150;
    d.text(120, y + 10, a, { size: 28 });
    d.arrow(230, y, 300, y, { color: C.purple });
    d.bubble(500, y, 360, 90, [b], { size: 32, color: C.blue });
    d.text(740, y + 10, c, { size: 26, color: C.red, anchor: "end" });
  });
}
