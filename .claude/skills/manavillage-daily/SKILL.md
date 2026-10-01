---
name: manavillage-daily
description: まなビレッジの今日の記事作成。在庫から英語学習1本・日本語学習1本を無作為に選び、アウトライン → 企画チェック → 本文とイラスト → 本文チェック → 下書き保存までを行い、完成した2本を Kaz に確認してもらう。「今日の記事を作って」と言われたときに使う。公開は Kaz の承認後。
---

毎日、**科目ごとに1本**(英語学習1本・日本語学習1本)。1本ごとに、**共通のルール `web/content/planning/common.md` と、その科目の文書だけ**を読んで進める。

| 科目 | 科目の文書 | テーマを選ぶ |
|---|---|---|
| 英語学習 | `web/content/planning/workflow.md` | `node scripts/pick-topic.mjs english` |
| 日本語学習 | `web/content/planning/japanese/workflow.md` | `node scripts/pick-topic.mjs japanese` |

1本ごとに(`web/` でコマンドを実行):

0. **テーマを選ぶ**: `pick-topic.mjs` で在庫から無作為に選ぶ(`common.md` 2-1)。Kaz の確認はいらない。topic-map を読んで重複するなら、在庫の行を `skip` にして選び直す。決めたら slug を在庫に書き、topic-map に行を足す
1. **アウトライン**: 科目の outlines フォルダに作る。**決まった型は使わない**。同じ科目の直近5本の見出しを読み、似すぎない構成をゼロから考える。英語学習は、personal-brain の `search_persona` と `get_persona_exemplars` で素材と文体を確かめる。topic-map の状態を `outlined` にする
2. **企画チェック**: `manavillage-checker` エージェントを起動し、アウトラインを判定させる。不合格なら直して再チェック(最大2回)。「勝てない」と判定されたら、在庫の行を `skip` にしてテーマを選び直す
3. **本文とイラスト**: 科目の記事フォルダに、科目の文書の frontmatter で書く(`status: draft`)。イラストは `web/content/illustrations/<slug>/core.mjs` に描画コードを書き、`node scripts/illustrate.mjs <slug>` で書き出す
4. **機械チェック**: `node scripts/check-article.mjs <slug>` が合格するまで直す
5. **本文チェック**: `manavillage-checker` を起動して判定させる。差し戻しは最大2回。2回で合格しなければ Kaz に判断を仰ぐ
6. **下書き保存**: topic-map の状態を `draft` にする。完成した2本を、Kaz にローカル(`npm run dev` → 記事の URL)で確認してもらう

**公開(`status: published` と `publishedAt`、デプロイ)は、Kaz の承認後だけ。**
