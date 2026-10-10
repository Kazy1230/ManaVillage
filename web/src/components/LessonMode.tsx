"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// 授業モード: 記事を、画面録画しながら授業できる形にする(2026-10 追加)。
// 見出しごとの場面に分け、→ キーで、要素を1つずつ出していく。ヘッダー、コメント欄などは隠す。
// 本文の HTML は変えない(クラスを付け外しするだけ)。モードを切ると、すべて元に戻る。
type Unit = HTMLElement;
type Section = Unit[];

const LABEL = {
  ja: { on: "授業モード", exit: "終了", prev: "前へ", next: "次へ", small: "文字を小さく", big: "文字を大きく", hide: "操作バーを隠す", hint: "→ / Space: 次へ  ← : 前へ  H: 操作バーの表示  Esc: 終了" },
  en: { on: "Lesson mode", exit: "Exit", prev: "Back", next: "Next", small: "Smaller text", big: "Larger text", hide: "Hide controls", hint: "→ / Space: next  ←: back  H: toggle controls  Esc: exit" },
} as const;

function buildSections(article: HTMLElement): Section[] {
  const prose = article.querySelector<HTMLElement>(".prose");
  if (!prose) return [];
  const head: Unit[] = [];
  const h1 = article.querySelector<HTMLElement>("h1");
  const cover = article.querySelector<HTMLElement>("figure.cover");
  if (h1) head.push(h1);
  if (cover) head.push(cover);
  const sections: Section[] = [head];
  for (const child of Array.from(prose.children) as HTMLElement[]) {
    if (child.tagName === "H2") sections.push([]);
    const cur = sections[sections.length - 1];
    // リストは、項目を1つずつ出す
    if (child.tagName === "UL" || child.tagName === "OL") cur.push(...(Array.from(child.children) as HTMLElement[]));
    else cur.push(child);
  }
  return sections.filter((s) => s.length > 0);
}

export default function LessonMode({ lang = "ja" }: { lang?: "ja" | "en" }) {
  const t = LABEL[lang];
  const [on, setOn] = useState(false);
  const [scale, setScale] = useState(1.25);
  const [bar, setBar] = useState(true);
  const [pos, setPos] = useState({ sec: 0, shown: 1 });
  const sections = useRef<Section[]>([]);
  const [total, setTotal] = useState(0);

  // 要素の表示状態を、位置に合わせて更新する
  const paint = useCallback((sec: number, shown: number) => {
    sections.current.forEach((units, i) => {
      // 切り替え部品が出たら、見出しと部品だけを残す(部品が主役の場面になる)
      let stage = -1;
      if (i === sec) for (let j = 0; j < Math.min(shown, units.length); j++) if (units[j].classList.contains("switcher")) stage = j;
      units.forEach((el, j) => {
        el.classList.toggle("ls-off", i !== sec || (stage > 0 && j > 0 && j < stage));
        el.classList.toggle("ls-hide", i === sec && j >= shown);
      });
    });
  }, []);

  const go = useCallback((delta: 1 | -1) => {
    setPos((p) => {
      const secs = sections.current;
      if (!secs.length) return p;
      const len = secs[p.sec].length;
      let n = p;
      if (delta === 1) {
        if (p.shown < len) n = { sec: p.sec, shown: p.shown + 1 };
        else if (p.sec < secs.length - 1) n = { sec: p.sec + 1, shown: 1 };
      } else {
        if (p.shown > 1) n = { sec: p.sec, shown: p.shown - 1 };
        else if (p.sec > 0) n = { sec: p.sec - 1, shown: secs[p.sec - 1].length };
      }
      return n;
    });
  }, []);

  const close = useCallback(() => setOn(false), []);

  // 入る・出る
  useEffect(() => {
    const root = document.documentElement;
    const article = document.querySelector<HTMLElement>("article.paper");
    if (!on || !article) return;
    sections.current = buildSections(article);
    setTotal(sections.current.length);
    setPos({ sec: 0, shown: 1 });
    root.dataset.lesson = "on";
    window.scrollTo({ top: 0 });
    return () => {
      delete root.dataset.lesson;
      root.style.removeProperty("--lesson-scale");
      sections.current.flat().forEach((el) => el.classList.remove("ls-off", "ls-hide", "ls-in"));
      sections.current = [];
    };
  }, [on]);

  useEffect(() => {
    if (!on) return;
    document.documentElement.style.setProperty("--lesson-scale", String(scale));
  }, [on, scale]);

  // 位置が変わったら、表示を更新して、新しく出た要素をふわっと出す
  useEffect(() => {
    if (!on) return;
    paint(pos.sec, pos.shown);
    const el = sections.current[pos.sec]?.[pos.shown - 1];
    if (el) {
      el.classList.remove("ls-in");
      void el.offsetWidth;
      el.classList.add("ls-in");
      // 場面の最初は、先頭から。途中の要素は、画面に入っていなければ、動かす
      if (pos.shown === 1) window.scrollTo({ top: 0, behavior: "smooth" });
      else el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [on, pos, paint]);

  // キー操作
  useEffect(() => {
    if (!on) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Escape") close();
      else if (e.key === "h" || e.key === "H") setBar((b) => !b);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [on, go, close]);

  return (
    <>
      <button type="button" className="lesson-btn" aria-pressed={on} onClick={() => setOn(true)}>
        <span aria-hidden="true">▶</span> {t.on}
      </button>
      {on && (
        <div className={`lesson-bar${bar ? "" : " is-hidden"}`} role="toolbar" aria-label={t.on}>
          <button type="button" onClick={() => setScale((s) => Math.max(1, +(s - 0.15).toFixed(2)))} aria-label={t.small}>A−</button>
          <button type="button" onClick={() => setScale((s) => Math.min(2, +(s + 0.15).toFixed(2)))} aria-label={t.big}>A＋</button>
          <button type="button" onClick={() => go(-1)}>‹ {t.prev}</button>
          <span className="lesson-count" aria-live="polite">{pos.sec + 1} / {total}</span>
          <button type="button" className="primary" onClick={() => go(1)}>{t.next} ›</button>
          <button type="button" onClick={() => setBar(false)} aria-label={t.hide}>H</button>
          <button type="button" onClick={close}>{t.exit}</button>
          <span className="lesson-hint">{t.hint}</span>
        </div>
      )}
    </>
  );
}
