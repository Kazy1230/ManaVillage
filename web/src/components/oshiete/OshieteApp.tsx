"use client";

// おしえて英語(サイト版)。画面の流れと言葉は Artifact 版(英語動画ショート/app/oshiete.html)と同じ。
// ・ログインしていない人:最初の3トーク(体験版)だけ。進み具合はこのブラウザに保存
// ・ログインした人:1日3トーク(日本時間の朝7時に次の3つが届く)。進み具合は Supabase に保存
// ・3トーク解決したら、ログインの案内(ログインしていない人だけ)→ レビュー
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DAILY, HINT_VIDEOS, TRIAL, dayKey } from "@/lib/oshiete/config";
import { keywordJudge, type JudgeResponse } from "@/lib/oshiete/judge";
import { doneCount, freshState, normalizeState, type Msg, type OshieteState } from "@/lib/oshiete/state";
import { NUDGE, PEOPLE, PHASES, RETRY, TALKS, THANKS, type Talk, type Who } from "@/lib/oshiete/talks";
import { IconBack, IconBulb, IconCheck, IconMsg, IconNext, IconSend, IconStar, IconX } from "./icons";

const LOCAL_KEY = "oshiete-eigo-site-v1";
const IMG = { logo: "/oshiete/logo.png", grammar: "/oshiete/grammar.png", toeic: "/oshiete/toeic.png", toefl: "/oshiete/toefl.png", done: "/oshiete/talk.png" };
const AV: Record<string, string> = { boy: "/oshiete/av_boy_jh.png", girl: "/oshiete/av_girl_hs.png", man: "/oshiete/av_man.png" };
const LOGIN_URL = "/login?next=%2Foshiete";
const SIGNUP_URL = "/signup?next=%2Foshiete";

type Modal = null | "login" | "review";
type UI = {
  view: "top" | "list" | "chat";
  cur: number;
  judging: Record<number, boolean>;
  note: Record<number, string>;
  hint: boolean;
  leaving: number;
  fresh: boolean;
  bump: boolean;
  showDone: boolean;
  confirmReset: boolean;
  modal: Modal;
};

function now() {
  const d = new Date();
  return d.getHours() + ":" + ("0" + d.getMinutes()).slice(-2);
}

function loadLocal(): OshieteState | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? normalizeState(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

// 日付が変わっていたら、今日の数を 0 にもどす(朝7時の区切り)
function rolled(s: OshieteState): { s: OshieteState; fresh: boolean } {
  const today = dayKey();
  return s.day === today ? { s, fresh: false } : { s: { ...s, day: today, dayCount: 0 }, fresh: true };
}

// 3トーク解決したあとに出すポップアップ
function modalFor(s: OshieteState, loggedIn: boolean): Modal {
  if (doneCount(s) < TRIAL || s.flags.reviewed) return null;
  return !loggedIn && !s.flags.loginAsked ? "login" : "review";
}

const say = (s: OshieteState, i: number, text: string, me = false): OshieteState => ({
  ...s,
  conv: { ...s.conv, [i]: [...(s.conv[i] ?? []), { me, text, time: now() } satisfies Msg] },
});

function Avatar({ who, size }: { who: Who; size: number }) {
  const p = PEOPLE[who];
  return (
    <span className="av" aria-hidden="true" style={{ width: size, height: size, background: p.color }}>
      <Image src={AV[p.av]} alt="" width={size} height={size} />
    </span>
  );
}

export default function OshieteApp({ viewer, saved, devTools }: { viewer: { nickname: string } | null; saved: OshieteState | null; devTools: boolean }) {
  const loggedIn = !!viewer;
  // 最初の状態:ログインした人は Supabase の保存、まだなければ(体験版のあとに初めてログインしたとき)このブラウザの体験版の分を引きつぐ
  const [init] = useState(() => {
    const base = (loggedIn ? saved ?? loadLocal() : loadLocal()) ?? freshState();
    const r = rolled(base);
    return { s: r.s, fresh: r.fresh, upload: loggedIn && !saved };
  });
  const [S, setS] = useState<OshieteState>(init.s);
  const [ui, setUi] = useState<UI>(() => ({
    view: "top", cur: -1, judging: {}, note: {}, hint: false, leaving: -1, fresh: init.fresh, bump: false, showDone: false, confirmReset: false,
    modal: modalFor(init.s, loggedIn),
  }));
  const [draft, setDraft] = useState("");
  const sRef = useRef(S);
  const box = useRef<HTMLTextAreaElement>(null);
  const msgs = useRef<HTMLDivElement>(null);

  // ---------- 保存 ----------
  const firstSave = useRef(!init.upload);
  useEffect(() => {
    sRef.current = S;
    if (!loggedIn) {
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(S));
      } catch {}
      return;
    }
    // 読み込んだ直後は送らない(体験版を引きついだときだけ、すぐ送る)
    if (firstSave.current) {
      firstSave.current = false;
      return;
    }
    const timer = setTimeout(() => {
      fetch("/api/oshiete/state", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(S), keepalive: true }).catch(() => {});
    }, 400);
    return () => clearTimeout(timer);
  }, [S, loggedIn]);

  // ログインした人は、ポップアップの状態もこのブラウザに残しておく(ログアウトしたあとに体験版の案内が出ないように)
  useEffect(() => {
    if (!loggedIn || !S.flags.reviewed) return;
    try {
      const local = loadLocal();
      if (local && !local.flags.reviewed) localStorage.setItem(LOCAL_KEY, JSON.stringify({ ...local, flags: { ...local.flags, loginAsked: true, reviewed: true } }));
    } catch {}
  }, [S.flags.reviewed, loggedIn]);

  // 開いたまま朝7時をまたいだら、次の質問を届ける
  useEffect(() => {
    const id = setInterval(() => {
      const r = rolled(sRef.current);
      if (r.fresh) {
        setS(r.s);
        setUi((u) => ({ ...u, fresh: true }));
      }
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  // トークの一番下を見せる
  useEffect(() => {
    if (msgs.current) msgs.current.scrollTop = msgs.current.scrollHeight;
  }, [S.conv, ui.cur, ui.view, ui.judging]);

  // ヒントを Esc で閉じる
  useEffect(() => {
    if (!ui.hint) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUi((u) => ({ ...u, hint: false }));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [ui.hint]);

  const go = (patch: Partial<UI>) => setUi((u) => ({ ...u, confirmReset: false, fresh: patch.view === "list" ? u.fresh : false, ...patch }));

  // ---------- 判定 ----------
  async function judge(i: number, stage: "q" | "mistake", text: string, teacher: string[]): Promise<JudgeResponse> {
    const t = TALKS[i];
    try {
      const res = await fetch("/api/oshiete/judge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ i, stage, text, teacher }) });
      if (res.ok) return (await res.json()) as JudgeResponse;
    } catch {}
    return { ...keywordJudge(t, stage, text), note: "AIの判定が使えなかったので、言葉で簡易判定しました" };
  }

  async function send() {
    const i = ui.cur;
    const t = TALKS[i];
    const text = draft.trim();
    if (!t || !text || ui.judging[i] || S.done[i]) return;
    setDraft("");
    const stage = S.stage[i] ?? "q";
    const teacher = [...(S.conv[i] ?? []).filter((m) => m.me).map((m) => m.text), text];
    setS((s) => say(s, i, text, true));
    setUi((u) => ({ ...u, judging: { ...u.judging, [i]: true }, note: { ...u.note, [i]: "" } }));
    const started = Date.now();
    const verdict = await judge(i, stage, text, teacher);
    const wait = 1200 - (Date.now() - started);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    setUi((u) => ({ ...u, judging: { ...u.judging, [i]: false }, note: { ...u.note, [i]: verdict.note ?? "" } }));
    // 別のトークや画面に移っていても、返事はこのトークに残す
    if (stage === "mistake") {
      if (verdict.result === "solved") return solve(i);
      setS((s) => say(s, i, RETRY));
      return;
    }
    if (verdict.result === "solved") {
      if (t.mistake) {
        const m = t.mistake.t;
        setS((s) => ({ ...say(s, i, m), stage: { ...s.stage, [i]: "mistake" } }));
        return;
      }
      return solve(i);
    }
    // 追い質問(同じものは2回出さない)。2つとも出し終わったら、ヒントを見るように頼む
    const want = verdict.result === "followup" && verdict.id === "f2" ? 1 : 0;
    setS((s) => {
      const used = s.used[i] ?? [];
      const pick = used.indexOf(want) < 0 ? want : used.indexOf(1 - want) < 0 ? 1 - want : -1;
      const next = pick >= 0 ? say(s, i, t.f[pick]) : say(s, i, NUDGE);
      return pick >= 0 ? { ...next, used: { ...s.used, [i]: [...used, pick] } } : next;
    });
  }

  // 「ありがとう」を出した瞬間に解決を記録する(そのあとは送れない。読み込み直しても解決のまま)
  function solve(i: number) {
    setS((s) => ({ ...say(s, i, THANKS), done: { ...s.done, [i]: true }, solvedAt: { ...s.solvedAt, [i]: Date.now() }, dayCount: s.dayCount + 1 }));
    setTimeout(() => {
      // そのトークを開いたままのときだけ、一覧にもどって「解決！」を見せる
      let moved = false;
      setUi((u) => {
        if (u.view !== "chat" || u.cur !== i) return u;
        moved = true;
        return { ...u, view: "list", hint: false, leaving: i };
      });
      setTimeout(() => {
        const modal = modalFor(sRef.current, loggedIn);
        if (modal === "login") setS((s) => ({ ...s, flags: { ...s.flags, loginAsked: true } }));
        setUi((u) => ({ ...u, leaving: -1, bump: true, modal: u.modal ?? modal }));
        setTimeout(() => setUi((u) => ({ ...u, bump: false })), 900);
      }, moved ? 1100 : 0);
    }, 1700);
  }

  // ---------- 画面 ----------
  const done = doneCount(S);
  const quota = loggedIn ? DAILY : TRIAL;
  const used = loggedIn ? Math.min(S.dayCount, DAILY) : Math.min(done, TRIAL);
  const chipLabel = (loggedIn ? "今日 " : "体験 ") + used + "/" + quota;

  let screen: React.ReactNode;
  // 画面は関数として呼ぶ(コンポーネントにすると、描き直すたびに入力欄が作り直されて、文字が消える)
  if (ui.view === "top") screen = topView();
  else if (ui.view === "list") screen = listView();
  else screen = chatView();

  return (
    <div className="app">
      {screen}
      {ui.modal === "login" && (
        <LoginModal
          onSkip={() => {
            setS((s) => ({ ...s, flags: { ...s.flags, loginAsked: true } }));
            setUi((u) => ({ ...u, modal: "review" }));
          }}
        />
      )}
      {ui.modal === "review" && (
        <ReviewModal
          onClose={() => {
            setS((s) => ({ ...s, flags: { ...s.flags, loginAsked: true, reviewed: true } }));
            setUi((u) => ({ ...u, modal: null }));
          }}
        />
      )}
    </div>
  );

  function topView() {
    const subj = [
      { id: "grammar", name: "基本英文法", icon: IMG.grammar, color: "#FFD3B0", tags: ["すべての土台", "学び直し"], prog: "解決 " + done + "/" + TALKS.length },
      { id: "toeic", name: "TOEIC", icon: IMG.toeic, color: "#CFE3FF", tags: ["就職", "昇進"], soon: true },
      { id: "toefl", name: "TOEFL", icon: IMG.toefl, color: "#D3EEDA", tags: ["留学", "大学院"], soon: true },
    ];
    return (
      <div className="view">
        <div className="top-head pad">
          <div className="brand">
            <b><Image src={IMG.logo} alt="" width={30} height={30} />おしえて英語</b>
            <span className="pill">{chipLabel}</span>
          </div>
          <h1>何を教える？</h1>
          <p className="lead">あなたが先生。生徒の質問に答えるほど、自分の英語が身につきます。</p>
          {!loggedIn && <p className="trialnote">ログインしなくても、最初の3つの質問を体験できます。続きは、ログインすると毎朝3つずつ届きます。</p>}
        </div>
        <div className="subjects pad">
          {subj.map((c) => (
            <button key={c.id} type="button" className="subject" disabled={!!c.soon} onClick={() => go({ view: "list" })}>
              <span className="ic" aria-hidden="true" style={{ background: c.color }}><Image src={c.icon} alt="" width={64} height={64} /></span>
              <span className="body">
                <span className="name">{c.name}</span>
                <span className="tags">
                  {c.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                  {c.soon && <span className="tag soon">準備中</span>}
                </span>
                {c.prog && <span className="prog">{c.prog}</span>}
              </span>
              {!c.soon && <IconNext />}
            </button>
          ))}
        </div>
        <div className="foot pad">
          <span className="toplinks">
            <Link href="/">まなビレッジ</Link>
            {loggedIn ? <Link href="/mypage">マイページ（{viewer?.nickname}）</Link> : <a href={LOGIN_URL}>ログイン</a>}
          </span>
        </div>
        <div className="foot pad">
          {devTools && (
            <button type="button" className="ghost" onClick={() => { setS((s) => ({ ...s, dayCount: 0 })); go({ fresh: true }); }}>
              テスト用：次の日にする
            </button>
          )}
          <button type="button" className="ghost" onClick={() => setUi((u) => ({ ...u, confirmReset: true }))}>はじめからやり直す</button>
        </div>
        {ui.confirmReset && (
          <div className="foot pad">
            <span className="lead">進み具合を全部消します。</span>
            <button type="button" className="ghost" onClick={() => { setS({ ...freshState(), flags: S.flags }); go({}); }}>消す</button>
            <button type="button" className="ghost" onClick={() => go({})}>やめる</button>
          </div>
        )}
      </div>
    );
  }

  function listView() {
    const n = TALKS.findIndex((_, k) => !S.done[k]);
    const trialOver = !loggedIn && done >= TRIAL;
    const rest = Math.max(0, quota - used);
    const shown: number[] = [];
    for (let k = 0; k < TALKS.length && shown.length < rest; k++) if (!S.done[k]) shown.push(k);
    if (ui.leaving >= 0 && !shown.includes(ui.leaving)) shown.unshift(ui.leaving);
    // 見出し:並んでいるトークのフェーズ。2つにまたがる日は「フェーズ1・2」
    const phs: number[] = [];
    shown.forEach((k) => { if (!phs.includes(TALKS[k].ph)) phs.push(TALKS[k].ph); });
    if (!phs.length) phs.push(TALKS[n >= 0 ? n : TALKS.length - 1].ph);
    let label: string;
    if (phs.length > 1) label = "フェーズ" + phs.join("・");
    else {
      const inPh = TALKS.map((_, k) => k).filter((k) => TALKS[k].ph === phs[0]);
      label = PHASES[phs[0] - 1].name + "・" + inPh.filter((k) => S.done[k]).length + "/" + inPh.length;
    }
    const arrive = ui.fresh && shown.length > 0;
    let empty: React.ReactNode = null;
    if (rest === 0 && ui.leaving < 0 && n >= 0) {
      empty = trialOver ? (
        <div className="empty">
          <Image src={IMG.done} alt="" width={128} height={128} />
          <b>体験版はここまで！</b>
          <span>おつかれさまでした、先生。<br />ログインすると、毎朝7時に新しい質問が3つずつ届きます。</span>
          <span className="acts">
            <a className="btn primary" href={LOGIN_URL}>ログインして続ける</a>
            <a className="btn" href={SIGNUP_URL}>無料で登録する</a>
          </span>
        </div>
      ) : (
        <div className="empty">
          <Image src={IMG.done} alt="" width={128} height={128} />
          <b>今日の質問はここまで！</b>
          <span>おつかれさまでした、先生。<br />明日の朝7時に、また生徒が質問しに来ます。</span>
        </div>
      );
    }
    if (n < 0 && ui.leaving < 0) {
      empty = (
        <div className="empty">
          <Image src={IMG.done} alt="" width={128} height={128} />
          <b>質問はぜんぶ解決！</b>
          <span>基本英文法の質問は、ひととおり答えました。</span>
        </div>
      );
    }
    // 解決したトーク(新しい順)。開くと会話を読み返せる
    const doneList = Object.keys(S.done).map(Number).filter((k) => S.done[k] && k !== ui.leaving)
      .sort((a, b) => (S.solvedAt[b] ?? b) - (S.solvedAt[a] ?? a));
    const qTime = (k: number) => S.qtime[k] ?? now();
    return (
      <div className="view">
        <div className="bar pad">
          <button type="button" className="iconbtn" aria-label="科目の選択にもどる" onClick={() => go({ view: "top" })}><IconBack /></button>
          <div className="t"><b>基本英文法</b><span>{label}</span></div>
          <span className={"chip" + (ui.bump ? " bump" : "")}><IconCheck />{chipLabel}</span>
        </div>
        <div className="list">
          {arrive && <div className="toast" role="status"><span><IconMsg />新しい質問が届きました</span></div>}
          {shown.map((k) => {
            const t = TALKS[k];
            const p = PEOPLE[t.who];
            const conv = S.conv[k] ?? [];
            const answered = conv.some((m) => m.me);
            const last = conv.length ? conv[conv.length - 1].text : t.q[t.q.length - 1];
            const cls = ui.leaving === k ? "row leaving" : arrive ? "row arriving" : "row";
            return (
              <div key={k} className={cls}>
                <button type="button" className="talk pad" onClick={() => openTalk(k)}>
                  <Avatar who={t.who} size={54} />
                  <span className="mid">
                    <span className="who"><b>{p.name}</b><span className="topic">{t.topic}</span></span>
                    <span className="last">{last}</span>
                  </span>
                  <span className="side"><span>{qTime(k)}</span>{!answered && <span className="unread" aria-label="未回答" />}</span>
                </button>
                {ui.leaving === k && <div className="pop" aria-live="polite"><span className="badge"><IconCheck />解決！</span></div>}
              </div>
            );
          })}
          {empty}
          {doneList.length > 0 && (
            <div className="donebox">
              <button type="button" className="donehead pad" aria-expanded={ui.showDone} onClick={() => setUi((u) => ({ ...u, showDone: !u.showDone }))}>
                <IconCheck />解決したトーク（{doneList.length}）<span className={"caret" + (ui.showDone ? " open" : "")}><IconNext /></span>
              </button>
              {ui.showDone && doneList.map((k) => {
                const t = TALKS[k];
                return (
                  <button key={k} type="button" className="talk done pad" onClick={() => openTalk(k)}>
                    <Avatar who={t.who} size={40} />
                    <span className="mid"><span className="who"><b>{PEOPLE[t.who].name}</b><span className="topic">{t.topic}</span></span></span>
                    <span className="side"><span className="ok"><IconCheck />解決</span></span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  function openTalk(k: number) {
    if (ui.leaving >= 0) return;
    // 生徒の質問の時刻:はじめて開いたときに記録する(先生の返事より後の時刻に見えないように)
    if (!S.qtime[k]) setS((s) => ({ ...s, qtime: { ...s.qtime, [k]: now() } }));
    go({ view: "chat", cur: k, hint: false });
  }

  function chatView() {
    const i = ui.cur;
    const t = TALKS[i];
    const p = PEOPLE[t.who];
    const solved = !!S.done[i];
    const busy = !!ui.judging[i];
    const qt = S.qtime[i] ?? now();
    const list: Msg[] = [...t.q.map((q) => ({ me: false, text: q, time: qt })), ...(S.conv[i] ?? [])];
    return (
      <div className="view">
        <div className="bar pad">
          <button type="button" className="iconbtn" aria-label="トーク選択にもどる" onClick={() => go({ view: "list", hint: false })}><IconBack /></button>
          <Avatar who={t.who} size={40} />
          <div className="t"><b>{p.name}</b><span className="two">{t.topic}</span></div>
          <button type="button" className="hintbtn" onClick={() => setUi((u) => ({ ...u, hint: true }))}><IconBulb />ヒント</button>
        </div>
        <div className="msgs pad" ref={msgs}>
          <span className="day">今日</span>
          {list.map((m, n) =>
            m.me ? (
              <div key={n} className="m me"><div className="bub">{m.text}</div><time>既読　{m.time}</time></div>
            ) : (
              <div key={n} className="m"><Avatar who={t.who} size={36} /><div className="col"><div className="bub">{m.text}</div><time>{m.time}</time></div></div>
            ),
          )}
          {busy && <div className="m"><Avatar who={t.who} size={36} /><span className="dots" aria-label="生徒が考えています"><i /><i /><i /></span></div>}
          {solved && <span className="solved"><IconCheck />このトピックは解決しました</span>}
          {ui.note[i] && <span className="note">{ui.note[i]}</span>}
        </div>
        <div className="compose pad">
          <label htmlFor="answer" className="sr">先生として答える</label>
          <textarea
            id="answer"
            ref={box}
            rows={1}
            value={draft}
            placeholder={solved ? "解決しました" : busy ? "生徒が考えています…" : "先生として答えよう…"}
            disabled={solved || busy}
            onChange={(e) => {
              setDraft(e.target.value);
              const el = e.target;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 140) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                e.preventDefault();
                void send();
              }
            }}
          />
          <button type="button" className="send" aria-label="送る" disabled={solved || busy} onClick={() => void send()}><IconSend /></button>
        </div>
        {ui.hint && <HintSheet t={t} onClose={() => setUi((u) => ({ ...u, hint: false }))} />}
      </div>
    );
  }
}

function HintSheet({ t, onClose }: { t: Talk; onClose: () => void }) {
  const ph = PHASES[t.ph - 1];
  const yt = HINT_VIDEOS[t.video];
  return (
    <div className="shade" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label="ヒント">
        <div className="sheet-head pad">
          <div className="t"><small>ヒント</small><b>{t.topic}</b></div>
          <button type="button" className="iconbtn close" aria-label="ヒントを閉じる" autoFocus onClick={onClose}><IconX /></button>
        </div>
        <div className="sheet-body pad">
          {yt && (
            <div className="ytwrap">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(yt)}?rel=0&playsinline=1`}
                title={`ヒント動画：${t.topic}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}
          {yt && <h2>動画を見られないときは、こちら</h2>}
          <div className="explain">{t.hint}</div>
          <h2>{ph.mapTitle}</h2>
          <div className="map">{ph.map}</div>
        </div>
      </div>
    </div>
  );
}

function Perk({ children }: { children: React.ReactNode }) {
  return <li><IconCheck />{children}</li>;
}

function LoginModal({ onSkip }: { onSkip: () => void }) {
  return (
    <div className="modal-shade">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <Image className="art" src={IMG.done} alt="" width={96} height={96} />
        <h2 id="login-title">3つの質問、解決しました！</h2>
        <p>おつかれさまでした、先生。ログイン・登録（無料）すると、続きの質問に答えられます。</p>
        <ul className="perks">
          <Perk>毎朝7時に、新しい質問が3つずつ届きます</Perk>
          <Perk>進み具合が保存され、ほかの端末でも続きから</Perk>
          <Perk>質問が届いたら、メールでお知らせ</Perk>
        </ul>
        <a className="btn primary" href={LOGIN_URL}>ログインして続ける</a>
        <a className="btn" href={SIGNUP_URL}>無料で登録する</a>
        <button type="button" className="btn text" onClick={onSkip}>今はしない</button>
      </div>
    </div>
  );
}

function ReviewModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [best, setBest] = useState("");
  const [hard, setHard] = useState("");
  const [state, setState] = useState<"edit" | "sending" | "sent" | "error">("edit");

  async function submit() {
    if (!rating) return;
    setState("sending");
    try {
      const res = await fetch("/api/oshiete/review", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating, best, hard }) });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="modal-shade">
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="review-done">
          <Image className="art" src={IMG.done} alt="" width={96} height={96} />
          <h2 id="review-done">ありがとうございました！</h2>
          <p>いただいた声は、おしえて英語をよくするために使わせていただきます。</p>
          <button type="button" className="btn primary" autoFocus onClick={onClose}>閉じる</button>
        </div>
      </div>
    );
  }
  return (
    <div className="modal-shade">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="review-title">
        <h2 id="review-title">感想を聞かせてください</h2>
        <p className="q">おしえて英語はどうでしたか？</p>
        <div className="stars" role="radiogroup" aria-label="5段階の評価">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n}つ星`} className={"star" + (n <= rating ? " on" : "")} onClick={() => setRating(n)}>
              <IconStar />
            </button>
          ))}
        </div>
        <label>
          先生になって教えてみて、いちばんよかったところはどこですか？
          <span className="opt">（空のままでも送れます）</span>
          <textarea value={best} maxLength={2000} onChange={(e) => setBest(e.target.value)} />
        </label>
        <label>
          分かりにくかったところ・やりにくかったところはどこですか？
          <span className="opt">（空のままでも送れます）</span>
          <textarea value={hard} maxLength={2000} onChange={(e) => setHard(e.target.value)} />
        </label>
        {state === "error" && <p className="err" role="alert">送れませんでした。時間をおいて、もう一度お試しください。</p>}
        <button type="button" className="btn primary" disabled={!rating || state === "sending"} onClick={() => void submit()}>
          {state === "sending" ? "送信中…" : rating ? "送る" : "★を選んでください"}
        </button>
        <button type="button" className="btn text" onClick={onClose}>今はしない</button>
      </div>
    </div>
  );
}
