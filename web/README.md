# web — まなビレッジのサイト本体

Next.js 16(App Router)+ Supabase。記事は `content/<記事チーム>/articles/*.md`(english・japanese・it・philosophy・science・relationships)。

- 作業ルールと入口: [`../AGENTS.md`](../AGENTS.md)
- 構成: [`../docs/02-architecture.md`](../docs/02-architecture.md)
- 運用手順: [`../docs/03-operations.md`](../docs/03-operations.md)
- 記事制作ワークフロー: [`content/english/planning/workflow.md`](content/english/planning/workflow.md)

```bash
npm install
cp .env.example .env.local
npm run dev
```
