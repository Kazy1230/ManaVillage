# topic-map(英語学習のテーマ管理表)

アウトライン以降に進んだ記事を管理する表。テーマの在庫は `inventory.csv`(`common.md` 1章)。

**状態**: `outlined` → `draft` → `published`
**主キーワード**: その記事が狙う、ただ1つの検索語。同じ主キーワードの記事を、2本作らない
**想定読者**: 仮の設定。検索データが集まったら、見直す
**ID**: 在庫の id(`E-xxxx`)
**slug**: `scripts/check-article.mjs` がこの列で記事を照合する。公開前は予定の slug を書く

最終更新: 2026-10-04(記事をすべて削除。削除した記事の一覧は `archive/deleted-articles-2026-10-04.md`)

---

## 記事一覧

| ID | slug | タイトル | 主キーワード | 検索意図 | 想定読者 | type | 状態 | ハブ |
|---|---|---|---|---|---|---|---|---|
| E-0189 | rise-vs-raise | rise と raise の違い | rise raise 違い | rise と raise の使い分けを知りたい | 初級〜中級 | general | published | 英文法・語法 |
| E-0137 | wish-subjunctive | 仮定法 I wish の使い方 | 仮定法 I wish | I wish のあとの形を、いつ・なぜそうするか知りたい | 高校生〜社会人(中級) | general | published | 英文法・語法 |
| E-0045 | extensive-reading-high-school | 高校生の英語多読 | 英語 多読 高校生 | 受験もある中で、多読をやっていいか・どうやるか知りたい | 高校生 | experience | published | 教材の選び方・進め方 |
| E-0201 | end-vs-finish | end と finish の違い | end finish 違い | 「終わる」を英語で言うとき end と finish のどちらか知りたい | 初級〜中級 | general | published | 英文法・語法 |
| E-0195 | think-vs-feel | think と feel の違い | think feel 違い | 「〜と思う」を英語で言うとき think と feel のどちらか知りたい | 初級〜中級 | general | published | 英文法・語法 |
| E-0160 | question-words-order | 疑問詞の使い方 | 疑問詞 使い方 | 疑問詞の使い方と、疑問詞を使った文の語順を知りたい | 初級 | general | draft | 英文法・語法 |
| E-0273 | make-vs-do | make と do の違い | make do 使い分け | make と do のどちらを使うか迷う | 初級〜中級 | experience | published | 英文法・語法 |
| E-0132 | relative-pronouns | 関係代名詞とは | 関係代名詞 とは | 関係代名詞が何をするものか、who / which / that をどう使い分けるか知りたい | 中学生〜高校生、やり直しの社会人 | general | published | 英文法・語法 |
| E-0123 | as-as-comparison | as ... as の使い方 | as as 使い方 | as ... as(同じくらい)と not as ... as(〜ほど…ない)の使い方を知りたい | 中学生〜高校生、やり直しの社会人 | experience | proposed | 英文法・語法 |

## ハブ(テーマのまとまり)

ハブ記事は、まとまりの記事が3〜4本たまってから作る。ハブ名は、在庫の `hub` 列にあるもの: 英単語の覚え方 / 独り言・スピーキング / 教材の選び方・進め方 / 発音・リスニング / 勉強の続け方 / 試験対策 / 英文法・語法 / 英会話フレーズ

## 近い記事と、判定(重複の注意)

| 組み合わせ | 近い点 | 判定 |
|---|---|---|
|  |  |  |

## 記録欄(統合、削除、リダイレクトの履歴)

- 2026-10-04: Kaz の指示で、記事をすべて削除(英語学習の公開済み34本・下書き10本、日本語学習2本、IT のテスト1本)。URL へのリダイレクトはしない(404 のまま)。元に戻すときは `archive/deleted-articles-2026-10-04.md` の手順
