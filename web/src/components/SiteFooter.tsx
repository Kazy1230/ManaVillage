import Link from "next/link";
import { getTagCounts, isSectionLive, liveSections } from "@/lib/articles";
import { SECTIONS, type Lang, type SectionKey } from "@/lib/sections";
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

const COPY = {
  ja: {
    desc: "学び、つまずき、助け合う。科目ごとの記事と、学習者どうしで助け合える掲示板のサイトです。",
    subjects: "科目", articles: "記事", all: "すべての記事", join: "参加する", board: "掲示板", newThread: "スレッドを作る",
    mypage: "マイページ", login: "ログイン", signup: "新規登録", about: "サイトについて",
    info: [["/about", "まなビレッジとは"], ["/operator", "運営者について"], ["/contact", "お問い合わせ"], ["/privacy", "プライバシーポリシー"], ["/terms", "利用規約"]],
    copy: "まなビレッジ", by: "運営：Kaz", official: "公式アカウント",
  },
  en: {
    desc: "Learn, stumble, and help each other. Guides for each subject, and a board where learners help each other.",
    subjects: "Subjects", articles: "Guides", all: "All guides", join: "Join", board: "Board", newThread: "Start a thread",
    mypage: "My page", login: "Log in", signup: "Sign up", about: "About (in Japanese)",
    info: [["/about", "About Mana Village"], ["/operator", "About the operator"], ["/contact", "Contact"], ["/privacy", "Privacy policy"], ["/terms", "Terms of use"]],
    copy: "Mana Village", by: "Operated by Kaz", official: "Official accounts",
  },
} as const;

export default function SiteFooter({ loggedIn, lang }: { loggedIn: boolean; lang: Lang }) {
  const c = COPY[lang];
  // 記事の列は、ページの言語の科目(日本語のページなら英語学習、英語のページなら日本語学習)
  const home: SectionKey = lang === "en" ? "japanese" : "english";
  const sec = SECTIONS[home];
  const tags = isSectionLive(home) ? getTagCounts(home).slice(0, 5) : [];

  return (
    <footer className="site-foot bleed">
      <div className="foot-in">
        <div className="foot-main">
          <div className="foot-brand">
            <Link className="foot-logo" href="/" lang="ja"><i />まなビレッジ</Link>
            <p className="foot-tag en">{SITE_TAGLINE}</p>
            <p className="foot-desc">{c.desc}</p>
            <ul className="foot-social" aria-label={c.official}>
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

          <nav className="foot-col" aria-label={c.subjects}>
            <h2>{c.subjects}</h2>
            <ul>
              {liveSections().map((k) => (
                <li key={k}><Link href={SECTIONS[k].top} lang={SECTIONS[k].lang}>{SECTIONS[k].label}</Link></li>
              ))}
            </ul>
          </nav>

          {isSectionLive(home) && (
            <nav className="foot-col" aria-label={c.articles}>
              <h2>{c.articles}</h2>
              <ul>
                <li><Link href={sec.articles}>{c.all}</Link></li>
                {tags.map(([tg]) => (
                  <li key={tg}><Link href={`${sec.tags}/${encodeURIComponent(tg)}`}>#{tg}</Link></li>
                ))}
              </ul>
            </nav>
          )}

          <nav className="foot-col" aria-label={c.join}>
            <h2>{c.join}</h2>
            <ul>
              <li><Link href="/boards">{c.board}</Link></li>
              <li><Link href="/boards/new">{c.newThread}</Link></li>
              {loggedIn ? (
                <li><Link href="/mypage">{c.mypage}</Link></li>
              ) : (
                <>
                  <li><Link href="/login">{c.login}</Link></li>
                  <li><Link href="/signup">{c.signup}</Link></li>
                </>
              )}
            </ul>
          </nav>

          <nav className="foot-col" aria-label={c.about}>
            <h2>{c.about}</h2>
            <ul>
              {c.info.map(([href, label]) => <li key={href}><Link href={href}>{label}</Link></li>)}
            </ul>
          </nav>
        </div>

        <div className="foot-bottom">
          <small>© {new Date().getFullYear()} {c.copy}</small>
          <small>{c.by}</small>
        </div>
      </div>
    </footer>
  );
}
