---
name: manavillage-review
description: Kaz が書いた記事の文章をチャットに貼ったときの確認と、イラスト、公開の作業。下書きとして保存し、機械チェック・事実と出典の確認・読みやすさと薄さの指摘を行い、イラストを描く。承認後に公開してデプロイする。文章は書き直さない。
---

`web/content/planning/common.md` の 2-2〜2-6 と、対象の科目の文書(英語学習 `workflow.md` / 日本語学習 `japanese/workflow.md`)に従う。**Kaz の文章の言葉は変えない。直した文を出さない。**

## Kaz が文章を貼ったとき

1. **保存**: 提案(`planning/proposals/<slug>.md`)から、どの記事かを判断し、`content/…/articles/<slug>.md` に `status: draft` で保存する。frontmatter を組み立てる(題名は Kaz が選んだもの。description は案を出し、Kaz に確かめる)。科目の文書の「書き方の約束」の変換だけを行う(例文ボックス、囲み、ルビなど)。**変えた所を、すべて報告する**。日本語学習は、ルビを付けた読みの一覧を出す
2. **機械チェック**: `web/` で `node scripts/check-article.mjs <slug>`
3. **確認**: `manavillage-checker` エージェントを起動して、事実・出典の確認と、読みやすさ・薄さの指摘をさせる(Claude 本体は、Kaz の文章を評価しない)
4. **イラスト**: サムネと、Kaz が `[図: …]` と印を付けた所の図を描く(`web/content/illustrations/<slug>/core.mjs`、`fig-1.mjs` など → `node scripts/illustrate.mjs <slug>`)。画像をチャットに送る
5. **返す**: 機械チェックの結果と、確認の指摘を、重要度の高い順(事実の誤り、確認できない主張 → わかりにくさ・薄さ・重なり)に、該当箇所の最初の数語と理由つきでまとめる。**直した文は出さない**。topic-map を `draft` にする
6. Kaz が直して貼り直したら、1〜5 を繰り返す(何度でも)

## Kaz が承認したとき

`status: published` と `publishedAt` を書き、`node scripts/check-article.mjs <slug>` が通ることを確かめ、topic-map を `published` にする。ビルド・デプロイし、本番で記事のページとサムネを確認する。完成した `.md` と画像は、チャットに送ってよい(Kaz はリモートのセッションが多く、localhost を開けない)。
