FILTER = """<filter id="crayon"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.2"/></filter>"""

def svg(body, vb="0 0 200 125", cls="doodle"):
    return f'<svg class="{cls}" viewBox="{vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>{FILTER}</defs><g filter="url(#crayon)" fill="none" stroke-linecap="round" stroke-linejoin="round">{body}</g></svg>'

def person(x, y, c="#222735", s=1.0):
    r = 9 * s
    return (f'<circle cx="{x}" cy="{y}" r="{r}" stroke="{c}" stroke-width="2.4"/>'
            f'<circle cx="{x-3*s}" cy="{y-1*s}" r="1" fill="{c}"/><circle cx="{x+3*s}" cy="{y-1*s}" r="1" fill="{c}"/>'
            f'<path d="M{x-3*s} {y+3*s} q{3*s} {3*s} {6*s} 0" stroke="{c}" stroke-width="1.6"/>'
            f'<path d="M{x} {y+r} l1 {24*s} M{x} {y+r+8*s} l-11 {7*s} M{x} {y+r+8*s} l12 {5*s} M{x+1} {y+r+24*s} l-9 {14*s} M{x+1} {y+r+24*s} l10 {13*s}" stroke="{c}" stroke-width="2.4"/>')

# スポットライト(は と が)
D_SPOT = svg(
    '<path d="M30 8 L18 108 L86 112 L52 8 Z" fill="#FFE27A" stroke="#E8B400" stroke-width="2" opacity=".85"/>'
    '<rect x="32" y="2" width="18" height="10" rx="2" stroke="#222735" stroke-width="2.4"/>'
    + person(50, 58) + person(120, 62, "#98A1B3", .9) + person(160, 60, "#98A1B3", .9) +
    '<text x="44" y="122" font-size="13" fill="#2F6BFF" stroke="none" font-weight="700">が</text>'
    '<path d="M126 22 q6 8 10 18" stroke="#2F6BFF" stroke-width="2"/><text x="104" y="14" font-size="12" fill="#2F6BFF" stroke="none" font-weight="700">は = the stage</text>')

# 見る・見える・眺める(窓と山)
D_SEE = svg(
    '<rect x="96" y="14" width="88" height="70" rx="4" stroke="#222735" stroke-width="2.4"/>'
    '<path d="M100 78 L128 40 L146 60 L158 46 L180 78" stroke="#4CA36B" stroke-width="2.6" fill="#DDF3E4"/>'
    '<path d="M122 40 l6 -6 l6 6" stroke="#fff" stroke-width="3"/>'
    '<circle cx="168" cy="28" r="7" stroke="#F5A524" stroke-width="2.4" fill="#FFE27A"/>'
    + person(52, 52) +
    '<path d="M62 50 q14 -6 32 -8" stroke="#2F6BFF" stroke-width="1.8" stroke-dasharray="4 4"/>'
    '<text x="18" y="118" font-size="12" fill="#2F6BFF" stroke="none" font-weight="700">山が見える</text>')

# です・ます(職場)
D_POLITE = svg(
    person(50, 46) + person(140, 46, "#2F6BFF") +
    '<path d="M64 20 h52 a8 8 0 0 1 8 8 v14 a8 8 0 0 1 -8 8 h-34 l-10 8 v-8 h-8 a8 8 0 0 1 -8 -8 v-14 a8 8 0 0 1 8 -8z" stroke="#222735" stroke-width="2" fill="#fff"/>'
    '<text x="70" y="40" font-size="12" fill="#222735" stroke="none" font-weight="700">〜です</text>'
    '<path d="M20 112 h160" stroke="#CDD4E1" stroke-width="2"/>'
    '<rect x="78" y="90" width="44" height="22" stroke="#98A1B3" stroke-width="2"/>')

# に と で(家と公園)
D_NIDE = svg(
    '<path d="M20 70 L48 44 L76 70 V108 H20 Z" stroke="#222735" stroke-width="2.4" fill="#FCE7F3"/>'
    '<text x="38" y="92" font-size="14" fill="#E11D74" stroke="none" font-weight="700">に</text>'
    '<path d="M110 108 q30 -40 76 0" stroke="#4CA36B" stroke-width="2.4" fill="#DDF3E4"/>'
    + person(148, 50, "#222735", .9) +
    '<text x="138" y="122" font-size="14" fill="#2F6BFF" stroke="none" font-weight="700">で</text>')

# あげる・くれる・もらう(プレゼント)
D_GIVE = svg(
    person(40, 48) + person(160, 48, "#2F6BFF") +
    '<rect x="88" y="62" width="24" height="20" stroke="#E8B400" stroke-width="2.4" fill="#FFE27A"/>'
    '<path d="M100 62 v20 M88 70 h24" stroke="#E11D74" stroke-width="2"/>'
    '<path d="M60 56 q30 -26 74 0" stroke="#222735" stroke-width="1.8" stroke-dasharray="4 4"/><path d="M128 50 l7 6 l-9 3" stroke="#222735" stroke-width="1.8"/>')

# 〜てしまう(割れたコップ)
D_SHIMAU = svg(
    person(60, 44) +
    '<path d="M120 96 l8 -24 h24 l8 24 z" stroke="#222735" stroke-width="2.4" fill="#E0F2FE"/>'
    '<path d="M136 72 l4 10 l-6 6 l8 8" stroke="#E11D74" stroke-width="2"/>'
    '<path d="M110 108 l-8 4 M170 108 l8 4 M140 112 v6" stroke="#98A1B3" stroke-width="2"/>'
    '<text x="22" y="18" font-size="13" fill="#E11D74" stroke="none" font-weight="700">あっ…</text>')

D_SPOT_SMALL = svg(
    '<path d="M30 8 L14 108 L80 112 L50 8 Z" fill="#FFE27A" stroke="#E8B400" stroke-width="2" opacity=".85"/>'
    '<rect x="30" y="2" width="18" height="10" rx="2" stroke="#222735" stroke-width="2.4"/>'
    + person(46, 58) + person(130, 62, "#98A1B3", .9), vb="0 0 180 125", cls="doodle sm")

