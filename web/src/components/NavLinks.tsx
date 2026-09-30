"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/articles", label: "記事", match: ["/articles", "/tags"] },
  { href: "/boards", label: "掲示板", match: ["/boards"] },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="nav" aria-label="サイト">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} aria-current={l.match.some((m) => pathname.startsWith(m)) ? "page" : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
