"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { sectionOfPath, type Lang, type SectionKey } from "@/lib/sections";

type Tab = { key: SectionKey; label: string; top: string; lang: Lang };

// ヘッダーのメニュー: 科目を並べ、その右に、全科目で共通の掲示板
export default function SubjectTabs({ tabs, board, lang }: { tabs: Tab[]; board: string; lang: Lang }) {
  const pathname = usePathname();
  const current = sectionOfPath(pathname);
  const nav = useRef<HTMLElement>(null);

  // 狭い画面ではメニューが横にスクロールするので、いまの科目が見える位置まで動かす
  useEffect(() => {
    const el = nav.current;
    const cur = el?.querySelector<HTMLElement>('[aria-current="page"]');
    if (el && cur) el.scrollLeft = cur.offsetLeft - (el.clientWidth - cur.offsetWidth) / 2;
  }, [pathname]);

  return (
    <nav className="head-nav" ref={nav} aria-label={lang === "en" ? "Site" : "サイト"}>
      <div className="subjects">
        {tabs.map((s) => (
          <Link key={s.key} href={s.top} lang={s.lang} aria-current={s.key === current ? "page" : undefined}>
            {s.label}
          </Link>
        ))}
      </div>
      <span className="nav-sep" aria-hidden="true" />
      <div className="nav">
        <Link href="/boards" aria-current={pathname.startsWith("/boards") ? "page" : undefined}>{board}</Link>
      </div>
    </nav>
  );
}
