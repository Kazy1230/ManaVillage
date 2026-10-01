"use client";

import { useEffect, useState } from "react";
import type { JaPhrase } from "@/lib/articles";

// 日本語学習のトップのヒーロー: 記事の例文(日本語・ローマ字・英訳)を切り替えて見せる
export default function JaPhraseCarousel({ phrases }: { phrases: JaPhrase[] }) {
  const [i, setI] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (phrases.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % phrases.length), 4200);
    return () => clearInterval(t);
  }, [phrases.length, tick]);

  const p = phrases[i];
  return (
    <>
      <div className="phrase in" key={i}>
        <span className="jpx" lang="ja" dangerouslySetInnerHTML={{ __html: p.jp }} />
        <span className="ro">{p.romaji}</span>
        <span className="ja">“{p.en}”</span>
      </div>
      {phrases.length > 1 && (
        <div className="dots" role="group" aria-label="Example sentences">
          {phrases.map((_, n) => (
            <button
              key={n}
              type="button"
              aria-label={`Sentence ${n + 1}`}
              aria-current={n === i}
              onClick={(e) => {
                e.preventDefault();
                setI(n);
                setTick((t) => t + 1);
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
