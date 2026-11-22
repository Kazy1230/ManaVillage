// 体験版のあとのレビューを保存する(ログインしていなくても送れる)
import { getViewer } from "@/lib/auth";
import { REVIEW_LIMIT_PER_IP } from "@/lib/oshiete/config";
import { anonId, clientIp, underLimits } from "@/lib/oshiete/server";
import { createAdminClient } from "@/lib/supabase/admin";

const clip = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 2000) : "");

export async function POST(request: Request) {
  let body: { rating?: unknown; best?: unknown; hard?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return Response.json({ error: "rating required" }, { status: 400 });

  if (!(await underLimits([{ key: `review-ip:${await clientIp()}`, limit: REVIEW_LIMIT_PER_IP }]))) {
    return Response.json({ error: "too many" }, { status: 429 });
  }
  const viewer = await getViewer();
  const { error } = await createAdminClient()
    .from("oshiete_reviews")
    .insert({
      user_id: viewer?.id ?? null,
      anon_id: viewer ? null : await anonId(),
      rating,
      best: clip(body.best) || null,
      hard: clip(body.hard) || null,
    });
  if (error) {
    console.error("[oshiete review]", error.message);
    return Response.json({ error: "save failed" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
