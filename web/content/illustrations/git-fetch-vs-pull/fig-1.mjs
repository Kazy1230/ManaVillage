import { C } from "../../../scripts/doodle.mjs";
export const seed = 8602;
export default function draw(d) {
  d.text(200, 60, "fetch = 取ってくる", { size: 34, color: C.blue });
  d.cloud(110, 150, 1.1);
  d.arrow(180, 175, 260, 250, { color: C.orange, w: 6 });
  d.poly([[250, 330], [250, 275], [330, 275], [330, 330]], { color: C.brown, fill: "#F3E3C8", w: 5 });
  d.line(190, 340, 380, 340, { color: C.gray, w: 6 });
  d.text(290, 400, "玄関に置いたまま", { size: 26 });
  d.text(290, 440, "自分のブランチは変わらない", { size: 22, color: C.gray });
  d.line(430, 90, 430, 470, { color: C.gray, w: 3 });
  d.text(620, 60, "pull = 取り込む", { size: 34, color: C.blue });
  d.poly([[510, 340], [510, 160], [730, 160], [730, 340]], { color: C.ink, fill: "#F9F6EE", w: 5 });
  d.poly([[590, 300], [590, 245], [670, 245], [670, 300]], { color: C.brown, fill: "#F3E3C8", w: 5 });
  d.text(620, 400, "fetch + merge", { size: 28, color: C.red });
  d.text(620, 440, "部屋の中まで運び入れる", { size: 24 });
}
