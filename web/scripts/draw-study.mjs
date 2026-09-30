// 勉強法記事の「変な絵」: node scripts/draw-study.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { C, canvas } from "./doodle.mjs";

const book = (d, x, y, w, h, { fill = C.sky, label, labelSize = 22, color = C.ink } = {}) => {
  d.poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], { fill, color });
  d.line(x + 12, y + 4, x + 12, y + h - 4, { color, w: 3 });
  if (label) d.text(x + w / 2 + 6, y + h / 2 + labelSize * 0.35, label, { size: labelSize, color });
};
const card = (d, x, y, w, h, label, fill = "#fff", size = 20) => {
  d.poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], { fill, w: 4 });
  if (label) d.text(x + w / 2, y + h / 2 + size * 0.35, label, { size });
};
const phone = (d, x, y, fill = "#E8EEF5") => {
  d.poly([[x, y], [x + 60, y], [x + 60, y + 104], [x, y + 104]], { fill, w: 4 });
  d.circle(x + 30, y + 92, 5, { w: 2, overshoot: false });
};
const clock = (d, x, y, r, [h, m] = [3, 0]) => {
  d.circle(x, y, r, { fill: "#fff" });
  const ah = ((h % 12) / 12 + m / 720) * Math.PI * 2 - Math.PI / 2;
  const am = (m / 60) * Math.PI * 2 - Math.PI / 2;
  d.line(x, y, x + Math.cos(ah) * r * 0.5, y + Math.sin(ah) * r * 0.5, { w: 6 });
  d.line(x, y, x + Math.cos(am) * r * 0.8, y + Math.sin(am) * r * 0.8, { w: 4, color: C.red });
};
const note = (d, x, y) => d.text(x, y, "♪", { size: 34, color: C.purple });

const scenes = {
  "why-research/1": (d) => {
    d.person(250, 190, { mood: "big", arms: "hold", dir: 1, hair: C.ink });
    d.circle(345, 250, 38, { fill: "#E6F4FF", w: 6 });
    d.line(372, 278, 420, 330, { w: 10, color: C.brown });
    d.text(345, 262, "?", { size: 34, color: C.blue });
    d.poly([[470, 300], [640, 300], [640, 420], [470, 420]], { fill: "#FFF1CF" });
    d.text(555, 355, "勉強法の", { size: 22 });
    d.text(555, 390, "研究", { size: 26, color: C.red });
    d.circle(250, 70, 30, { color: C.orange, fill: C.yellow });
    d.line(240, 102, 260, 102, { w: 4 });
    for (const a of [-2.4, -1.6, -0.8]) d.line(250 + Math.cos(a) * 42, 70 + Math.sin(a) * 42, 250 + Math.cos(a) * 62, 70 + Math.sin(a) * 62, { color: C.orange, w: 4 });
    d.text(560, 110, "わかると", { size: 30 });
    d.text(560, 160, "たのしい!", { size: 40, color: C.red });
  },
  "vocab-first/1": (d) => {
    d.line(400, 20, 400, 480, { color: C.gray, w: 3 });
    d.text(200, 60, "単語を知らないと…", { size: 26 });
    d.person(150, 220, { mood: "sad", arms: "hold", dir: 1, sweat: true, s: 0.9 });
    book(d, 190, 270, 110, 80, { fill: "#E2EEFB", label: "文法" });
    for (const [x, y, s] of [[260, 150, 44], [320, 200, 34], [300, 120, 28], [340, 260, 30]]) d.question(x, y, s);
    d.text(600, 60, "単語を知っていると", { size: 26 });
    d.person(560, 220, { mood: "big", arms: "hold", dir: 1, blush: true, s: 0.9 });
    book(d, 600, 270, 110, 80, { fill: "#DDF5E8", label: "文法" });
    d.star(700, 170, 22); d.star(650, 130, 16);
    d.text(600, 450, "すらすら!", { size: 28, color: C.green });
    d.text(200, 450, "あれ何だっけ?", { size: 26, color: C.red });
  },
  "highlighter-myth/1": (d) => {
    d.poly([[120, 80], [400, 90], [400, 420], [120, 410]], { fill: "#fff" });
    d.poly([[400, 90], [680, 80], [680, 410], [400, 420]], { fill: "#fff" });
    for (let i = 0; i < 8; i++) {
      d.line(150, 120 + i * 36, 370, 122 + i * 36, { color: C.yellow, w: 22 });
      d.line(430, 122 + i * 36, 650, 120 + i * 36, { color: i === 3 ? C.pink : C.yellow, w: 22 });
    }
    d.person(700, 300, { mood: "wavy", arms: "down", s: 0.7, sweat: true });
    d.text(400, 470, "ぜんぶ大事…? (どこが大事かわからない)", { size: 22, color: C.gray });
  },
  "example-sentences/1": (d) => {
    d.poly([[80, 330], [720, 330], [720, 420], [80, 420]], { fill: "#FFE4EA" });
    d.circle(170, 300, 36, { fill: "#FFE3C4" });
    d.dot(158, 300, 3); d.dot(182, 300, 3);
    d.curve([[160, 316], [170, 322], [180, 316]], { w: 3 });
    d.ellipse(180, 350, 90, 22, { color: null, fill: "#fff" });
    d.bubble(470, 170, 440, 130, ["I'm looking forward", "to it!"], { size: 30 });
    d.circle(230, 230, 10, { w: 3, overshoot: false });
    d.circle(260, 205, 14, { w: 3, overshoot: false });
    d.circle(690, 60, 30, { color: C.orange, fill: C.yellow });
    d.circle(706, 50, 26, { color: null, fill: "#fff" });
    d.text(400, 470, "布団で ふと思い出せたら 勝ち", { size: 24, color: C.gray });
  },
  "which-first/1": (d) => {
    d.line(400, 480, 400, 180, { w: 8, color: C.brown });
    d.poly([[120, 110], [390, 110], [410, 150], [390, 190], [120, 190]], { fill: "#FFF1CF" });
    d.text(255, 145, "基礎がない", { size: 24 });
    d.text(255, 178, "→ やさしい文法書", { size: 20, color: C.red });
    d.poly([[410, 210], [690, 210], [690, 290], [410, 290], [390, 250]], { fill: "#DDF5E8" });
    d.text(550, 245, "基礎がある", { size: 24 });
    d.text(550, 278, "→ 単語帳＋文法書", { size: 20, color: C.green });
    d.person(240, 330, { mood: "surprised", arms: "down", s: 0.8 });
    d.question(290, 300, 40);
    d.text(400, 60, "どっちから?", { size: 34 });
  },
  "mumble-commute/1": (d) => {
    d.poly([[60, 60], [740, 60], [740, 250], [60, 250]], { fill: "#E6F4FF" });
    d.line(400, 60, 400, 250, { w: 4 });
    d.curve([[80, 230], [200, 190], [300, 210], [380, 170]], { color: C.green, w: 5 });
    d.circle(560, 150, 30, { color: C.orange, fill: C.yellow });
    d.line(330, 20, 330, 90, { w: 4, color: C.gray });
    d.circle(330, 100, 12, { w: 4, color: C.gray, overshoot: false });
    d.person(330, 200, { mood: "happy", arms: "up", s: 0.9, hair: C.brown });
    d.line(305, 190, 305, 220, { w: 6, color: C.blue });
    d.line(355, 190, 355, 220, { w: 6, color: C.blue });
    note(d, 410, 220); note(d, 450, 190); note(d, 250, 200);
    d.bubble(560, 330, 330, 80, ["♪ I'm on my way ♪"], { tail: [360, 250], size: 24 });
    d.text(400, 470, "知ってる英語を 小さく口ずさむ", { size: 24, color: C.gray });
  },
  "retrieval-practice/1": (d) => {
    d.text(400, 50, "1週間後に覚えていた割合", { size: 26 });
    d.line(140, 420, 660, 420, { w: 5 });
    d.poly([[200, 420], [320, 420], [320, 330], [200, 330]], { fill: C.gray });
    d.poly([[480, 420], [600, 420], [600, 150], [480, 150]], { fill: C.red });
    d.text(260, 315, "約1/3", { size: 26 });
    d.text(540, 135, "約80%", { size: 30, color: C.red });
    d.text(260, 460, "読み直し", { size: 24 });
    d.text(540, 460, "思い出す練習", { size: 24, color: C.red });
    d.person(90, 230, { mood: "flat", arms: "down", s: 0.6 });
    d.zzz(120, 170);
    d.person(710, 230, { mood: "big", arms: "up", s: 0.6 });
  },
  "rip-the-pages/1": (d) => {
    d.person(300, 180, { mood: "big", arms: "up", hair: C.ink, blush: true });
    d.poly([[210, 90], [250, 80], [262, 140], [222, 150]], { fill: "#fff", w: 4 });
    d.poly([[345, 80], [390, 92], [375, 150], [335, 140]], { fill: "#fff", w: 4 });
    for (const [x, y, r] of [[480, 120, 12], [540, 220, -18], [600, 90, 20], [470, 300, 8]]) {
      d.poly([[x, y], [x + 50, y + r * 0.3], [x + 44, y + 60], [x - 4, y + 56]], { fill: "#fff", w: 3 });
      d.line(x + 8, y + 18, x + 36, y + 20, { color: C.gray, w: 2 });
      d.line(x + 8, y + 34, x + 34, y + 36, { color: C.gray, w: 2 });
    }
    book(d, 120, 380, 140, 40, { fill: C.sky, label: "単語帳", labelSize: 18 });
    d.text(560, 420, "覚えた! さようなら!", { size: 28, color: C.red });
  },
  "study-abroad/1": (d) => {
    d.line(400, 20, 400, 480, { color: C.gray, w: 3 });
    d.poly([[40, 60], [360, 60], [360, 400], [40, 400]], { fill: "#EEF0F4" });
    d.person(170, 200, { mood: "flat", arms: "hold", dir: 1, s: 0.8, legs: "sit" });
    d.poly([[220, 250], [310, 250], [300, 300], [230, 300]], { fill: "#9EC5F0", w: 4 });
    d.zzz(250, 150);
    d.text(200, 450, "部屋で日本語の動画", { size: 22, color: C.gray });
    d.person(500, 200, { mood: "big", arms: "wave", s: 0.8, hair: C.brown });
    d.person(620, 200, { mood: "happy", arms: "down", s: 0.8, hair: C.orange });
    d.person(720, 220, { mood: "big", arms: "up", s: 0.7 });
    d.bubble(520, 80, 170, 70, ["Hi! I'm Kaz."], { tail: [505, 165], size: 20 });
    d.bubble(680, 90, 150, 70, ["Nice!"], { tail: [640, 170], size: 22 });
    d.text(600, 450, "とりあえず話しかける", { size: 22, color: C.green });
  },
  "tough-times/1": (d) => {
    d.cloud(300, 90, 1.2, "#C9D3DE");
    for (const x of [230, 280, 330, 380]) d.line(x, 150, x - 10, 190, { color: C.sky, w: 4 });
    d.person(300, 250, { mood: "wavy", arms: "down", s: 0.9 });
    d.curve([[270, 232], [300, 205], [330, 232]], { color: C.ink, w: 6 });
    d.circle(268, 240, 10, { fill: C.blue, w: 3, overshoot: false });
    d.circle(332, 240, 10, { fill: C.blue, w: 3, overshoot: false });
    d.line(282, 244, 292, 244, { w: 3 }); d.line(308, 244, 318, 244, { w: 3 });
    d.text(300, 460, "がまん…がまん…", { size: 24, color: C.gray });
    d.sun(620, 150, 40);
    d.text(620, 300, "そのうち", { size: 28 });
    d.text(620, 345, "晴れる", { size: 34, color: C.orange });
  },
  "grammar-book-one-month/1": (d) => {
    d.poly([[80, 70], [520, 70], [520, 440], [80, 440]], { fill: "#fff" });
    d.poly([[80, 70], [520, 70], [520, 120], [80, 120]], { fill: C.red });
    d.text(300, 108, "1か月", { size: 30, color: "#fff" });
    for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) {
      const n = r * 7 + c + 1;
      if (n > 30) continue;
      const x = 110 + c * 58, y = 160 + r * 58;
      if (n <= 22) d.check(x + 6, y - 4);
      else d.text(x + 6, y + 8, String(n), { size: 18, color: C.gray });
    }
    book(d, 580, 200, 150, 190, { fill: C.sky, label: "文法書", labelSize: 26 });
    d.star(700, 170, 26);
  },
  "image-not-japanese/1": (d) => {
    const apple = (x, y, s = 1) => {
      d.circle(x, y, 38 * s, { fill: C.red });
      d.line(x, y - 36 * s, x + 6 * s, y - 58 * s, { color: C.brown, w: 5 });
      d.ellipse(x + 20 * s, y - 52 * s, 14 * s, 8 * s, { fill: C.green, w: 3 });
    };
    d.text(120, 140, "apple", { size: 40, color: C.blue });
    d.arrow(200, 130, 330, 130, { color: C.gray, w: 4 });
    d.text(400, 140, "りんご", { size: 36 });
    d.arrow(470, 130, 590, 130, { color: C.gray, w: 4 });
    apple(670, 130, 0.9);
    d.text(400, 200, "遠回り…", { size: 22, color: C.gray });
    d.text(200, 350, "apple", { size: 44, color: C.blue });
    d.arrow(290, 340, 520, 340, { color: C.red, w: 7 });
    apple(610, 340, 1.2);
    d.text(400, 400, "直通!", { size: 30, color: C.red });
  },
  "5-minute-gaps/1": (d) => {
    clock(d, 400, 230, 110, [12, 5]);
    d.text(400, 400, "5分あれば", { size: 34 });
    d.text(400, 450, "けっこうできる", { size: 28, color: C.red });
    d.ellipse(140, 160, 44, 18, { fill: "#fff" });
    d.poly([[98, 160], [182, 160], [170, 250], [110, 250]], { fill: "#fff" });
    d.curve([[182, 180], [210, 195], [180, 225]], { w: 5 });
    d.text(140, 290, "コーヒー待ち", { size: 20, color: C.gray });
    phone(d, 630, 110);
    d.text(660, 260, "電車の中", { size: 20, color: C.gray });
    d.text(660, 170, "Aa", { size: 24, color: C.blue });
  },
  "communication-skill/1": (d) => {
    d.person(220, 180, { mood: "surprised", arms: "stop", dir: 1, hair: C.ink, blush: true });
    d.bubble(200, 60, 240, 80, ["Excuse me!"], { tail: [220, 145], size: 28 });
    d.person(560, 190, { mood: "big", arms: "down", hair: C.gray });
    d.poly([[500, 290], [620, 290], [620, 330], [500, 330]], { fill: C.brown });
    d.heart(620, 110, 20);
    d.text(400, 450, "勇気は 頭のよさより 伸ばしやすい", { size: 24, color: C.gray });
  },
  "vocab-900-rotation/1": (d) => {
    const stack = (x, label, sub, fill, n) => {
      for (let i = 0; i < n; i++) card(d, x - 60 + i * 4, 220 - i * 14, 120, 80, null, fill);
      d.text(x, 110 - n * 4, label, { size: 26 });
      d.text(x, 330, sub, { size: 30, color: C.red });
    };
    stack(150, "おととい", "300", "#E2EEFB", 5);
    stack(330, "きのう", "300", "#DDF5E8", 5);
    stack(510, "きょう", "300", "#FFF1CF", 5);
    d.text(242, 250, "+", { size: 44 }); d.text(422, 250, "+", { size: 44 });
    d.text(650, 250, "=", { size: 40 });
    d.text(720, 262, "900", { size: 44, color: C.red });
    d.text(400, 430, "毎日「今日の300＋2日分の復習」", { size: 26, color: C.gray });
  },
  "myth-list/1": (d) => {
    d.poly([[140, 40], [660, 50], [650, 460], [150, 450]], { fill: "#FFFDF3" });
    d.text(400, 100, "よくある誤解", { size: 34, color: C.red });
    const items = ["聞き流すだけでOK", "マーカーで覚える", "書いて覚える", "留学すれば話せる", "日本語訳で覚える"];
    items.forEach((t, i) => {
      d.cross(210, 160 + i * 62);
      d.text(250, 172 + i * 62, t, { size: 26, anchor: "start" });
    });
  },
  "self-talk-beginners/1": (d) => {
    d.person(170, 190, { mood: "flat", arms: "hold", dir: 1, s: 0.9, hair: C.brown });
    phone(d, 240, 230);
    d.text(270, 270, "赤信号", { size: 14 });
    d.bubble(200, 70, 250, 80, ["赤信号って…?"], { tail: [185, 160], size: 24 });
    d.arrow(330, 290, 440, 290, { color: C.gray, w: 4 });
    d.poly([[460, 180], [720, 190], [715, 410], [455, 400]], { fill: "#FFF1CF" });
    d.text(590, 225, "MEMO", { size: 22, color: C.gray });
    d.text(590, 275, "red light", { size: 32, color: C.red });
    d.text(590, 325, "crosswalk", { size: 28, color: C.blue });
    d.text(590, 372, "I'm late!", { size: 28 });
  },
  "spaced-review/1": (d) => {
    d.line(80, 60, 80, 420, { w: 5 }); d.line(80, 420, 740, 420, { w: 5 });
    d.text(60, 50, "記憶", { size: 20, anchor: "start" });
    d.text(740, 455, "時間", { size: 20, anchor: "end" });
    d.curve([[80, 90], [120, 250], [180, 320], [260, 360], [400, 390], [720, 405]], { color: C.gray, w: 4 });
    d.text(560, 380, "放っておくと…", { size: 20, color: C.gray });
    d.curve([[80, 90], [130, 200], [170, 230], [175, 100], [260, 170], [320, 190], [325, 100], [460, 140], [560, 155], [565, 100], [720, 115]], { color: C.red, w: 6 });
    for (const x of [172, 322, 562]) d.star(x, 90, 16);
    d.text(400, 260, "忘れかけた頃に復習", { size: 26, color: C.red });
  },
  "adults-restart/1": (d) => {
    d.person(300, 190, { mood: "big", arms: "hold", dir: 1, hair: "#CFCFCF", blush: true });
    d.line(282, 186, 318, 186, { w: 3 });
    d.circle(290, 186, 9, { w: 3, overshoot: false }); d.circle(310, 186, 9, { w: 3, overshoot: false });
    book(d, 350, 230, 120, 90, { fill: "#DDF5E8", label: "English" });
    d.star(520, 140, 22); d.star(560, 220, 16); d.star(480, 90, 14);
    d.text(560, 330, "大人は", { size: 28 });
    d.text(560, 380, "経験がある", { size: 32, color: C.green });
  },
  "dont-write-to-memorize/1": (d) => {
    d.line(400, 20, 400, 480, { color: C.gray, w: 3 });
    d.poly([[60, 80], [340, 80], [340, 330], [60, 330]], { fill: "#fff" });
    for (let i = 0; i < 6; i++) d.text(200, 120 + i * 36, "necessary", { size: 22, color: C.gray });
    d.person(200, 360, { mood: "sad", arms: "down", s: 0.55, sweat: true });
    d.text(200, 470, "手が つかれる…", { size: 22, color: C.gray });
    d.person(600, 220, { mood: "big", arms: "wave", hair: C.ink });
    d.bubble(600, 90, 300, 90, ["It's necessary!"], { tail: [600, 180], size: 28 });
    d.text(600, 470, "声に出して 思い出す", { size: 22, color: C.green });
  },
  "fun-youtube/1": (d) => {
    d.poly([[260, 100], [620, 100], [620, 330], [260, 330]], { fill: "#EEF0F4" });
    d.poly([[410, 170], [410, 260], [490, 215]], { fill: C.red, w: 4 });
    d.line(380, 330, 360, 380, { w: 5 }); d.line(500, 330, 520, 380, { w: 5 });
    d.person(130, 220, { mood: "big", arms: "up", blush: true });
    d.text(130, 130, "HAHA!", { size: 30, color: C.orange });
    d.text(440, 440, "つかれた日は 笑って聞くだけでいい", { size: 24, color: C.gray });
  },
  "toeic-vocab/1": (d) => {
    d.poly([[80, 70], [360, 70], [360, 420], [80, 420]], { fill: "#fff" });
    d.text(220, 120, "SCORE", { size: 28 });
    d.text(220, 200, "???", { size: 56, color: C.gray });
    for (let i = 0; i < 4; i++) d.line(120, 260 + i * 36, 320, 260 + i * 36, { color: C.sky, w: 3 });
    d.arrow(380, 250, 470, 250, { w: 5 });
    book(d, 500, 150, 170, 220, { fill: "#FFF1CF", label: "単語帳", labelSize: 28 });
    d.text(590, 420, "まず1冊を完璧に", { size: 26, color: C.red });
    d.star(680, 130, 24);
  },
  "context-memory/1": (d) => {
    d.poly([[0, 250], [800, 250], [800, 500], [0, 500]], { fill: "#BFE3F7", color: null });
    d.curve([[0, 250], [100, 238], [200, 258], [300, 240], [400, 256], [500, 240], [600, 258], [700, 240], [800, 252]], { color: C.blue, w: 5 });
    d.person(560, 360, { mood: "surprised", arms: "up", s: 0.8, face: "#FFE3C4" });
    d.ellipse(560, 356, 34, 22, { color: C.ink, fill: "#E6F4FF", w: 4 });
    for (const [x, y] of [[620, 290], [630, 260], [640, 230]]) d.circle(x, y, 8, { w: 3, overshoot: false });
    d.ellipse(300, 400, 40, 18, { fill: C.orange });
    d.poly([[260, 400], [230, 382], [232, 418]], { fill: C.orange, w: 3 });
    d.dot(322, 396, 3);
    card(d, 90, 60, 140, 80, "boat", "#fff", 28);
    d.person(330, 110, { mood: "happy", arms: "hold", dir: -1, s: 0.6 });
    d.text(560, 200, "水の中で覚えたら 水の中で思い出す?", { size: 20, color: C.gray });
  },
  "mistakes-ok/1": (d) => {
    d.person(250, 200, { mood: "big", arms: "wave", hair: C.orange });
    d.bubble(300, 80, 320, 90, ["I goed to work!"], { tail: [260, 170], size: 28 });
    d.text(470, 150, "(正しくは went)", { size: 20, color: C.gray });
    d.text(560, 330, "誰も", { size: 26 });
    d.text(560, 370, "聞いてない", { size: 26 });
    d.text(560, 420, "だからOK!", { size: 30, color: C.red });
  },
  "one-book-mastery/1": (d) => {
    d.line(400, 20, 400, 480, { color: C.gray, w: 3 });
    const cols = ["#E2EEFB", "#DDF5E8", "#FFF1CF", "#FFE4EA", "#ECE6FF"];
    cols.forEach((c, i) => book(d, 90 + (i % 2) * 20, 360 - i * 55, 200, 50, { fill: c }));
    d.person(320, 280, { mood: "wavy", arms: "up", s: 0.6, sweat: true });
    d.text(200, 460, "どれも途中…", { size: 22, color: C.gray });
    book(d, 520, 200, 180, 190, { fill: C.sky, label: "1冊", labelSize: 36 });
    d.star(700, 170, 30); d.star(510, 170, 18);
    d.text(610, 460, "ボロボロになるまで", { size: 22, color: C.green });
  },
  "parents-kids/1": (d) => {
    d.person(230, 170, { mood: "big", arms: "point", dir: 1, hair: C.brown });
    d.person(360, 240, { mood: "big", arms: "up", s: 0.6, blush: true });
    d.poly([[520, 110], [680, 110], [680, 420], [520, 420]], { fill: "#EEF0F4" });
    d.line(520, 230, 680, 230, { w: 4 });
    d.line(540, 160, 540, 200, { w: 5 }); d.line(540, 270, 540, 320, { w: 5 });
    d.bubble(250, 60, 260, 80, ["It's a fridge!"], { tail: [240, 140], size: 26 });
    d.text(380, 450, "家の中は 英語の教室", { size: 24, color: C.gray });
  },
  "money-vs-learning/1": (d) => {
    book(d, 110, 170, 170, 210, { fill: "#D9C7A8", label: "1冊目" });
    for (const [x1, y1, x2, y2] of [[130, 200, 180, 240], [200, 300, 250, 330], [150, 340, 170, 370]]) d.line(x1, y1, x2, y2, { color: C.brown, w: 3 });
    d.text(200, 430, "ボロボロ", { size: 24, color: C.gray });
    d.text(400, 290, "+", { size: 50 });
    book(d, 500, 170, 170, 210, { fill: C.sky, label: "2冊目" });
    d.star(680, 160, 22);
    d.text(590, 430, "まっさら", { size: 24, color: C.blue });
    d.text(400, 90, "2周目は 新しい本で", { size: 30, color: C.red });
  },
  "enjoy-learning/1": (d) => {
    d.person(400, 180, { mood: "big", arms: "up", hair: C.ink, blush: true, legs: "run" });
    book(d, 440, 110, 70, 50, { fill: C.sky });
    note(d, 250, 150); note(d, 560, 120); note(d, 300, 90);
    d.star(200, 260, 22); d.star(600, 260, 20); d.star(520, 60, 14);
    d.text(400, 430, "楽しい → 続く → できる!", { size: 32, color: C.red });
  },
  "faq-kaz-method/1": (d) => {
    d.text(260, 200, "Q", { size: 150, color: C.blue });
    d.text(540, 330, "A", { size: 150, color: C.red });
    d.question(120, 120, 50); d.question(680, 110, 40); d.question(160, 380, 34);
    d.person(400, 250, { mood: "happy", arms: "shrug", s: 0.7 });
  },
  "self-talk/1": (d) => {
    d.sun(690, 80, 34);
    d.line(40, 430, 760, 430, { color: C.gray, w: 4 });
    for (const x of [120, 560]) {
      d.line(x, 430, x, 330, { color: C.brown, w: 8 });
      d.circle(x, 300, 50, { fill: C.green });
    }
    d.person(330, 250, { mood: "happy", arms: "down", legs: "run", sweat: true, hair: C.ink });
    d.circle(390, 200, 8, { w: 3, overshoot: false });
    d.circle(415, 170, 12, { w: 3, overshoot: false });
    d.bubble(520, 110, 330, 110, ["It's so hot today…", "I need a cold drink."], { size: 24 });
    d.text(330, 470, "頭の中で言うだけでも OK", { size: 22, color: C.gray });
  },
};

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "articles");
let seed = 101;
for (const [key, draw] of Object.entries(scenes)) {
  const d = canvas(seed++ * 7919);
  draw(d);
  const file = path.join(root, `${key}.svg`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, d.toString());
}
console.log(`wrote ${Object.keys(scenes).length} drawings`);
