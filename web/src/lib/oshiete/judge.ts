// 判定のしくみ(サーバーとブラウザの両方で使う)。
// AI(DeepSeek)に渡す文と、AI が使えないときの言葉の簡易判定は、Artifact 版と同じ
import type { Stage } from "@/lib/oshiete/state";
import type { Talk } from "@/lib/oshiete/talks";

export type Verdict = { result: "solved" } | { result: "followup"; id: "f1" | "f2" } | { result: "retry" };
export type JudgeResponse = Verdict & { note?: string };

export function judgePrompt(t: Talk, stage: Stage, text: string, teacherLines: string[]): string {
  if (stage === "mistake" && t.mistake) {
    return (
      "あなたは英語学習アプリの判定係です。ユーザーは「先生」役で、初心者の生徒に日本語で英語を教えています。\n" +
      "生徒がわざと間違えた文を言いました。先生の返事が、その間違いを正しく直せているかを判定してください。\n\n" +
      "# 生徒の間違い\n" + t.mistake.t + "\n\n# 正しい直し方\n" + t.mistake.fix + "\n\n# 先生の返事\n" + text + "\n\n" +
      "決まり：正しい英文を示しているか、何がどう違うかを正しく指摘していれば solved。間違いを認めてしまう、別の間違いを教える、直し方が書かれていない場合は retry。用語は使っていなくてよい。\n" +
      'JSONだけで答えてください：{"result":"solved"} または {"result":"retry"}'
    );
  }
  return (
    "あなたは英語学習アプリの判定係です。ユーザーは「先生」役で、初心者の生徒の質問に日本語で答えています。先生の答えで、生徒の疑問が解決したかを判定してください。\n\n" +
    "# 生徒の質問\n" + t.q.join("\n") + "\n\n# 正しい解説（判定の基準）\n" + t.hint + "\n\n" +
    "# 解決の要点（言い方は自由。全部伝わっていれば解決）\n" + t.key.map((k, n) => "①②③"[n] + " " + k).join("\n") + "\n\n" +
    "# 追い質問の候補\nf1：" + t.f[0] + "\nf2：" + t.f[1] + "\n\n" +
    "# 先生がこれまでに送った答え（古い順。合わせて判定する）\n" + teacherLines.map((m, n) => n + 1 + ". " + m).join("\n") + "\n\n" +
    "決まり：\n- 要点が、言い方を変えてでも全部伝わっていれば solved。主語・目的語などの用語は使っていなくてよい。正しい英文の例で示していてもよい。\n- 解説にないことは求めない。\n- 間違ったことを教えている、または要点が足りないなら followup。足りない要点を一番引き出せる追い質問の id を選ぶ。\n" +
    'JSONだけで答えてください：{"result":"solved"} または {"result":"followup","id":"f1"}'
  );
}

// AI の返事を確かめる(形が違えば null)
export function parseVerdict(v: unknown, stage: Stage): Verdict | null {
  if (!v || typeof v !== "object") return null;
  const r = (v as { result?: unknown }).result;
  if (r === "solved") return { result: "solved" };
  if (stage === "mistake") return r === "retry" || r === "followup" ? { result: "retry" } : null;
  if (r === "followup" || r === "retry") return { result: "followup", id: (v as { id?: unknown }).id === "f2" ? "f2" : "f1" };
  return null;
}

// ---------- 言葉の簡易判定(AI が使えないとき) ----------

export function keywordJudge(t: Talk, stage: Stage, text: string): Verdict {
  const low = text.toLowerCase().replace(/[’‘]/g, "'");
  const mistake = stage === "mistake" && t.mistake ? t.mistake : null;
  const kws = mistake ? mistake.kw : t.kw;
  // 質問文(わざと間違いの文)にもともと入っている言葉では、○にしない
  const src = (mistake ? mistake.t : t.q.join(" ")).toLowerCase();
  const ok = text.length >= 6 && kws.some((w) => {
    const lw = w.toLowerCase();
    return src.indexOf(lw) < 0 && kwHit(low, lw);
  });
  if (stage === "mistake") return { result: ok ? "solved" : "retry" };
  return ok ? { result: "solved" } : { result: "followup", id: "f1" };
}

// 言葉が答えに入っているか。英語は単語ごとに比べる(in が reaching に当たらないように)。
// すぐ後ろが打ち消し(じゃない・でもいい など)のときは数えない
const NEG = /^\s*[」』"']?\s*(?:は|が|を|で|って|も)?\s*(?:じゃな|ではな|でもい|でも大丈夫|でもよ|でも合|でもok|でもＯＫ|は違|はちが|は間違|とは限らな|わけじゃな|わけではな)/i;
function kwHit(low: string, w: string) {
  const ascii = /^[a-z0-9' ]+$/.test(w);
  let from = 0;
  let at: number;
  while ((at = low.indexOf(w, from)) >= 0) {
    from = at + 1;
    if (ascii && (/[a-z0-9']/.test(low.charAt(at - 1) || " ") || /[a-z0-9']/.test(low.charAt(at + w.length) || " "))) continue;
    if (NEG.test(low.slice(at + w.length, at + w.length + 16))) continue;
    return true;
  }
  return false;
}
