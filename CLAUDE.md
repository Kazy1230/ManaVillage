@AGENTS.md

## Claude Code 向けの補足

- 記事の作業では、`.claude/skills/manavillage-weekly`(在庫の見直し)と `.claude/skills/manavillage-daily`(日次の記事作成)を使う
- 企画チェックと本文チェックは、`manavillage-checker` サブエージェントを起動して行う(執筆したコンテキストでは判定しない)
- 開発サーバーは `.claude/launch.json` の `web`(`npm --prefix web run dev`、ポート 3000)
