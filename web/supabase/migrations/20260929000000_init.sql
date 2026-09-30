-- まなビレッジ 初期スキーマ
-- 記事本文は Markdown でリポジトリ管理。DB にはコメント・掲示板・プロフィールのみを持つ。

-- ============ profiles ============
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null check (char_length(btrim(nickname)) between 1 and 30),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nickname)
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'nickname'), ''), '学習者')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ article comments ============
create table public.comments (
  id bigint generated always as identity primary key,
  article_slug text not null check (char_length(article_slug) between 1 and 200),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  parent_id bigint references public.comments (id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index comments_article_idx on public.comments (article_slug, created_at desc);
create index comments_user_idx on public.comments (user_id, created_at desc);

-- 返信は同じ記事のコメントにしか付けられない
create function public.check_comment_parent()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.parent_id is not null and not exists (
    select 1 from public.comments p
    where p.id = new.parent_id and p.article_slug = new.article_slug
  ) then
    raise exception 'parent comment belongs to another article';
  end if;
  return new;
end;
$$;

create trigger comments_parent_check
  before insert on public.comments
  for each row execute function public.check_comment_parent();

-- ============ boards ============
create table public.board_categories (
  id bigint generated always as identity primary key,
  name text not null check (char_length(btrim(name)) between 1 and 30),
  created_by uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);
create unique index board_categories_name_key on public.board_categories (lower(btrim(name)));

create table public.threads (
  id bigint generated always as identity primary key,
  category_id bigint not null references public.board_categories (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 100),
  body text not null check (char_length(btrim(body)) between 1 and 5000),
  reply_count integer not null default 0,
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index threads_new_idx on public.threads (created_at desc);
create index threads_popular_idx on public.threads (reply_count desc, last_activity_at desc);
create index threads_category_idx on public.threads (category_id, created_at desc);
create index threads_user_idx on public.threads (user_id, created_at desc);

create table public.thread_posts (
  id bigint generated always as identity primary key,
  thread_id bigint not null references public.threads (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  parent_id bigint references public.thread_posts (id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index thread_posts_thread_idx on public.thread_posts (thread_id, created_at desc);
create index thread_posts_user_idx on public.thread_posts (user_id, created_at desc);

-- 新規スレッドのカウンタはクライアントから指定させない
create function public.init_thread()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.reply_count := 0;
  new.last_activity_at := now();
  new.created_at := now();
  return new;
end;
$$;

create trigger threads_init
  before insert on public.threads
  for each row execute function public.init_thread();

create function public.check_thread_post()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.parent_id is not null and not exists (
    select 1 from public.thread_posts p
    where p.id = new.parent_id and p.thread_id = new.thread_id
  ) then
    raise exception 'parent post belongs to another thread';
  end if;
  return new;
end;
$$;

create trigger thread_posts_parent_check
  before insert on public.thread_posts
  for each row execute function public.check_thread_post();

-- 返信数と最終更新は書き込み側の権限に関係なく更新する
create function public.bump_thread()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.threads
     set reply_count = reply_count + 1,
         last_activity_at = now()
   where id = new.thread_id;
  return new;
end;
$$;

create trigger thread_posts_bump
  after insert on public.thread_posts
  for each row execute function public.bump_thread();

-- ============ Row Level Security ============
alter table public.profiles enable row level security;
alter table public.comments enable row level security;
alter table public.board_categories enable row level security;
alter table public.threads enable row level security;
alter table public.thread_posts enable row level security;

-- 閲覧は誰でも可
create policy "profiles are public" on public.profiles for select using (true);
create policy "comments are public" on public.comments for select using (true);
create policy "categories are public" on public.board_categories for select using (true);
create policy "threads are public" on public.threads for select using (true);
create policy "posts are public" on public.thread_posts for select using (true);

-- 投稿はログイン済みユーザーが自分名義でのみ可（編集・削除のポリシーは作らない）
create policy "users comment as themselves" on public.comments
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "users create categories" on public.board_categories
  for insert to authenticated with check (created_by = (select auth.uid()));
create policy "users create threads" on public.threads
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "users post as themselves" on public.thread_posts
  for insert to authenticated with check (user_id = (select auth.uid()));

-- プロフィールは本人がニックネームだけ変更可
create policy "users update own profile" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (nickname) on public.profiles to authenticated;

-- 念のため列単位でも制限
revoke update, delete on public.comments, public.threads, public.thread_posts, public.board_categories from anon, authenticated;
revoke insert on public.comments, public.threads, public.thread_posts, public.board_categories from anon;

-- ============ views ============
create view public.article_comment_counts
with (security_invoker = true) as
  select article_slug, count(*)::int as count
  from public.comments
  group by article_slug;
