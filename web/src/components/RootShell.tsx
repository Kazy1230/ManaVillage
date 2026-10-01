import { Newsreader } from "next/font/google";
import ScrollEffects from "@/components/ScrollEffects";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getViewer } from "@/lib/auth";
import type { Lang, SectionKey } from "@/lib/sections";
import "@/app/globals.css";

const en = Newsreader({ style: ["italic"], weight: ["400", "500"], subsets: ["latin"], variable: "--font-en" });

// ルートレイアウトの中身。言語ごとに (ja) と (en) の2つのルートレイアウトがあり、どちらもこれを使う
// (ルートレイアウトをまたぐ移動はページ全体の読み込みになるので、<html lang> と見た目が正しく切り替わる)
export default async function RootShell({ lang, section, children }: { lang: Lang; section?: SectionKey; children: React.ReactNode }) {
  const viewer = await getViewer();
  return (
    <html lang={lang} className={en.variable} data-section={section}>
      <body>
        <SiteHeader lang={lang} viewer={viewer} />
        <main>{children}</main>
        <SiteFooter loggedIn={!!viewer} lang={lang} />
        <ScrollEffects />
      </body>
    </html>
  );
}
