// 記事用の「変な絵」を生成する: node scripts/draw-articles.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { C, canvas } from "./doodle.mjs";

const scenes = {
  // ---------- How are you? ----------
  "how-are-you/1": (d) => {
    d.person(170, 200, { mood: "happy", arms: "wave", hair: C.brown });
    d.bubble(250, 90, 250, 90, ["How are you?"], { tail: [200, 170] });
    d.person(560, 200, { mood: "flat", arms: "stiff", face: "#DDE3EA", sweat: true });
    d.bubble(590, 70, 340, 110, ["I'm fine, thank you.", "And you?"], { tail: [570, 165], size: 24 });
    d.text(560, 400, "(ロボットみたい…)", { size: 22, color: C.gray });
    d.question(235, 205, 40);
  },
  "how-are-you/2": (d) => {
    d.line(110, 60, 110, 450, { color: C.ink, w: 6 });
    d.arrow(110, 450, 110, 50, { color: C.ink, w: 6 });
    d.text(110, 40, "げんき", { size: 22, color: C.red });
    const rows = [
      [95, "big", "Great!", "さいこう", C.yellow],
      [190, "happy", "Pretty good.", "いい感じ", "#FFF1A8"],
      [285, "flat", "Not bad.", "まあまあ", "#F2F2F2"],
      [380, "sad", "Could be better.", "いまいち", "#D6E6F7"],
    ];
    for (const [y, mood, en, ja, bg] of rows) {
      d.circle(190, y, 34, { fill: bg });
      d.dot(178, y - 6, 4); d.dot(202, y - 6, 4);
      const m = { big: [[174, y + 8], [190, y + 22], [206, y + 8]], happy: [[176, y + 10], [190, y + 18], [204, y + 10]], flat: [[176, y + 14], [204, y + 14]], sad: [[176, y + 20], [190, y + 12], [204, y + 20]] }[mood];
      d.curve(m, { w: 3.5 });
      d.text(260, y + 10, en, { size: 34, anchor: "start" });
      d.text(560, y + 10, ja, { size: 24, anchor: "start", color: C.gray });
    }
  },

  // ---------- Me too / Me neither ----------
  "me-too-me-neither/1": (d) => {
    d.person(180, 210, { mood: "sad", arms: "down", hair: C.ink });
    d.bubble(220, 80, 330, 100, ["I don't like natto."], { tail: [190, 175], size: 26 });
    d.ellipse(110, 370, 40, 22, { fill: C.brown });
    for (let i = 0; i < 6; i++) d.line(80 + i * 10, 360, 90 + i * 12, 330 - (i % 2) * 14, { color: C.gray, w: 2 });
    d.person(580, 210, { mood: "big", arms: "up", blush: true });
    d.bubble(600, 90, 220, 90, ["Me too!"], { tail: [585, 175], size: 32 });
    d.question(250, 240, 48);
    d.question(285, 215, 34);
    d.text(400, 460, "え、きみは納豆すきなの？ きらいなの？", { size: 22, color: C.gray });
  },
  "me-too-me-neither/2": (d) => {
    d.poly([[40, 60], [380, 60], [380, 440], [40, 440]], { color: C.ink, fill: "#FFF7D6", w: 5 });
    d.text(210, 120, "I like ~", { size: 36 });
    d.arrow(210, 160, 210, 250, { color: C.orange });
    d.text(210, 320, "Me too.", { size: 44, color: C.red });
    d.heart(210, 385, 22);
    d.poly([[420, 60], [760, 60], [760, 440], [420, 440]], { color: C.ink, fill: "#E2EEFB", w: 5 });
    d.text(590, 120, "I don't like ~", { size: 34 });
    d.arrow(590, 160, 590, 250, { color: C.blue });
    d.text(590, 320, "Me neither.", { size: 44, color: C.blue });
    d.cross(590, 390, C.blue);
  },

  // ---------- see / look / watch ----------
  "see-look-watch/1": (d) => {
    for (const x of [266, 533]) d.line(x, 30, x, 470, { color: C.gray, w: 3 });
    d.text(133, 60, "see", { size: 44, color: C.blue });
    d.person(110, 250, { mood: "flat", arms: "down", s: 0.9 });
    d.curve([[150, 130], [175, 112], [200, 130]], { color: C.ink, w: 4 });
    d.curve([[200, 130], [225, 112], [250, 130]], { color: C.ink, w: 4 });
    d.arrow(160, 160, 240, 170, { color: C.gray, w: 3 });
    d.text(133, 450, "(目に入っちゃった)", { size: 20, color: C.gray });
    d.text(400, 60, "look", { size: 44, color: C.red });
    d.person(340, 250, { mood: "surprised", arms: "point", dir: 1, s: 0.9 });
    for (let i = 0; i < 6; i++) d.ellipse(465 + Math.cos(i) * 20, 230 + Math.sin(i) * 20, 12, 12, { fill: C.pink, w: 3 });
    d.circle(465, 230, 10, { fill: C.yellow, w: 3 });
    d.line(465, 250, 465, 330, { color: C.green, w: 5 });
    d.text(360, 160, "Look!", { size: 30, color: C.red });
    d.text(400, 450, "(わざと目を向ける)", { size: 20, color: C.gray });
    d.text(667, 60, "watch", { size: 44, color: C.green });
    d.poly([[560, 110], [770, 110], [770, 250], [560, 250]], { fill: "#DFF3E4" });
    d.circle(665, 180, 22, { fill: "#fff", w: 4 });
    d.line(640, 270, 640, 250, { w: 4 }); d.line(690, 270, 690, 250, { w: 4 });
    d.person(640, 320, { mood: "happy", arms: "hold", dir: 1, s: 0.75, legs: "sit" });
    d.ellipse(690, 380, 22, 14, { fill: C.yellow, w: 3 });
    d.text(667, 450, "(動きをじっと追う)", { size: 20, color: C.gray });
  },

  // ---------- by / until ----------
  "by-until/1": (d) => {
    d.text(90, 130, "by", { size: 44, color: C.red });
    d.line(150, 120, 700, 120, { color: C.gray, w: 4 });
    d.poly([[700, 70], [700, 130]], { closed: false, w: 5 });
    d.poly([[700, 70], [750, 82], [700, 96]], { fill: C.red, w: 4 });
    d.text(700, 170, "金曜", { size: 24 });
    d.star(430, 120, 26);
    d.text(430, 75, "出す!", { size: 24, color: C.red });
    d.text(430, 205, "金曜までの どこか1回", { size: 22, color: C.gray });
    d.text(90, 350, "until", { size: 44, color: C.blue });
    d.poly([[700, 300], [700, 360]], { closed: false, w: 5 });
    d.poly([[700, 300], [750, 312], [700, 326]], { fill: C.blue, w: 4 });
    d.text(700, 400, "金曜", { size: 24 });
    d.poly([[170, 330], [690, 330], [690, 362], [170, 362]], { fill: C.sky, w: 4 });
    d.text(430, 355, "wait… wait… wait…", { size: 22, color: C.blue });
    d.text(430, 440, "金曜まで ずーっと続く", { size: 22, color: C.gray });
  },

  // ---------- 断り方 ----------
  "polite-no/1": (d) => {
    d.person(170, 150, { mood: "happy", arms: "hold", dir: 1, hair: C.ink });
    d.poly([[40, 280], [360, 280], [360, 470], [40, 470]], { fill: "#EEE2CF" });
    d.text(200, 390, "レジ", { size: 26, color: C.brown });
    d.poly([[240, 190], [300, 190], [292, 262], [248, 262]], { fill: "#FFFFFF", w: 4 });
    d.curve([[255, 190], [270, 168], [285, 190]], { w: 3 });
    d.bubble(190, 55, 300, 80, ["Do you need a bag?"], { tail: [180, 120], size: 24 });
    d.person(560, 170, { mood: "happy", arms: "stop", dir: -1, blush: true });
    d.bubble(620, 60, 280, 90, ["I'm good, thanks!"], { tail: [580, 140], size: 26 });
    d.poly([[640, 260], [700, 260], [700, 320], [640, 320]], { fill: C.yellow, w: 4 });
    d.text(670, 300, "エコ", { size: 18 });
  },

  // ---------- want / would like ----------
  "would-like/1": (d) => {
    d.line(400, 20, 400, 480, { color: C.gray, w: 3 });
    d.person(110, 190, { mood: "flat", arms: "point", dir: 1, s: 0.9 });
    d.bubble(150, 70, 250, 90, ["I want coffee."], { tail: [120, 160], size: 24 });
    d.person(310, 210, { mood: "wavy", arms: "down", s: 0.85, sweat: true, hair: C.brown });
    d.text(310, 150, "…はい", { size: 20, color: C.gray });
    d.cross(200, 430);
    d.text(285, 440, "こわい", { size: 22, color: C.gray });
    d.person(500, 190, { mood: "happy", arms: "wave", s: 0.9, blush: true });
    d.bubble(560, 70, 300, 100, ["I'd like a coffee,", "please."], { tail: [510, 160], size: 24 });
    d.person(700, 210, { mood: "big", arms: "down", s: 0.85, hair: C.brown });
    d.heart(700, 140, 16);
    d.circle(590, 430, 26, { color: C.green, w: 7 });
    d.text(690, 440, "やさしい", { size: 22, color: C.gray });
  },

  // ---------- maybe / probably ----------
  "maybe-probably/1": (d) => {
    d.curve([[120, 400], [150, 250], [260, 150], [400, 120], [540, 150], [650, 250], [680, 400]], { w: 7 });
    d.line(120, 400, 680, 400, { w: 5 });
    d.text(170, 380, "possibly", { size: 24, color: C.gray, rot: -50 });
    d.text(400, 180, "maybe", { size: 34, color: C.orange });
    d.text(590, 250, "probably", { size: 30, color: C.red, rot: 35 });
    d.arrow(400, 400, 590, 280, { color: C.red, w: 7 });
    d.circle(400, 400, 14, { fill: C.ink });
    d.text(150, 450, "あやしい", { size: 22, color: C.gray });
    d.text(650, 450, "ほぼそう", { size: 22, color: C.gray });
  },
  "maybe-probably/2": (d) => {
    d.person(170, 200, { mood: "big", arms: "wave", hair: C.orange });
    d.bubble(230, 80, 330, 100, ["Are you coming", "to the party?"], { tail: [190, 170], size: 24 });
    d.person(580, 200, { mood: "wavy", arms: "shrug" });
    d.bubble(620, 80, 200, 80, ["Maybe…"], { tail: [590, 170], size: 30 });
    d.text(170, 420, "(あ、これ来ないやつだ)", { size: 22, color: C.gray });
  },

  // ---------- a / the ----------
  "a-and-the/1": (d) => {
    const dog = (x, y, s = 1, fill = "#F3D9B1") => {
      d.ellipse(x, y, 46 * s, 26 * s, { fill });
      d.circle(x + 50 * s, y - 24 * s, 20 * s, { fill });
      d.ellipse(x + 44 * s, y - 42 * s, 7 * s, 12 * s, { fill: C.brown, w: 3 });
      d.dot(x + 56 * s, y - 26 * s, 3 * s);
      for (const dx of [-30, -12, 14, 30]) d.line(x + dx * s, y + 22 * s, x + dx * s, y + 50 * s, { w: 4 });
      d.curve([[x - 44 * s, y - 6 * s], [x - 62 * s, y - 24 * s], [x - 58 * s, y - 34 * s]], { w: 4 });
    };
    d.line(400, 20, 400, 480, { color: C.gray, w: 3 });
    d.text(200, 60, "I saw a dog.", { size: 32, color: C.blue });
    dog(110, 180, 0.7); dog(260, 170, 0.7, "#fff"); dog(170, 300, 0.7, "#E0E0E0"); dog(300, 320, 0.6, "#F7E3A1");
    d.question(340, 250, 36);
    d.text(200, 450, "どの犬かは どうでもいい", { size: 20, color: C.gray });
    d.text(600, 60, "The dog was HUGE!", { size: 30, color: C.red });
    dog(560, 270, 1.7, "#F3D9B1");
    d.person(720, 300, { mood: "surprised", arms: "up", s: 0.6 });
    d.text(600, 450, "さっきの あの犬ね", { size: 20, color: C.gray });
  },

  // ---------- L / R ----------
  "l-and-r/1": (d) => {
    d.person(170, 190, { mood: "big", arms: "hold", dir: 1, hair: C.ink });
    d.ellipse(260, 290, 50, 26, { fill: "#fff" });
    for (let i = 0; i < 7; i++) {
      const x = 230 + i * 10, y = 280 - (i % 3) * 5;
      d.ellipse(x, y, 7, 5, { color: C.ink, fill: C.brown, w: 2 });
      d.line(x - 8, y, x - 13, y - 5, { w: 2 }); d.line(x + 8, y, x + 13, y - 5, { w: 2 });
    }
    d.bubble(210, 70, 270, 90, ["I love lice!"], { tail: [180, 160], size: 30 });
    d.person(590, 200, { mood: "surprised", arms: "up", sweat: true });
    d.bubble(620, 70, 230, 80, ["...lice?!"], { tail: [600, 170], size: 30 });
    d.text(400, 450, "rice(お米) のつもりが lice(シラミ) に…", { size: 22, color: C.gray });
  },
  "l-and-r/2": (d) => {
    d.line(400, 20, 400, 480, { color: C.gray, w: 3 });
    for (const [cx, label, color] of [[200, "L", C.blue], [600, "R", C.red]]) {
      d.text(cx, 70, label, { size: 56, color });
      d.curve([[cx - 150, 160], [cx - 60, 130], [cx + 60, 130], [cx + 150, 160]], { w: 6 });
      for (let i = 0; i < 4; i++) d.poly([[cx - 60 + i * 30, 146], [cx - 36 + i * 30, 146], [cx - 40 + i * 30, 176], [cx - 56 + i * 30, 176]], { fill: "#fff", w: 3 });
      d.curve([[cx - 150, 400], [cx - 50, 430], [cx + 50, 430], [cx + 150, 400]], { w: 6 });
    }
    d.poly([[90, 390], [200, 330], [250, 250], [235, 190], [215, 185], [205, 250], [150, 330], [80, 380]], { fill: C.pink, w: 4 });
    d.text(290, 215, "ぺたっ", { size: 26, color: C.blue });
    d.poly([[490, 390], [570, 340], [600, 290], [630, 270], [650, 300], [610, 340], [520, 395]], { fill: C.pink, w: 4 });
    d.text(640, 230, "ふわっ", { size: 26, color: C.red });
    d.text(600, 465, "どこにも つけない", { size: 20, color: C.gray });
    d.text(200, 465, "上の歯のうらに つける", { size: 20, color: C.gray });
  },

  // ---------- 英語日記 ----------
  "english-diary/1": (d) => {
    d.poly([[70, 70], [470, 60], [480, 440], [80, 450]], { fill: "#FFFDF3", w: 5 });
    for (const y of [150, 230, 310]) d.line(100, y + 20, 450, y + 16, { color: C.sky, w: 3 });
    d.text(270, 120, "Sep 29", { size: 26, color: C.gray });
    d.text(110, 165, "I ate ramen.", { size: 32, anchor: "start", color: C.blue });
    d.text(110, 245, "It was so good.", { size: 32, anchor: "start", color: C.blue });
    d.text(110, 325, "I'm sleepy.", { size: 32, anchor: "start", color: C.blue });
    d.check(420, 400);
    d.person(630, 220, { mood: "flat", arms: "down" });
    d.zzz(680, 150);
    d.ellipse(620, 60, 34, 34, { color: C.orange, fill: C.yellow });
    d.ellipse(640, 50, 30, 30, { color: null, fill: "#fff" });
    d.text(620, 460, "3行でOK", { size: 26, color: C.red });
  },
};

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "articles");
let seed = 11;
for (const [key, draw] of Object.entries(scenes)) {
  const d = canvas(seed++ * 7919);
  draw(d);
  const file = path.join(root, `${key}.svg`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, d.toString());
  console.log("wrote", path.relative(process.cwd(), file));
}
