# -*- coding: utf-8 -*-
# 英語で書くページ(日本語学習)では、漢字にはすべて読み(ルビ)を付ける。
# 書き出した HTML の本文の文字を見て、まだルビの付いていない漢字に辞書の読みを付ける。
# 辞書にない漢字が残ったら、エラーにして気づけるようにする。
import re

READINGS = {
    "自己紹介": "じこしょうかい", "公園": "こうえん", "昨日": "きのう", "明日": "あした", "学生": "がくせい",
    "夜景": "やけい", "映画": "えいが", "田中": "たなか", "走": "はし", "待": "ま", "気": "き", "疲": "つか",
    "願": "ねが", "眺": "なが", "見": "み", "私": "わたし", "誰": "だれ", "来": "き", "山": "やま", "窓": "まど",
}
KANJI = re.compile(r"[一-鿿々]")
WORD = re.compile("|".join(sorted(map(re.escape, READINGS), key=len, reverse=True)))
VOID = {"meta", "br", "input", "img", "link", "hr", "path", "circle", "rect", "ellipse", "line", "polygon", "polyline", "feturbulence", "fedisplacementmap", "fecolormatrix"}
SKIP = {"ruby", "rt", "svg", "style", "script", "title", "head", "textarea"}

def add_furigana(html, default_lang):
    out, stack = [], []
    for tok in re.split(r"(<[^>]+>)", html):
        if tok.startswith("<"):
            m = re.match(r"<(/?)([a-zA-Z][\w:-]*)([^>]*)>", tok)
            if m and not tok.startswith("<!"):
                close, name, rest = m.group(1), m.group(2).lower(), m.group(3)
                if close:
                    while stack and stack.pop()[0] != name:
                        pass
                elif name not in VOID and not rest.rstrip().endswith("/"):
                    lang = re.search(r'\blang="([^"]+)"', rest)
                    stack.append((name, lang.group(1) if lang else None))
            out.append(tok)
            continue
        langs = [l for _, l in stack if l]
        lang = langs[-1] if langs else default_lang
        if lang != "en" or any(n in SKIP for n, _ in stack) or not KANJI.search(tok):
            out.append(tok)
            continue
        text = WORD.sub(lambda m: f"<ruby>{m.group(0)}<rt>{READINGS[m.group(0)]}</rt></ruby>", tok)
        left = KANJI.findall(re.sub(r"<ruby>.*?</ruby>", "", text))
        if left:
            raise ValueError(f"読みが辞書にない漢字: {''.join(left)}(furigana.py の READINGS に足す)")
        out.append(text)
    return "".join(out)
