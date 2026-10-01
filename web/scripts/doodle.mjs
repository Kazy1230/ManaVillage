// 3歳児のクレヨン画風のSVGを描くための小さな道具箱
// 座標にわざと揺らぎを入れ、塗りを線から少しずらして「はみ出し感」を出す

export const C = {
  ink: "#2B2B2B", blue: "#3F7BE0", sky: "#8EC9F0", yellow: "#FFD23F", orange: "#FF9F1C",
  red: "#E4572E", pink: "#FF8FA3", green: "#4CAF50", brown: "#A0662D", gray: "#9E9E9E", purple: "#9B6BD3",
};

const FONT = `'Comic Sans MS','Segoe Print','Chalkboard SE','Marker Felt','Hiragino Maru Gothic ProN','Yu Gothic',cursive`;

export function canvas(seed = 1, w = 800, h = 500) {
  let s = seed >>> 0;
  const rnd = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const r = (a, b) => a + (b - a) * rnd();
  const out = [];
  const f = (n) => Math.round(n * 10) / 10;

  // Catmull-Rom を3次ベジェに変換して、ゆるい曲線にする
  const smooth = (pts, closed) => {
    if (pts.length < 2) return "";
    const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
    let d = `M${f(p[1][0])},${f(p[1][1])}`;
    for (let i = 1; i < p.length - 2; i++) {
      const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
      d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
    }
    return closed ? d + "Z" : d;
  };

  const wobbleSeg = (x1, y1, x2, y2, amp = 2.2) => {
    const len = Math.hypot(x2 - x1, y2 - y1);
    const n = Math.max(2, Math.round(len / 22));
    const nx = -(y2 - y1) / (len || 1), ny = (x2 - x1) / (len || 1);
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const o = i === 0 || i === n ? r(-1.5, 1.5) : r(-amp, amp);
      pts.push([x1 + (x2 - x1) * t + nx * o, y1 + (y2 - y1) * t + ny * o]);
    }
    return pts;
  };

  const stroke = (d, color = C.ink, w = 5) =>
    out.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`);
  const fillPath = (d, color, dx = r(-5, 5), dy = r(-4, 4)) =>
    out.push(`<path d="${d}" fill="${color}" opacity="0.85" transform="translate(${f(dx)},${f(dy)})"/>`);

  const api = {
    r,
    raw: (s) => out.push(s),

    line(x1, y1, x2, y2, { color = C.ink, w = 5, amp } = {}) {
      stroke(smooth(wobbleSeg(x1, y1, x2, y2, amp), false), color, w);
    },

    poly(points, { color = C.ink, w = 5, fill, closed = true } = {}) {
      const pts = [];
      const list = closed ? [...points, points[0]] : points;
      for (let i = 0; i < list.length - 1; i++) {
        const seg = wobbleSeg(...list[i], ...list[i + 1]);
        pts.push(...(i === 0 ? seg : seg.slice(1)));
      }
      if (closed) pts.pop();
      const d = smooth(pts, closed);
      if (fill) fillPath(d, fill);
      if (color) stroke(d, color, w);
    },

    ellipse(cx, cy, rx, ry, { color = C.ink, w = 5, fill, overshoot = true } = {}) {
      const n = 16;
      const start = r(0, Math.PI * 2);
      const pts = [];
      for (let i = 0; i < n; i++) {
        const a = start + (i / n) * Math.PI * 2;
        const k = 1 + r(-0.06, 0.06);
        pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
      }
      if (fill) fillPath(smooth(pts, true), fill);
      if (!color) return;
      if (overshoot) {
        const extra = [];
        for (let i = 0; i <= 3; i++) {
          const a = start + Math.PI * 2 + (i / n) * Math.PI * 2;
          extra.push([cx + Math.cos(a) * rx * 1.04, cy + Math.sin(a) * ry * 1.04]);
        }
        stroke(smooth([...pts, ...extra], false), color, w);
      } else stroke(smooth(pts, true), color, w);
    },

    circle(cx, cy, rad, o = {}) {
      api.ellipse(cx, cy, rad, rad, o);
    },

    dot(cx, cy, rad = 4, color = C.ink) {
      out.push(`<circle cx="${f(cx + r(-1, 1))}" cy="${f(cy + r(-1, 1))}" r="${rad}" fill="${color}"/>`);
    },

    curve(points, { color = C.ink, w = 5 } = {}) {
      stroke(smooth(points.map(([x, y]) => [x + r(-2, 2), y + r(-2, 2)]), false), color, w);
    },

    text(x, y, str, { size = 28, color = C.ink, anchor = "middle", rot, weight = 700 } = {}) {
      const a = rot ?? r(-3, 3);
      const esc = String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;");
      out.push(`<text x="${f(x)}" y="${f(y)}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}" transform="rotate(${f(a)} ${f(x)} ${f(y)})">${esc}</text>`);
    },

    // 吹き出し。lines は1行ずつの配列、tail は尻尾の先の座標
    bubble(cx, cy, w, h, lines, { tail, size = 26, color = C.ink, fill = "#fff", textColor = C.ink } = {}) {
      if (tail) {
        const [tx, ty] = tail;
        const ang = Math.atan2(ty - cy, tx - cx);
        const bx = cx + Math.cos(ang) * w * 0.42, by = cy + Math.sin(ang) * h * 0.42;
        const px = -Math.sin(ang) * 16, py = Math.cos(ang) * 16;
        api.poly([[bx + px, by + py], [tx, ty], [bx - px, by - py]], { color, fill, closed: false, w: 4 });
      }
      api.ellipse(cx, cy, w / 2, h / 2, { color, fill, w: 4 });
      const lh = size * 1.25;
      lines.forEach((ln, i) => api.text(cx, cy + (i - (lines.length - 1) / 2) * lh + size * 0.35, ln, { size, color: textColor }));
    },

    // 棒人間。x,y は頭の中心
    person(x, y, { s = 1, mood = "happy", arms = "down", dir = 1, color = C.ink, face = "#FFE3C4", hair, sweat = false, blush = false, legs = "stand" } = {}) {
      const S = (v) => v * s;
      api.line(x, y + S(28), x, y + S(100), { color, w: 5 });
      if (legs === "sit") {
        api.line(x, y + S(100), x + dir * S(40), y + S(104), { color });
        api.line(x + dir * S(40), y + S(104), x + dir * S(42), y + S(145), { color });
      } else if (legs === "run") {
        api.line(x, y + S(100), x - dir * S(34), y + S(140), { color });
        api.line(x, y + S(100), x + dir * S(30), y + S(150), { color });
      } else {
        api.line(x, y + S(100), x - S(24), y + S(155), { color });
        api.line(x, y + S(100), x + S(24), y + S(155), { color });
      }
      const sh = [x, y + S(48)];
      const armTo = {
        down: [[x - S(34), y + S(88)], [x + S(34), y + S(88)]],
        up: [[x - S(40), y - S(10)], [x + S(40), y - S(10)]],
        wave: [[x - S(34), y + S(88)], [x + S(46), y + S(4)]],
        point: [[x - dir * S(30), y + S(88)], [x + dir * S(64), y + S(40)]],
        hold: [[x + dir * S(46), y + S(72)], [x + dir * S(50), y + S(62)]],
        stop: [[x - dir * S(30), y + S(88)], [x + dir * S(52), y + S(30)]],
        shrug: [[x - S(46), y + S(40)], [x + S(46), y + S(40)]],
        stiff: [[x - S(14), y + S(98)], [x + S(14), y + S(98)]],
      }[arms];
      for (const [ax, ay] of armTo) api.line(...sh, ax, ay, { color });
      if (arms === "stop") {
        const [hx, hy] = armTo[1];
        api.ellipse(hx + dir * S(6), hy - S(6), S(12), S(14), { color, fill: face, w: 4 });
      }
      api.circle(x, y, S(28), { color, fill: face });
      if (hair) api.curve([[x - S(22), y - S(18)], [x - S(8), y - S(34)], [x + S(6), y - S(22)], [x + S(16), y - S(36)], [x + S(24), y - S(16)]], { color: hair, w: 6 });
      const ey = y - S(4);
      if (mood === "surprised") {
        api.circle(x - S(10), ey, S(5), { color, w: 3, overshoot: false });
        api.circle(x + S(10), ey, S(5), { color, w: 3, overshoot: false });
        api.circle(x, y + S(14), S(5), { color, w: 3, overshoot: false });
      } else {
        api.dot(x - S(10), ey, S(3.5), color);
        api.dot(x + S(10), ey, S(3.5), color);
        const m = {
          happy: [[x - S(11), y + S(9)], [x, y + S(17)], [x + S(11), y + S(9)]],
          big: [[x - S(13), y + S(7)], [x, y + S(21)], [x + S(13), y + S(7)]],
          sad: [[x - S(10), y + S(17)], [x, y + S(10)], [x + S(10), y + S(17)]],
          flat: [[x - S(10), y + S(13)], [x + S(10), y + S(13)]],
          wavy: [[x - S(12), y + S(14)], [x - S(4), y + S(9)], [x + S(4), y + S(15)], [x + S(12), y + S(10)]],
        }[mood];
        api.curve(m, { color, w: 3.5 });
        if (mood === "big") api.line(x - S(12), y + S(8), x + S(12), y + S(8), { color, w: 3 });
      }
      if (blush) {
        api.ellipse(x - S(17), y + S(6), S(5), S(3), { color: null, fill: C.pink });
        api.ellipse(x + S(17), y + S(6), S(5), S(3), { color: null, fill: C.pink });
      }
      if (sweat) api.poly([[x + S(32), y - S(20)], [x + S(38), y - S(4)], [x + S(26), y - S(4)]], { color: C.sky, fill: C.sky, w: 3 });
    },

    heart(x, y, sz = 20, color = C.red) {
      api.curve([[x, y + sz], [x - sz * 1.1, y], [x - sz * 0.6, y - sz * 0.8], [x, y - sz * 0.3], [x + sz * 0.6, y - sz * 0.8], [x + sz * 1.1, y], [x, y + sz]], { color, w: 4 });
      api.ellipse(x, y - sz * 0.1, sz * 0.6, sz * 0.5, { color: null, fill: color });
    },

    star(x, y, sz = 18, color = C.yellow) {
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const rr = i % 2 ? sz * 0.45 : sz;
        pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
      }
      api.poly(pts, { color: C.orange, fill: color, w: 3 });
    },

    sun(x, y, rad = 36) {
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        api.line(x + Math.cos(a) * (rad + 10), y + Math.sin(a) * (rad + 10), x + Math.cos(a) * (rad + 30), y + Math.sin(a) * (rad + 30), { color: C.orange, w: 5 });
      }
      api.circle(x, y, rad, { color: C.orange, fill: C.yellow });
    },

    cloud(x, y, sz = 1, fill = "#E8EEF5") {
      for (const [dx, dy, rr] of [[-40, 6, 30], [0, -10, 38], [42, 4, 30]]) api.circle(x + dx * sz, y + dy * sz, rr * sz, { color: C.gray, fill, w: 4 });
    },

    question(x, y, sz = 40, color = C.red) {
      api.text(x, y, "?", { size: sz, color });
    },

    zzz(x, y) {
      api.text(x, y, "z", { size: 22, color: C.blue });
      api.text(x + 18, y - 20, "z", { size: 28, color: C.blue });
      api.text(x + 40, y - 46, "Z", { size: 36, color: C.blue });
    },

    arrow(x1, y1, x2, y2, { color = C.ink, w = 5 } = {}) {
      api.line(x1, y1, x2, y2, { color, w });
      const a = Math.atan2(y2 - y1, x2 - x1);
      for (const s2 of [-1, 1]) api.line(x2, y2, x2 - Math.cos(a + s2 * 0.5) * 22, y2 - Math.sin(a + s2 * 0.5) * 22, { color, w });
    },

    check(x, y, color = C.green) {
      api.line(x - 20, y, x - 4, y + 18, { color, w: 8 });
      api.line(x - 4, y + 18, x + 26, y - 22, { color, w: 8 });
    },

    cross(x, y, color = C.red) {
      api.line(x - 20, y - 20, x + 20, y + 20, { color, w: 8 });
      api.line(x + 20, y - 20, x - 20, y + 20, { color, w: 8 });
    },

    // ---- 和の小物(日本語学習の記事で使う) ----
    sakura(x, y, sz = 14) {
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        api.ellipse(x + Math.cos(a) * sz * 0.75, y + Math.sin(a) * sz * 0.75, sz * 0.55, sz * 0.55, { color: "#E07A90", fill: "#F7B7C5", w: 2, overshoot: false });
      }
      api.dot(x, y, sz * 0.22, C.yellow);
    },

    // 鳥居。x は中心、y は笠木(いちばん上の横木)の高さ
    torii(x, y, sz = 1, color = "#D2452F") {
      const W = 150 * sz, H = 150 * sz;
      api.curve([[x - W * 0.62, y + 6 * sz], [x, y - 10 * sz], [x + W * 0.62, y + 6 * sz]], { color, w: 12 * sz });
      api.line(x - W * 0.5, y + 30 * sz, x + W * 0.5, y + 30 * sz, { color, w: 9 * sz });
      api.line(x - W * 0.34, y, x - W * 0.36, y + H, { color, w: 11 * sz });
      api.line(x + W * 0.34, y, x + W * 0.36, y + H, { color, w: 11 * sz });
    },

    toString() {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs><filter id="crayon"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${seed % 97}"/><feDisplacementMap in="SourceGraphic" scale="3.5"/></filter></defs>
<rect width="${w}" height="${h}" fill="#ffffff"/>
<g filter="url(#crayon)">
${out.join("\n")}
</g>
</svg>
`;
    },
  };
  return api;
}
