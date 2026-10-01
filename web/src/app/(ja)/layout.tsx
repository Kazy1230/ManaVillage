import type { Metadata } from "next";
import RootShell from "@/components/RootShell";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "まなビレッジ", template: "%s | まなビレッジ" },
  description: "学び、つまずき、助け合う。科目ごとの記事と、学習者どうしで助け合える掲示板のサイト。",
  openGraph: {
    type: "website",
    siteName: "まなビレッジ",
    locale: "ja_JP",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "まなビレッジ — For Everyone's Learning, For Everyone's Help" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-default.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang="ja">{children}</RootShell>;
}
