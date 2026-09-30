// 英単語を覚える4つの段階の階段
import { C } from "../../../scripts/doodle.mjs";
export const seed = 4001;
export default function draw(d) {
  const steps = [
    { top: 410, label: "1 出会う", color: "#E2EEFB" },
    { top: 335, label: "2 イメージできる", color: "#DDF5E8" },
    { top: 260, label: "3 思い出せる", color: "#FFF1CF" },
    { top: 185, label: "4 使える", color: "#FFE4EA" },
  ];
  steps.forEach((s, i) => {
    const x0 = 30 + i * 185;
    d.poly([[x0, s.top], [x0 + 185, s.top], [x0 + 185, 480], [x0, 480]], { fill: s.color, w: 5 });
    d.text(x0 + 92, s.top + 40, s.label, { size: 19, rot: 0 });
  });
  // 1: はじめまして
  d.person(110, 330, { s: 0.5, mood: "surprised", arms: "down" });
  d.bubble(110, 250, 150, 56, ["はじめまして"], { tail: [110, 305], size: 18 });
  // 2: 頭の中に場面が浮かぶ
  d.person(305, 255, { s: 0.5, mood: "happy", arms: "down", hair: C.brown });
  d.ellipse(305, 170, 70, 42, { fill: "#fff", w: 4 });
  d.circle(262, 200, 6, { w: 3, overshoot: false });
  d.poly([[285, 160], [315, 160], [311, 190], [289, 190]], { fill: "#fff", w: 3 });
  d.curve([[315, 170], [330, 178], [318, 188]], { w: 3 });
  d.curve([[300, 190], [296, 200], [305, 206], [320, 202]], { color: C.brown, w: 5 });
  // 3: あ、spill!
  d.person(480, 180, { s: 0.5, mood: "big", arms: "point", dir: 1 });
  d.bubble(470, 100, 130, 56, ["あ、spill!"], { tail: [478, 155], size: 20, textColor: C.red });
  // 4: しゃべっている
  d.person(640, 105, { s: 0.5, mood: "big", arms: "wave" });
  d.person(730, 110, { s: 0.45, mood: "happy", arms: "down", hair: C.orange });
  d.bubble(660, 35, 250, 50, ["I spilled coffee!"], { tail: [645, 80], size: 18 });
}
