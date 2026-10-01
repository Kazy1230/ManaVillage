// 単語の間の音がつながる: 3つの型を1枚で
import { C } from "../../../scripts/doodle.mjs";
export const seed = 4003;
export default function draw(d) {
  d.text(400, 38, "単語は、切れずに つながって流れる", { size: 28, rot: 0 });
  const rows = [
    { y: 130, words: ["check", "it", "out"], joined: "チェキラウ", type: "1 子音+母音", color: "#DDF5E8" },
    { y: 270, words: ["big", "game"], joined: "ビッゲイム", type: "2 同じ子音", color: "#FFF1CF" },
    { y: 410, words: ["get", "over"], joined: "ゲロウヴァー", type: "3 t が弱くなる", color: "#FFE4EA" },
  ];
  for (const r of rows) {
    d.text(95, r.y - 40, r.type, { size: 20, color: C.blue, rot: 0 });
    // 文字ブロック: 区切って見える単語
    let x = 40;
    for (const w of r.words) {
      const wd = 24 + w.length * 18;
      d.poly([[x, r.y - 20], [x + wd, r.y - 20], [x + wd, r.y + 20], [x, r.y + 20]], { fill: "#fff", w: 4 });
      d.text(x + wd / 2, r.y + 8, w, { size: 22, rot: 0 });
      x += wd + 10;
    }
    // 矢印の先: ひと続きの音
    d.arrow(x + 10, r.y, 450, r.y, { color: C.gray, w: 4 });
    d.ellipse(610, r.y, 140, 42, { fill: r.color, w: 5 });
    d.text(610, r.y + 9, r.joined, { size: 26, rot: 0 });
  }
}
