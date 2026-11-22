// ログインした人の進み具合を保存する(本人の行だけ。RLS で守る)
import { getViewer } from "@/lib/auth";
import { normalizeState } from "@/lib/oshiete/state";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: Request) {
  const viewer = await getViewer();
  if (!viewer) return Response.json({ error: "login required" }, { status: 401 });
  const raw = await request.text();
  if (raw.length > 250_000) return Response.json({ error: "too large" }, { status: 413 });
  let state;
  try {
    state = normalizeState(JSON.parse(raw));
  } catch {
    state = null;
  }
  if (!state) return Response.json({ error: "bad request" }, { status: 400 });

  const supabase = await createClient();
  const { error } = await supabase
    .from("oshiete_progress")
    .upsert({ user_id: viewer.id, state, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) {
    console.error("[oshiete state]", error.message);
    return Response.json({ error: "save failed" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
