"use client";

import { useEffect } from "react";

// 記事の中の、動く部品を動かす。どちらも、JavaScript がなくても、内容が全部見える形の HTML にしてある。
// 1) 切り替え部品([data-switcher]): タブでパネルを切り替える
// 2) 語順が動く部品([data-reorder]): ボタンで、語の並びが入れ替わる(FLIP アニメーション)
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

    const movers = Array.from(document.querySelectorAll<HTMLElement>("[data-reorder]"));
    const mark = (box: HTMLElement, state: string) => {
      box.querySelectorAll<HTMLElement>("[data-ro-set]").forEach((b) => {
        const on = b.dataset.roSet === state;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
    };
    movers.forEach((box) => {
      box.classList.add("is-ready");
      mark(box, box.dataset.state ?? "ja");
    });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const move = (box: HTMLElement, state: string) => {
      if (box.dataset.state === state) return;
      const chips = Array.from(box.querySelectorAll<HTMLElement>(".ro-chip"));
      const before = new Map(chips.map((c) => [c, c.getBoundingClientRect()]));
      box.dataset.state = state;
      mark(box, state);
      if (reduce) return;
      chips.forEach((c) => {
        const a = before.get(c)!;
        const b = c.getBoundingClientRect();
        if (a.width === 0 && b.width > 0) c.animate([{ opacity: 0, transform: "scale(.8)" }, { opacity: 1, transform: "none" }], { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)" });
        else if (a.width > 0 && b.width > 0) c.animate([{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px)` }, { transform: "none" }], { duration: 600, easing: "cubic-bezier(.2,.8,.2,1)" });
      });
    };

    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const tab = el.closest<HTMLElement>("[data-sw-tab]");
      const box = tab?.closest<HTMLElement>("[data-switcher]");
      if (tab && box) {
        activate(box, tab.dataset.swTab!);
        return;
      }
      const set = el.closest<HTMLElement>("[data-ro-set]");
      const mover = set?.closest<HTMLElement>("[data-reorder]");
      if (set && mover) move(mover, set.dataset.roSet!);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
