# 02 アーキテクチャ

manavillage.online の技術構成。コードを触る前に読む。

## 全体像

```
ブラウザ ──> Vercel(Next.js 16 App Router, Node.js)
               ├─ 記事: web/content/articles/*.md を実行時に読み込んで SSR
               ├─ 認証・DB: Supabase(Postgres + Auth + RLS)
               └─ 通知メール: Resend(サーバー側から送信)
```

- 記事は Git 管理の Markdown。管理画面(CMS)はない
- コメント・掲示板・プロフィールは Supabase の DB
- 本番: https://manavillage.online(`manavillage.vercel.app` と `www.` は本番ドメインへ 308 リダイレクト)

## 技術スタック

| 役割 | 使っているもの |
|---|---|
| フレームワーク | Next.js 16.3(App Router, Turbopack, React 19.2, TypeScript) |
| DB・認証 | Supabase(`@supabase/supabase-js`, `@supabase/ssr`) |
| メール | Resend(`resend`) |
| Markdown | `gray-matter`(frontmatter)+ `marked`(HTML 化) |
| イラスト生成(開発時のみ) | 自作の `scripts/doodle.mjs` + `@resvg/resvg-js`(SVG→PNG)+ `sharp`(PNG→webp) |
| ホスティング | Vercel(プロジェクト名 `manavillage`、チーム `kazy1230-s-project`) |

**Next.js 16 の注意**: 学習データの Next.js と違う点が多い(`middleware` は `proxy.ts`、`params` / `searchParams` / `cookies()` は必ず `await`、`revalidateTag` は第2引数が必要 など)。コードを書く前に `web/node_modules/next/dist/docs/` を読むこと(`web/AGENTS.md` にも書いてある)。

## ディレクトリ

```
web/
  content/
    articles/            記事の Markdown(slug = ファイル名)
    illustrations/<slug>/core.mjs, core.svg   記事イラストの描画コードと原本
    materials/           運営者の学習の素材(personal-brain のスナップショット)
    planning/            記事制作ワークフロー(workflow.md, topic-map.md, cards/, outlines/)
  public/
    illustrations/<slug>/core.webp   ワークフロー導入後の記事のイラスト
    articles/<slug>/*.svg            導入前の記事のイラスト
  scripts/
    doodle.mjs           クレヨン風の絵を描く道具箱(揺れる線、棒人間、吹き出し…)
    illustrate.mjs       content/illustrations/<slug>/*.mjs → svg、webp(幅900)、共有用の PNG(1200x630)を書き出す
    make-og.mjs          サイト共通の共有画像 public/og-default.png を作る
    check-article.mjs    記事の機械チェック(ワークフロー 3-5 のうち機械で判定できる項目)
    draw-articles.mjs    導入前の記事10本のイラスト(旧方式)
    draw-study.mjs       導入前の勉強法記事30本のイラスト(旧方式)
  src/
    proxy.ts             Supabase のセッション更新(旧 middleware)
    app/
      layout.tsx         ヘッダー・フッター・共通メタデータ
      page.tsx           トップ(最新記事のヒーロー、新着、タグ、掲示板の人気スレッド)
      actions.ts         Server Actions(ログイン、登録、コメント、スレッド作成、書き込み、ニックネーム変更 など)
      articles/          記事一覧・記事詳細(JSON-LD, canonical, OG, 関連記事, コメント)
      tags/[tag]/        タグ別一覧(記事3本未満、またはハブ記事がある場合は noindex)
      boards/            掲示板一覧(カテゴリ・新着/人気)、スレッド詳細、スレッド作成
      login, signup, reset-password, update-password, mypage
      about, operator, contact, privacy, terms   サイトの紹介・運営者・問い合わせ・プライバシーポリシー・利用規約(InfoPage 部品で共通のレイアウト)
      auth/confirm/route.ts   メールのリンク(登録確認・パスワード再設定)の受け口
      sitemap.ts, robots.ts
    lib/jsonld.ts        JSON-LD(WebSite / Organization / Person、記事の BlogPosting の著者・発行元の参照)
    lib/tags.ts          タグページの説明文(記事が3本以上のタグを中身のあるページにする)
    lib/site.ts          SNS のアカウント、タグライン、運営者名、問い合わせ先メール(変更はここだけ)
    components/          UI 部品(Discussion = コメント/返信のツリー表示と投稿フォーム など)
    lib/
      articles.ts        記事の読み込み(旧形式と新形式の frontmatter 両対応)、下書きの除外、関連記事、タグの index 判定
      queries.ts         Supabase の読み取りクエリ
      mail.ts            通知メール(Resend)
      auth.ts            getViewer / requireViewer / safeNext(オープンリダイレクト対策)
      supabase/          server / proxy / admin(秘密鍵を使う。サーバー専用)クライアント
  supabase/migrations/20260929000000_init.sql   DB スキーマと RLS(Supabase の SQL Editor で実行済み)
```

## データモデル(Supabase)

| テーブル | 中身 | 主なルール |
|---|---|---|
| `profiles` | ユーザーのニックネーム、`is_admin` | 登録時にトリガーで自動作成。本人はニックネームだけ更新できる(列単位の GRANT) |
| `comments` | 記事へのコメント(`article_slug`, `parent_id` で返信) | 誰でも閲覧、ログイン済みユーザーが本人名義で投稿。編集・削除のポリシーなし(要件どおり投稿後は固定) |
| `board_categories` | 掲示板のカテゴリ(学習者が作れる) | 名前は大文字小文字を無視して一意 |
| `threads` | スレッド。`reply_count`, `last_activity_at` はトリガーで更新 | クライアントからカウンタを書き換えられない |
| `thread_posts` | スレッドへの書き込み(`parent_id` で返信) | 返信先は同じスレッドのみ(トリガーで検証) |
| `article_comment_counts`(ビュー) | 記事ごとのコメント数 | `security_invoker` |

- `is_admin = true` のユーザーのコメントに「筆者」バッジが出る。設定は SQL Editor で行う(`docs/03-operations.md`)
- 通報・モデレーションの機能はない(要件どおり)。削除が必要なら Supabase の Table Editor で行を消す

## 認証の流れ

- 登録: `signUp`(ニックネームは `user_metadata`)→ 確認メール → `/auth/confirm?next=/mypage&token_hash=…&type=email` → セッション発行
- パスワード再設定: `resetPasswordForEmail` → メール → `/auth/confirm?next=/update-password&token_hash=…&type=recovery`
- メールテンプレートは `{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=…` 形式にしてある(別ブラウザで開いても動くように。設定内容は `docs/03-operations.md`)
- `next` パラメータは `safeNext` で同一サイト内のパスだけに制限

## 通知メール(`web/src/lib/mail.ts`)

- 記事にコメントが付いたら → 管理者(`ADMIN_EMAIL`、既定 `xenon.english@gmail.com`)
- 自分のコメント/スレッド/書き込みに返信が付いたら → その学習者(本人の操作は除く)
- 掲示板の新規スレッドと返信は、管理者には通知しない
- 送信は `after()` でレスポンスのあとに行う。`RESEND_API_KEY` が空なら送信せずログに出す
- 受信者のメールアドレスは `SUPABASE_SECRET_KEY` を使って Auth から取得(サーバー専用)

## 記事の仕組み(`web/src/lib/articles.ts`)

- frontmatter は2形式に対応
  - 新形式(ワークフロー導入後): `title, description, slug, type, status, publishedAt, primaryKeyword, searchIntent, targetReader, hub, hubTag?, tags, coreIllustration, coreIllustrationAlt, related, sources, materialsUsed`
  - 旧形式(導入前の42本): `title, date, tags, summary, keyword, phrases?, draft?`
- 下書き(`status: draft` / `draft: true`)は、本番(`NODE_ENV=production`)のサイト表示・sitemap・関連記事から除外。ローカルでは「下書き」バッジ付きで表示し、`noindex`
- 本文の独自記法: `==語句==` → 蛍光ペン。例文ボックス `<div class="example">`、運営者の体験 `<div class="voice">`(書き方は `web/content/planning/workflow.md` の付録)
- `phrases`(任意)を持つ記事が最新だと、トップのヒーローでフレーズが切り替わる
- 関連記事: frontmatter の `related` を優先し、足りない分をタグの重なりで補う
- 記事ページの並び: 本文 → コメント → 関連記事
- **リンクの埋め込みカード**(`web/src/lib/linkCards.ts`): 本文の段落やリストにリンクがあると、そのブロックの直後に、リンク先のカード(イラスト、タイトル、説明)を表示する。記事内の同じリンク先は最初の1回だけ。外部 URL は、リンクの文字とドメインだけの簡易カード

## SEO の実装

- `canonical`(全ページ)、OG タグ、Twitter の大きいカード(`summary_large_image`)
- 共有画像: サイト共通 `public/og-default.png`(`node scripts/make-og.mjs` で作る)、ワークフロー導入後の記事は `public/illustrations/<slug>/core-og.png`(`illustrate.mjs` が 1200x630 の PNG を一緒に書き出す)。導入前の記事は共通画像
- JSON-LD: トップに `WebSite` + `Organization` + `Person`(運営者)、運営者ページに `Person`、記事に `BlogPosting`(著者は運営者の `Person`、発行元は `Organization`)
- `sitemap.xml`: 公開済みの記事と、検索に出してよいタグページだけ
- タグページの `noindex`: 公開記事が3本未満、または `hubTag` にそのタグを持つハブ記事が公開済み
- 返信ゼロのスレッドは `noindex`
- `robots.txt`: `/mypage`, `/update-password`, `/auth/` を除外
- `next.config.ts` の `redirects`: `www.manavillage.online` と `manavillage.vercel.app` を本番ドメインへ

## 環境変数(値は Git に入れない。`web/.env.example` が雛形)

| 名前 | 用途 | 公開してよいか |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase のプロジェクト URL | 公開前提 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase の公開キー | 公開前提 |
| `SUPABASE_SECRET_KEY` | 通知メールの宛先取得(サーバー専用) | **秘密** |
| `NEXT_PUBLIC_SITE_URL` | メール内リンクと canonical(本番は `https://manavillage.online`) | 公開前提 |
| `RESEND_API_KEY` | 通知メールの送信 | **秘密** |
| `MAIL_FROM` | 送信元(今は `onboarding@resend.dev`) | — |
| `ADMIN_EMAIL` | コメント通知の宛先 | — |

ローカルは `web/.env.local`、本番は Vercel の Environment Variables(Production)に設定済み。

## 将来の拡張方針(2026-10-01 決定。まだ実装していない)

分野(英語学習、日本語学習、IT、音楽など)と、言語(ja / en)を、別の軸として扱う。

- **URL**: 日本語は接頭辞なし、英語だけ `/en/` を付ける。分野は URL の階層で分ける(例: `/english/...`、`/en/japanese/...`、`/it/...`、`/en/it/...`)。いまの `/articles/<slug>` は、分野を導入するときに `/english/articles/<slug>` へ 301 で移す
- **データ**: 記事の frontmatter に `section`(分野)を足す。言語は、分野ごとの設定(サイト側のファイル)か、フォルダ名(`content/articles/<section>/<lang>/`)から決める。記事ごとの `lang` は持たない。同じ内容の翻訳には、共通の `translationKey` を付けて結び、`hreflang` と言語切り替えのリンクを出す
- **絞り込み**: 一覧、タグ、sitemap、トップのヒーロー、関連記事は、分野と言語で絞る。`<html lang>` は、記事の言語で切り替える
- **運営**: `topic-map`、素材(`materials`)、ワークフロー、チェックの基準は、分野ごとに分ける。体験談の素材があるのは英語学習だけ。日本語学習・IT・音楽の記事は、一般解説と例え話(体験談なし)が中心
- **順序**: 分野を足すのは、英語学習の記事が十分に厚くなってから(分野を広げると、サイトの専門性の評価が薄まるおそれがある)。翻訳は、日本語版を先に作り、必要な記事だけ英語にする
- **日本語学習者向け(英語で書く)**: 文法解説と類義語解説が中心。例え話は使う(ワークフロー 3-4 のルール)
