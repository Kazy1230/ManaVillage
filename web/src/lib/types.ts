export type Author = { nickname: string; is_admin: boolean };

export type PostRow = {
  id: number;
  parent_id: number | null;
  user_id: string;
  body: string;
  created_at: string;
  author: Author | null;
};

export type ActionState = { ok?: string; error?: string };
