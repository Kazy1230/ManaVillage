---
title: git fetch と pull の違い。「取ってくる」だけか、「取り込む」までか
description: git fetch は、リモートの更新を手元に取ってくるだけのコマンド。git pull は、fetch したあとに、自分のブランチへ取り込む(マージする)ところまでやるコマンドです。実機で確かめた出力と、pull が止まる場面も見ながら、使い分けを整理します。
slug: git-fetch-vs-pull
type: general
status: draft
author: kaz
publishedAt: ""
updatedAt: ""
primaryKeyword: git fetch pull 違い
searchIntent: git fetch と git pull は何が違うのか、どちらを使えばいいのかを知りたい
targetReader: Git を使い始めたばかりの初心者
hub: Git
tags: [Git, 初心者, 開発ツール]
coreIllustration: core.webp
coreIllustrationAlt: 左で雲のリモートから荷物を受け取って玄関に置く(fetch)。右でその荷物を部屋の中まで運び入れる絵(pull)
related: [git-commit-vs-push]
sources:
  - 'Pro Git「Git Basics - Working with Remotes」(fetch、pull、追跡ブランチ、pull.rebase) https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes'
  - '実機で確認: git 2.55.0(fetch の前後の git status、git log main..origin/main、git diff main...origin/main、git merge、git pull、設定がないときの pull の停止)'
materialsUsed: []
keyword: git fetch
---

友だちから、メッセージが届きます。「共有フォルダに、新しい資料を入れたよ」。

でも、自分のパソコンにある資料は、まだ古いまま。自分から、取りに行かなければ、新しい資料は手元に来ません。

Git でも、まったく同じことが起きます。

だれかが、リモートに更新を push しても、Git は、それを**勝手には教えてくれません**。自分から、取りに行く必要があります。

そのためのコマンドが、**git fetch** と **git pull** の2つです。

「どっちを使えばいいの?」と、手が止まったことはありませんか。

実際に動かした出力を見ながら、2つの違いをつかんでいきましょう。

## 取りに行くまで、Git は更新を知らない

先に、こんな場面を見てください。相手が先に push したあとで、自分の `git status` を見ます。

```bash
$ git status
On branch main
Your branch is up to date with 'origin/main'.
```

「リモートと同じ」と言っています。でも、リモートには、すでに新しい更新が入っています。

どういうことでしょう。

`origin/main` は、リモートの main を、**最後に取りに行った時点の姿**で、手元に記録したものです。取りに行くまで、この記録は、古いままです。だから、`git status` は、「同じ」と答えてしまいます。

そこで、取りに行くコマンドが、fetch です。

```bash
$ git fetch
From (リモートの URL)
   2199620..a795d69  main       -> origin/main
```

Pro Git(Git の公式の解説書)は、fetch を、リモートのプロジェクトから、**まだ持っていないデータを、すべて取ってくる**コマンドと説明しています。

そのあとの `git status` は、こう変わります。

```bash
$ git status
On branch main
Your branch is behind 'origin/main' by 1 commit, and can be fast-forwarded.
  (use "git pull" to update your local branch)
```

「1つ遅れています」。fetch したことで、はじめて、遅れていることが分かりました。

![左に、雲の形のリモートから荷物が届く絵と「fetch = 取ってくる」。荷物は、玄関に置かれたまま。右に、荷物を部屋の中に運び入れる絵と「pull = 取り込む」](/illustrations/git-fetch-vs-pull/fig-1.webp)

荷物でいえば、宅配便を受け取って、**玄関に置いた**状態です。家(手元)には届いています。でも、部屋(自分のブランチ)には、まだ入っていません。

## 玄関の荷物は、開ける前に中身を見られる

fetch の、いいところが、ここです。

荷物が玄関にあるうちは、部屋は何も変わっていません。だから、取り込む前に、**中身を確認**できます。

何が届いたかは、こう見られます。

```bash
$ git log main..origin/main --oneline
a795d69 Add a line to README
```

「手元の main にはなくて、origin/main にはある commit」の一覧です。1つ届いている、と分かります。

変更の中身を見たいときは、`git diff` です。

```bash
$ git diff main...origin/main
```

```diff
 hi
+bob line
```

README に、1行追加されている、と分かりました。

## 玄関の荷物を、部屋に入れる

中身を見て、「取り込んで大丈夫」と思ったら、部屋に運び入れます。`git merge` です。

```bash
$ git merge origin/main
Updating 2199620..a795d69
Fast-forward
 README | 1 +
 1 file changed, 1 insertion(+)
```

取り込んだあとの `git status` は、こうなります。

```bash
$ git status
On branch main
Your branch is up to date with 'origin/main'.
```

手元の main が、origin/main に追いつきました。

## pull は、この2つを、1つにしたもの

では、pull は何をするのでしょう。

Pro Git によると、pull は、現在のブランチがリモートのブランチを追跡しているとき、**自動で fetch して、さらにマージまでやる**コマンドです。

ふつうの設定では、こう言えます。

**git pull = git fetch + git merge**

実際の出力を見てみます。先ほどとは別の場面で、fetch せずに、いきなり pull したときです。

```bash
$ git pull
From (リモートの URL)
   a795d69..709ba75  main       -> origin/main
Updating a795d69..709ba75
Fast-forward
 README | 1 +
 1 file changed, 1 insertion(+)
```

上の2行(From と矢印)が、fetch の部分です。下の3行が、merge の部分です。**fetch して、取り込むまで**を、1回でやってくれました。

荷物でいえば、受け取って、そのまま部屋まで運び入れてくれた、というわけです。

## pull が、止まる日

ただし、pull が、いつもすんなり進むとは限りません。

自分の手元にも、まだ push していない commit があるとき、リモートにも、新しい commit が入っていると、どうなるでしょう。

荷物でいえば、部屋の中にも、自分の荷物があって、そこへ新しい荷物が届く、という状態です。Git は、「どう合わせるか」を、決めなければなりません。

設定を何もしていない状態で pull すると、こう止まります。

```bash
$ git pull
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint:
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
...
fatal: Need to specify how to reconcile divergent branches.
```

「どうやって合わせるか、指定してください」と言っています。merge で合わせるのか、rebase で合わせるのか。ここは、初心者が、いちばんつまずきやすい所です。

## 結局、どっちから使えばいい?

ここまで見てきて、使い分けは、こうなります。

**まず fetch して、中身を見て、取り込む**。これが、いちばん安全な、基本の形です。

fetch は、自分のブランチを**変えません**。何が届いたか、見てから決められます。

pull は、その近道です。便利ですが、取り込む前に、**中身を見る機会がありません**。さっきの「止まる日」のように、思わぬ形で、止まることもあります。

慣れるまでは、`git fetch` → `git log main..origin/main` → `git merge origin/main` の順で、1つずつ進めてみてください。自分の手元で、いま何が起きているか、よく分かります。

push が rejected されたときも、同じです。[git commit と push の違い](/it/articles/git-commit-vs-push)で書いたように、まず fetch して、中身を見て、取り込んでから、もう一度 push します。

## 今日、持って帰ってほしいこと

- Git は、リモートの更新を、**取りに行くまで知らない**(fetch するまで、`git status` は「同じ」と答える)
- ==fetch== は、リモートの更新を手元に取ってくるだけ。自分のブランチは、変わらない
- ==pull== は、ふつうの設定では、**fetch + merge**。取り込みまでやる
- 基本は、**fetch → 中身を見る → 取り込む**。pull は、その近道
- 手元にも commit があるときの pull は、止まることがある

今日、リモートに更新があるかを、**pull の代わりに、fetch で**確かめてみませんか。

`git status` が「behind」と教えてくれたら、荷物は、玄関に届いています。
