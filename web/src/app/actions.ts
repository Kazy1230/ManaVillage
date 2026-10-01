"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getViewer, safeNext } from "@/lib/auth";
import { findArticle } from "@/lib/articles";
import { lp } from "@/lib/paths";
import { SECTIONS, type Lang } from "@/lib/sections";
import { notifyAdminOfComment, notifyReply } from "@/lib/mail";
import { SITE_URL } from "@/lib/env";
import type { ActionState } from "@/lib/types";

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const optionalId = (fd: FormData, key: string) => {
  const n = Number(fd.get(key));
  return Number.isInteger(n) && n > 0 ? n : null;
};

// フォームの hidden の lang(英語のページから送られたときは "en")。エラーや完了のメッセージ、移動先をその言語に合わせる
const langOf = (fd: FormData): Lang => (fd.get("lang") === "en" ? "en" : "ja");
const say = (lang: Lang, ja: string, en: string) => (lang === "en" ? en : ja);

function authError(message: string, lang: Lang) {
  if (/invalid login credentials/i.test(message)) return say(lang, "メールアドレスかパスワードが違います。", "The email address or password is incorrect.");
  if (/email not confirmed/i.test(message)) return say(lang, "メールアドレスの確認が済んでいません。届いたメールのリンクを開いてください。", "Your email address hasn’t been confirmed yet. Please open the link in the email we sent you.");
  if (/already registered|already been registered/i.test(message)) return say(lang, "このメールアドレスはすでに登録されています。ログインしてください。", "This email address is already registered. Please log in.");
  if (/password/i.test(message)) return say(lang, "パスワードは8文字以上にしてください。", "Your password must be at least 8 characters.");
  if (/rate limit/i.test(message)) return say(lang, "短時間に操作が集中しました。少し待ってからもう一度お試しください。", "Too many attempts in a short time. Please wait a moment and try again.");
  return say(lang, "処理できませんでした。入力内容を確認して、もう一度お試しください。", "Something went wrong. Please check what you entered and try again.");
}

// ---------- auth ----------

export async function login(_: ActionState, fd: FormData): Promise<ActionState> {
  const lang = langOf(fd);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: text(fd, "email"),
    password: String(fd.get("password") ?? ""),
  });
  if (error) return { error: authError(error.message, lang) };
  revalidatePath("/", "layout");
  redirect(safeNext(fd.get("next")));
}

export async function signup(_: ActionState, fd: FormData): Promise<ActionState> {
  const lang = langOf(fd);
  const nickname = text(fd, "nickname");
  const password = String(fd.get("password") ?? "");
  if (nickname.length < 1 || nickname.length > 30) return { error: say(lang, "ニックネームは1〜30文字で入力してください。", "Your nickname must be 1–30 characters.") };
  if (password.length < 8) return { error: say(lang, "パスワードは8文字以上にしてください。", "Your password must be at least 8 characters.") };
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: text(fd, "email"),
    password,
    options: { data: { nickname }, emailRedirectTo: `${SITE_URL}/auth/confirm?next=${lp(lang, "/mypage")}` },
  });
  if (error) return { error: authError(error.message, lang) };
  return { ok: say(lang, "確認メールを送りました。メール内のリンクを開くと登録が完了します。", "We’ve sent you a confirmation email. Open the link in it to finish signing up.") };
}

export async function logout(fd: FormData) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(langOf(fd) === "en" ? "/en/japanese" : "/");
}

export async function requestPasswordReset(_: ActionState, fd: FormData): Promise<ActionState> {
  const lang = langOf(fd);
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(text(fd, "email"), {
    redirectTo: `${SITE_URL}/auth/confirm?next=${lp(lang, "/update-password")}`,
  });
  if (error) return { error: authError(error.message, lang) };
  return { ok: say(lang, "パスワード再設定用のメールを送りました。メール内のリンクから新しいパスワードを設定してください。", "We’ve sent you an email to reset your password. Use the link in it to set a new password.") };
}

export async function updatePassword(_: ActionState, fd: FormData): Promise<ActionState> {
  const lang = langOf(fd);
  const password = String(fd.get("password") ?? "");
  if (password.length < 8) return { error: say(lang, "パスワードは8文字以上にしてください。", "Your password must be at least 8 characters.") };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: authError(error.message, lang) };
  redirect(lp(lang, "/mypage"));
}

export async function updateNickname(_: ActionState, fd: FormData): Promise<ActionState> {
  const lang = langOf(fd);
  const viewer = await getViewer();
  if (!viewer) return { error: say(lang, "ログインしてください。", "Please log in.") };
  const nickname = text(fd, "nickname");
  if (nickname.length < 1 || nickname.length > 30) return { error: say(lang, "ニックネームは1〜30文字で入力してください。", "Your nickname must be 1–30 characters.") };
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ nickname }).eq("id", viewer.id);
  if (error) return { error: say(lang, "保存できませんでした。もう一度お試しください。", "Couldn’t save. Please try again.") };
  revalidatePath("/", "layout");
  return { ok: say(lang, "ニックネームを保存しました。", "Your nickname has been saved.") };
}

// ---------- article comments ----------

export async function addComment(_: ActionState, fd: FormData): Promise<ActionState> {
  const slug = text(fd, "slug");
  const article = findArticle(slug);
  // 英語のページ(日本語学習)の記事には、英語で返す
  const en = langOf(fd) === "en" || (!!article && SECTIONS[article.section].lang === "en");
  const msg = (ja: string, english: string) => (en ? english : ja);
  const viewer = await getViewer();
  if (!viewer) return { error: msg("コメントするにはログインしてください。", "Please log in to comment.") };
  if (!article) return { error: "記事が見つかりません。" };
  const body = text(fd, "body");
  if (!body) return { error: msg("コメントを入力してください。", "Please write a comment.") };
  if (body.length > 2000) return { error: msg("コメントは2000文字以内にしてください。", "Comments must be 2,000 characters or fewer.") };
  const parentId = optionalId(fd, "parent_id");

  const supabase = await createClient();
  let parentAuthor: string | null = null;
  if (parentId) {
    const { data } = await supabase.from("comments").select("user_id").eq("id", parentId).eq("article_slug", slug).single();
    if (!data) return { error: msg("返信先のコメントが見つかりません。", "The comment you’re replying to was not found.") };
    parentAuthor = data.user_id;
  }
  const { error } = await supabase.from("comments").insert({ article_slug: slug, body, parent_id: parentId });
  if (error) return { error: msg("投稿できませんでした。もう一度お試しください。", "Couldn’t post. Please try again.") };

  after(async () => {
    await notifyAdminOfComment(article.title, article.url, viewer.nickname, body);
    if (parentAuthor) {
      await notifyReply([parentAuthor], viewer.id, `「${article.title}」のあなたのコメントに返信がありました`, viewer.nickname, body, `${SITE_URL}${article.url}#comments`);
    }
  });
  revalidatePath(article.url);
  return { ok: parentId ? msg("返信しました。", "Reply posted.") : msg("コメントしました。", "Comment posted.") };
}

// ---------- boards ----------

export async function createThread(_: ActionState, fd: FormData): Promise<ActionState> {
  const lang = langOf(fd);
  const viewer = await getViewer();
  if (!viewer) return { error: say(lang, "スレッドを作るにはログインしてください。", "Please log in to start a thread.") };
  const title = text(fd, "title");
  const body = text(fd, "body");
  const newCategory = text(fd, "new_category");
  let categoryId = optionalId(fd, "category_id");
  if (!title || title.length > 100) return { error: say(lang, "タイトルは1〜100文字で入力してください。", "The title must be 1–100 characters.") };
  if (!body || body.length > 5000) return { error: say(lang, "本文は1〜5000文字で入力してください。", "The message must be 1–5,000 characters.") };

  const supabase = await createClient();
  if (newCategory) {
    if (newCategory.length > 30) return { error: say(lang, "カテゴリ名は30文字以内にしてください。", "Category names must be 30 characters or fewer.") };
    const { data: existing } = await supabase.from("board_categories").select("id").ilike("name", newCategory.replace(/[%_\\]/g, "\\$&")).maybeSingle();
    if (existing) {
      categoryId = existing.id;
    } else {
      const { data: created, error } = await supabase.from("board_categories").insert({ name: newCategory }).select("id").single();
      if (error || !created) return { error: say(lang, "カテゴリを作成できませんでした。別の名前でお試しください。", "Couldn’t create the category. Please try a different name.") };
      categoryId = created.id;
    }
  }
  if (!categoryId) return { error: say(lang, "カテゴリを選ぶか、新しいカテゴリ名を入力してください。", "Choose a category, or enter a new category name.") };

  const { data: thread, error } = await supabase.from("threads").insert({ category_id: categoryId, title, body }).select("id").single();
  if (error || !thread) return { error: say(lang, "スレッドを作成できませんでした。もう一度お試しください。", "Couldn’t create the thread. Please try again.") };
  revalidatePath("/boards");
  revalidatePath("/en/boards");
  redirect(lp(lang, `/boards/${categoryId}/${thread.id}`));
}

export async function addThreadPost(_: ActionState, fd: FormData): Promise<ActionState> {
  const lang = langOf(fd);
  const viewer = await getViewer();
  if (!viewer) return { error: say(lang, "書き込むにはログインしてください。", "Please log in to post.") };
  const threadId = optionalId(fd, "thread_id");
  const body = text(fd, "body");
  const parentId = optionalId(fd, "parent_id");
  if (!threadId) return { error: say(lang, "スレッドが見つかりません。", "Thread not found.") };
  if (!body) return { error: say(lang, "本文を入力してください。", "Please write a message.") };
  if (body.length > 2000) return { error: say(lang, "書き込みは2000文字以内にしてください。", "Posts must be 2,000 characters or fewer.") };

  const supabase = await createClient();
  const { data: thread } = await supabase.from("threads").select("id, title, user_id, category_id").eq("id", threadId).single();
  if (!thread) return { error: say(lang, "スレッドが見つかりません。", "Thread not found.") };
  const recipients: (string | null)[] = [thread.user_id];
  if (parentId) {
    const { data } = await supabase.from("thread_posts").select("user_id").eq("id", parentId).eq("thread_id", threadId).single();
    if (!data) return { error: say(lang, "返信先の書き込みが見つかりません。", "The post you’re replying to was not found.") };
    recipients.push(data.user_id);
  }
  const { error } = await supabase.from("thread_posts").insert({ thread_id: threadId, body, parent_id: parentId });
  if (error) return { error: say(lang, "書き込めませんでした。もう一度お試しください。", "Couldn’t post. Please try again.") };

  // 通知メールは、受け取る人の言語が分からないため日本語のまま(URL は日本語のページ)
  const url = `${SITE_URL}/boards/${thread.category_id}/${thread.id}`;
  after(() => notifyReply(recipients, viewer.id, `スレッド「${thread.title}」に返信がありました`, viewer.nickname, body, url));
  revalidatePath(`/boards/${thread.category_id}/${thread.id}`);
  revalidatePath(`/en/boards/${thread.category_id}/${thread.id}`);
  revalidatePath("/boards");
  revalidatePath("/en/boards");
  return { ok: parentId ? say(lang, "返信しました。", "Reply posted.") : say(lang, "書き込みました。", "Posted.") };
}
