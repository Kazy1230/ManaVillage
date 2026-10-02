// 許可を求める言い方の階段: 下は友だち(いい?)、上は上司(させていただけますか)。相手で言い方を選ぶ
import { C } from "../../../scripts/doodle.mjs";
export const seed = 5301;
export default function draw(d) {
  const steps = [
    { top: 420, label: "いい?", color: "#F8E3E7" },
    { top: 340, label: "てもいいですか", color: "#FBEFCF" },
    { top: 260, label: "てもよろしいですか", color: "#E3EEDC" },
    { top: 180, label: "させていただけますか", color: "#E0EAF3" },
  ];
  steps.forEach((s, i) => {
    const x0 = 40 + i * 180;
    d.poly([[x0, s.top], [x0 + 180, s.top], [x0 + 180, 480], [x0, 480]], { fill: s.color, w: 5 });
    d.text(x0 + 90, s.top + 32, s.label, { size: i >= 2 ? 16 : 20, rot: 0 });
  });
  // 下の段: 友だちどうし
  d.person(110, 330, { s: 0.55, mood: "happy", arms: "wave" });
  d.bubble(150, 250, 150, 56, ["いい?"], { tail: [118, 300], size: 24, color: "#C8553D" });
  // 上の段: 上司に、ていねいに
  d.person(670, 100, { s: 0.55, mood: "surprised", arms: "down", color: "#2E4A7D" });
  d.bubble(560, 50, 270, 56, ["使わせていただけますか"], { tail: [640, 80], size: 20, color: "#2E4A7D" });
  d.sakura(760, 440, 13);
}
