import "server-only";
import { redirect } from "next/navigation";
import { lp } from "@/lib/paths";
import type { Lang } from "@/lib/sections";
import { createClient } from "@/lib/supabase/server";

export type Viewer = { id: string; email: string | null; nickname: string; isAdmin: boolean };

export async function getViewer(): Promise<Viewer | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, is_admin")
    .eq("id", data.user.id)
    .single();
  return {
    id: data.user.id,
    email: data.user.email ?? null,
    nickname: profile?.nickname ?? "学習者",
    isAdmin: profile?.is_admin ?? false,
  };
}

// ログインしていなければ、ログインのページへ(英語のページからは /en/login へ)
export async function requireViewer(next: string, lang: Lang = "ja") {
  const viewer = await getViewer();
  if (!viewer) redirect(`${lp(lang, "/login")}?next=${encodeURIComponent(next)}`);
  return viewer;
}

export function safeNext(value: FormDataEntryValue | string | null | undefined) {
  const v = typeof value === "string" ? value : "";
  return v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : "/";
}
