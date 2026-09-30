import type { Metadata } from "next";
import Link from "next/link";
import { Newsreader, Noto_Sans_JP, Zen_Kaku_Gothic_New } from "next/font/google";
import NavLinks from "@/components/NavLinks";
import ScrollEffects from "@/components/ScrollEffects";
import SiteFooter from "@/components/SiteFooter";
import { getViewer } from "@/lib/auth";
import { initial } from "@/lib/format";
import { SITE_URL } from "@/lib/env";
import "./globals.css";

const display = Zen_Kaku_Gothic_New({ weight: ["500", "700", "900"], subsets: ["latin"], variable: "--font-display", preload: false });
const body = Noto_Sans_JP({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-body", preload: false });
const en = Newsreader({ style: ["italic"], weight: ["400", "500"], subsets: ["latin"], variable: "--font-en" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "まなビレッジ", template: "%s | まなビレッジ" },
  description: "Kaz が書く英語学習の記事と、学習者どうしで交流できる掲示板。",
  openGraph: { type: "website", siteName: "まなビレッジ", locale: "ja_JP" },
  twitter: { card: "summary" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const viewer = await getViewer();
  return (
    <html lang="ja" className={`${display.variable} ${body.variable} ${en.variable}`}>
      <body>
        <header className="site-head bleed" id="site-head">
          <div className="head-in">
            <Link className="logo" href="/"><i />まなビレッジ</Link>
            <NavLinks />
            <div className="acct">
              {viewer ? (
                <Link className="avatar" href="/mypage" aria-label={`マイページ（${viewer.nickname}）`}>{initial(viewer.nickname)}</Link>
              ) : (
                <Link className="btn primary" href="/login">ログイン</Link>
              )}
            </div>
          </div>
        </header>
        <main>{children}</main>
        <SiteFooter loggedIn={!!viewer} />
        <ScrollEffects />
      </body>
    </html>
  );
}
