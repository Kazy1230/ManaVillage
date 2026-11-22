-- おしえて英語(サイト版 MVP、2026-11-22)
-- ・oshiete_progress: ログインした人の進み具合と、朝のメールの設定
-- ・oshiete_reviews : 体験版のあとのレビュー(★と記述2問)。ログインしていない人も送れる(サーバーが秘密鍵で書き込む)
-- ・oshiete_rate    : AI判定・レビューの回数の上限(1日あたり。サーバーだけが使う)

-- ============ 進み具合 ============
create table public.oshiete_progress (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  -- アプリの状態(解決したトーク、会話、今日の数 など)。中身の形はアプリ側(web/src/lib/oshiete/state.ts)で決める
  state jsonb not null default '{}'::jsonb check (pg_column_size(state) < 300000),
  -- 朝のメールを止めたら true
  mail_opt_out boolean not null default false,
  -- メールの「通知を止める」リンクの鍵(ログインしなくても止められるように)
  unsub_token uuid not null default gen_random_uuid() unique,
  -- 最後に朝のメールを送った日(日本時間の 7:00 区切り)。同じ日に二重に送らない
  last_mailed_day date,
  updated_at timestamptz not null default now()
);

alter table public.oshiete_progress enable row level security;

create policy "users read own oshiete progress" on public.oshiete_progress
  for select to authenticated using (user_id = (select auth.uid()));
create policy "users create own oshiete progress" on public.oshiete_progress
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "users update own oshiete progress" on public.oshiete_progress
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- 本人が書けるのは、状態とメールの設定だけ(鍵と送信日はサーバーだけが書く)
revoke insert, update, delete on public.oshiete_progress from anon, authenticated;
grant insert (user_id, state, mail_opt_out, updated_at) on public.oshiete_progress to authenticated;
-- user_id は upsert(ON CONFLICT DO UPDATE)で同じ値を入れ直すために要る。変えられないことは RLS の with check が守る
grant update (user_id, state, mail_opt_out, updated_at) on public.oshiete_progress to authenticated;

-- ============ レビュー ============
create table public.oshiete_reviews (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  -- ログインしていない人の目印(ブラウザごとのランダムな ID)
  anon_id text check (char_length(anon_id) <= 64),
  rating smallint not null check (rating between 1 and 5),
  -- 「先生になって教えてみて、いちばんよかったところはどこですか？」
  best text check (char_length(best) <= 2000),
  -- 「分かりにくかったところ・やりにくかったところはどこですか？」
  hard text check (char_length(hard) <= 2000),
  created_at timestamptz not null default now()
);
create index oshiete_reviews_created_idx on public.oshiete_reviews (created_at desc);

alter table public.oshiete_reviews enable row level security;
-- 書き込みはサーバー(秘密鍵)だけ。読めるのは管理者(Kaz)だけ
create policy "admins read oshiete reviews" on public.oshiete_reviews
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_admin));
revoke insert, update, delete on public.oshiete_reviews from anon, authenticated;

-- ============ 回数の上限 ============
create table public.oshiete_rate (
  key text not null check (char_length(key) <= 200),
  day date not null,
  count integer not null default 0,
  primary key (key, day)
);
alter table public.oshiete_rate enable row level security;
-- ポリシーなし = anon / authenticated からは読めも書けもしない
revoke all on public.oshiete_rate from anon, authenticated;

-- 1回数えて、上限以内なら true を返す
create function public.oshiete_rate_hit(p_key text, p_day date, p_limit integer)
returns boolean
language sql
security definer set search_path = ''
as $$
  insert into public.oshiete_rate as r (key, day, count)
  values (p_key, p_day, 1)
  on conflict (key, day) do update set count = r.count + 1
  returning r.count <= p_limit;
$$;
revoke execute on function public.oshiete_rate_hit(text, date, integer) from public, anon, authenticated;
grant execute on function public.oshiete_rate_hit(text, date, integer) to service_role;
