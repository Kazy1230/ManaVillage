---
name: manavillage-weekly
description: まなビレッジの週次テーマ選定。検索サジェスト・Search Console のクエリ・掲示板・personal-brain・topic-map から、企画カードを15〜20本作り、Kaz の承認を取る。「今週のテーマ選定」「企画カードを作って」と言われたときに使う。
---

`web/content/planning/workflow.md` の 3-1 に従って、今週の企画カードを作る。

1. `web/content/planning/topic-map.md` と `web/content/planning/cards/` の過去のカードを読む
2. 材料を集める
   - personal-brain: `get_persona_core`(recentThoughts、themeIndex)、`search_persona`(theme: learning。必要なら creative、work)
   - Kaz が共有した Search Console の CSV(あれば)
   - 検索サジェスト(Google の候補。`suggestqueries.google.com` を `client=firefox&hl=ja&gl=jp` で取得)
   - 掲示板のスレッドとコメント(Supabase の公開 API で読む)
3. `web/content/planning/cards/<年>-W<週>.md` に、カード15〜20本と、執筆キュー(直近3〜4日は固定)を書く。書式は前週のファイルに合わせる
4. 各カードを topic-map に `card` で登録し、近い記事との判定を「近い記事と、判定」の表に書く
5. Kaz に承認を求める。承認されたカードの状態を `approved` にする
