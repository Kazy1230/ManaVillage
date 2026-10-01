"use client";

import { useEffect, useSyncExternalStore } from "react";

// 日本語学習の記事: ふりがな(ルビ)とローマ字の表示を切り替える。どちらも最初は表示。選んだ状態はこの端末に保存する
const KEYS = { furi: "mv-furigana", ro: "mv-romaji" } as const;
const EVENT = "mv-reading";

function read(key: string) {
  try {
    return localStorage.getItem(key) !== "off";
  } catch {
    return true;
  }
}

function write(key: string, on: boolean) {
  try {
    localStorage.setItem(key, on ? "on" : "off");
  } catch {}
  dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  addEventListener(EVENT, cb);
  addEventListener("storage", cb);
  return () => {
    removeEventListener(EVENT, cb);
    removeEventListener("storage", cb);
  };
}

const useSetting = (key: string) => useSyncExternalStore(subscribe, () => read(key), () => true);

export default function ReadingToggle() {
  const furi = useSetting(KEYS.furi);
  const ro = useSetting(KEYS.ro);

  useEffect(() => {
    document.documentElement.classList.toggle("no-furi", !furi);
    document.documentElement.classList.toggle("no-ro", !ro);
  }, [furi, ro]);

  const seg = (label: string, key: string, on: boolean) => (
    <>
      <span>{label}</span>
      <span className="seg" role="group" aria-label={label}>
        <button type="button" aria-pressed={on} onClick={() => write(key, true)}>On</button>
        <button type="button" aria-pressed={!on} onClick={() => write(key, false)}>Off</button>
      </span>
    </>
  );

  return (
    <div className="reading">
      {seg("Furigana", KEYS.furi, furi)}
      {seg("Romaji", KEYS.ro, ro)}
    </div>
  );
}
