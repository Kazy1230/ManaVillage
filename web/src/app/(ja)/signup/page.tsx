import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signup } from "@/app/actions";
import ActionForm from "@/components/ActionForm";
import AuthShell from "@/components/AuthShell";
import { getViewer, safeNext } from "@/lib/auth";

export const metadata: Metadata = { title: "新規登録" };

export default async function SignupPage(props: PageProps<"/signup">) {
  const sp = await props.searchParams;
  const next = safeNext(typeof sp.next === "string" ? sp.next : null);
  if (await getViewer()) redirect(next);

  return (
    <AuthShell title="はじめまして" sub="無料で登録して、記事へのコメントや掲示板に参加しましょう" tab="signup" next={next}>
      <ActionForm action={signup} submitLabel="無料で登録する" pendingLabel="登録中…">
        <label className="field" htmlFor="su-nick">
          ニックネーム
          <input id="su-nick" name="nickname" required maxLength={30} autoComplete="nickname" placeholder="例：みほ" />
          <span className="hint">コメントや掲示板に表示されます。あとから変更できます。</span>
        </label>
        <label className="field" htmlFor="su-mail">
          メールアドレス
          <input id="su-mail" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
          <span className="hint">ログインと、返信のお知らせに使います。公開されません。</span>
        </label>
        <label className="field" htmlFor="su-pass">
          パスワード
          <input id="su-pass" name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="8文字以上" />
        </label>
      </ActionForm>
      <p className="hint" style={{ textAlign: "center", lineHeight: 1.8 }}>
        登録すると、<Link href="/terms">利用規約</Link>と<Link href="/privacy">プライバシーポリシー</Link>に同意したものとみなします。
      </p>
    </AuthShell>
  );
}
