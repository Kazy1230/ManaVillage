import { C } from "../../../scripts/doodle.mjs";
export const seed = 8402;
export default function draw(d) {
  d.text(190, 70, "commit = 手元に記録", { size: 34, color: C.blue });
  d.poly([[60, 340], [60, 160], [320, 160], [320, 340]], { color: C.ink, fill: "#F3F5FA", w: 5 });
  d.text(190, 240, "ノートに", { size: 30 });
  d.text(190, 285, "書き留める", { size: 30 });
  d.arrow(335, 250, 465, 250, { color: C.orange, w: 7 });
  d.text(400, 225, "push", { size: 32, color: C.orange });
  d.text(620, 70, "push = みんなに送る", { size: 34, color: C.blue });
  d.cloud(620, 230, 1.5);
  d.text(620, 320, "共有フォルダ", { size: 28, color: C.ink });
  d.text(400, 440, "commit だけでは、リモートには届かない", { size: 30, color: C.red });
}
