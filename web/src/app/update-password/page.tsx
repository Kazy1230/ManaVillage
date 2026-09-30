import type { Metadata } from "next";
import { updatePassword } from "@/app/actions";
import ActionForm from "@/components/ActionForm";
import AuthShell from "@/components/AuthShell";
import { requireViewer } from "@/lib/auth";

export const metadata: Metadata = { title: "新しいパスワード" };

export default async function UpdatePasswordPage() {
  await requireViewer("/update-password");
  return (
    <AuthShell title="新しいパスワード" sub="新しいパスワードを設定してください">
      <ActionForm action={updatePassword} submitLabel="パスワードを変更する">
        <label className="field" htmlFor="up-pass">新しいパスワード<input id="up-pass" name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="8文字以上" /></label>
      </ActionForm>
    </AuthShell>
  );
}
