import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { pageAlternates } from "@/lib/articles";
import { CONTACT_EMAIL } from "@/lib/site";

export function generateMetadata(): Metadata {
  return {
    title: "Contact",
    description: "How to contact Mana Village — to report a mistake in an article, request removal of a post, or ask about your personal information.",
    alternates: pageAlternates("/contact", "en"),
  };
}

export default function ContactPage() {
  return (
    <InfoPage title="Contact" lang="en" otherLang="/contact">
      <p>You can reach Mana Village at the email address below. You’re welcome to write in English or Japanese.</p>

      <div className="example" style={{ gap: 8 }}>
        <span className="lbl">MAIL</span>
        <span style={{ fontSize: 20, fontWeight: 700, overflowWrap: "anywhere", userSelect: "all" }}>{CONTACT_EMAIL}</span>
        <span className="ja"><a href={`mailto:${CONTACT_EMAIL}`}>Open in your email app</a> (if it doesn’t open, copy the address above)</span>
      </div>

      <h2>When to contact us</h2>
      <ul>
        <li>You found a mistake or something unclear in an article</li>
        <li>You ran into a problem with, or found something inappropriate in, a comment or board post</li>
        <li>You’d like your posts or account deleted (see also the <Link href="/en/privacy">Privacy Policy</Link>)</li>
        <li>You’d like us to disclose, correct, or stop using your personal information</li>
        <li>You found a bug on the site</li>
      </ul>

      <h2>Before you write</h2>
      <ul>
        <li>For questions about your account or posts, please include the email address and nickname you registered with, and the URL of the page in question. This helps us check quickly.</li>
        <li>It may take some time for us to reply.</li>
        <li>Depending on the content, we may not be able to reply.</li>
      </ul>
    </InfoPage>
  );
}
