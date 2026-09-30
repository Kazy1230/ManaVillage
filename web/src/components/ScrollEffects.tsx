"use client";

import { useEffect, useState } from "react";

export default function ScrollEffects() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const head = document.getElementById("site-head");
    const onScroll = () => {
      head?.classList.toggle("scrolled", scrollY > 8);
      setShowTop(scrollY > 600);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      className={`totop${showTop ? " show" : ""}`}
      type="button"
      aria-label="ページの先頭へ"
      tabIndex={showTop ? 0 : -1}
      onClick={() => scrollTo({ top: 0 })}
    >
      ↑
    </button>
  );
}
