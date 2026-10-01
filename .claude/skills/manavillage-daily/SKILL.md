---
name: manavillage-daily
description: まなビレッジの今日の記事作成。在庫(topic-map)から2本選び、アウトライン → 企画チェック → 本文とイラスト → 本文チェック → 下書き保存までを行い、完成した2本を Kaz に確認してもらう。「今日の記事を作って」と言われたときに使う。公開はしない。
---

`web/content/planning/workflow.md` の 3-2〜3-6 と付録に従う。1日2本(執筆キューの順)。

1本ごとに:

0. **テーマを選ぶ**: 在庫(topic-map)の `idea` から、点数の高い順に2本選ぶ(ワークフロー 3-1)。Kaz の確認はいらない
1. **アウトライン**: `web/content/planning/outlines/<slug>.md` に作る。作る前に topic-map を再確認し、personal-brain の `search_persona` と `get_persona_exemplars` で素材と文体を確かめる。状態を `outlined` にする
2. **企画チェック**: `manavillage-checker` エージェントを起動し、アウトラインを判定させる。不合格なら直して再チェック
3. **本文とイラスト**: `web/content/articles/<slug>.md` を 4章のテンプレートで書く(`status: draft`)。イラストは `web/content/illustrations/<slug>/core.mjs` に描画コードを書き、`node scripts/illustrate.mjs <slug>` で書き出す
4. **機械チェック**: `node scripts/check-article.mjs <slug>` が合格するまで直す
5. **本文チェック**: `manavillage-checker` を起動して判定させる。差し戻しは最大2回。2回で合格しなければ Kaz に判断を仰ぐ
6. **下書き保存**: topic-map の状態を `draft` にする。完成した2本を、Kaz にローカル(`npm run dev` → 記事の URL)で確認してもらう。承認されたら `published` にしてデプロイする

**既存記事の手直し(1日1本)**: 新しい記事2本のあとに、ワークフロー導入前の記事(topic-map の A-xx)を1本、新しい frontmatter と書き方のルールに合わせて直す。優先順は、topic-map の「近い記事と、判定」で要注意・更新とした記事(A-22 と A-33 の差別化、A-24 の書き直し、A-30 の更新)→ 公開中で「僕」「Kaz式」を使っている記事。直したら `check-article.mjs` と `manavillage-checker` の本文チェックを通し、下書きの新記事と一緒に Kaz のレビューに出す。

**公開(`status: published` とデプロイ)は、Kaz の承認後だけ。**
