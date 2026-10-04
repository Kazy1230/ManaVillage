@AGENTS.md

## Claude Code 向けの補足

- 記事の作業では、`.claude/skills/manavillage-propose`(テーマと構成の提案)、`manavillage-review`(Kaz が貼った文章の確認・イラスト・公開)、`manavillage-weekly`(在庫の見直し)を使う。**記事の本文は Kaz が書く。Claude は書かない・直さない**
- 事実・出典の確認と、読みやすさ・薄さの指摘は、`manavillage-checker` サブエージェントに任せる。チェック担当は、記事のフォルダで科目を判断し、`common.md` とその科目の文書の項目で確認する(指摘だけ。直した文は出さない)
- 開発サーバーは `.claude/launch.json` の `web`(`npm --prefix web run dev`、ポート 3000)
