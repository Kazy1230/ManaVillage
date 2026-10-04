import { C } from "../../../scripts/doodle.mjs";
export const seed = 8301;
export default function draw(d) {
  d.person(170, 220, { s: 1.1, mood: "surprised", arms: "wave" });
  d.bubble(300, 110, 220, 100, ["Where?"], { tail: [200, 190], size: 44, color: C.blue });
  d.poly([[520, 440], [520, 200], [680, 200], [680, 440]], { color: C.brown, fill: "#F3E3C8", w: 6 });
  d.text(600, 280, "WC", { size: 56, color: C.blue });
  d.arrow(330, 330, 500, 330, { color: C.orange });
  d.question(100, 120, 40);
}
