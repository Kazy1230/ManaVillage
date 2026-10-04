import { C } from "../../../scripts/doodle.mjs";
export const seed = 8501;
export default function draw(d) {
  d.cloud(130, 110, 1.3, "#DDE3EC"); d.cloud(400, 70, 1.5, "#DDE3EC"); d.cloud(670, 120, 1.3, "#DDE3EC");
  d.cloud(100, 400, 1.2, "#DDE3EC"); d.cloud(700, 410, 1.2, "#DDE3EC");
  d.question(240, 230, 56, C.gray); d.question(560, 230, 56, C.gray);
  d.person(400, 230, { s: 1.15, mood: "flat", arms: "point", dir: 1 });
  d.star(400, 150, 28);
  d.line(400, 178, 400, 200, { color: C.yellow, w: 5 });
  d.text(400, 470, "I think…", { size: 36, color: C.blue });
}
