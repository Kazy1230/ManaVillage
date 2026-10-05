import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { pageAlternates } from "@/lib/articles";
import { SITE_TAGLINE, SOCIAL } from "@/lib/site";

export function generateMetadata(): Metadata {
  return {
    title: "まなビレッジとは",
    description: "まなビレッジは、英語の勉強方法を書いた記事と、学習者どうしで助け合える掲示板のサイトです。サイトの考え方と、記事の作り方を紹介します。",
    alternates: pageAlternates("/about"),
  };
}

export default function AboutPage() {
  return (
    <InfoPage title="まなビレッジとは" otherLang="/en/about">
      <p>
        まなビレッジは、<strong>英語の勉強方法</strong>を書いた記事と、学習者どうしで<strong>つまずきを助け合える掲示板</strong>のサイトです。
      </p>
      <p className="en" style={{ fontSize: 20, color: "var(--accent)" }}>{SITE_TAGLINE}</p>

      <h2>ここでできること</h2>
      <ul>
        <li><Link href="/articles">記事</Link>を読む: 単語の覚え方、文法書の進め方、独り言でのスピーキング練習など、勉強のやり方を中心に書いています。読むだけなら、登録もログインもいりません。</li>
        <li><Link href="/boards">掲示板</Link>で質問する・答える: スレッドを立てて、みんなの知恵を借りられます。誰かの疑問に、コメントや返信で答えることもできます。</li>
        <li>記事にコメントする: 感想や質問を書くと、ほかの学習者や運営者から返事が来ることがあります。</li>
      </ul>
      <p>コメントや掲示板への書き込みには、無料の<Link href="/signup">アカウント登録</Link>が必要です。</p>

      <h2>大切にしている考え方</h2>
      <p>
        いちばん伝えたいのは、英語の知識そのものより、<strong>勉強そのものを楽しんでほしい</strong>ということです。
        勉強の方法を知ると、手ごたえが出て、勉強が楽しくなります。楽しければ続けられます。続ければ、できないことは少しずつ減っていきます。
      </p>
      <p>
        そのために、効果が低いとされるやり方を避け、少ない時間でも進める方法を、研究と運営者の経験の両方から紹介しています。
        読んだ人が、手ごたえを感じながら続けられるように、記事を書いています。
      </p>

      <h2>運営</h2>
      <p>
        まなビレッジは、運営者の <Link href="/operator">Kaz</Link> が運営しています。記事の間違いの指摘、ご意見、削除のご依頼などは、<Link href="/contact">お問い合わせ</Link>からどうぞ。
      </p>
      <p>
        公式アカウント:{" "}
        <a href={SOCIAL.instagram.url} target="_blank" rel="noopener noreferrer">Instagram</a>{" / "}
        <a href={SOCIAL.youtube.url} target="_blank" rel="noopener noreferrer">YouTube</a>
      </p>
    </InfoPage>
  );
}
