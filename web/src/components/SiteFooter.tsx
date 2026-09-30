import Link from "next/link";
import { getTagCounts } from "@/lib/articles";
import { SITE_TAGLINE, SOCIAL } from "@/lib/site";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5.2" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10 9.4v5.2l4.6-2.6z" fill="currentColor" />
    </svg>
  );
}

export default function SiteFooter({ loggedIn }: { loggedIn: boolean }) {
  const tags = getTagCounts().slice(0, 5);

  return (
    <footer className="site-foot bleed">
      <div className="foot-in">
        <div className="foot-main">
          <div className="foot-brand">
            <Link className="foot-logo" href="/"><i />まなビレッジ</Link>
            <p className="foot-tag en">{SITE_TAGLINE}</p>
            <p className="foot-desc">英語の勉強方法を書いた記事と、学習者どうしで助け合える掲示板のサイトです。</p>
            <ul className="foot-social" aria-label="公式アカウント">
              <li>
                <a href={SOCIAL.instagram.url} target="_blank" rel="noopener noreferrer" aria-label={`Instagram（@${SOCIAL.instagram.handle}）`}>
                  <InstagramIcon /><span>Instagram</span>
                </a>
              </li>
              <li>
                <a href={SOCIAL.youtube.url} target="_blank" rel="noopener noreferrer" aria-label={`YouTube（@${SOCIAL.youtube.handle}）`}>
                  <YouTubeIcon /><span>YouTube</span>
                </a>
              </li>
            </ul>
          </div>

          <nav className="foot-col" aria-label="記事">
            <h2>記事</h2>
            <ul>
              <li><Link href="/articles">すべての記事</Link></li>
              {tags.map(([t]) => (
                <li key={t}><Link href={`/tags/${encodeURIComponent(t)}`}>#{t}</Link></li>
              ))}
            </ul>
          </nav>

          <nav className="foot-col" aria-label="掲示板とアカウント">
            <h2>参加する</h2>
            <ul>
              <li><Link href="/boards">掲示板</Link></li>
              <li><Link href="/boards/new">スレッドを作る</Link></li>
              {loggedIn ? (
                <li><Link href="/mypage">マイページ</Link></li>
              ) : (
                <>
                  <li><Link href="/login">ログイン</Link></li>
                  <li><Link href="/signup">新規登録</Link></li>
                </>
              )}
            </ul>
          </nav>

          <nav className="foot-col" aria-label="サイトについて">
            <h2>サイトについて</h2>
            <ul>
              <li><Link href="/about">まなビレッジとは</Link></li>
              <li><Link href="/operator">運営者について</Link></li>
              <li><Link href="/contact">お問い合わせ</Link></li>
              <li><Link href="/privacy">プライバシーポリシー</Link></li>
              <li><Link href="/terms">利用規約</Link></li>
            </ul>
          </nav>
        </div>

        <div className="foot-bottom">
          <small>© {new Date().getFullYear()} まなビレッジ</small>
          <small>運営：Kaz</small>
        </div>
      </div>
    </footer>
  );
}
