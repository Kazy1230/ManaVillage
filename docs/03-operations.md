# 03 運用手順(ランブック)

## ローカルで動かす

```bash
cd web
npm install
cp .env.example .env.local   # 値は Kaz から受け取る(Supabase の API Keys 画面など)
npm run dev                  # http://localhost:3000
```

- 下書きの記事もローカルでは表示される(「下書き」バッジ付き)
- 型チェック・lint: `npx tsc --noEmit && npx eslint src`
- 本番ビルドの確認: `npx next build`(開発サーバーを止めてから)

## デプロイ(Vercel)

- **記事の公開は Kaz の承認後だけ**(`web/content/planning/workflow.md` 0章)。下書きのままなら、コードのデプロイで記事が公開されることはない
- 現在は Vercel CLI で手動デプロイしている(GitHub 連携の自動デプロイは未設定)

```bash
cd web
npx vercel deploy --prod --yes
```

- 初回は `npx vercel link --yes --project manavillage` でプロジェクトにリンクする(チーム `kazy1230-s-project`。Kaz の Vercel アカウントで実行)
- まれに Vercel 側のエラーで失敗する(`"status": "error"`)。その場合はもう一度実行する
- デプロイ後の確認例:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://manavillage.online/articles/<slug>
curl -s https://manavillage.online/sitemap.xml | grep <slug>
```

- 環境変数を変えたら再デプロイが必要。追加・更新は `npx vercel env add NAME production --force`(値は標準入力で渡す)

## Supabase の設定(済み。作り直すときの手順)

プロジェクト: `https://bicgedvqagwfxpopzaop.supabase.co`

1. SQL Editor で `web/supabase/migrations/20260929000000_init.sql` を実行する
2. Authentication → URL Configuration
   - Site URL: `https://manavillage.online`
   - Redirect URLs: `https://manavillage.online/**`、`http://localhost:3000/**`
3. Authentication → Emails → Templates(別ブラウザで開いても動く形式)
   - Confirm signup: `<a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email">登録を完了する</a>`
   - Reset Password: `<a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery">パスワードを再設定する</a>`
4. 管理者(筆者バッジ)の設定。Kaz のアカウントで登録したあと、SQL Editor で:

```sql
update profiles set is_admin = true where id = (select id from auth.users where email = '登録したメールアドレス');
```

- Supabase 標準のメール送信は1時間あたりの上限が小さい。本格運用の前に、Auth の SMTP を Resend に切り替える(未対応。`docs/06-open-items.md`)

## ドメインと DNS(お名前.com)

- ドメイン `manavillage.online` はお名前.com で管理。ネームサーバーは `01〜04.dnsv.jp`
- レコード: ルートに Vercel 指定の A レコード、`www` に Vercel 指定の CNAME。Search Console の所有権確認用の TXT レコードもここに追加した
- 旧 URL(`manavillage.vercel.app`, `www.`)は `web/next.config.ts` のリダイレクトで本番ドメインへ

## Google Search Console

- プロパティ: 「ドメイン」タイプで `manavillage.online`(DNS の TXT で確認済み)
- サイトマップ: `https://manavillage.online/sitemap.xml` を送信済み(ドメインプロパティでは、URL を全部入力する。`sitemap.xml` だけだと「無効」になる)
- 新しい記事を公開したら、URL 検査で「インデックス登録をリクエスト」する(1日の上限あり)
- 週1回、Kaz がクエリなどを共有し、ワークフロー6章の基準で見直す

## Resend(通知メール)

- API キーはローカル・Vercel とも設定済み
- 送信元は `onboarding@resend.dev`(テスト用)。この送信元は、Resend に登録したメールアドレス宛てにしか届かない
- 学習者への返信通知を届けるには、Resend で独自ドメインを認証し、`MAIL_FROM` を `まなビレッジ <noreply@独自ドメイン>` に変える(未対応)

## 記事を作る

`web/content/planning/common.md`(共通)と、科目の文書(`workflow.md` = 英語学習、`japanese/workflow.md` = 日本語学習)に従う。要点:

- テーマは、Kaz が「テーマを出して」と言ったときに、Claude が在庫から無作為に抽出して提案する。本文は Kaz が書く(2026-10-04 から。`web/content/planning/common.md`)
- Kaz が書いた文章をチャットに貼る → Claude が下書きとして保存(言葉は変えない)→ `node scripts/check-article.mjs <slug>` → 別エージェントが事実・出典の確認と読みやすさ・薄さの指摘 → Kaz が直す → 承認 → 公開してデプロイ
- イラスト: Claude が描く。`web/content/illustrations/<slug>/core.mjs`(サムネ)と `fig-1.mjs` など(本文の図)を書いて `node scripts/illustrate.mjs <slug>`
- Claude Code なら、スキル `manavillage-propose`(提案)/ `manavillage-review`(確認・イラスト・公開)/ `manavillage-weekly`(在庫の見直し)と、確認用サブエージェント `manavillage-checker`(`.claude/`)が使える

## personal-brain(素材庫)

- Kaz の考えや体験を記録している MCP サーバー。Claude Code に接続されていれば、`get_persona_core` / `search_persona`(theme: `learning`)/ `get_persona_exemplars` で読める
- 接続できない環境では `web/content/materials/`(スナップショット)を使う。**素材にない学習の体験談は書かない**

## 静的モック(参考)

- 最初期の HTML モック: `docs/archive/mock/`。一時的に `https://manavillage-mock.vercel.app`(Vercel プロジェクト `manavillage-mock`)にもデプロイした。現行サイトとは無関係
