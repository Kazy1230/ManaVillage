"use client";

import Link from "next/link";
import { useState } from "react";
import ActionForm from "@/components/ActionForm";
import { t as tr } from "@/lib/i18n";
import type { Lang } from "@/lib/sections";
import type { ActionState } from "@/lib/types";

type Props = {
  action: (state: ActionState, fd: FormData) => Promise<ActionState>;
  hidden: Record<string, string>;
  parentId: number;
  to: string;
  loggedIn: boolean;
  loginHref: string;
  lang?: Lang;
};

export default function ReplyToggle({ action, hidden, parentId, to, loggedIn, loginHref, lang = "ja" }: Props) {
  const s = tr(lang);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="reply-btn" type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? s.close : s.reply}
      </button>
      {open && (
        <div className="reply-box">
          {loggedIn ? (
            <ActionForm
              action={action}
              submitLabel={s.reply}
              pendingLabel={s.sending}
              className="compose"
              buttonClass="btn primary small"
              footNote={s.noEdit}
              onSuccess={() => setOpen(false)}
            >
              {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
              <input type="hidden" name="parent_id" value={parentId} />
              <label className="sr-only" htmlFor={`reply-${parentId}`}>{s.replyToLabel(to)}</label>
              <textarea id={`reply-${parentId}`} name="body" required maxLength={2000} placeholder={s.replyTo(to)} autoFocus />
            </ActionForm>
          ) : (
            <div className="prompt" style={{ margin: 0 }}>
              <span>{s.loginToReply}</span>
              <Link className="btn primary small" href={loginHref}>{s.login}</Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
