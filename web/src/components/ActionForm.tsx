"use client";

import { useActionState, useEffect, useEffectEvent } from "react";
import type { ActionState } from "@/lib/types";

type Props = {
  action: (state: ActionState, fd: FormData) => Promise<ActionState>;
  submitLabel: string;
  pendingLabel?: string;
  className?: string;
  buttonClass?: string;
  footNote?: React.ReactNode;
  onSuccess?: () => void;
  children: React.ReactNode;
};

export default function ActionForm({
  action,
  submitLabel,
  pendingLabel = "送信中…",
  className = "form",
  buttonClass = "btn primary block-btn",
  footNote,
  onSuccess,
  children,
}: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const succeeded = useEffectEvent(() => onSuccess?.());

  useEffect(() => {
    if (state.ok) succeeded();
  }, [state]);

  return (
    <form action={formAction} className={className}>
      {children}
      {state.error && <p className="flash err" role="alert">{state.error}</p>}
      {state.ok && <p className="flash ok" role="status">{state.ok}</p>}
      {footNote ? (
        <div className="compose-foot">
          <span className="hint">{footNote}</span>
          <button className={buttonClass} type="submit" disabled={pending}>{pending ? pendingLabel : submitLabel}</button>
        </div>
      ) : (
        <button className={buttonClass} type="submit" disabled={pending}>{pending ? pendingLabel : submitLabel}</button>
      )}
    </form>
  );
}
