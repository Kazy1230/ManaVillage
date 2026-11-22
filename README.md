# まなビレッジ(ManaVillage)

英語学習の記事と、学習者どうしが学び合える掲示板のサイト。

- 本番: https://manavillage.online
- 運営者: Kaz
- 状態(2026-10-01): 公開中。記事34本(勉強法が中心)+ 下書き10本。記事制作ワークフローで1日2本ずつ追加中

## このリポジトリの中身

| 場所 | 中身 |
|---|---|
| [`AGENTS.md`](AGENTS.md) | **AI エージェント向けの作業ルールと入口。最初に読む** |
| [`docs/`](docs/README.md) | 要件、アーキテクチャ、運用手順、これまでの経緯、デザイン、残作業 |
| [`web/`](web/) | サイト本体(Next.js 16 + Supabase)。記事の Markdown も `web/content/<記事チーム>/articles/` にある |
| [`web/content/<記事チーム>/planning/`](web/content/english/planning/) | 記事チームごとの記事制作ワークフロー(指示書、テーマ管理表、企画カード、アウトライン)。english・japanese・philosophy・it・science・relationships |
| [`web/content/common/planning/`](web/content/common/planning/) | 記事課の共通のルール(`common.md`)と、掲示板の最初のスレッド案 |
| [`web/content/common/materials/`](web/content/common/materials/) | 運営者の英語学習の素材(記事の体験談はここにあるものだけ使う) |
| [`.claude/`](.claude/) | Claude Code 用のサブエージェント(記事チェック)とスキル(週次のテーマ選定、日次の記事作成) |

## すぐ動かす

```bash
cd web
npm install
cp .env.example .env.local   # 値は運営者から受け取る(秘密鍵は Git に入れない)
npm run dev                  # http://localhost:3000
```

デプロイ、Supabase、ドメイン、Search Console などは [`docs/03-operations.md`](docs/03-operations.md) を参照。
