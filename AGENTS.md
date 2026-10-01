# AGENTS.md — AI エージェント向けの作業ルール

このリポジトリで作業する AI エージェント(Claude Code、Codex など)は、最初にこのファイルを読むこと。

## 読む順番

1. このファイル
2. [`docs/04-history.md`](docs/04-history.md) — これまでの経緯と、決まったこと(なぜそうなっているか)
3. [`docs/06-open-items.md`](docs/06-open-items.md) — 今残っている作業
4. 作業の種類に応じて:
   - **記事を作る・直す** → [`web/content/planning/workflow.md`](web/content/planning/workflow.md)(記事制作ワークフロー)と [`web/content/planning/topic-map.md`](web/content/planning/topic-map.md)
   - **日本語学習(英語で書く)の記事** → [`web/content/planning/japanese/workflow.md`](web/content/planning/japanese/workflow.md)(2026-10-02 確定。英語学習のワークフローとの違いだけを書いている)
   - **コードを触る** → [`docs/02-architecture.md`](docs/02-architecture.md) と `web/AGENTS.md`(Next.js 16 の注意)
   - **デプロイ・設定** → [`docs/03-operations.md`](docs/03-operations.md)
   - **見た目を変える** → [`docs/05-design.md`](docs/05-design.md)
   - **要件を確かめる** → [`docs/01-requirements.md`](docs/01-requirements.md)

## 絶対に守ること

1. **秘密情報を Git に入れない**。`web/.env.local` や API キー(`SUPABASE_SECRET_KEY`, `RESEND_API_KEY`)、`.vercel/` はコミットしない。このリポジトリは**公開**されている
2. **記事の公開(`status: published` にしてデプロイ)は、Kaz の承認後だけ**。下書きのままのデプロイは問題ない(本番には出ない)
3. **学習に関する体験談を捏造しない**。運営者の学習の方法・成果・経歴は、personal-brain または `web/content/materials/` にあるものだけ使う
4. **研究や統計は、原典で確認できたものだけ書く**。確認できなければ削る
5. **自分が書いた記事を、自分でチェックしない**。チェックは別のエージェント(別セッション)が行う(ワークフロー 3-3, 3-5)
6. 本番の DB(Supabase)や DNS、Vercel の設定を変えるときは、Kaz に確認してから
7. Kaz とのやりとりは日本語で

## 記事の作業の流れ(要約。詳細はワークフロー)

```
[毎日2本] テーマを在庫(topic-map)から選ぶ(Kaz の確認なし)
          → アウトライン(planning/outlines/)→ 企画チェック(別エージェント)
          → 本文(content/articles/<slug>.md, status: draft)とイラスト
          → node scripts/check-article.mjs <slug>(web/ で実行)
          → 本文チェック(別エージェント。差し戻しは最大2回)
          → Kaz が完成した2本を確認 → 承認されたら published にしてデプロイ → topic-map を published に
[毎日1本] 導入前の記事(topic-map の A-xx)の手直し(docs/06-open-items.md の優先順)
```

- 記事の frontmatter はワークフロー4章のテンプレート。本文の書き方(例文ボックス、運営者の体験の囲み、蛍光ペン、イラストの入れ方)はワークフローの付録
- イラスト: `web/content/illustrations/<slug>/core.mjs` に `scripts/doodle.mjs` の関数で描き、`node scripts/illustrate.mjs <slug>` で webp を書き出す
- 内部リンクは公開済みの記事だけに張る(`check-article.mjs` が確かめる)

## ツールごとのメモ

- **Claude Code**: `.claude/agents/manavillage-checker.md`(チェック用サブエージェント)、`.claude/skills/manavillage-weekly`(在庫の見直し。Kaz の確認なし)、`.claude/skills/manavillage-daily`(日次の記事作成)が使える。personal-brain(MCP)が接続されていれば、`get_persona_core` / `search_persona`(theme: `learning`)/ `get_persona_exemplars` で素材と文体を確かめる
- **その他のエージェント**: 上の `.claude/` のファイルは普通の Markdown なので、手順書として読んで同じことを行う。チェックは、執筆とは別のセッションで `manavillage-checker.md` の指示に従って行う。personal-brain に接続できない場合は `web/content/materials/` だけを素材にする

## よく使うコマンド(`web/` で実行)

```bash
npm run dev                                  # ローカル確認(下書きも表示される)
npx tsc --noEmit && npx eslint src           # 型チェックと lint
node scripts/illustrate.mjs <slug>           # 記事イラストの書き出し
node scripts/check-article.mjs <slug>        # 記事の機械チェック
npx vercel deploy --prod --yes               # 本番デプロイ(記事の公開は Kaz の承認後)
```

## Git

- ブランチは `main`。作業の区切りでコミットし、わかりやすい日本語か英語のメッセージを書く
- 生成物で Git に入れるもの: 記事、イラストの svg と webp、planning のファイル。入れないもの: `node_modules`, `.next`, `.env*`(`.env.example` を除く)、`.vercel`
