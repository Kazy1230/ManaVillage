import type { Lang } from "@/lib/sections";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(iso: string, lang: Lang = "ja") {
  const d = new Date(iso);
  return lang === "en" ? `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` : `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function shortDate(iso: string, lang: Lang = "ja") {
  const d = new Date(iso);
  return lang === "en" ? `${MONTHS[d.getMonth()]} ${d.getDate()}` : `${d.getMonth() + 1}月${d.getDate()}日`;
}

export function timeAgo(iso: string, lang: Lang = "ja") {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  const en = lang === "en";
  const ago = (n: number, unit: string, ja: string) => (en ? `${n} ${unit}${n === 1 ? "" : "s"} ago` : `${n}${ja}前`);
  if (s < 60) return en ? "just now" : "たった今";
  if (s < 3600) return ago(Math.floor(s / 60), "minute", "分");
  if (s < 86400) return ago(Math.floor(s / 3600), "hour", "時間");
  if (s < 86400 * 7) return ago(Math.floor(s / 86400), "day", "日");
  return formatDate(iso, lang);
}

export const initial = (name: string) => [...name.trim()][0] ?? "?";
