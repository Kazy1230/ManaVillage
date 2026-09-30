"use client";

import { useEffect, useState } from "react";
import type { Phrase } from "@/lib/articles";

export default function PhraseCarousel({ phrases }: { phrases: Phrase[] }) {
  const [i, setI] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (phrases.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % phrases.length), 3600);
    return () => clearInterval(t);
  }, [phrases.length, tick]);

  const p = phrases[i];
  return (
    <>
      <div className="phrase in" key={i}>
        <span className="en"><mark>{p.key}</mark> {p.rest}</span>
        <span className="ja">{p.ja}</span>
        {p.level && <span className="level">丁寧さ <b>{p.level}</b></span>}
      </div>
      {phrases.length > 1 && (
        <div className="dots" role="group" aria-label="フレーズ切替">
          {phrases.map((_, n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n + 1}つ目のフレーズ`}
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
