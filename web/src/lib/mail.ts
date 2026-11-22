import "server-only";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/env";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "xenon.english@gmail.com";

async function send(to: string, subject: string, text: string, headers?: Record<string, string>) {
  if (!process.env.RESEND_API_KEY) {
    console.info(`[mail skipped: RESEND_API_KEY not set] to=${to} subject=${subject}`);
    return false;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.MAIL_FROM ?? "まなビレッジ <onboarding@resend.dev>",
    to,
    subject,
    text,
    headers,
  });
  if (error) console.error("[mail failed]", error);
  return !error;
}

async function emailOf(userId: string) {
  const { data } = await createAdminClient().auth.admin.getUserById(userId);
  return data.user?.email ?? null;
}

export async function notifyAdminOfComment(articleTitle: string, articlePath: string, nickname: string, body: string) {
  await send(
    ADMIN_EMAIL,
    `【まなビレッジ】「${articleTitle}」にコメントが付きました`,
    `${nickname} さんのコメント:\n\n${body}\n\n${SITE_URL}${articlePath}#comments`,
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

// おしえて英語の朝のお知らせ(毎朝7時。web/src/app/api/oshiete/morning/route.ts から)
export async function sendOshieteMorning(userId: string, student: string, profile: string, question: string, unsubToken: string) {
  const to = await emailOf(userId);
  if (!to) return false;
  const stopUrl = `${SITE_URL}/oshiete/mail-stop?t=${unsubToken}`;
  return send(
    to,
    `${student}から新しい質問が届いています`,
    `先生、おはようございます。
${student}（${profile}）から、新しい質問が届いています。

「${question}」

今日の3つの質問に答える:
${SITE_URL}/oshiete

――
このメールは「おしえて英語」の朝のお知らせです。
通知を止める: ${stopUrl}
マイページからも止められます: ${SITE_URL}/mypage`,
    {
      "List-Unsubscribe": `<${SITE_URL}/api/oshiete/unsubscribe?t=${unsubToken}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  );
}
