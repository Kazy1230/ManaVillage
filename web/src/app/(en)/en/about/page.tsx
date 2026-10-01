import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { pageAlternates } from "@/lib/articles";
import { SITE_TAGLINE, SOCIAL } from "@/lib/site";

export function generateMetadata(): Metadata {
  return {
    title: "About Mana Village",
    description: "Mana Village is a site of learning guides for each subject, plus a board where learners help each other. Here is what we believe in and how we write our articles.",
    alternates: pageAlternates("/about", "en"),
  };
}

// 日本語版(/about)の英訳。内容を足さない
export default function AboutPage() {
  return (
    <InfoPage title="About Mana Village" lang="en" otherLang="/about">
      <p>
        Mana Village (まなビレッジ) is a site of <strong>learning guides</strong> for each subject, and a <strong>board where learners help each other</strong> when they get stuck.
       
      </p>
      <p className="en" style={{ fontSize: 20, color: "var(--accent)" }}>{SITE_TAGLINE}</p>

      <h2>What you can do here</h2>
      <ul>
        <li>Read the guides: for English speakers, our <Link href="/en/japanese">Learn Japanese</Link> section explains Japanese grammar and look-alike words in English. You don’t need to sign up or log in to read.</li>
        <li>Ask and answer on the <Link href="/en/boards">board</Link>: start a thread to borrow everyone’s ideas, or help someone else by replying.</li>
        <li>Comment on articles: when you share your thoughts or questions, other learners or the operator may reply.</li>
      </ul>
      <p>To comment or post on the board, you need a free <Link href="/en/signup">account</Link>.</p>

      <h2>What we care about</h2>
      <p>
        More than any piece of knowledge, we hope you’ll <strong>come to enjoy learning itself</strong>.
        When you know how to learn, you start to feel progress, and learning becomes fun. When it’s fun, you keep going. And when you keep going, the things you can’t do yet slowly get fewer.
      </p>

      <h2>How we write our articles</h2>
      <ul>
        <li>We don’t rewrite other sites’ articles. We use them only to research the topic; the structure, example sentences, and pictures are our own.</li>
        <li>When we mention research or statistics, we only include what we could confirm in the original source. If we can’t confirm it, we leave it out.</li>
        <li>The operator’s personal opinions are written as opinions, separately from facts.</li>
        <li>The operator reviews every article before it is published.</li>
        <li>The pictures in our articles are simple drawings on a white background, made to help the explanation.</li>
      </ul>

      <h2>Who runs this site</h2>
      <p>
        Mana Village is run by <Link href="/en/operator">Kaz</Link>. To point out a mistake in an article, share feedback, or ask us to remove something, please use the <Link href="/en/contact">contact page</Link>.
      </p>
      <p>
        Official accounts:{" "}
        <a href={SOCIAL.instagram.url} target="_blank" rel="noopener noreferrer">Instagram</a>{" / "}
        <a href={SOCIAL.youtube.url} target="_blank" rel="noopener noreferrer">YouTube</a>
      </p>
    </InfoPage>
  );
}
