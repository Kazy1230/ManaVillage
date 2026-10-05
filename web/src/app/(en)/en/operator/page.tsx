import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { pageAlternates } from "@/lib/articles";
import { ldScript, personLd } from "@/lib/jsonld";
import { CONTACT_EMAIL, OPERATOR_NAME, SOCIAL } from "@/lib/site";

export function generateMetadata(): Metadata {
  return {
    title: "About the operator",
    description: "About Kaz, who runs Mana Village, our ambassador Yukina Shirakawa, and information about the site.",
    alternates: pageAlternates("/operator", "en"),
  };
}

// 日本語版(/operator)の英訳。運営者の体験・考えは、日本語版にあるものだけを訳す(足さない)
export default function OperatorPage() {
  return (
    <InfoPage title="About the operator" lang="en" otherLang="/operator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript({ "@context": "https://schema.org", ...personLd }) }} />
      <h2>Site information</h2>
      <table>
        <tbody>
          <tr><th>Site name</th><td>Mana Village (まなビレッジ)</td></tr>
          <tr><th>URL</th><td>https://manavillage.online</td></tr>
          <tr><th>Operator</th><td>{OPERATOR_NAME}</td></tr>
          <tr><th>Launched</th><td>September 2026</td></tr>
          <tr><th>Contact</th><td><Link href="/en/contact">Contact page</Link> (email: {CONTACT_EMAIL})</td></tr>
          <tr>
            <th>Official accounts</th>
            <td>
              <a href={SOCIAL.instagram.url} target="_blank" rel="noopener noreferrer">Instagram</a>{" / "}
              <a href={SOCIAL.youtube.url} target="_blank" rel="noopener noreferrer">YouTube</a>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Hi, I’m Kaz</h2>
      <p>
        I run Mana Village. I love thinking about <em>how</em> to learn and sharing it with others, so I built this site.
      </p>

      <p>
        When you know how to learn, learning becomes fun. What I hope for, in the end, is that readers come to enjoy learning itself. When it’s fun, you can keep going; when you keep going, the things you can’t do slowly disappear. You start to like yourself a little more, and every day becomes more enjoyable.
      </p>

      <h2>What I want to share</h2>
      <p>
        Not just skills, but ways of learning that help later — how to face something you don’t understand, and how to learn efficiently.
        You can read more on the <Link href="/en/about">About Mana Village</Link> page.
      </p>

      <h2 id="yukina">Yukina Shirakawa (Ambassador)</h2>
      <p>
        Yukina Shirakawa is an <strong>ambassador</strong> of Mana Village. Some of our English- and Japanese-learning articles are written in her voice. They are signed “Yukina Shirakawa (Ambassador).”
      </p>
      <p>
        She is easygoing, good at cheering you on, able to laugh at her own mistakes, and never quite gives up. Think of her as a friend who keeps learning alongside you, and celebrates the days you make it.
      </p>

      <h2>Getting in touch</h2>
      <p>
        To report a mistake in an article, ask us to remove a comment or post, or ask about your personal information, please use the <Link href="/en/contact">contact page</Link>.
      </p>
    </InfoPage>
  );
}
