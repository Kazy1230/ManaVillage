import type { Metadata } from "next";
import RootShell from "@/components/RootShell";
import { SITE_URL } from "@/lib/env";

// 英語で書くページ(日本語学習)のルートレイアウト。<html lang="en"> と、和の見た目(data-section="japanese")
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Learn Japanese | Mana Village", template: "%s | Mana Village" },
  description: "Practical guides to Japanese grammar and look-alike words, explained in English with simple analogies.",
  openGraph: {
    type: "website",
    siteName: "Mana Village",
    locale: "en_US",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Mana Village — For Everyone's Learning, For Everyone's Help" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-default.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang="en" section="japanese">{children}</RootShell>;
}
