import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// メールのリンクの鍵で、朝のメールを止める(ログインしなくても止められる)
export async function stopMailByToken(token: string) {
  if (!UUID.test(token)) return false;
  const { data, error } = await createAdminClient()
    .from("oshiete_progress")
    .update({ mail_opt_out: true })
    .eq("unsub_token", token)
    .select("user_id");
  if (error) console.error("[oshiete mail-stop]", error.message);
  return !error && (data?.length ?? 0) > 0;
}
