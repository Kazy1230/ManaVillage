// 全体の入口(/)の「ITを学ぶ」のカード: パソコンの前で「わかった!」
import { C } from "../../../scripts/doodle.mjs";
export const seed = 5103;
export default function draw(d) {
  d.poly([[430, 150], [710, 150], [710, 340], [430, 340]], { fill: "#1E2530", w: 6 });
  d.text(470, 210, "$ git commit", { size: 30, color: "#7EE0C3", anchor: "start", rot: 0 });
  d.text(470, 260, "✓ saved!", { size: 30, color: "#FFFFFF", anchor: "start", rot: 0 });
  d.poly([[400, 340], [740, 340], [770, 380], [370, 380]], { fill: C.gray, w: 5 });
  d.person(230, 230, { s: 1.05, mood: "big", arms: "wave" });
  d.bubble(250, 90, 250, 100, ["わかった!"], { tail: [240, 160], size: 38, color: "#0E7C70" });
  d.star(760, 110, 20);
}
