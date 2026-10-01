import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { pageAlternates } from "@/lib/articles";
import { OPERATOR_NAME } from "@/lib/site";

export function generateMetadata(): Metadata {
  return {
    title: "Terms of Use",
    description: "The rules for creating an account, posting comments and on the board, and using the articles on Mana Village.",
    alternates: pageAlternates("/terms", "en"),
  };
}

// 日本語版(/terms)の英訳。内容を変えるときは日本語版と一緒に直す
export default function TermsPage() {
  return (
    <InfoPage title="Terms of Use" updated="Effective: October 1, 2026" lang="en" otherLang="/terms">
      <p className="sub">
        This is an English translation provided for convenience. If there is any difference between this translation and the <Link href="/terms">Japanese version</Link>, the Japanese version prevails.
      </p>
      <p>
        These Terms of Use (“the Terms”) are the rules for using Mana Village (https://manavillage.online, “the site”).
        By using the site, you agree to the Terms. If you create an account, please read the Terms before signing up.
      </p>

      <h2>1. Accounts</h2>
      <ul>
        <li>You need a free account to post comments or use the board. You don’t need an account just to read articles.</li>
        <li>When signing up, use a valid email address and set a nickname and password.</li>
        <li>You are responsible for managing your password. The operator is not responsible for any damage caused by someone else using your account.</li>
        <li>You may not transfer or lend your account to anyone else.</li>
      </ul>

      <h2>2. Prohibited conduct</h2>
      <p>You must not:</p>
      <ul>
        <li>Break the law, or do anything that may break the law</li>
        <li>Defame, discriminate against, harass, or threaten others</li>
        <li>Post other people’s personal information (real name, address, contact details, and so on) without their consent</li>
        <li>Infringe on other people’s copyrights or other rights</li>
        <li>Impersonate someone else</li>
        <li>Post advertising, solicitations, spam, or links unrelated to the site</li>
        <li>Post obscene or violent content, or other content that others may find offensive</li>
        <li>Gain unauthorized access to the site or interfere with its operation</li>
        <li>Do anything else the operator considers inappropriate</li>
      </ul>

      <h2>3. Posts</h2>
      <ul>
        <li>You cannot edit or delete your comments or board posts after posting. Please check the content carefully before you post.</li>
        <li>You keep the copyright to what you post. However, you grant the site permission, free of charge, to display and store it and to use it to run the site.</li>
        <li>Your nickname and posts can be seen by anyone.</li>
        <li>The operator may delete posts that violate the Terms, or that the operator considers inappropriate, without notice. For repeated violations, the operator may suspend or delete the account.</li>
        <li>If you delete your account, your comments and posts remain under the name “Deleted user.”</li>
        <li>If you want your own or someone else’s post deleted, please contact us through the <Link href="/en/contact">contact page</Link>.</li>
      </ul>

      <h2>4. Articles and other site content</h2>
      <ul>
        <li>The copyright to the articles, illustrations, text, design, and other content of the site belongs to the operator or to the rightful owners. You may not reproduce, copy, or distribute it without permission beyond what the law allows as quotation.</li>
        <li>The articles are written as information to help with your studies. They do not guarantee any particular learning effect or result. Please decide how to study based on your own situation.</li>
        <li>We only mention research and statistics we could confirm in the original source, but research findings may change later.</li>
      </ul>

      <h2>5. Links to other sites</h2>
      <p>
        The site may link to other sites. The operator is not responsible for the content of linked sites or for anything that happens there.
      </p>

      <h2>6. Disclaimer</h2>
      <ul>
        <li>The operator works to keep the site’s content accurate, up to date, and safe, but does not guarantee it.</li>
        <li>The operator is not responsible for damage arising from use of the site, except in cases of the operator’s intent or gross negligence.</li>
        <li>The operator may change, temporarily stop, or end the site’s content or features without prior notice.</li>
        <li>Please resolve any disputes between users among yourselves.</li>
      </ul>

      <h2>7. Personal information</h2>
      <p>
        How we handle personal information collected on the site is set out in the <Link href="/en/privacy">Privacy Policy</Link>.
      </p>

      <h2>8. Changes to the Terms</h2>
      <p>
        The operator may change the Terms as needed. The changed Terms take effect when they are posted on this page. If you continue to use the site after a change, you agree to the changed Terms.
      </p>

      <h2>9. Governing law</h2>
      <p>The Terms are governed by the laws of Japan.</p>

      <h2>10. Operator and contact</h2>
      <p>
        Operator: {OPERATOR_NAME}<br />
        <Link href="/en/contact">Contact page</Link>
      </p>
    </InfoPage>
  );
}
