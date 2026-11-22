"use client";

// マイページの「アカウントを削除する」。押すと説明と確認のチェックが出て、もう一度押すと削除する
import { useState } from "react";
import { deleteAccount } from "@/app/actions";
import ActionForm from "@/components/ActionForm";
import type { Lang } from "@/lib/sections";

const T = {
  ja: {
    open: "アカウントを削除する",
    title: "アカウントを削除しますか？",
    points: [
      "メールアドレス・ニックネームなどのアカウントの情報を削除します。",
      "おしえて英語の進み具合も削除します。",
      "記事へのコメントや掲示板の書き込みは消えず、「退会したユーザー」として残ります。",
      "削除したアカウントは、元に戻せません。",
    ],
    confirm: "上のことを確認しました",
    submit: "削除する",
    pending: "削除しています…",
    cancel: "やめる",
  },
  en: {
    open: "Delete account",
    title: "Delete your account?",
    points: [
      "Your account information, such as your email address and nickname, will be deleted.",
      "Your comments and board posts will not be removed; they will remain under the name “Deleted user.”",
      "A deleted account cannot be restored.",
    ],
    confirm: "I understand the above",
    submit: "Delete",
    pending: "Deleting…",
    cancel: "Cancel",
  },
} as const;

export default function DeleteAccount({ lang }: { lang: Lang }) {
  const s = T[lang];
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button className="btn block-btn danger" type="button" onClick={() => setOpen(true)}>
        {s.open}
      </button>
    );
  }
  return (
    <div className="delete-box" role="group" aria-labelledby="delete-title">
      <p id="delete-title" className="delete-title">{s.title}</p>
      <ul>
        {s.points.map((p) => <li key={p}>{p}</li>)}
      </ul>
      <ActionForm action={deleteAccount} submitLabel={s.submit} pendingLabel={s.pending} buttonClass="btn block-btn danger solid">
        <input type="hidden" name="lang" value={lang} />
        <label className="check">
          <input type="checkbox" name="confirm" value="yes" required />
          {s.confirm}
        </label>
      </ActionForm>
      <button className="btn block-btn" type="button" onClick={() => setOpen(false)}>{s.cancel}</button>
    </div>
  );
}
