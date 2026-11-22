@AGENTS.md

## Claude Code 向けの補足

- 記事の作業では、`.claude/skills/manavillage-propose`(テーマと構成の提案)、`manavillage-review`(Kaz が貼った文章の確認・イラスト・公開)、`manavillage-weekly`(在庫の見直し)を使う。**記事の本文は Claude が書いてよい(Kaz は最終チェックのみ。Kaz が自分で書くときは、Kaz が明示する)**
- 記事は、Kaz へのインタビューを軸に作る(`common.md` 2-0)。インタビューの答えをもとに記事にまとめ、**`manavillage-editor`(面白くするエージェント)に通す**。事実・出典の確認と、読みやすさ・薄さの指摘が必要なときは、`manavillage-checker` サブエージェントに任せる。チェック担当は、記事のフォルダで科目を判断し、`common.md` とその科目の文書の項目で確認する(指摘を受けて、Claude が直す。差し戻しは最大2回)
- 開発サーバーは `.claude/launch.json` の `web`(`npm --prefix web run dev`、ポート 3000)

## 組織図での位置(2026-11-22〜)

このリポジトリは、まなビレッジの「まなビレッジウェブ部」。上の `C:\まなビレッジ\CLAUDE.md` が指令塔(全体の組織図と頼み方)。

| 課・チーム | 担当する場所 |
|---|---|
| サイト開発課 | `web/src`、`web/supabase`、`docs/` |
| 記事課 | `web/content/`。英語記事チーム=`english/`、日本語記事チーム=`japanese/`、哲学記事チーム=`philosophy/`、科学記事チーム=`science/`、IT記事チーム=`it/`、人間関係記事チーム=`relationships/`(各チームに `articles/` と `planning/`)。記事課の共通=`common/`(`planning/common.md`・`materials/`・`characters/`・`brand/`) |
| 記事課のツール担当 | `web/content/illustrations/` と `web/scripts/` |
| おしえて英語課 | サイト版は `web/src/app/(oshiete)`、`web/src/components/oshiete`、`web/src/lib/oshiete`、`web/src/app/api/oshiete`。企画と動画は `おしえて英語課\`(Git に入れない。`.gitignore`) |

- `.claude/` の `manavillage-checker`・`manavillage-editor`(エージェント)と、`manavillage-propose`・`manavillage-review`・`manavillage-weekly`(スキル)は、記事課の全チームで共通の担当。`weekly` は Search Console を見るので、分析部と重なる
