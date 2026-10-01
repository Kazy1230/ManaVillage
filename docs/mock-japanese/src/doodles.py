# -*- coding: utf-8 -*-
# モック用の「ゆるい」クレヨン風イラスト(和の小物入り)。本番の scripts/doodle.mjs と同じ方針:
# 白い背景、揺れる線、2〜4色、棒人間と丸い顔。

FILTER = """<filter id="crayon"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.2"/></filter>"""

INK, SHU, AI, TAKE, SAKURA, YAMABUKI, GRAY = "#2A2522", "#C9452E", "#2E4A7D", "#4C8C5A", "#F2A7B5", "#E8B400", "#A39A8E"

def svg(body, vb="0 0 200 125", cls="doodle"):
    return f'<svg class="{cls}" viewBox="{vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>{FILTER}</defs><g filter="url(#crayon)" fill="none" stroke-linecap="round" stroke-linejoin="round">{body}</g></svg>'

def person(x, y, c=INK, s=1.0):
    r = 9 * s
    return (f'<circle cx="{x}" cy="{y}" r="{r}" stroke="{c}" stroke-width="2.4" fill="#fff"/>'
            f'<circle cx="{x-3*s}" cy="{y-1*s}" r="1" fill="{c}"/><circle cx="{x+3*s}" cy="{y-1*s}" r="1" fill="{c}"/>'
            f'<path d="M{x-3*s} {y+3*s} q{3*s} {3*s} {6*s} 0" stroke="{c}" stroke-width="1.6"/>'
            f'<path d="M{x} {y+r} l1 {24*s} M{x} {y+r+8*s} l-11 {7*s} M{x} {y+r+8*s} l12 {5*s} M{x+1} {y+r+24*s} l-9 {14*s} M{x+1} {y+r+24*s} l10 {13*s}" stroke="{c}" stroke-width="2.4"/>')

def sakura(x, y, s=1.0):
    p = "".join(f'<circle cx="{x + 4.2*s*dx:.1f}" cy="{y + 4.2*s*dy:.1f}" r="{3*s:.1f}" fill="{SAKURA}" stroke="#E07A90" stroke-width="1"/>'
                for dx, dy in [(0, -1), (.95, -.31), (.59, .81), (-.59, .81), (-.95, -.31)])
    return p + f'<circle cx="{x}" cy="{y}" r="{1.6*s:.1f}" fill="{YAMABUKI}" stroke="none"/>'

def torii(x, y, s=1.0, c=SHU):
    w, h = 50 * s, 46 * s
    return (f'<path d="M{x-w/2-6*s} {y} q{w/2+6*s} {-8*s} {w+12*s} 0" stroke="{c}" stroke-width="{4*s}"/>'
            f'<path d="M{x-w/2} {y+9*s} h{w}" stroke="{c}" stroke-width="{3*s}"/>'
            f'<path d="M{x-w/2+8*s} {y-2*s} v{h} M{x+w/2-8*s} {y-2*s} v{h}" stroke="{c}" stroke-width="{3.4*s}"/>')

# は と が: 能舞台風の幕(定式幕)の前で、スポットライト
D_SPOT = svg(
    '<path d="M4 4 h192" stroke="%s" stroke-width="2"/>' % INK +
    "".join(f'<rect x="{4+i*24}" y="5" width="24" height="12" fill="{c}" stroke="none" opacity=".85"/>' for i, c in enumerate(([INK, TAKE, SHU] * 3)[:8])) +
    '<path d="M34 18 L20 112 L88 114 L54 18 Z" fill="#FBE7B5" stroke="%s" stroke-width="2" opacity=".9"/>' % YAMABUKI +
    person(52, 62) + person(124, 66, GRAY, .9) + person(164, 64, GRAY, .9) +
    '<text x="46" y="123" font-size="13" fill="%s" stroke="none" font-weight="700">が</text>' % SHU +
    '<text x="114" y="34" font-size="12" fill="%s" stroke="none" font-weight="700">は = the stage</text>' % AI +
    sakura(186, 100, .8) + sakura(100, 108, .7))

# 見る・見える・眺める: 障子の窓から富士山
D_SEE = svg(
    '<rect x="96" y="12" width="90" height="74" rx="2" stroke="%s" stroke-width="2.6" fill="#FFFDF8"/>' % INK +
    '<path d="M100 80 L136 34 L172 80 Z" stroke="%s" stroke-width="2.6" fill="#DCE6F2"/>' % AI +
    '<path d="M126 46 l5 6 l5 -5 l5 6 l5 -6 l-10 -13 z" stroke="%s" stroke-width="1.6" fill="#fff"/>' % AI +
    '<circle cx="168" cy="28" r="7" stroke="%s" stroke-width="2.4" fill="#F6C4B8"/>' % SHU +
    '<path d="M126 12 v74 M156 12 v74 M96 49 h90" stroke="#C9B99A" stroke-width="1.6"/>' +
    person(48, 54) +
    '<path d="M58 52 q16 -6 34 -8" stroke="%s" stroke-width="1.8" stroke-dasharray="4 4"/>' % SHU +
    '<text x="14" y="120" font-size="12" fill="%s" stroke="none" font-weight="700">富士山が見える</text>' % AI +
    sakura(16, 20, .8))

# です・ます: のれんのある店先で、おじぎ
D_POLITE = svg(
    '<path d="M20 8 h160" stroke="%s" stroke-width="3"/>' % INK +
    "".join(f'<rect x="{24+i*38}" y="10" width="34" height="30" fill="{AI}" stroke="none" opacity=".9"/>' for i in range(4)) +
    '<circle cx="100" cy="25" r="8" stroke="#fff" stroke-width="2"/>' +
    person(52, 62) +
    '<g transform="rotate(28 146 90)">' + person(146, 64, SHU) + '</g>' +
    '<text x="62" y="120" font-size="12" fill="%s" stroke="none" font-weight="700">よろしくお願いします</text>' % INK)

# に と で: 瓦屋根の家と、鳥居のある公園
D_NIDE = svg(
    '<path d="M12 64 q34 -30 70 0" stroke="%s" stroke-width="3" fill="#E7E1F2"/>' % INK +
    '<rect x="22" y="64" width="50" height="44" stroke="%s" stroke-width="2.4" fill="#FFFDF8"/>' % INK +
    '<path d="M47 64 v44 M22 86 h50" stroke="#C9B99A" stroke-width="1.4"/>' +
    '<text x="40" y="82" font-size="15" fill="%s" stroke="none" font-weight="700">に</text>' % SHU +
    torii(150, 40, .8) +
    '<path d="M104 110 h92" stroke="%s" stroke-width="2.4"/>' % TAKE +
    person(150, 64, INK, .8) +
    '<text x="172" y="100" font-size="15" fill="%s" stroke="none" font-weight="700">で</text>' % AI)

# あげる・くれる・もらう: 風呂敷包みを渡す
D_GIVE = svg(
    person(36, 50) + person(164, 50, AI) +
    '<rect x="84" y="62" width="32" height="24" rx="4" stroke="%s" stroke-width="2.4" fill="#F6C4B8"/>' % SHU +
    '<path d="M94 62 q6 -14 12 0 M90 62 l-6 -8 M110 62 l6 -8" stroke="%s" stroke-width="2.2"/>' % SHU +
    '<path d="M90 70 l6 4 l-6 4 M104 70 l6 4 l-6 4" stroke="#fff" stroke-width="1.4"/>' +
    '<path d="M56 40 q44 -30 88 0" stroke="%s" stroke-width="1.8" stroke-dasharray="4 4"/><path d="M138 34 l7 6 l-9 3" stroke="%s" stroke-width="1.8"/>' % (INK, INK) +
    sakura(100, 104, .8))

# 〜てしまう: 茶碗を割ってしまった
D_SHIMAU = svg(
    person(56, 46) +
    '<path d="M112 84 q28 26 56 0 z" stroke="%s" stroke-width="2.4" fill="#DCE6F2"/>' % AI +
    '<path d="M126 84 l6 10 l-4 6 M150 84 l-4 8 l6 6" stroke="%s" stroke-width="2"/>' % SHU +
    '<path d="M132 102 h16" stroke="%s" stroke-width="2.4"/>' % AI +
    '<path d="M104 104 l-8 6 M176 104 l8 6 M140 112 v8" stroke="%s" stroke-width="2"/>' % GRAY +
    '<text x="20" y="18" font-size="13" fill="%s" stroke="none" font-weight="700">あっ…</text>' % SHU)
