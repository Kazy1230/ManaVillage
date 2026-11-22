# 公開済みの記事の書き直し(厚みを出す)の指示書

ワークフロー導入前に公開した記事を、ワークフロー(`web/content/planning/workflow.md`)の基準に合わせて書き直す担当者(AI エージェント)向けの指示書。1人が1本を担当する。

## 読むもの(最初に)

1. `C:\まなビレッジサイト\AGENTS.md`(守ること)
2. `C:\まなビレッジサイト\web\content\planning\workflow.md`(0章、1章の素材庫と重複の判定基準、3-4 の書き方・例えのルール・小ネタのルール、4章、付録)
3. `C:\まなビレッジサイト\web\content\planning\topic-map.md`(担当記事の行と、近い記事の判定)
4. `C:\まなビレッジサイト\web\content\materials\learning-philosophy.md`(運営者の学習の素材。**ここにない学習の体験談は書かない**)
5. 担当記事 `C:\まなビレッジサイト\web\content\articles\<slug>.md`
6. 使えるなら personal-brain(`mcp__personal-brain__search_persona`、theme: `learning`。`get_persona_exemplars`)で、担当記事のテーマに関する素材と、運営者の文体を確かめる

## 目的

いまの記事は、約1,500字(中央値)と薄い。読者の疑問に、上位の記事と並ぶ厚みで答える記事にする。**水増しはしない**。同じ主張の言い換えや、長い前置きは書かない。足すのは「新しい情報」だけ。

足してよいもの:
- 各主張の具体例(例文、失敗例と正しい例の対比、つまずく場面、手順)
- 「なぜそうなのか」の説明
- よくある疑問への答え(本当に聞かれそうなものだけ)
- 確認できた研究(出典つき)
- 運営者の意見・体験(素材にあるものだけ。囲みで書く)
- 読者が次にやること

## 守ること

1. **書き直すのは、担当記事のファイルだけ**(とイラストが無い場合のイラスト)。他の記事、topic-map、コード、設定は触らない。他のエージェントが、同時に別の記事を書き直している
2. **slug、`publishedAt` は変えない**。`status: published` のまま。`updatedAt: "2026-10-01"` を足す
3. **主キーワード(`primaryKeyword`)と `hub` は変えない**。スペースで区切った語が、**title と導入(最初の `##` より前)に、すべて入る**ようにする(機械チェックが確かめる)。タイトルは、主キーワードを入れて、検索意図が伝わる言葉に書き直してよい(目安30〜40字)。どうしても主キーワードが記事の内容と合わないときは、そのまま直し、最後の報告に理由と代案を書く
4. **タグは3〜5個**。既存のタグから選ぶ: 勉強法、単語、学習研究、スピーキング、モチベーション、リスニング、文法、丁寧表現、ビジネス英語、会話、初心者、発音、留学。新しいタグは作らない
5. **本文は 2,800〜4,500字を目安**。内容が足りなければ、短くてよい(ただし2,500字未満にしかならないなら、足りない理由を最後に報告する)
6. **学習に関する体験談を捏造しない**。運営者の学習の方法・成果・経歴は、素材ファイルか personal-brain にあるものだけ。数字(点数、期間、語数、回数)を、素材にないのに書かない
7. **研究・統計は、原典(論文の要旨、出版社や学会のページなど)を WebSearch / WebFetch で確認できたものだけ**書く。`sources` に、確認した出典を「著者(年). タイトル. 掲載誌」の形で書く。確認できないものは削る。いまの記事に書いてある研究の主張も、もう一度確認する
8. **type ごとの書き方**:
   - `general`: 運営者の学習体験談を入れない。`<div class="voice">` も使わない。`materialsUsed: []`
   - `experience`: 素材にある運営者の意見・体験を、`<div class="voice"><span class="lbl">運営者の体験</span><p>…</p></div>`(意見なら `運営者の意見`)の囲みで、1つ以上入れる。`materialsUsed` に、素材ファイルの節(例: `content/materials/learning-philosophy.md §3`)や personal-brain の項目名を書く。素材に合う材料がなくて、囲みが作れないなら、type を `general` に変えてよい(最後に報告する)
9. **個人ブログに見える表現を使わない**: 「僕」「Kazです」「Kaz式」「僕の学習メモ」。運営者の話は囲みの中だけ、「運営者は〜」「私たちは〜」の形で書く。タイトルにも「Kaz式」を入れない(slug が `faq-kaz-method` の記事のように、URL に残るのは仕方ない)
10. **例えのルール**(ワークフロー 3-4): 日常のありがちな場面、仕組みと対応させる、1つの主張に1つ、たとえ話として書き、効果の裏付けに見せない、特定の属性を揶揄しない
11. **小ネタのルール**: 各節に1つ程度の、他愛のない共感の小ネタ(「〜ありますよね」)はよい。数字、資格・経歴、実在の人物・店・商品の名前、学習成果の裏付け、誰かを傷つける話は入れない。小ネタを主張の根拠にしない
12. **内部リンク**: 公開済みの**他の記事**へ、本文中に自然な流れで3本以上。1つの段落のリンクは1〜2本まで(リンクごとに埋め込みカードが出るため)。`related` にも、関連の強い記事を2〜3本。リンク先は、下の公開済みの slug だけ
13. **文体**: です・ます。説教にならず、親しみやすく。導入は短く、最初の数行で何が分かるかを示す。最後のまとめで、本文の繰り返しをしない。次にやることを示し、コメントを誘う一言で終える。絵文字は使わない
14. **見出し**: 本文は `##` から始める(h1 は title から自動で作られる)。`###` は `##` の下だけ
15. **イラスト**: 記事に既にある絵(`/illustrations/<slug>/core.webp`)は、そのまま使う。絵が無い記事は、`web/content/illustrations/<slug>/core.mjs` に描画コードを書き(書き方は `web/content/illustrations/vocabulary-memorization/core.mjs` を参考に)、`C:\まなビレッジサイト\web` で `node scripts/illustrate.mjs <slug>` を実行して作る。絵は、白い背景に、3歳児が描いたようなゆるい絵。文章を読まなくても、記事の核の概念が伝わるようにする。`coreIllustration: core.webp` と `coreIllustrationAlt` を埋め、本文にも `![alt](/illustrations/<slug>/core.webp)` で入れる
16. **description**: 90〜130字。記事ごとに固有。検索結果で、何が分かる記事かが伝わる文にする

## frontmatter(全部埋める)

```yaml
---
title: ""
description: ""
slug: <slug>
type: general | experience
status: published
publishedAt: "<もとのまま>"
updatedAt: "2026-10-01"
primaryKeyword: "<もとのまま>"
searchIntent: "<もとのまま。必要なら少し直す>"
targetReader: "<もとのまま>"
hub: "<もとのまま>"
tags: [3〜5個]
coreIllustration: core.webp
coreIllustrationAlt: ""
related: [2〜3個の slug]
sources: []
materialsUsed: []
keyword: "<もとのまま。カードに大きく出る短い英語>"
phrases: (もとにあれば、そのまま残す)
---
```

## 本文の書き方(記法)

- 蛍光ペン: `==語句==`
- 例文ボックス: `<div class="example"><span class="lbl">EXAMPLE</span><span class="en">英文(<mark class="hl">強調</mark>)</span><span class="ja">日本語訳</span></div>`。間違い例は `class="example ng"`、`EXAMPLE` を `NG` に
- 運営者の体験・意見(experience のみ): `<div class="voice"><span class="lbl">運営者の体験</span><p>…</p></div>`
- 表、箇条書き、番号つきリストは使ってよい

## 終わる前に

1. `C:\まなビレッジサイト\web` で `node scripts/check-article.mjs <slug>` を実行し、**合格(終了コード0)になるまで直す**
2. 次の点を自分で読み返す: 同じことを言い換えた段落がないか、体験談が素材の範囲か、研究が確認済みか、リンク先が公開済みか
3. **最終報告**(200字以内): 本文の字数、足した主な内容、確認した出典(URL)、迷った点(主キーワードが合わない、type を変えたなど)

## 公開済みの記事の slug(内部リンクに使える)

why-research, vocab-first, highlighter-myth, example-sentences, which-first, mumble-commute, retrieval-practice, rip-the-pages, study-abroad, tough-times, grammar-book-one-month, image-not-japanese, 5-minute-gaps, communication-skill, vocab-900-rotation, myth-list, self-talk-beginners, spaced-review, adults-restart, dont-write-to-memorize, fun-youtube, toeic-vocab, context-memory, mistakes-ok, one-book-mastery, parents-kids, money-vs-learning, enjoy-learning, faq-kaz-method, self-talk, asking-permission, linking-sounds, vocabulary-memorization, skip-what-you-dont-understand

(下書きの記事 how-are-you, me-too-me-neither, see-look-watch, by-until, polite-no, would-like, maybe-probably, a-and-the, l-and-r, english-diary には、リンクしない)
