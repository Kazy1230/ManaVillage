// ログイン・新規登録・パスワードの再設定・新しいパスワードの画面。日本語(/login など)と英語(/en/login など)で共通
import Link from "next/link";
import { redirect } from "next/navigation";
import { login, requestPasswordReset, signup, updatePassword } from "@/app/actions";
import ActionForm from "@/components/ActionForm";
import AuthShell from "@/components/AuthShell";
import { getViewer, requireViewer, safeNext } from "@/lib/auth";
import { lp } from "@/lib/paths";
import type { Lang } from "@/lib/sections";

type SP = Record<string, string | string[] | undefined>;

const T = {
  ja: {
    loginTitle: "おかえりなさい",
    loginSub: "ログインしてコメントや掲示板に参加しましょう",
    linkExpired: "リンクの有効期限が切れているか、すでに使われています。もう一度お試しください。",
    login: "ログイン",
    loggingIn: "ログイン中…",
    email: "メールアドレス",
    password: "パスワード",
    forgot: "パスワードを忘れた方",
    signupTitle: "はじめまして",
    signupSub: "無料で登録して、記事へのコメントや掲示板に参加しましょう",
    signupBtn: "無料で登録する",
    signingUp: "登録中…",
    nickname: "ニックネーム",
    nicknamePh: "例：みほ",
    nicknameHint: "コメントや掲示板に表示されます。あとから変更できます。",
    emailHint: "ログインと、返信のお知らせに使います。公開されません。",
    passwordPh: "8文字以上",
    consent: (terms: React.ReactNode, privacy: React.ReactNode) => <>登録すると、{terms}と{privacy}に同意したものとみなします。</>,
    terms: "利用規約",
    privacy: "プライバシーポリシー",
    resetTitle: "パスワードの再設定",
    resetSub: "登録したメールアドレスに、再設定用のリンクを送ります",
    resetBtn: "再設定メールを送る",
    backToLogin: "ログインに戻る",
    newPwTitle: "新しいパスワード",
    newPwSub: "新しいパスワードを設定してください",
    newPwBtn: "パスワードを変更する",
    sending: "送信中…",
  },
  en: {
    loginTitle: "Welcome back",
    loginSub: "Log in to join the comments and the board",
    linkExpired: "This link has expired or has already been used. Please try again.",
    login: "Log in",
    loggingIn: "Logging in…",
    email: "Email address",
    password: "Password",
    forgot: "Forgot your password?",
    signupTitle: "Nice to meet you",
    signupSub: "Sign up for free to comment on articles and join the board",
    signupBtn: "Sign up for free",
    signingUp: "Signing up…",
    nickname: "Nickname",
    nicknamePh: "e.g. Sam",
    nicknameHint: "Shown on your comments and posts. You can change it later.",
    emailHint: "Used for logging in and for reply notifications. Never shown publicly.",
    passwordPh: "At least 8 characters",
    consent: (terms: React.ReactNode, privacy: React.ReactNode) => <>By signing up, you agree to the {terms} and the {privacy}.</>,
    terms: "Terms of Use",
    privacy: "Privacy Policy",
    resetTitle: "Reset your password",
    resetSub: "We’ll send a reset link to the email address you registered with",
    resetBtn: "Send the reset email",
    backToLogin: "Back to log in",
    newPwTitle: "New password",
    newPwSub: "Set a new password",
    newPwBtn: "Change password",
    sending: "Sending…",
  },
} as const;

const nextOf = (sp: SP) => safeNext(typeof sp.next === "string" ? sp.next : null);
const LangField = ({ lang }: { lang: Lang }) => <input type="hidden" name="lang" value={lang} />;

export async function LoginView({ lang, sp }: { lang: Lang; sp: SP }) {
  const s = T[lang];
  const next = nextOf(sp);
  if (await getViewer()) redirect(next);
  return (
    <AuthShell title={s.loginTitle} sub={s.loginSub} tab="login" next={next} lang={lang}>
      {sp.error === "link" && <p className="flash err" role="alert">{s.linkExpired}</p>}
      <ActionForm action={login} submitLabel={s.login} pendingLabel={s.loggingIn}>
        <LangField lang={lang} />
        <input type="hidden" name="next" value={next} />
        <label className="field" htmlFor="li-mail">{s.email}<input id="li-mail" name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
        <label className="field" htmlFor="li-pass">{s.password}<input id="li-pass" name="password" type="password" autoComplete="current-password" required /></label>
      </ActionForm>
      <Link className="link" href={lp(lang, "/reset-password")}>{s.forgot}</Link>
    </AuthShell>
  );
}

export async function SignupView({ lang, sp }: { lang: Lang; sp: SP }) {
  const s = T[lang];
  const next = nextOf(sp);
  if (await getViewer()) redirect(next);
  return (
    <AuthShell title={s.signupTitle} sub={s.signupSub} tab="signup" next={next} lang={lang}>
      <ActionForm action={signup} submitLabel={s.signupBtn} pendingLabel={s.signingUp}>
        <LangField lang={lang} />
        <label className="field" htmlFor="su-nick">
          {s.nickname}
          <input id="su-nick" name="nickname" required maxLength={30} autoComplete="nickname" placeholder={s.nicknamePh} />
          <span className="hint">{s.nicknameHint}</span>
        </label>
        <label className="field" htmlFor="su-mail">
          {s.email}
          <input id="su-mail" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
          <span className="hint">{s.emailHint}</span>
        </label>
        <label className="field" htmlFor="su-pass">
          {s.password}
          <input id="su-pass" name="password" type="password" required minLength={8} autoComplete="new-password" placeholder={s.passwordPh} />
        </label>
      </ActionForm>
      <p className="hint" style={{ textAlign: "center", lineHeight: 1.8 }}>
        {s.consent(<Link href={lp(lang, "/terms")}>{s.terms}</Link>, <Link href={lp(lang, "/privacy")}>{s.privacy}</Link>)}
      </p>
    </AuthShell>
  );
}

export function ResetPasswordView({ lang }: { lang: Lang }) {
  const s = T[lang];
  return (
    <AuthShell title={s.resetTitle} sub={s.resetSub} lang={lang}>
      <ActionForm action={requestPasswordReset} submitLabel={s.resetBtn} pendingLabel={s.sending}>
        <LangField lang={lang} />
        <label className="field" htmlFor="rp-mail">{s.email}<input id="rp-mail" name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
      </ActionForm>
      <Link className="link" href={lp(lang, "/login")}>{s.backToLogin}</Link>
    </AuthShell>
  );
}

export async function UpdatePasswordView({ lang }: { lang: Lang }) {
  const s = T[lang];
  await requireViewer(lp(lang, "/update-password"), lang);
  return (
    <AuthShell title={s.newPwTitle} sub={s.newPwSub} lang={lang}>
      <ActionForm action={updatePassword} submitLabel={s.newPwBtn} pendingLabel={s.sending}>
        <LangField lang={lang} />
        <label className="field" htmlFor="up-pass">{s.password}<input id="up-pass" name="password" type="password" required minLength={8} autoComplete="new-password" placeholder={s.passwordPh} /></label>
      </ActionForm>
    </AuthShell>
  );
}
