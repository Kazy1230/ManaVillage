// ログイン・登録・マイページ・掲示板・サイトについてのページは、日本語(/login など)と英語(/en/login など)の2つがある。
// 言語に合わせた URL を作る。科目の URL は lib/sections.ts
import type { Lang } from "@/lib/sections";

export const lp = (lang: Lang, path: string) => (lang === "en" ? `/en${path}` : path);

// 英語のページかどうか(/en/ で始まる URL)
export const langOfPath = (pathname: string): Lang => (pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ja");
