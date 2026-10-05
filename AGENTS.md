# AGENTS.md — AI エージェント向けの作業ルール

このリポジトリで作業する AI エージェント(Claude Code、Codex など)は、最初にこのファイルを読むこと。

## 読む順番

1. このファイル
2. [`docs/04-history.md`](docs/04-history.md) — これまでの経緯と、決まったこと(なぜそうなっているか)
3. [`docs/06-open-items.md`](docs/06-open-items.md) — 今残っている作業
4. 作業の種類に応じて:
   - **記事を作る・直す** → 共通のルール [`web/content/planning/common.md`](web/content/planning/common.md) と、その科目の文書だけを読む
     - 英語学習(日本語で書く): [`web/content/planning/workflow.md`](web/content/planning/workflow.md)
     - 日本語学習(英語で書く): [`web/content/planning/japanese/workflow.md`](web/content/planning/japanese/workflow.md)
   - **コードを触る** → [`docs/02-architecture.md`](docs/02-architecture.md) と `web/AGENTS.md`(Next.js 16 の注意)
   - **デプロイ・設定** → [`docs/03-operations.md`](docs/03-operations.md)
   - **見た目を変える** → [`docs/05-design.md`](docs/05-design.md)
   - **要件を確かめる** → [`docs/01-requirements.md`](docs/01-requirements.md)

## 絶対に守ること

1. **秘密情報を Git に入れない**。`web/.env.local` や API キー(`SUPABASE_SECRET_KEY`, `RESEND_API_KEY`)、`.vercel/` はコミットしない。このリポジトリは**公開**されている
2. **記事の本文は、Claude が書いてよい**(2026-10-04 に Kaz が許可。Kaz は最終チェックをする。Kaz が自分で書きたいときは、Kaz が明示する)。著者は Kaz と、キャラクター「白河雪菜」の二人(`web/content/planning/common.md` 5章。雪菜はアンバサダーだと読者に明記する)。**体験談は、どの著者の記事でも、Kaz の本当の体験だけ**(雪菜は、それを雪菜の話として語り直す。設定は `web/content/characters/shirakawa-yukina/profile.md`)。personal-brain と `web/content/materials/` に記録がなければ、作らずに Kaz に質問する(`common.md` 2-1b)。**Kaz の記事に、記録にない気持ち・見解・数字を足さない**
3. **記事の公開(`status: published` にしてデプロイ)は、Kaz の承認後だけ**。下書きのままのデプロイは問題ない(本番には出ない)。**体験談を、エージェントが作ることはしない**。記録にないときは、Kaz に質問して、答えを personal-brain に記録する
4. **研究や統計、文法の説明は、原典で確認できたものだけを根拠にする**。確認できなければ、そう伝える(Kaz が書いた主張でも、確認できないものは指摘する)
5. **記事の編集(面白くする)は、別のエージェント(`manavillage-editor`)に任せる**(2026-10-05〜)。記事の評価を Claude 本体がしない。事実・出典の確認は、提案のときに Claude が出典を開いて済ませる。`manavillage-checker`(確認専用)は、Kaz が頼んだときと、編集で事実の記述が変わったときに使う
6. 本番の DB(Supabase)や DNS、Vercel の設定を変えるときは、Kaz に確認してから
7. Kaz とのやりとりは日本語で

## 記事の作業の流れ(要約。詳細は `web/content/planning/common.md`)

```
Kaz:「テーマを出して」
  ① Claude: 在庫から無作為に抽出(node scripts/pick-topic.mjs <english|japanese>)→ 上位記事と出典を調べ、概要と構成案を出す   [skill: manavillage-propose]
  ② Claude: その概要をもとに、Kaz への質問(5〜8問)を考える
  ③ Kaz: 質問に答える(インタビュー)。答えは personal-brain に記録し、提案ファイルに貼る
  ④ Claude: 答えを軸に、記事にまとめる(元のテーマから逸れない)→ 機械チェック(check-article.mjs)     [skill: manavillage-review]
  ⑤ manavillage-editor(面白くするエージェント)に通す。事実と出典は変えない
  ⑥ Claude: イラストを描き、本文・画像・編集者の報告をチャットに送る → Kaz が確認・承認
  ⑦ 公開してデプロイする
```

- 記事の frontmatter と、Kaz の書き方の約束(例文、囲み、ルビなど)は、科目の文書に書いてある
- イラスト: `web/content/illustrations/<slug>/core.mjs`(サムネ)と `fig-1.mjs` など(本文の図)を `scripts/doodle.mjs` の関数で描き、`node scripts/illustrate.mjs <slug>` で webp を書き出す
- 内部リンクは公開済みの記事だけに張る(`check-article.mjs` が確かめる)

## ツールごとのメモ

- **Claude Code**: `.claude/agents/manavillage-editor.md`(面白くする編集者。記事を直してよい)、`.claude/skills/manavillage-propose`(テーマと構成の提案、インタビュー)、`.claude/skills/manavillage-review`(貼られた文章の確認・イラスト・公開)、`.claude/skills/manavillage-weekly`(在庫の見直し)、`.claude/agents/manavillage-checker.md`(確認用のサブエージェント)が使える。personal-brain(MCP)が接続されていれば、提案のときに `get_persona_core` / `search_persona`(theme: `learning`)で、Kaz の過去の考えや体験を探して示す
- **その他のエージェント**: 上の `.claude/` のファイルは普通の Markdown なので、手順書として読んで同じことを行う。確認は、別のセッションで `manavillage-checker.md` の指示に従って行う

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
