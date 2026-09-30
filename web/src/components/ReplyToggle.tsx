"use client";

import Link from "next/link";
import { useState } from "react";
import ActionForm from "@/components/ActionForm";
import type { ActionState } from "@/lib/types";

type Props = {
  action: (state: ActionState, fd: FormData) => Promise<ActionState>;
  hidden: Record<string, string>;
  parentId: number;
  to: string;
  loggedIn: boolean;
  loginHref: string;
};

export default function ReplyToggle({ action, hidden, parentId, to, loggedIn, loginHref }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="reply-btn" type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? "閉じる" : "返信する"}
      </button>
      {open && (
        <div className="reply-box">
          {loggedIn ? (
            <ActionForm
              action={action}
              submitLabel="返信する"
              className="compose"
              buttonClass="btn primary small"
              footNote="投稿後は編集・削除できません"
              onSuccess={() => setOpen(false)}
            >
              {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
              <input type="hidden" name="parent_id" value={parentId} />
              <label className="sr-only" htmlFor={`reply-${parentId}`}>{to}さんへの返信</label>
              <textarea id={`reply-${parentId}`} name="body" required maxLength={2000} placeholder={`${to}さんへの返信を書く`} autoFocus />
            </ActionForm>
          ) : (
            <div className="prompt" style={{ margin: 0 }}>
              <span>返信するにはログインしてください。</span>
              <Link className="btn primary small" href={loginHref}>ログイン</Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
