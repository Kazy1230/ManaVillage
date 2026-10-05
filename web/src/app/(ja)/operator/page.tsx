import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { pageAlternates } from "@/lib/articles";
import { CONTACT_EMAIL, ESTABLISHED, OPERATOR_NAME, SOCIAL } from "@/lib/site";
import { ldScript, personLd } from "@/lib/jsonld";

export function generateMetadata(): Metadata {
  return {
    title: "運営者について",
    description: "まなビレッジの運営者 Kaz と、キャラクターの白河雪菜の紹介、サイトの運営情報です。",
    alternates: pageAlternates("/operator"),
  };
}

export default function OperatorPage() {
  return (
    <InfoPage title="運営者について" otherLang="/en/operator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript({ "@context": "https://schema.org", ...personLd }) }} />
      <h2>運営者情報</h2>
      <table>
        <tbody>
          <tr><th>サイト名</th><td>まなビレッジ</td></tr>
          <tr><th>URL</th><td>https://manavillage.online</td></tr>
          <tr><th>運営者</th><td>{OPERATOR_NAME}</td></tr>
          <tr><th>開設</th><td>{ESTABLISHED}</td></tr>
          <tr><th>お問い合わせ</th><td><Link href="/contact">お問い合わせページ</Link>(メール: {CONTACT_EMAIL})</td></tr>
          <tr>
            <th>公式アカウント</th>
            <td>
              <a href={SOCIAL.instagram.url} target="_blank" rel="noopener noreferrer">Instagram</a>{" / "}
              <a href={SOCIAL.youtube.url} target="_blank" rel="noopener noreferrer">YouTube</a>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>はじめまして、Kaz です</h2>
      <p>
        まなビレッジを運営している Kaz です。英語の「勉強の方法」を考えて、みんなに伝えるのが好きで、このサイトを作りました。
      </p>

      <div className="voice">
        <span className="lbl">運営者の体験</span>
        <p>英語がいちばん伸びたと感じたのは、英文法書を1冊、単語帳を1冊、やり切ったときでした。単語帳には、文法書でカバーしきれない例外的な表現も載っていて、それを少しずつ補えたことで、英語がどんどん楽しくなりました。</p>
      </div>

      <div className="voice">
        <span className="lbl">運営者の考え</span>
        <p>勉強の方法を知っていれば、勉強は楽しくなります。読んでくれた人に、最終的に「勉強そのものを楽しんでもらいたい」と思っています。楽しければ続けられて、続けられれば、できないことはなくなっていく。そして、自分のことが少し好きになって、毎日が楽しくなる。そんな流れを、英語を通して伝えたいです。</p>
      </div>

      <h2>このサイトで伝えたいこと</h2>
      <p>
        英語のスキルだけでなく、「分からないことが起きたときの向き合い方」や「効率のよい学び方」のように、あとで役に立つ学び方も伝えたいと考えています。
        くわしい考え方は、<Link href="/about">まなビレッジとは</Link>に書いています。
      </p>

      <h2 id="yukina">白河雪菜(キャラクター)</h2>
      <p>
        白河雪菜は、まなビレッジの<strong>架空のキャラクター</strong>です。英語学習や日本語学習の記事の一部は、雪菜の語りで書いています。署名が「白河雪菜(キャラクター)」になっている記事です。
      </p>
      <p>
        のんびりしていて、ほめ上手。失敗を笑えて、あきらめが悪い。読んでくれた人といっしょに続ける、仲間のような存在です。「できた日」は、いっしょに喜びます。
      </p>
      <p>
        雪菜が語る体験談は、運営者 Kaz の実際の体験をもとにしています。実在の人物ではないので、年齢や職業などの経歴はありません。
      </p>

      <h2>ご連絡について</h2>
      <p>
        記事の内容の間違い、コメントや投稿の削除のご依頼、個人情報についてのご相談などは、<Link href="/contact">お問い合わせ</Link>からお知らせください。
      </p>
    </InfoPage>
  );
}
