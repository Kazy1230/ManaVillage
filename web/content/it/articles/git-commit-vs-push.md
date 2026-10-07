---
title: git commit と push の違い。「手元に記録」と「みんなに送る」を分けて考える
description: git commit は、変更を自分のパソコンのリポジトリに記録するコマンド。git push は、その記録をリモート(GitHub など)に送るコマンドです。add から push までの流れと、push が弾かれる理由を、公式の説明と実際の出力で整理した。
slug: git-commit-vs-push
type: general
status: published
author: kaz
publishedAt: 2026-10-05
updatedAt: ""
primaryKeyword: git commit push 違い
searchIntent: git commit と git push は何が違うのか、どの順番で使うのかを知りたい
targetReader: Git を使い始めたばかりの初心者
hub: Git
tags: [Git, 初心者, 開発ツール]
coreIllustration: core.webp
coreIllustrationAlt: 左で自分のパソコンに「commit」と書かれたノートが積まれ、右の雲(リモート)へ「push」の矢印が伸びている絵
related: []
sources:
  - 'Pro Git「Git Basics - Recording Changes to the Repository」(add、commit、-a の注意) https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository'
  - 'Pro Git「Git Basics - Working with Remotes」(push、push が拒否される場合) https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes'
  - '実機で確認: git 2.55.0(git status の「ahead of」の表示、push が rejected になる出力)'
materialsUsed: []
keyword: git push
commentPrompt: "Git で、最初に引っかかったのは、どこでしたか?"
---

「commit したのに、GitHub を開いても、何も変わっていない」

Git を使い始めた人が、一度はぶつかる場面です。commit と push は名前も似ていて、どちらも「変更を確定する」コマンドに見えます。でも、git commit と git push の違いは、仕事そのものが別だということです。

## 「commit したのに、GitHub が変わらない」のは、なぜ?

commit が記録する場所と、GitHub のある場所が、別だからです。

- ==git commit== = 変更を、自分のパソコンの中のリポジトリに記録する
- ==git push== = その記録を、リモート(GitHub など、別の場所にあるリポジトリ)に送る

Pro Git(Git の公式の解説書)は、commit を「ステージングした変更を、スナップショットとして記録する」ものと説明しています。push については、共有したい所まで進んだら、upstream(リモート)に送るコマンド、と説明しています。

![左に、自分のパソコンと「commit = 手元に記録」。右に、雲の形のリモートと「push = リモートへ送る」。2つの間に矢印](/illustrations/git-commit-vs-push/fig-1.webp)

たとえるなら、commit は「自分のノートに書き留める」こと。push は、「そのノートの内容をみんなの共有フォルダに届ける」ことです。ノートに書いただけでは、共有フォルダには何も届きません。commit だけでは GitHub に変更が出てこないのは、そのためです。

## ノートに書く前に、「何を書くか」を選ぶ

スマホで写真をだれかに送るとき、撮った写真を全部ではなく、送る写真を選びます。commit にも、同じような「選ぶ」ステップがあります。

commit に入るのは、ステージングエリアに入れた変更だけです。ステージングエリアに入れるコマンドが、`git add` です。

```bash
$ git add README
$ git commit -m "Story 182: fix benchmarks for speed"
```

Pro Git には、こう書かれています(意訳)。まだステージされていない変更は、その commit には入らない。

ノートでいえば、どのメモを今日のノートに書き留めるかを選ぶのが add、選んだメモを実際に書き留めるのが commit です。add は「ファイルをプロジェクトに追加する」というより、「この内容を、次の commit に入れる」と考えると分かりやすくなります。

## 共有フォルダに届けようとしたら、弾かれた!

みんなで使っている共有の資料を保存しようとしたら、「先にだれかが更新しています」と言われた。そんな経験はないでしょうか。Git の push でも、似たことが起きます。

commit したら、push でリモートに送ります。

```bash
$ git push origin main
```

`origin` は、リモートの名前です。`main` は、送るブランチの名前です。プロジェクトによっては、`master` など別の名前のこともあります。自分のブランチ名は、`git branch` で確認できます。

ただし、push はいつも成功するとは限りません。Pro Git によると、成功するのは、リモートへの書き込み権限があり、しかも、その間にだれも push していないときです。たとえば、あなたとだれかが同じ時期に clone して、相手が先に push したあと、あなたが push すると、あなたの push は弾かれます。

実際に、同じブランチで、相手が先に push したあとに、こちらが push すると、こう表示されます。

```bash
To (リモートの URL)
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to '…'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. ...
```

「リモートに、あなたの手元にない作業がある」と言われています。共有フォルダのたとえなら、先にだれかが新しいノートを置いていた状態です。まず相手の変更を取り込んで(fetch して、自分の作業と合わせて)から、もう一度 push します。取り込み方には、いくつかやり方があります。詳しくは、別の記事で解説します。

## commit のあとの `git status` が、教えてくれること

いま自分がどこまで進んでいるのか迷ったら、`git status` を打ちます。commit したあと、まだ push していないときは、こう表示されます。

```bash
$ git status
On branch main
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)
```

「手元の main は、リモートの main より、1つ進んでいます」という意味で、`git push` でリモートに届けるようにも教えてくれています。push すると、この表示は「up to date」(リモートと同じ)に変わります。

## commit しただけで、安心していませんか?

つまずきやすい所が2つあります。

1つ目は、commit しただけで安心してしまうことです。ローカルには記録されましたが、リモートには、まだ届いていません。パソコンが壊れたり、別のパソコンで作業したりするとき、困ります。

2つ目は、`git commit -a` の使いすぎです。

```bash
$ git commit -a -m 'Add new benchmarks'
```

`-a` を付けると、すでに追跡しているファイルの変更を、自動でステージングして、commit できます。便利ですが、Pro Git も注意しているとおり、意図しない変更まで入ってしまうことがあります。

私のおすすめ(公式の推奨ではありません)は、最初のうちは、`git add` で、何を入れるかを、自分で選ぶことです。

## まとめ

- ==commit== は、変更を手元のリポジトリに記録する
- ==push== は、その記録をリモートに送る
- 順番は、add → commit → push
- push は、先にだれかが push していると、弾かれることがある。そのときは、fetch して取り込んでから、もう一度
- 迷ったら、`git status`

commit のあとに `git status` を打つと、「ahead of」の表示で、手元とリモートの差が見えます。
