"use client";

// おしえて英語はブラウザに保存した進み具合を最初に読むので、サーバーでは描かない
import dynamic from "next/dynamic";
import type { OshieteState } from "@/lib/oshiete/state";

const OshieteApp = dynamic(() => import("./OshieteApp"), { ssr: false, loading: () => <div className="app" aria-busy="true" /> });

export default function OshieteLoader(props: { viewer: { nickname: string } | null; saved: OshieteState | null; devTools: boolean }) {
  return <OshieteApp {...props} />;
}
