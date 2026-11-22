// 先生の答えを判定する(AI は DeepSeek。使えないときは言葉の簡易判定)
import { getViewer } from "@/lib/auth";
import { JUDGE_LIMITS, TRIAL } from "@/lib/oshiete/config";
import { judgePrompt, keywordJudge, parseVerdict, type JudgeResponse } from "@/lib/oshiete/judge";
import { anonId, askDeepSeek, clientIp, underLimits } from "@/lib/oshiete/server";
import type { Stage } from "@/lib/oshiete/state";
import { TALKS } from "@/lib/oshiete/talks";

const MAX_TEXT = 1000;

export async function POST(request: Request) {
  let body: { i?: unknown; stage?: unknown; text?: unknown; teacher?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  const i = Number(body.i);
  const t = Number.isInteger(i) ? TALKS[i] : undefined;
  const stage: Stage = body.stage === "mistake" ? "mistake" : "q";
  const text = typeof body.text === "string" ? body.text.trim().slice(0, MAX_TEXT) : "";
  const teacher = Array.isArray(body.teacher) ? body.teacher.filter((x): x is string => typeof x === "string").slice(-10).map((x) => x.slice(0, MAX_TEXT)) : [];
  if (!t || !text || (stage === "mistake" && !t.mistake)) return Response.json({ error: "bad request" }, { status: 400 });

  const viewer = await getViewer();
  // ログインしていない人は、体験版の3トークだけ
  if (!viewer && i >= TRIAL) return Response.json({ error: "login required" }, { status: 403 });

  const fallback = (note: string): Response => Response.json({ ...keywordJudge(t, stage, text), note } satisfies JudgeResponse);

  const ip = await clientIp();
  const who = viewer ? { key: `user:${viewer.id}`, limit: JUDGE_LIMITS.user } : { key: `anon:${await anonId()}`, limit: JUDGE_LIMITS.anon };
  if (!(await underLimits([{ key: `ip:${ip}`, limit: JUDGE_LIMITS.ip }, who]))) {
    return fallback("今日のAI判定の回数が上限に達したので、言葉で簡易判定しました");
  }

  try {
    const verdict = parseVerdict(await askDeepSeek(judgePrompt(t, stage, text, teacher.length ? teacher : [text])), stage);
    if (verdict) return Response.json(verdict satisfies JudgeResponse);
    return fallback("AIの判定がうまく読めなかったので、言葉で簡易判定しました");
  } catch (e) {
    console.error("[oshiete judge]", e instanceof Error ? e.message : e);
    return fallback("AIの判定が使えなかったので、言葉で簡易判定しました");
  }
}
