# -*- coding: utf-8 -*-
# 日本語学習セクションのモック v2。既存サイトの globals.css をそのまま埋め込み、
# 既存のページ(トップ、記事ページ)と同じクラス・同じ並びで組む。新しい部品は EXTRA_CSS だけ。
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from doodles import D_SPOT, D_SEE, D_POLITE, D_NIDE, D_GIVE, D_SHIMAU

ROOT = r"C:\まなビレッジサイト"
OUT = os.path.join(ROOT, "docs", "mock-japanese")
GLOBALS = open(os.path.join(ROOT, "web", "src", "app", "globals.css"), encoding="utf-8").read()

# 既存にない部品だけを、既存と同じ作法(変数、角丸、余白)で足す
EXTRA_CSS = r"""
/* モック用: next/font の Newsreader の代わり */
:root{--font-en:Georgia}
/* 英語で書くセクション: 本文は英字を先に */
html[lang="en"]{--body:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Hiragino Sans","Noto Sans JP","Yu Gothic Medium",Meiryo,sans-serif;--display:var(--body)}
.jp{font-family:"Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP","Noto Sans CJK JP","Yu Gothic Medium","Yu Gothic",Meiryo,sans-serif;font-style:normal}
.mock-note{background:var(--p2);color:#99650A;font-size:12px;font-weight:700;text-align:center;padding:6px 12px}
/* 記事カードとヒーローの絵(本番は webp の <img>。モックは SVG) */
.thumb svg{width:100%;height:100%}
.prose figure.illus{background:#fff;border:1px solid var(--line);border-radius:16px;padding:12px 40px}
.prose figure.illus svg{display:block;width:100%;height:auto}

/* ヒーローの右側: 日本語のフレーズ */
.phrase .jpx{font-size:clamp(28px,3.4vw,38px);line-height:1.5;font-weight:700}
.phrase .jpx mark{color:inherit;background:linear-gradient(var(--hl),var(--hl)) no-repeat 0 88% / 0% 42%;padding-inline:2px;animation:marker .7s .35s var(--ease) forwards}
.phrase .ro{font-family:var(--en);font-style:italic;font-size:17px;color:var(--ink)}

/* ヘッダーの科目タブ */
.head-nav{display:flex;align-items:center;gap:12px;min-width:0}
.subjects{display:flex;gap:4px}
.subjects a{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:99px;font-size:14px;color:var(--muted);white-space:nowrap;transition:color .2s,background .2s}
.subjects a:hover{color:var(--ink);background:var(--bg)}
.subjects a[aria-current="page"]{color:var(--accent);background:var(--accent-soft);font-weight:500}
.nav-sep{width:1px;height:22px;background:var(--line-strong)}
@media (max-width:760px){
  .head-in,.scrolled .head-in{flex-wrap:wrap;height:auto;padding-block:10px;row-gap:8px}
  .head-nav{order:3;width:100%;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}
  .subjects a{font-size:13px}
}
/* 例文ボックス(.example を拡張): 日本語、ローマ字、英訳の3段 */
.example .jpx{font-size:22px;line-height:2;font-weight:700;letter-spacing:.02em}
.example .jpx mark{color:inherit;background:linear-gradient(var(--hl),var(--hl)) no-repeat 0 88% / 100% 42%;padding-inline:2px}
.example .ro{font-family:var(--en);font-style:italic;font-size:15px;color:var(--muted);line-height:1.5}
.example .tr{font-size:15px;line-height:1.6}
.example.ng .jpx{text-decoration:line-through;text-decoration-color:rgba(201,64,92,.5);text-decoration-thickness:2px}
.example.ok{background:#F2FBF6;border-color:#CBEBD9}
.ok .lbl{color:var(--ok)}
.example .why{font-size:13px;color:var(--muted);border-top:1px dashed var(--line-strong);padding-top:8px;margin-top:6px;line-height:1.8}
.ex-pair{display:grid;grid-template-columns:1fr 1fr;gap:12px}
ruby{ruby-position:over}
rt{font-size:.48em;font-weight:500;color:var(--muted);letter-spacing:0}
/* ふりがな・ローマ字の切り替え(掲示板の .seg と同じ形) */
.reading{display:flex;gap:10px;flex-wrap:wrap;align-items:center;font-size:13px;color:var(--muted);margin:-16px 0 32px}
.reading .seg button{border:0;background:none;padding:6px 14px;border-radius:99px;font-size:13px;color:var(--muted)}
.reading .seg button[aria-pressed="true"]{background:var(--surface);color:var(--ink);font-weight:500;box-shadow:0 1px 4px rgba(25,35,70,.12)}
body.no-furi rt{visibility:hidden}
body.no-ro .example .ro{display:none}
/* 要点(冒頭) */
.prose .points{border:1px solid var(--line);border-radius:16px;padding:20px 24px;background:var(--accent-soft)}
.prose .points .lbl{display:block;margin-bottom:6px}
.prose .points ul{margin:0}
/* 表(既存の .prose table)の日本語セル */
.prose td .jpx,.prose th .jpx{font-size:17px;font-weight:700;display:block;line-height:1.9}
.prose td .tr{font-size:13px;color:var(--muted);display:block}
/* 言語切り替え(既存トップの h1 帯の中) */
.home-intro .seg{justify-self:start;margin-top:6px}
.home-intro .seg a{display:inline-flex;gap:6px;align-items:center}
.vlabel{font-size:12px;font-weight:700;letter-spacing:.08em;color:var(--faint);margin:48px 0 14px;display:flex;align-items:center;gap:12px}
.vlabel::after{content:"";flex:1;border-top:1px dashed var(--line-strong)}
.vlabel b{color:var(--accent)}
@media (max-width:520px){.prose tbody th{white-space:nowrap;font-size:12px}.prose th,.prose td{padding:8px 10px}.prose td .jpx,.prose th .jpx{font-size:15px;white-space:nowrap}.ex-pair{grid-template-columns:1fr}.example .jpx{font-size:20px}.prose figure.illus{padding:8px 12px}}
"""

WA_CSS = open(os.path.join(os.path.dirname(__file__), "wa.css"), encoding="utf-8").read()

TOGGLE_JS = """<script>
document.querySelectorAll('[data-toggle]').forEach(function(b){b.addEventListener('click',function(){
  var cls=b.dataset.toggle, on=b.dataset.on==='1';
  b.parentElement.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});
  document.body.classList.toggle(cls,!on);});});
var bar=document.querySelector('.progress');addEventListener('scroll',function(){var m=document.documentElement.scrollHeight-innerHeight;if(bar)bar.style.transform='scaleX('+(m>0?Math.min(1,scrollY/m):0)+')';document.getElementById('site-head').classList.toggle('scrolled',scrollY>8)},{passive:true});
</script>"""

def page(lang, title, body, script=""):
    return f"""<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<style>
/* ===== web/src/app/globals.css(既存サイトの CSS をそのまま埋め込み) ===== */
{GLOBALS}
/* ===== モックで足した部品 ===== */
{EXTRA_CSS}
{WA_CSS if lang == "en" else ""}
</style>
</head>
<body>
{body}
{script}
</body>
</html>
"""

# 科目の切り替えは、ヘッダーのメニューに科目を並べる(科目が増えたら、ここに足すだけ)
SUBJECTS = [
    ("en-learning", "03-english-top.html", "英語を学ぶ", "ja"),
    ("ja-learning", "01-japanese-top.html", "Learn Japanese", "en"),
]

def header(lang="en", cur=None):
    # cur: いま見ている科目。まなビレッジ全体の入口(00-index)では None
    tabs = "".join(
        f'<a href="{href}" lang="{l}"{" aria-current=\"page\"" if key == cur else ""}>{label}</a>'
        for key, href, label, l in SUBJECTS)
    board = "Board" if lang == "en" else "掲示板"
    acct = '<a class="btn primary" href="#">Log in</a>' if lang == "en" else '<a class="btn primary" href="#">ログイン</a>'
    return f"""<header class="site-head bleed" id="site-head"><div class="head-in">
  <a class="logo jp" href="00-index.html"><i></i>まなビレッジ</a>
  <nav class="head-nav" aria-label="Site">
    <div class="subjects" role="list" aria-label="{'Subjects' if lang == 'en' else '学ぶ科目'}">{tabs}</div>
    <span class="nav-sep" aria-hidden="true"></span>
    <div class="nav"><a href="#">{board}</a></div>
  </nav>
  <div class="acct">{acct}</div>
</div></header>"""

IG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5.2"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.4" cy="6.6" r=".9" fill="currentColor" stroke="none"/></svg>'
YT = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.4v5.2l4.6-2.6z" fill="currentColor"/></svg>'

def footer(lang="en"):
    if lang == "en":
        desc = "Japanese grammar and word choice, explained in plain English — plus a board where learners help each other."
        c1 = ("Articles", ["All articles", "#Particles", "#Grammar", "#Synonyms", "#Politeness"])
        c2 = ("Join", ["Board", "Start a thread", "Log in", "Sign up"])
        c3 = ("About", ["About Mana Village", "About the operator", "Contact", "Privacy policy", "Terms of use"])
        bottom = ("© 2026 Mana Village", "Operated by Kaz")
    else:
        desc = "英語の勉強方法を書いた記事と、学習者どうしで助け合える掲示板のサイトです。"
        c1 = ("記事", ["すべての記事", "#勉強法", "#単語", "#学習研究", "#スピーキング", "Learn Japanese (English)"])
        c2 = ("参加する", ["掲示板", "スレッドを作る", "ログイン", "新規登録"])
        c3 = ("サイトについて", ["まなビレッジとは", "運営者について", "お問い合わせ", "プライバシーポリシー", "利用規約"])
        bottom = ("© 2026 まなビレッジ", "運営：Kaz")
    col = lambda c: f'<nav class="foot-col"><h2>{c[0]}</h2><ul>' + "".join(f'<li><a href="#">{x}</a></li>' for x in c[1]) + "</ul></nav>"
    return f"""<footer class="site-foot bleed"><div class="foot-in">
  <div class="foot-main">
    <div class="foot-brand"><a class="foot-logo jp" href="00-index.html"><i></i>まなビレッジ</a>
      <p class="foot-tag en">For Everyone's Learning, For Everyone's Help</p>
      <p class="foot-desc">{desc}</p>
      <ul class="foot-social"><li><a href="#">{IG}<span>Instagram</span></a></li><li><a href="#">{YT}<span>YouTube</span></a></li></ul>
    </div>
    {col(c1)}{col(c2)}{col(c3)}
  </div>
  <div class="foot-bottom"><small>{bottom[0]}</small><small>{bottom[1]}</small></div>
</div></footer>"""

PASTEL = ["var(--p1)", "var(--p2)", "var(--p3)", "var(--p4)", "var(--p5)", "var(--p6)"]
ARTICLES = [
    dict(art=D_SPOT, tag="Particles", title="は (wa) vs が (ga): think of it as a spotlight", date="Sep 30", mins=8, c=4),
    dict(art=D_SEE, tag="Synonyms", title="見る, 見える, 眺める: three ways to “see” in Japanese", date="Sep 29", mins=7, c=2),
    dict(art=D_POLITE, tag="Politeness", title="です / ます vs. casual forms: which one at work?", date="Sep 28", mins=9, c=6),
    dict(art=D_NIDE, tag="Particles", title="に vs で: where things are vs. where things happen", date="Sep 27", mins=6, c=1),
    dict(art=D_GIVE, tag="Grammar", title="あげる, くれる, もらう: who is giving to whom?", date="Sep 26", mins=8, c=3),
    dict(art=D_SHIMAU, tag="Grammar", title="〜てしまう: when something “just happened”", date="Sep 25", mins=5, c=0),
]

def card(a, i):
    return f"""<a class="card reveal" href="02-japanese-article.html">
  <div class="thumb" style="background:{PASTEL[i % 6]}">{a['art']}</div>
  <div class="card-body">
    <div class="meta"><span class="tag">#{a['tag']}</span><span class="dot-sep"></span><span>{a['date']}</span><span class="dot-sep"></span><span>{a['mins']} min</span></div>
    <h3>{a['title']}</h3>
  </div>
  <div class="card-foot"><span>💬 {a['c']} comments</span><span class="go">Read →</span></div>
</a>"""

R = lambda k, f: f"<ruby>{k}<rt>{f}</rt></ruby>"

def ex(lbl, jpx, ro, tr, kind="", why=""):
    k = f" {kind}" if kind else ""
    w = f'<span class="why">{why}</span>' if why else ""
    return f'<div class="example{k}"><span class="lbl">{lbl}</span><span class="jpx jp">{jpx}</span><span class="ro">{ro}</span><span class="tr">{tr}</span>{w}</div>'

TICKER = [("いただきます", "Let’s eat"), ("お疲れさまです", "Thanks for your hard work"), ("よろしくお願いします", "Nice to work with you"),
          ("ちょっと待って", "Wait a sec"), ("なるほど", "I see"), ("気にしないで", "No worries"), ("また明日", "See you tomorrow")]
ticker = "".join(f'<span class="ticker-item"{" aria-hidden=\"true\"" if n >= len(TICKER) else ""}><span class="jp" style="font-size:17px;color:var(--hl);font-weight:700">{j}</span>{e}<span class="sep">✦</span></span>'
                 for n, (j, e) in enumerate(TICKER + TICKER))

TAGS = [("Particles", 9), ("Grammar", 14), ("Synonyms", 11), ("Politeness", 6), ("Verbs", 8), ("Beginner", 12), ("Kanji", 4)]
chips = "".join(f'<a class="chip" href="#">#{t}<span class="n">{n}</span></a>' for t, n in TAGS)

# ---------- 1. セクションのトップ(既存のトップと同じ並び) ----------
top = header("en", "ja-learning") + f"""
<main><div class="screen">
  <div class="wrap home-intro">
    <h1>Japanese grammar, explained with things you already know.</h1>
    <p>Particles, verb forms, and words that look alike — each guide is built around a simple analogy and real example sentences. Read it, try it, and ask the community on the board when you get stuck.</p>
  </div>
  <div class="wrap">
    <a class="panel hero" href="02-japanese-article.html">
      <div class="hero-text intro">
        <span class="badge-new"><i></i>Latest guide</span>
        <h2>は (wa) vs が (ga): think of it as a spotlight</h2>
        <p class="lead">は names what you’re talking about. が points at which one. One picture, three example sentences, and the mistake almost everyone makes.</p>
        <div class="meta"><span class="tag">#Particles</span><span class="dot-sep"></span><span>Sep 30</span><span class="dot-sep"></span><span>8 min read</span></div>
        <span class="btn primary" style="justify-self:start">Read the guide <span class="arr">→</span></span>
      </div>
      <div class="stage">
        <span class="float f1 jp" aria-hidden="true">は</span><span class="float f2 jp" aria-hidden="true">が</span><span class="float f3" aria-hidden="true">spotlight</span>
        <span class="stage-label">3 SENTENCES IN THIS GUIDE</span>
        <div class="phrase in"><span class="jpx jp">{R('私','わたし')}<mark>は</mark>{R('学生','がくせい')}です。</span><span class="ro">Watashi wa gakusei desu.</span><span class="ja">“I’m a student.”</span></div>
        <div class="dots"><button aria-current="true" aria-label="1"></button><button aria-label="2"></button><button aria-label="3"></button></div>
      </div>
    </a>
  </div>

  <div class="ticker bleed" aria-label="Everyday phrases"><div class="ticker-track">{ticker}</div></div>

  <div class="wrap">
    <section class="block">
      <div class="sec-head reveal"><div><h2>New guides</h2><p class="sub">Practical grammar and word-choice guides, written in English</p></div><a class="more" href="#">All articles <span class="arr">→</span></a></div>
      <div class="cards">{''.join(card(a, i + 1) for i, a in enumerate(ARTICLES))}</div>
    </section>
    <section class="block">
      <div class="sec-head reveal"><div><h2>Browse by tag</h2><p class="sub">More tags appear as new guides are added</p></div></div>
      <div class="chips reveal">{chips}</div>
    </section>
  </div>

  <section class="band bleed"><div class="wrap band-in">
    <div class="reveal"><h2>Board</h2><p>Ask questions, check your sentences, and share your progress with other learners. No login needed to read.</p><a class="btn" href="#">Open the board <span class="arr">→</span></a></div>
    <div class="band-list">
      <a class="band-item reveal" href="#"><span class="t">Is <span class="jp">私が</span> ever natural in a self-introduction?</span><span class="n">5 replies</span><span class="cat c0">Grammar Q&amp;A</span></a>
      <a class="band-item reveal" href="#"><span class="t">Please check my sentence: <span class="jp">昨日、公園に走りました</span></span><span class="n">3 replies</span><span class="cat c1">Sentence check</span></a>
      <a class="band-item reveal" href="#"><span class="t">How I review kanji on the train</span><span class="n">8 replies</span><span class="cat c2">Study log</span></a>
    </div>
  </div></section>
</div></main>
""" + footer("en")

# ---------- 2. 記事ページ(既存の記事ページと同じ並び) ----------
article = '<div class="progress" aria-hidden="true"></div>' + header("en", "ja-learning") + f"""
<main><div class="screen"><div class="wrap reader-grid">
  <article class="panel paper">
    <div class="crumb"><a href="01-japanese-top.html">Articles</a><span>/</span><a href="#">#Particles</a></div>
    <h1>は (wa) vs が (ga): think of it as a spotlight</h1>
    <div class="byline"><div class="avatar" aria-hidden="true">K</div><div><div class="who">Kaz</div><div class="sub">Sep 30, 2026 · 8 min read · Updated Oct 1, 2026</div></div></div>
    <div class="reading">
      <span>Furigana</span><span class="seg"><button type="button" data-toggle="no-furi" data-on="1" aria-pressed="true">On</button><button type="button" data-toggle="no-furi" data-on="0" aria-pressed="false">Off</button></span>
      <span>Romaji</span><span class="seg"><button type="button" data-toggle="no-ro" data-on="1" aria-pressed="true">On</button><button type="button" data-toggle="no-ro" data-on="0" aria-pressed="false">Off</button></span>
    </div>
    <div class="prose">
      <p>Textbooks often translate both <b class="jp">は</b> and <b class="jp">が</b> as nothing at all — there’s no English word for either. So you end up guessing. If you’ve ever flipped a coin between the two, you’re in good company.</p>
      <div class="points"><span class="lbl">IN 30 SECONDS</span><ul>
        <li><b class="jp">は</b> names the <b>topic</b> — what the sentence is about.</li>
        <li><b class="jp">が</b> picks out <b>who or what</b> — often new information, or the answer to “who?”</li>
        <li>Question words like <span class="jp">{R('誰','だれ')}</span> (who) take <b class="jp">が</b>, never <b class="jp">は</b>.</li></ul></div>
      <figure class="illus">{D_SPOT}</figure>

      <h2>Think of a stage and a spotlight</h2>
      <p>Here is the short version: <span class="hl">は tells the listener what you’re talking about. が tells them which one.</span></p>
      <div class="voice"><span class="lbl">THINK OF IT LIKE THIS</span>
        <p>Picture a stage. <b class="jp">は</b> is the stage light that’s already on — “OK, we’re talking about <em>me</em> now.” <b class="jp">が</b> is a spotlight that swings onto one person in the crowd — “It’s <em>Tanaka</em> who came, not anyone else.” This is just a picture to help it stick, not a rule that covers every case.</p></div>

      <h2>は: setting the topic</h2>
      <p>Use <b class="jp">は</b> when you introduce what the sentence is about. In a self-introduction, you are the topic.</p>
      {ex("EXAMPLE", f"{R('私','わたし')}<mark>は</mark>{R('学生','がくせい')}です。", "Watashi wa gakusei desu.", "I’m a student. (As for me — I’m a student.)")}

      <h2>が: pointing at “which one”</h2>
      <p>When someone asks “who?”, both the question and the answer use <b class="jp">が</b>. The answer is new information, so it gets the spotlight.</p>
      <div class="ex-pair">
        {ex("QUESTION", f"{R('誰','だれ')}<mark>が</mark>{R('来','き')}ましたか。", "Dare ga kimashita ka?", "Who came?")}
        {ex("ANSWER", f"{R('田中','たなか')}さん<mark>が</mark>{R('来','き')}ました。", "Tanaka-san ga kimashita.", "Tanaka came.")}
      </div>

      <h2>The mistake almost everyone makes</h2>
      <p>A question word can’t be the topic, because the topic is something you already know.</p>
      <div class="ex-pair">
        {ex("NG", f"{R('誰','だれ')}は{R('来','き')}ましたか。", "Dare wa kimashita ka?", "(intended: Who came?)", "ng", "誰 asks for something unknown, so it can’t be marked with は.")}
        {ex("OK", f"{R('誰','だれ')}<mark>が</mark>{R('来','き')}ましたか。", "Dare ga kimashita ka?", "Who came?", "ok")}
      </div>
      <p>And one that isn’t wrong, but sounds odd: saying <span class="jp">{R('私','わたし')}が{R('学生','がくせい')}です</span> in a self-introduction sounds like “<em>I’m</em> the one who’s the student” — as if you were answering “Which of you is the student?”</p>

      <h3>Component sample: comparing look-alike words</h3>
      <p>Synonym guides use the same table style as the rest of the site.</p>
      <table>
        <thead><tr><th></th><th><span class="jpx jp">{R('見','み')}る</span>miru</th><th><span class="jpx jp">{R('見','み')}える</span>mieru</th><th><span class="jpx jp">{R('眺','なが')}める</span>nagameru</th></tr></thead>
        <tbody>
          <tr><th>Meaning</th><td>look, watch</td><td>be visible, can see</td><td>gaze at, look out over</td></tr>
          <tr><th>On purpose?</th><td>Yes</td><td>No — it comes into view</td><td>Yes — slowly, for a while</td></tr>
          <tr><th>Particle</th><td><span class="jpx jp">〜を見る</span></td><td><span class="jpx jp">〜が見える</span></td><td><span class="jpx jp">〜を眺める</span></td></tr>
          <tr><th>Example</th><td><span class="jpx jp">{R('映画','えいが')}を{R('見','み')}る</span><span class="tr">watch a movie</span></td><td><span class="jpx jp">{R('山','やま')}が{R('見','み')}える</span><span class="tr">I can see the mountains</span></td><td><span class="jpx jp">{R('夜景','やけい')}を{R('眺','なが')}める</span><span class="tr">gaze at the night view</span></td></tr>
        </tbody>
      </table>

      <h2>Try it yourself</h2>
      <p>Next time you write a Japanese sentence, ask: “Am I naming the topic, or answering <em>which one</em>?” Then post one sentence with <b class="jp">は</b> and one with <b class="jp">が</b> in the comments.</p>
    </div>
    <div class="tags-foot"><a class="chip" href="#">#Particles</a><a class="chip" href="#">#Grammar</a><a class="chip" href="#">#Beginner</a></div>
  </article>

  <section class="panel comments reveal" id="comments">
    <div class="c-head"><h2>Comments <span class="sub">2 · newest first</span></h2></div>
    <div class="c-body">
      <div class="prompt"><span>Log in to post. You can read without logging in.</span><a class="btn primary" href="#">Log in</a></div>
      <div class="cmt"><div class="avatar" aria-hidden="true">S</div><div class="cmt-body"><div class="who">Sam<span class="sub">2 days ago</span></div><p>The spotlight picture finally made <span class="jp">誰が</span> click for me. Is <span class="jp">私が</span> ever natural?</p><button class="reply-btn" type="button">Reply</button></div>
        <div class="replies"><div class="cmt"><div class="avatar" aria-hidden="true">K</div><div class="cmt-body"><div class="who">Kaz<span class="author">Author</span><span class="sub">1 day ago</span></div><p>Yes — when you answer “Who will do it?”: <span class="jp">私がやります。</span> (“<em>I’ll</em> do it.”)</p><button class="reply-btn" type="button">Reply</button></div></div></div>
      </div>
    </div>
  </section>

  <section class="related" aria-label="Related guides">
    <div class="sec-head" style="margin-bottom:20px"><h2>Related guides</h2></div>
    <div class="cards">{card(ARTICLES[1], 2)}{card(ARTICLES[3], 4)}{card(ARTICLES[2], 3)}</div>
  </section>
</div></div></main>
""" + footer("en")

# ---------- 3. 既存のトップに置く言語の切り替え ----------
switch = '<div class="mock-note">モック: 英語学習のトップ(「英語を学ぶ」を押した先。今のトップをここへ移す)</div>' + header("ja", "en-learning") + f"""
<main><div class="screen">
  <div class="wrap home-intro">
    <h1>英語の勉強方法を、研究と経験から。</h1>
    <p>単語の覚え方、文法書の進め方、スピーキングの練習まで。読んで、試して、つまずいたら掲示板でみんなに聞ける、英語学習のサイトです。</p>
  </div>
  <div class="wrap">
    <a class="panel hero" href="#">
      <div class="hero-text intro"><span class="badge-new"><i></i>最新記事</span><h2>(いまの最新記事のヒーロー。変更なし)</h2><p class="lead">ヘッダー以外は、今のトップのまま。</p></div>
      <div class="stage"><span class="stage-label">この記事で学ぶ5つの言い方</span><div class="phrase in"><span class="en"><mark>Talk to yourself.</mark></span><span class="ja">独り言を言おう</span></div></div>
    </a>
  </div>
</div></main>
""" + footer("ja")

# ---------- 0. まなビレッジ全体の入口(index。科目のトップとは別のページ) ----------
from doodles import svg, person, torii, sakura, SHU, INK
ART_EN = svg('<path d="M70 18 h96 a10 10 0 0 1 10 10 v26 a10 10 0 0 1 -10 10 h-58 l-14 12 v-12 h-24 a10 10 0 0 1 -10 -10 v-26 a10 10 0 0 1 10 -10z" stroke="#2F6BFF" stroke-width="2.4" fill="#fff"/>'
             '<text x="88" y="47" font-size="20" fill="#222735" stroke="none" font-style="italic" font-family="Georgia">Hello!</text>' + person(46, 66, "#222735"))
ART_JA = svg(torii(150, 36, .9) + person(56, 64, INK) +
             '<path d="M20 18 h76 a8 8 0 0 1 8 8 v16 a8 8 0 0 1 -8 8 h-44 l-10 9 v-9 h-22 a8 8 0 0 1 -8 -8 v-16 a8 8 0 0 1 8 -8z" stroke="%s" stroke-width="2.2" fill="#fff"/>' % SHU +
             '<text x="24" y="40" font-size="15" fill="%s" stroke="none" font-weight="700">こんにちは</text>' % INK + sakura(120, 104, .9) + sakura(186, 96, .7))

def subject(cls, lang, art, bg, name, who, desc, n, latest, btn, href):
    items = "".join(f'<li><a href="#">{x}</a></li>' for x in latest)
    return f"""<section class="panel subject {cls} reveal" lang="{lang}">
  <a class="subject-art" href="{href}" style="background:{bg}">{art}</a>
  <div class="subject-body">
    <span class="who">{who}</span>
    <h2><a href="{href}">{name}</a></h2>
    <p>{desc}</p>
    <ul class="subject-latest">{items}</ul>
    <div class="subject-foot"><span class="sub">{n}</span><a class="btn primary" href="{href}">{btn} <span class="arr">→</span></a></div>
  </div>
</section>"""

INDEX_CSS = """<style>
.portal-intro{text-align:center;justify-items:center;padding-block:24px 40px}
.portal-intro .tagline{font-size:clamp(20px,2.6vw,26px);color:var(--accent)}
.portal-intro p{margin-inline:auto}
.subjects-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px}
.subject{overflow:hidden;display:flex;flex-direction:column;transition:transform .35s var(--ease),box-shadow .35s var(--ease)}
.subject:hover{transform:translateY(-6px);box-shadow:var(--shadow-m)}
.subject-art{display:grid;place-items:center;aspect-ratio:16/8;border-bottom:1px solid var(--line);padding:16px 40px}
.subject-art svg{width:100%;height:100%}
.subject-body{padding:26px 28px 24px;display:grid;gap:12px;flex:1;align-content:start}
.subject .who{font-size:12px;font-weight:700;letter-spacing:.06em;color:var(--accent)}
.subject h2{font-size:26px;font-weight:900}
.subject h2 a:hover{color:var(--accent)}
.subject p{color:var(--muted)}
.subject-latest{list-style:none;margin:4px 0 0;padding:0;display:grid;border-top:1px solid var(--line)}
.subject-latest li{border-bottom:1px solid var(--line)}
.subject-latest a{display:block;padding:10px 2px;font-size:14px;transition:color .2s,padding .2s}
.subject-latest a:hover{color:var(--accent);padding-left:8px}
.subject-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:8px;flex-wrap:wrap}
/* 日本語学習のカードだけ、和の色と明朝 */
.subject.wa{--accent:#B83A2A;--accent-dark:#932C1F}
.subject.wa h2{font-family:"Hiragino Mincho ProN","Yu Mincho","YuMincho","Noto Serif JP",Georgia,serif;font-weight:700}
.subject.wa .btn.primary{box-shadow:0 4px 14px rgba(184,58,42,.25)}
.subject.wa h2,.subject.wa p,.subject.wa .subject-latest{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Hiragino Sans",sans-serif}
.subject.wa h2{font-family:"Hiragino Mincho ProN","Yu Mincho","YuMincho","Noto Serif JP",Georgia,serif}
.soon{border:2px dashed var(--line-strong);border-radius:var(--r);padding:20px 24px;color:var(--faint);font-size:14px;text-align:center;margin-top:28px}
@media (max-width:860px){.subjects-grid{grid-template-columns:1fr}}
</style>"""

index = '<div class="mock-note">モック: まなビレッジ全体の入口(index)。ロゴを押すとここに戻る。科目のトップとは別のページ</div>' + header("ja") + f"""
<main><div class="screen">
  <div class="wrap home-intro portal-intro">
    <h1>まなビレッジ</h1>
    <p class="tagline en">For Everyone's Learning, For Everyone's Help</p>
    <p>学びたい人が集まる、小さな村。科目ごとに、読みものと、学習者どうしで助け合える掲示板があります。<br><span class="sub" lang="en">A small village for learners — guides for each subject, and a board where everyone helps each other.</span></p>
  </div>
  <div class="wrap subjects-grid">
    {subject("", "ja", ART_EN, "var(--p1)", "英語を学ぶ", "日本語で読む · FOR JAPANESE SPEAKERS",
             "単語の覚え方、文法書の進め方、スピーキングの練習まで。研究と経験にもとづく英語の勉強法。", "記事 34本",
             ["英単語の覚え方 決定版", "英語の独り言のやり方。通勤・通学中に場面別で続ける練習法", "文法書は1か月で1冊"], "英語の記事へ", "03-english-top.html")}
    {subject("wa", "en", ART_JA, "#F4EFE4", "Learn Japanese", "IN ENGLISH · FOR JAPANESE LEARNERS",
             "Practical guides to Japanese grammar and look-alike words — each one built around a simple analogy and real example sentences.", "12 guides",
             ["は (wa) vs が (ga): think of it as a spotlight", "見る, 見える, 眺める: three ways to “see”", "です / ます vs. casual forms: which one at work?"], "Start learning", "01-japanese-top.html")}
  </div>
  <div class="wrap"><p class="soon">(将来の科目: IT、音楽 … ここにカードが増え、ヘッダーのメニューにも並ぶ)</p></div>

  <section class="band bleed"><div class="wrap band-in">
    <div class="reveal"><h2>掲示板 <span class="en" style="font-weight:400;font-size:20px">/ Board</span></h2><p>科目ごとのカテゴリで、質問したり、進み具合を報告したりできます。読むだけならログインは不要です。</p><a class="btn" href="#">掲示板をひらく <span class="arr">→</span></a></div>
    <div class="band-list">
      <a class="band-item reveal" href="#"><span class="t">単語帳、何周目で覚えられた？</span><span class="n">返信 12</span><span class="cat c0">英語 · 勉強法</span></a>
      <a class="band-item reveal" href="#" lang="en"><span class="t">Please check my sentence: <span class="jp">昨日、公園に走りました</span></span><span class="n">3 replies</span><span class="cat c3">Japanese · Sentence check</span></a>
      <a class="band-item reveal" href="#"><span class="t">独り言、最初の一言どうしてる？</span><span class="n">返信 8</span><span class="cat c1">英語 · スピーキング</span></a>
    </div>
  </div></section>
</div></main>
""" + footer("ja")

os.makedirs(OUT, exist_ok=True)
for old in ["01-section-top.html", "02-article.html", "03-language-switch.html"]:
    if os.path.exists(os.path.join(OUT, old)): os.remove(os.path.join(OUT, old))
for name, html in {
    "00-index.html": page("ja", "まなビレッジ — モック", index).replace("</head>", INDEX_CSS + "</head>"),
    "01-japanese-top.html": page("en", "Learn Japanese — Mock", top),
    "02-japanese-article.html": page("en", "は vs が — Mock", article, TOGGLE_JS),
    "03-english-top.html": page("ja", "英語学習のトップ — モック", switch),
}.items():
    open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n").write(html)
    print(name, len(html))
