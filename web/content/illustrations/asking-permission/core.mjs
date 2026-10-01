// 許可を求める言い方の、丁寧さの階段
import { C } from "../../../scripts/doodle.mjs";
export const seed = 4101;
export default function draw(d) {
  const steps = [
    { top: 410, label: "Can I", sub: "ラフ", color: "#E2EEFB" },
    { top: 335, label: "Is it|alright if I", sub: "ふつう", color: "#DDF5E8" },
    { top: 260, label: "May I /|Do you mind if I", sub: "丁寧", color: "#FFF1CF" },
    { top: 185, label: "Would it be|OK if I", sub: "とても丁寧", color: "#FFE4EA" },
  ];
  steps.forEach((s, i) => {
    const x0 = 30 + i * 185;
    d.poly([[x0, s.top], [x0 + 185, s.top], [x0 + 185, 480], [x0, 480]], { fill: s.color, w: 5 });
    const lines = s.label.split("|");
    lines.forEach((t, k) => d.text(x0 + 92, s.top + 28 + k * 24, t, { size: 17, rot: 0 }));
    d.text(x0 + 92, s.top + 34 + lines.length * 24, s.sub, { size: 16, rot: 0, color: C.gray });
  });
  d.person(110, 330, { s: 0.5, mood: "happy", arms: "wave" });
  d.bubble(110, 255, 150, 50, ["借りていい?"], { tail: [110, 305], size: 18 });
  d.person(295, 255, { s: 0.5, mood: "happy", arms: "down", hair: C.brown });
  d.person(480, 180, { s: 0.5, mood: "happy", arms: "down" });
  d.person(650, 105, { s: 0.5, mood: "happy", arms: "down", hair: C.orange });
  d.bubble(640, 38, 190, 44, ["よろしければ…"], { tail: [648, 80], size: 17 });
  d.star(765, 110, 16);
}
