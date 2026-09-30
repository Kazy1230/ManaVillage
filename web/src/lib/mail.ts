import "server-only";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/env";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "xenon.english@gmail.com";

async function send(to: string, subject: string, text: string) {
  if (!process.env.RESEND_API_KEY) {
    console.info(`[mail skipped: RESEND_API_KEY not set] to=${to} subject=${subject}`);
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.MAIL_FROM ?? "まなビレッジ <onboarding@resend.dev>",
    to,
    subject,
    text,
  });
  if (error) console.error("[mail failed]", error);
}

async function emailOf(userId: string) {
  const { data } = await createAdminClient().auth.admin.getUserById(userId);
  return data.user?.email ?? null;
}

export async function notifyAdminOfComment(articleTitle: string, slug: string, nickname: string, body: string) {
  await send(
    ADMIN_EMAIL,
    `【まなビレッジ】「${articleTitle}」にコメントが付きました`,
    `${nickname} さんのコメント:\n\n${body}\n\n${SITE_URL}/articles/${slug}#comments`,
  );
}

export async function notifyReply(recipientIds: (string | null)[], actorId: string, subject: string, nickname: string, body: string, url: string) {
  // 退会したユーザーの投稿(user_id が null)には通知しない
  const targets = [...new Set(recipientIds)].filter((id): id is string => !!id && id !== actorId);
  await Promise.all(
    targets.map(async (id) => {
      const to = await emailOf(id);
      if (to) await send(to, `【まなビレッジ】${subject}`, `${nickname} さんが返信しました:\n\n${body}\n\n${url}`);
    }),
  );
}
