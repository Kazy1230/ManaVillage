"use client";

import { useEffect } from "react";

// 記事の中の、切り替え部品([data-switcher])を動かす。
// 本文の HTML は、JavaScript がなくても、全部の内容が見える形(パネルが縦に並ぶ)にしてある。動くようになったら、タブで切り替える
export default function ArticleInteractive() {
  useEffect(() => {
    const boxes = Array.from(document.querySelectorAll<HTMLElement>("[data-switcher]"));
    const activate = (box: HTMLElement, key: string) => {
      box.querySelectorAll<HTMLElement>("[data-sw-tab]").forEach((b) => {
        const on = b.dataset.swTab === key;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", String(on));
      });
      box.querySelectorAll<HTMLElement>("[data-sw-panel]").forEach((p) => p.classList.toggle("is-active", p.dataset.swPanel === key));
    };
    boxes.forEach((box) => {
      box.classList.add("is-ready");
      const first = box.querySelector<HTMLElement>("[data-sw-tab]")?.dataset.swTab;
      if (first) activate(box, first);
    });
    const onClick = (e: MouseEvent) => {
      const tab = (e.target as HTMLElement).closest<HTMLElement>("[data-sw-tab]");
      const box = tab?.closest<HTMLElement>("[data-switcher]");
      if (tab && box) activate(box, tab.dataset.swTab!);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
