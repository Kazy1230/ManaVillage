import "server-only";
import { cookies, headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { dayKey } from "@/lib/oshiete/config";

export const ANON_COOKIE = "oshiete_anon";

// 見る人の IP(Vercel が付ける x-forwarded-for の先頭)
export async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown").trim().slice(0, 64);
}

// ログインしていない人の目印(ブラウザごとのランダムな ID。なければ作る)
export async function anonId() {
  const jar = await cookies();
  const have = jar.get(ANON_COOKIE)?.value;
  if (have && /^[0-9a-f-]{36}$/.test(have)) return have;
  const id = crypto.randomUUID();
  jar.set(ANON_COOKIE, id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 400, path: "/" });
  return id;
}

// 1日の回数を数える。どれか1つでも上限を超えたら false。
// 数えられなかったとき(テーブルがまだない など)は、止めずに通す(ログだけ残す)
export async function underLimits(limits: { key: string; limit: number }[]) {
  const admin = createAdminClient();
  const day = dayKey();
  const results = await Promise.all(
    limits.map(async ({ key, limit }) => {
      const { data, error } = await admin.rpc("oshiete_rate_hit", { p_key: key, p_day: day, p_limit: limit });
      if (error) {
        console.error("[oshiete rate]", error.message);
        return true;
      }
      return data !== false;
    }),
  );
  return results.every(Boolean);
}

// DeepSeek に JSON で答えてもらう(OpenAI と同じ形の API)。失敗したら例外
export async function askDeepSeek(prompt: string): Promise<unknown> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error("DEEPSEEK_API_KEY is not set");
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0,
      max_tokens: 60,
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`DeepSeek ${res.status}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content ?? "";
  return JSON.parse(content.replace(/^```(?:json)?\s*|\s*```$/g, ""));
}
