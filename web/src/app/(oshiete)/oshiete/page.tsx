import type { Metadata } from "next";
import OshieteApp from "@/components/oshiete/OshieteLoader";
import { getViewer } from "@/lib/auth";
import { normalizeState } from "@/lib/oshiete/state";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: { absolute: "おしえて英語 | まなビレッジ" }, alternates: { canonical: "/oshiete" } };

export default async function Page() {
  const viewer = await getViewer();
  let saved = null;
  if (viewer) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("oshiete_progress").select("state").eq("user_id", viewer.id).maybeSingle();
    if (error) console.error("[oshiete load]", error.message);
    saved = normalizeState(data?.state);
  }
  return (
    <OshieteApp
      viewer={viewer ? { nickname: viewer.nickname } : null}
      saved={saved}
      devTools={process.env.NODE_ENV !== "production"}
    />
  );
}
