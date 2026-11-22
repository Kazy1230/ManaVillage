"use client";

// マイページの「アカウントを削除する」。押すとポップアップで説明と確認のチェックが出て、「削除する」で削除する
import { useRef, useState } from "react";
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
  const ref = useRef<HTMLDialogElement>(null);
  const [checked, setChecked] = useState(false);
  const close = () => ref.current?.close();
  return (
    <>
      <button className="btn block-btn danger" type="button" onClick={() => ref.current?.showModal()}>
        {s.open}
      </button>
      <dialog
        ref={ref}
        className="delete-box"
        aria-labelledby="delete-title"
        onClose={() => setChecked(false)}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <p id="delete-title" className="delete-title">{s.title}</p>
        <ul>
          {s.points.map((p) => <li key={p}>{p}</li>)}
        </ul>
        <ActionForm action={deleteAccount} submitLabel={s.submit} pendingLabel={s.pending} buttonClass="btn block-btn danger solid" submitDisabled={!checked}>
          <input type="hidden" name="lang" value={lang} />
          <label className="check">
            <input type="checkbox" name="confirm" value="yes" required checked={checked} onChange={(e) => setChecked(e.target.checked)} />
            {s.confirm}
          </label>
        </ActionForm>
        <button className="btn block-btn" type="button" onClick={close}>{s.cancel}</button>
      </dialog>
    </>
  );
}
