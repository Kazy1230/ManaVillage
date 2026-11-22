import type { Metadata, Viewport } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import { SITE_URL } from "@/lib/env";
import "./oshiete.css";

// おしえて英語(/oshiete)のルートレイアウト。スマホ1画面のアプリなので、サイトのヘッダー・フッターは付けない。
// Zen Maru Gothic はこのアプリだけで読み込む(サイトのほかのページは OS 標準のゴシック体のまま。docs/05-design.md)
const font = Zen_Maru_Gothic({ weight: ["500", "700", "900"], subsets: ["latin"], variable: "--font-zen", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "おしえて英語 | まなビレッジ", template: "%s | おしえて英語" },
  description: "あなたが先生。生徒の英文法の質問に答えるほど、自分の英語が身につく、まなビレッジの学習アプリ。",
  openGraph: { type: "website", siteName: "まなビレッジ", locale: "ja_JP", images: [{ url: "/og-default.png", width: 1200, height: 630 }] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#F6F7FB", colorScheme: "light" };

export default function OshieteRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={font.variable}>
      <body className="oshiete-body">{children}</body>
    </html>
  );
}
