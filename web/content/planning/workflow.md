# 英語学習(日本語で書く)の記事制作ルール

日本語話者に向けて、英語の勉強方法・英文法・似た言葉・フレーズ・試験対策を書く記事(`/articles/...`)のルール。
**共通のルール(流れ、重複の判定、例え話と小ネタ、共通のチェック項目)は `planning/common.md`**。記事を作るときは、`common.md` とこの文書の2つを読む。

---

## 0. 読者と書き方

- 読者: 英語を学ぶ日本語話者。中学生〜社会人、初心者〜上級者まで。記事ごとに想定読者を決める
- 文体: です・ます。説教的でなく、親しみやすく。絵文字は使わない
- 分量: **5,000字を目安**。内容が足りないなら、水増しせず短くてよい
- 「Kazです」「僕」「Kaz式」「僕の学習メモ」のような、個人ブログに見える表現は使わない。運営者の話は、囲みの中だけ「運営者は〜」の形で書く

## 1. 素材庫(personal-brain)と、記事の type

英語学習は、運営者(Kaz)の学習体験を使える科目。素材の一次ソースは personal-brain(MCP サーバー)。

- **企画のとき**: `get_persona_core` で `recentThoughts` と `themeIndex` を確認する。`search_persona`(theme: `learning`。必要なら `creative`、`work`)で、関連する考えや体験を取る
- **執筆の前**: 記事のテーマで `search_persona` を呼ぶ。`get_persona_exemplars` で、Kaz の文体を確かめる
- **`content/materials/`**: personal-brain のスナップショット。personal-brain に接続できない環境でも作業できるようにするためのもの
- **検索して見つからない学習の体験談は使わない**。その場合は一般的な内容で書く
- **使ってよい素材**: 学習方法、英語学習の体験と考え方だけ。恋愛、人間関係、お金、健康、仕事の愚痴など、学習と関係のない私的な内容は使わない
- **個人の意見と一般的な事実を分ける**: 「マーカーは無駄」のような個人の方法論は、「運営者の意見・体験」として書く。一般的に「効果がある」と書くときは、根拠を確認する

| type | 内容 | 運営者の学習体験談 |
|---|---|---|
| `general` | 一般向けの解説記事 | 入れない |
| `experience` | 解説 + 運営者の学習体験談 | 素材庫にあるものだけ、囲みで入れる |

- 囲み: `<div class="voice"><span class="lbl">運営者の体験</span><p>…</p></div>`(意見なら `運営者の意見`)
- 素材庫に合う材料がなければ `general` にする

## 2. 在庫の中身

`planning/inventory.csv`。分類: 勉強法、勉強法(読者別)、試験、英文法、似た言葉(4つの層)、前置詞・句動詞。テーマの選び方は `common.md` 2-1(無作為)。

## 3. 企画チェックで足す項目

`common.md` 2-3 に加えて:

- [ ] 体験談を使う場合、素材庫(personal-brain、`content/materials/`)に該当する材料が実在するか(実際に検索して確かめる)
- [ ] 読者違いの記事なら、`common.md` 2-1 の2つの条件(検索の言葉が違う、中身が3つ以上変わる)を満たすか
- [ ] 似た言葉の記事なら、層(①〜④)と、「機能のハブ/比較/1つの言い方」のどれかがはっきりしていて、同じ層の他の記事と重ならないか

## 4. 本文チェックで足す項目

`common.md` 2-6 に加えて:

- [ ] 学習に関する体験談(方法、成果、経歴、数字)が、すべて personal-brain または `content/materials/` にあるか(1つずつ検索して確かめる)
- [ ] 個人の意見や方法論が、一般的な事実のように書かれていないか(「運営者の意見・体験」の囲みに入っているか)
- [ ] 学習と関係のない私的な内容が入っていないか
- [ ] `general` の記事に「運営者の体験」の囲みがないか。`experience` の記事に1つ以上あるか
- [ ] 英文の例文と、その日本語訳が正しく、自然か
- [ ] 個人ブログに見える表現(「僕」「Kaz式」など)がないか

## 5. 機械チェック(`check-article.mjs` が見る項目)

- frontmatter: 必須の項目、slug とファイル名の一致、type と status の値、公開済みなら publishedAt、`experience` なら materialsUsed
- description: 90〜150字(外れると「要確認」)
- タグ: 3〜5個。新しいタグは「要確認」。主キーワードをそのままタグにしていないか
- title と description が、他の記事と同じでないか
- 見出し: h1 がない、h2 より前に h3 がない、階層が飛んでいない
- 画像: alt、ファイルの存在。サムネ(`core.webp`)を本文に書いていたら不合格(タイトルの下に自動で出るため)
- 内部リンク(`/articles/<slug>`): 2本以上、リンク先と related が公開済みか
- 主キーワードの語が、title と導入(最初の h2 より前)にすべて入っているか
- 本文が2,500字未満なら「要確認」。「Kazです」「僕の学習メモ」「Kaz式」がないか。「僕」は「要確認」
- `experience` に `voice` の囲みがあるか。`general` に `voice` がないか
- topic-map に行があり、主キーワードが一致しているか。他の記事と主キーワードが重なっていないか

## 6. frontmatter

```yaml
---
title: ""              # 記事ごとに固有。検索意図が伝わる言葉と、主キーワードを入れる
description: ""        # 記事ごとに固有。120字前後
slug: ""               # 短い英語のスラッグ。科目をまたいで重複させない
type: general          # general / experience
status: draft          # draft / published
publishedAt: ""
updatedAt: ""          # 書き直したとき
primaryKeyword: ""     # ただ1つの検索語。topic-map と一致させる
searchIntent: ""
targetReader: ""
hub: ""                # topic-map のハブ名
tags: []               # 既存のタグから3〜5個
coreIllustration: core.webp
coreIllustrationAlt: ""
related: []            # 公開済みの記事の slug(2〜3本)
sources: []            # 確認した出典「著者(年). タイトル. 掲載誌」
materialsUsed: []      # 使った素材(experience では必須)
keyword: ""            # カードに大きく出る短い英語
phrases: []            # 任意。最新記事のときトップで切り替わるフレーズ(key / rest / ja)
---
```

---

## 付録: manavillage.online での実装

### 置き場所

| 項目 | このサイト |
|---|---|
| 記事 | `web/content/articles/<slug>.md` |
| イラスト | `web/content/illustrations/<slug>/` に描画コードを置く。サムネは `core.mjs`、本文の図は `fig-1.mjs` のように好きな名前で何枚でも。`node scripts/illustrate.mjs <slug>` で、全部の `.svg`(原本)と `web/public/illustrations/<slug>/<名前>.webp`、`<名前>-og.png` を書き出す |
| アウトライン | `web/content/planning/outlines/<slug>.md` |
| チェックエージェント | `.claude/agents/manavillage-checker.md`(執筆したセッションとは別に起動する) |

### コマンド(`web/` で実行)

- テーマを選ぶ: `node scripts/pick-topic.mjs english`
- イラストの書き出し: `node scripts/illustrate.mjs <slug>`
- 機械チェック: `node scripts/check-article.mjs <slug>`
- ローカル確認: `npm run dev` → http://localhost:3000/articles/<slug>(下書きには「下書き」バッジが出る)

### 本文の書き方

- h1 は title から自動で作られる。本文は `##` から始める
- サムネ(`core.webp`): 本文には書かない。frontmatter の `coreIllustration` と `coreIllustrationAlt` を埋めると、記事ページのタイトルの下に自動で出る
- 本文のイラスト: 必要なところに `![図が伝える内容](/illustrations/<slug>/fig-1.webp)`
- 例文ボックス: `<div class="example"><span class="lbl">EXAMPLE</span><span class="en">英文(<mark class="hl">強調</mark>)</span><span class="ja">日本語訳</span></div>`(間違い例は `class="example ng"`、ラベルは `NG`)
- 蛍光ペン: `==語句==`
- 内部リンク: `[記事タイトル](/articles/<slug>)`。公開済みの記事だけ。リンクを張ると段落の直後に埋め込みカードが出るので、1段落のリンクは1〜2本まで
- 追加の frontmatter `hubTag`(任意): ハブ記事にだけ付ける。そのタグのタグページは、ハブ記事の公開後に `noindex` になる
- 旧形式の記事(`date` / `summary` / `draft`)も読める
