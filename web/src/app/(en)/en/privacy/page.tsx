import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { pageAlternates } from "@/lib/articles";
import { CONTACT_EMAIL, OPERATOR_NAME } from "@/lib/site";

export function generateMetadata(): Metadata {
  return {
    title: "Privacy Policy",
    description: "What information Mana Village collects, why, which outside services we use, how ads would be handled if introduced, and how to request deletion.",
    alternates: pageAlternates("/privacy", "en"),
  };
}

// 日本語版(/privacy)の英訳。内容を変えるときは日本語版と一緒に直す
export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy" updated="Effective: October 1, 2026" lang="en" otherLang="/privacy">
      <p className="sub">
        This is an English translation provided for convenience. If there is any difference between this translation and the <Link href="/privacy">Japanese version</Link>, the Japanese version prevails.
      </p>
      <p>
        {OPERATOR_NAME} (“the operator”), who runs Mana Village (https://manavillage.online, “the site”), handles the information collected on the site as follows.
      </p>

      <h2>1. Information we collect</h2>
      <ul>
        <li><strong>Account information</strong>: email address, password, nickname, and registration date and time. Passwords are stored in encrypted (hashed) form, and the operator cannot see them.</li>
        <li><strong>Posts</strong>: comments on articles, board threads and posts, board category names, and the date and time of each.</li>
        <li><strong>Inquiries</strong>: the content of emails you send us and the sender’s email address.</li>
        <li><strong>Access information</strong>: IP address, browser and device type, and the date, time, and pages you accessed. These are recorded automatically by the servers of our hosting service (Vercel) to run the site.</li>
        <li><strong>Cookies</strong>: we use authentication cookies to keep you logged in.</li>
      </ul>

      <h2>2. How we use it</h2>
      <ul>
        <li>To register accounts, log you in, and reset passwords</li>
        <li>To notify the operator by email when an article receives a comment, and to notify you when someone replies to your post</li>
        <li>To provide site features such as comments and the board</li>
        <li>To prevent misuse and violations of the Terms of Use</li>
        <li>To respond to inquiries</li>
        <li>To investigate problems with the site and improve the service</li>
      </ul>
      <p>We do not use the information for any purpose other than those above.</p>

      <h2>3. Information that is public</h2>
      <p>
        Your nickname and the content of your comments and board posts can be seen by anyone, including people who are not logged in.
        Your email address is not shown. Please don’t include information that could identify you (your real name, address, phone number, workplace, and so on) in your posts.
      </p>

      <h2>4. Sharing with third parties and use of outside services</h2>
      <p>
        Except where required by law, the operator does not share personal information with third parties without your consent.
        However, to run the site, we entrust the storage and processing of information to the following outside services.
      </p>
      <table>
        <thead>
          <tr><th>Service</th><th>Purpose</th><th>Information entrusted</th></tr>
        </thead>
        <tbody>
          <tr><td>Supabase</td><td>Login authentication, database</td><td>Account information, posts</td></tr>
          <tr><td>Resend</td><td>Sending notification emails</td><td>Recipient email addresses, email content</td></tr>
          <tr><td>Vercel</td><td>Delivering the site (hosting)</td><td>Access information</td></tr>
        </tbody>
      </table>
      <p>
        These services may handle information on servers outside Japan.
        Confirmation emails at sign-up and password reset emails are sent by Supabase.
      </p>

      <h2>5. Cookies, analytics, and advertising</h2>
      <p>
        The site does not currently show ads or use analytics tools.
        The operator uses Google Search Console to check how the site appears in search results, but this does not collect information about individual visitors.
      </p>
      <p>
        <strong>We may introduce advertising (such as Google AdSense) or analytics in the future.</strong>
        If we do, the companies providing the ads or analytics may use cookies and similar technologies to collect browsing information.
        Before introducing them, we will update this page with the names of the services, the information collected, and how to opt out.
      </p>

      <h2>6. How long we keep information, and deletion</h2>
      <p>
        We keep account information and posts until the account is deleted.
        On this site, you cannot edit or delete your own comments or posts after posting.
        When an account is deleted, we delete the account information (email address, nickname, and so on). The account’s comments and posts remain, with the author’s name removed and shown as “Deleted user” (to keep other people’s replies and the flow of conversation intact). If you want the posts themselves deleted, please contact us through the <Link href="/en/contact">contact page</Link>. After confirming your identity, we will delete the posts in question.
      </p>

      <h2>7. Disclosure, correction, and suspension of use</h2>
      <p>
        If you would like your information disclosed, corrected, deleted, or no longer used, please contact us through the <Link href="/en/contact">contact page</Link>. After confirming your identity, we will respond in accordance with the law. You can change your nickname yourself on My page after logging in.
      </p>

      <h2>8. Security</h2>
      <p>
        Communication with the site is encrypted (HTTPS). The database is access-controlled so that only you, when logged in, can change your own information.
        However, we cannot fully guarantee the security of information on the internet.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        We may change this policy to follow changes in the law or new site features. When we do, we will update this page.
      </p>

      <h2>10. Contact</h2>
      <p>
        Operator: {OPERATOR_NAME}<br />
        Email: {CONTACT_EMAIL}<br />
        <Link href="/en/contact">Contact page</Link>
      </p>
    </InfoPage>
  );
}
