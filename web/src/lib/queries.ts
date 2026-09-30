import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { PostRow } from "@/lib/types";

export async function getCommentCounts() {
  const supabase = await createClient();
  const { data } = await supabase.from("article_comment_counts").select("article_slug, count");
  return new Map((data ?? []).map((r) => [r.article_slug as string, r.count as number]));
}

export type ThreadListItem = {
  id: number;
  title: string;
  reply_count: number;
  last_activity_at: string;
  created_at: string;
  category_id: number;
  category: { id: number; name: string } | null;
  author: { nickname: string } | null;
};

const THREAD_COLUMNS = "id, title, reply_count, last_activity_at, created_at, category_id, category:board_categories(id, name), author:profiles(nickname)";

export async function listThreads({ categoryId, sort, limit = 50 }: { categoryId?: number; sort: "new" | "popular"; limit?: number }) {
  const supabase = await createClient();
  let q = supabase.from("threads").select(THREAD_COLUMNS);
  if (categoryId) q = q.eq("category_id", categoryId);
  q = sort === "popular"
    ? q.order("reply_count", { ascending: false }).order("last_activity_at", { ascending: false })
    : q.order("created_at", { ascending: false });
  const { data } = await q.limit(limit);
  return (data ?? []) as unknown as ThreadListItem[];
}

export async function listCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("board_categories").select("id, name").order("created_at");
  return (data ?? []) as { id: number; name: string }[];
}

export const POST_COLUMNS = "id, parent_id, user_id, body, created_at, author:profiles(nickname, is_admin)";
export const asPosts = (data: unknown) => (data ?? []) as PostRow[];

export const catClass = (id: number) => `cat c${id % 6}`;
