// 朝のメール(Vercel Cron が毎朝7時・日本時間に呼ぶ。web/vercel.json)。
// ログインして遊んだことがあり、メールを止めておらず、まだ解決していない質問が残っている人に、その日の最初の質問を知らせる
import { dayKey } from "@/lib/oshiete/config";
import { normalizeState } from "@/lib/oshiete/state";
import { PEOPLE, TALKS } from "@/lib/oshiete/talks";
import { sendOshieteMorning } from "@/lib/mail";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 300;

type Row = { user_id: string; state: unknown; unsub_token: string; last_mailed_day: string | null };

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const dry = new URL(request.url).searchParams.get("dry") === "1";
  const today = dayKey();
  const admin = createAdminClient();
  let sent = 0, skipped = 0, failed = 0;

  for (let from = 0; ; from += 500) {
    const { data, error } = await admin
      .from("oshiete_progress")
      .select("user_id, state, unsub_token, last_mailed_day")
      .eq("mail_opt_out", false)
      .or(`last_mailed_day.is.null,last_mailed_day.lt.${today}`)
      .order("user_id")
      .range(from, from + 499);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    const rows = (data ?? []) as Row[];
    for (const row of rows) {
      const s = normalizeState(row.state);
      const next = s ? TALKS.findIndex((_, i) => !s.done[i]) : -1;
      // 全部解決した人と、今日の分にもう答えた人には送らない
      if (!s || next < 0 || (s.day === today && s.dayCount > 0)) {
        skipped++;
        continue;
      }
      const t = TALKS[next];
      const p = PEOPLE[t.who];
      if (dry) {
        sent++;
        continue;
      }
      const ok = await sendOshieteMorning(row.user_id, p.name + p.honorific, p.profile, t.q[t.q.length - 1], row.unsub_token);
      if (ok) {
        sent++;
        await admin.from("oshiete_progress").update({ last_mailed_day: today }).eq("user_id", row.user_id);
      } else failed++;
      // Resend の送信の上限(1秒に2通)に合わせて少し待つ
      await new Promise((r) => setTimeout(r, 600));
    }
    if (rows.length < 500) break;
  }

  // 回数の上限の記録は、1週間より前のものを消す
  if (!dry) {
    const weekAgo = dayKey(new Date(Date.now() - 7 * 24 * 3600 * 1000));
    await admin.from("oshiete_rate").delete().lt("day", weekAgo);
  }
  console.info(`[oshiete morning] day=${today} sent=${sent} skipped=${skipped} failed=${failed}${dry ? " (dry)" : ""}`);
  return Response.json({ day: today, sent, skipped, failed, dry });
}
