// 進み具合の形(Artifact 版と同じ。ログインしていない人はブラウザに、ログインした人は Supabase の oshiete_progress.state に保存する)
import { dayKey } from "@/lib/oshiete/config";

export type Msg = { me: boolean; text: string; time: string };
export type Stage = "q" | "mistake";

export type OshieteState = {
  done: Record<string, boolean>;
  day: string;
  dayCount: number;
  conv: Record<string, Msg[]>;
  stage: Record<string, Stage>;
  used: Record<string, number[]>;
  qtime: Record<string, string>;
  solvedAt: Record<string, number>;
  // ログインの案内・レビューを出したかどうか
  flags: { loginAsked?: boolean; reviewed?: boolean };
};

export function freshState(): OshieteState {
  return { done: {}, day: dayKey(), dayCount: 0, conv: {}, stage: {}, used: {}, qtime: {}, solvedAt: {}, flags: {} };
}

// 保存されていた値を、今の形にそろえる(足りない項目は空で補う)
export function normalizeState(raw: unknown): OshieteState | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as Partial<OshieteState>;
  if (!r.done || typeof r.done !== "object") return null;
  return { ...freshState(), ...r, flags: { ...(r.flags ?? {}) } } as OshieteState;
}

export const doneCount = (s: OshieteState) => Object.keys(s.done).filter((k) => s.done[k]).length;
