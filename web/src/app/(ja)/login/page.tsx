import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { login } from "@/app/actions";
import ActionForm from "@/components/ActionForm";
import AuthShell from "@/components/AuthShell";
import { getViewer, safeNext } from "@/lib/auth";

export const metadata: Metadata = { title: "ログイン" };

export default async function LoginPage(props: PageProps<"/login">) {
  const sp = await props.searchParams;
  const next = safeNext(typeof sp.next === "string" ? sp.next : null);
  if (await getViewer()) redirect(next);

  return (
    <AuthShell title="おかえりなさい" sub="ログインしてコメントや掲示板に参加しましょう" tab="login" next={next}>
      {sp.error === "link" && <p className="flash err" role="alert">リンクの有効期限が切れているか、すでに使われています。もう一度お試しください。</p>}
      <ActionForm action={login} submitLabel="ログイン" pendingLabel="ログイン中…">
        <input type="hidden" name="next" value={next} />
        <label className="field" htmlFor="li-mail">メールアドレス<input id="li-mail" name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
        <label className="field" htmlFor="li-pass">パスワード<input id="li-pass" name="password" type="password" autoComplete="current-password" required /></label>
      </ActionForm>
      <Link className="link" href="/reset-password">パスワードを忘れた方</Link>
    </AuthShell>
  );
}
