import type { Metadata } from "next";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions";
import ActionForm from "@/components/ActionForm";
import AuthShell from "@/components/AuthShell";

export const metadata: Metadata = { title: "パスワードの再設定" };

export default function ResetPasswordPage() {
  return (
    <AuthShell title="パスワードの再設定" sub="登録したメールアドレスに、再設定用のリンクを送ります">
      <ActionForm action={requestPasswordReset} submitLabel="再設定メールを送る">
        <label className="field" htmlFor="rp-mail">メールアドレス<input id="rp-mail" name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
      </ActionForm>
      <Link className="link" href="/login">ログインに戻る</Link>
    </AuthShell>
  );
}
