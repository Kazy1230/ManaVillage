---
name: manavillage-weekly
description: まなビレッジの在庫(テーマの全体リスト)の見直し。検索サジェスト・Search Console のクエリ・掲示板・personal-brain から、topic-map の在庫を増やし、点数を付け直す。「在庫を見直して」「テーマを増やして」と言われたときに使う。Kaz の確認はいらない。
---

`web/content/planning/workflow.md` の 3-1 に従って、在庫(`web/content/planning/inventory.csv`、日本語学習は `web/content/planning/japanese/inventory.csv`)を見直す。**Kaz にテーマの承認は求めない**(2026-10-02 決定。Kaz が確認するのは完成した記事だけ)。

1. 在庫と topic-map を読む(初版は `node scripts/build-inventory.mjs` で作った。再実行すると作り直すので、以後は行を手で足す)
2. 材料を集める
   - personal-brain: `get_persona_core`(recentThoughts、themeIndex)、`search_persona`(theme: learning)
   - Kaz が共有した Search Console の CSV(あれば)
   - 検索サジェスト(Google の候補。`suggestqueries.google.com` を `client=firefox&hl=ja&gl=jp` で取得。日本語学習は `hl=en&gl=us`)
   - 検索結果の「他の人はこちらも質問」「関連する検索」
   - 掲示板のスレッドとコメント(Supabase の公開 API で読む)
3. 在庫にない項目を `idea` で足す。重複の判定は、ワークフロー1章の基準。勉強法は「テーマ × 読者」、似た言葉は4つの層(ワークフロー 3-1)で、漏れがないか見る
4. 需要・勝ちやすさ・穴埋めの順で点数を付け直し、次に書く順番を決める
