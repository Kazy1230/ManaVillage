import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { pageAlternates } from "@/lib/articles";
import { CONTACT_EMAIL } from "@/lib/site";

export function generateMetadata(): Metadata {
  return {
    title: "お問い合わせ",
    description: "まなビレッジへのお問い合わせ先です。記事の間違いの指摘、投稿の削除のご依頼、個人情報についてのご相談などを受け付けています。",
    alternates: pageAlternates("/contact"),
  };
}

export default function ContactPage() {
  return (
    <InfoPage title="お問い合わせ" otherLang="/en/contact">
      <p>まなビレッジへのご連絡は、次のメールアドレスで受け付けています。</p>

      <div className="example" style={{ gap: 8 }}>
        <span className="lbl">MAIL</span>
        <span style={{ fontSize: 20, fontWeight: 700, overflowWrap: "anywhere", userSelect: "all" }}>{CONTACT_EMAIL}</span>
        <span className="ja"><a href={`mailto:${CONTACT_EMAIL}`}>メールアプリで開く</a>(開かないときは、上のアドレスをコピーして送ってください)</span>
      </div>

      <h2>こんなときにご連絡ください</h2>
      <ul>
        <li>記事の内容に、間違いや分かりにくい所があったとき</li>
        <li>コメントや掲示板の投稿で、困ったことや不適切なものを見つけたとき</li>
        <li>自分の投稿やアカウントの削除を希望するとき(<Link href="/privacy">プライバシーポリシー</Link>も参照)</li>
        <li>個人情報の開示・訂正・利用停止を希望するとき</li>
        <li>サイトの不具合を見つけたとき</li>
      </ul>

      <h2>ご連絡のときのお願い</h2>
      <ul>
        <li>アカウントや投稿についてのご連絡では、登録したメールアドレスとニックネーム、対象のページの URL を書いていただくと、確認がスムーズです。</li>
        <li>お返事までに、お時間をいただくことがあります。</li>
        <li>内容によっては、お返事できない場合があります。</li>
      </ul>
    </InfoPage>
  );
}
