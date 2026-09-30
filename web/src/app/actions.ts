"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getViewer, safeNext } from "@/lib/auth";
import { getArticle } from "@/lib/articles";
import { notifyAdminOfComment, notifyReply } from "@/lib/mail";
import { SITE_URL } from "@/lib/env";
import type { ActionState } from "@/lib/types";

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const optionalId = (fd: FormData, key: string) => {
  const n = Number(fd.get(key));
  return Number.isInteger(n) && n > 0 ? n : null;
};

function authError(message: string) {
  if (/invalid login credentials/i.test(message)) return "メールアドレスかパスワードが違います。";
  if (/email not confirmed/i.test(message)) return "メールアドレスの確認が済んでいません。届いたメールのリンクを開いてください。";
  if (/already registered|already been registered/i.test(message)) return "このメールアドレスはすでに登録されています。ログインしてください。";
  if (/password/i.test(message)) return "パスワードは8文字以上にしてください。";
  if (/rate limit/i.test(message)) return "短時間に操作が集中しました。少し待ってからもう一度お試しください。";
  return "処理できませんでした。入力内容を確認して、もう一度お試しください。";
}

// ---------- auth ----------

export async function login(_: ActionState, fd: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: text(fd, "email"),
    password: String(fd.get("password") ?? ""),
  });
  if (error) return { error: authError(error.message) };
  revalidatePath("/", "layout");
  redirect(safeNext(fd.get("next")));
}

export async function signup(_: ActionState, fd: FormData): Promise<ActionState> {
  const nickname = text(fd, "nickname");
  const password = String(fd.get("password") ?? "");
  if (nickname.length < 1 || nickname.length > 30) return { error: "ニックネームは1〜30文字で入力してください。" };
  if (password.length < 8) return { error: "パスワードは8文字以上にしてください。" };
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: text(fd, "email"),
    password,
    options: { data: { nickname }, emailRedirectTo: `${SITE_URL}/auth/confirm?next=/mypage` },
  });
  if (error) return { error: authError(error.message) };
  return { ok: "確認メールを送りました。メール内のリンクを開くと登録が完了します。" };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function requestPasswordReset(_: ActionState, fd: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(text(fd, "email"), {
    redirectTo: `${SITE_URL}/auth/confirm?next=/update-password`,
  });
  if (error) return { error: authError(error.message) };
  return { ok: "パスワード再設定用のメールを送りました。メール内のリンクから新しいパスワードを設定してください。" };
}

export async function updatePassword(_: ActionState, fd: FormData): Promise<ActionState> {
  const password = String(fd.get("password") ?? "");
  if (password.length < 8) return { error: "パスワードは8文字以上にしてください。" };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: authError(error.message) };
  redirect("/mypage");
}

export async function updateNickname(_: ActionState, fd: FormData): Promise<ActionState> {
  const viewer = await getViewer();
  if (!viewer) return { error: "ログインしてください。" };
  const nickname = text(fd, "nickname");
  if (nickname.length < 1 || nickname.length > 30) return { error: "ニックネームは1〜30文字で入力してください。" };
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ nickname }).eq("id", viewer.id);
  if (error) return { error: "保存できませんでした。もう一度お試しください。" };
  revalidatePath("/", "layout");
  return { ok: "ニックネームを保存しました。" };
}

// ---------- article comments ----------

export async function addComment(_: ActionState, fd: FormData): Promise<ActionState> {
  const viewer = await getViewer();
  if (!viewer) return { error: "コメントするにはログインしてください。" };
  const slug = text(fd, "slug");
  const article = getArticle(slug);
  if (!article) return { error: "記事が見つかりません。" };
  const body = text(fd, "body");
  if (!body) return { error: "コメントを入力してください。" };
  if (body.length > 2000) return { error: "コメントは2000文字以内にしてください。" };
  const parentId = optionalId(fd, "parent_id");

  const supabase = await createClient();
  let parentAuthor: string | null = null;
  if (parentId) {
    const { data } = await supabase.from("comments").select("user_id").eq("id", parentId).eq("article_slug", slug).single();
    if (!data) return { error: "返信先のコメントが見つかりません。" };
    parentAuthor = data.user_id;
  }
  const { error } = await supabase.from("comments").insert({ article_slug: slug, body, parent_id: parentId });
  if (error) return { error: "投稿できませんでした。もう一度お試しください。" };

  after(async () => {
    await notifyAdminOfComment(article.title, slug, viewer.nickname, body);
    if (parentAuthor) {
      await notifyReply([parentAuthor], viewer.id, `「${article.title}」のあなたのコメントに返信がありました`, viewer.nickname, body, `${SITE_URL}/articles/${slug}#comments`);
    }
  });
  revalidatePath(`/articles/${slug}`);
  return { ok: parentId ? "返信しました。" : "コメントしました。" };
}

// ---------- boards ----------

export async function createThread(_: ActionState, fd: FormData): Promise<ActionState> {
  const viewer = await getViewer();
  if (!viewer) return { error: "スレッドを作るにはログインしてください。" };
  const title = text(fd, "title");
  const body = text(fd, "body");
  const newCategory = text(fd, "new_category");
  let categoryId = optionalId(fd, "category_id");
  if (!title || title.length > 100) return { error: "タイトルは1〜100文字で入力してください。" };
  if (!body || body.length > 5000) return { error: "本文は1〜5000文字で入力してください。" };

  const supabase = await createClient();
  if (newCategory) {
    if (newCategory.length > 30) return { error: "カテゴリ名は30文字以内にしてください。" };
    const { data: existing } = await supabase.from("board_categories").select("id").ilike("name", newCategory.replace(/[%_\\]/g, "\\$&")).maybeSingle();
    if (existing) {
      categoryId = existing.id;
    } else {
      const { data: created, error } = await supabase.from("board_categories").insert({ name: newCategory }).select("id").single();
      if (error || !created) return { error: "カテゴリを作成できませんでした。別の名前でお試しください。" };
      categoryId = created.id;
    }
  }
  if (!categoryId) return { error: "カテゴリを選ぶか、新しいカテゴリ名を入力してください。" };

  const { data: thread, error } = await supabase.from("threads").insert({ category_id: categoryId, title, body }).select("id").single();
  if (error || !thread) return { error: "スレッドを作成できませんでした。もう一度お試しください。" };
  revalidatePath("/boards");
  redirect(`/boards/${categoryId}/${thread.id}`);
}

export async function addThreadPost(_: ActionState, fd: FormData): Promise<ActionState> {
  const viewer = await getViewer();
  if (!viewer) return { error: "書き込むにはログインしてください。" };
  const threadId = optionalId(fd, "thread_id");
  const body = text(fd, "body");
  const parentId = optionalId(fd, "parent_id");
  if (!threadId) return { error: "スレッドが見つかりません。" };
  if (!body) return { error: "本文を入力してください。" };
  if (body.length > 2000) return { error: "書き込みは2000文字以内にしてください。" };

  const supabase = await createClient();
  const { data: thread } = await supabase.from("threads").select("id, title, user_id, category_id").eq("id", threadId).single();
  if (!thread) return { error: "スレッドが見つかりません。" };
  const recipients: (string | null)[] = [thread.user_id];
  if (parentId) {
    const { data } = await supabase.from("thread_posts").select("user_id").eq("id", parentId).eq("thread_id", threadId).single();
    if (!data) return { error: "返信先の書き込みが見つかりません。" };
    recipients.push(data.user_id);
  }
  const { error } = await supabase.from("thread_posts").insert({ thread_id: threadId, body, parent_id: parentId });
  if (error) return { error: "書き込めませんでした。もう一度お試しください。" };

  const url = `${SITE_URL}/boards/${thread.category_id}/${thread.id}`;
  after(() => notifyReply(recipients, viewer.id, `スレッド「${thread.title}」に返信がありました`, viewer.nickname, body, url));
  revalidatePath(`/boards/${thread.category_id}/${thread.id}`);
  revalidatePath("/boards");
  return { ok: parentId ? "返信しました。" : "書き込みました。" };
}
