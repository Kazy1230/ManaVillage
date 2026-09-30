-- 退会したユーザーの投稿を残す(退会後は「退会したユーザー」として表示する)
--
-- 変更前は、ユーザーを削除すると、その人のコメント・スレッド・書き込み・作ったカテゴリが
-- on delete cascade で一緒に消え、カテゴリやスレッドを通じて、他の人の投稿まで消えていた。
-- 変更後は、投稿者の欄(user_id / created_by)だけを空にして、投稿は残す。

begin;

alter table public.comments alter column user_id drop not null;
alter table public.comments drop constraint if exists comments_user_id_fkey;
alter table public.comments
  add constraint comments_user_id_fkey
  foreign key (user_id) references public.profiles (id) on delete set null;

alter table public.threads alter column user_id drop not null;
alter table public.threads drop constraint if exists threads_user_id_fkey;
alter table public.threads
  add constraint threads_user_id_fkey
  foreign key (user_id) references public.profiles (id) on delete set null;

alter table public.thread_posts alter column user_id drop not null;
alter table public.thread_posts drop constraint if exists thread_posts_user_id_fkey;
alter table public.thread_posts
  add constraint thread_posts_user_id_fkey
  foreign key (user_id) references public.profiles (id) on delete set null;

alter table public.board_categories alter column created_by drop not null;
alter table public.board_categories drop constraint if exists board_categories_created_by_fkey;
alter table public.board_categories
  add constraint board_categories_created_by_fkey
  foreign key (created_by) references public.profiles (id) on delete set null;

commit;

-- 確認用: user_id / created_by の4つが「set null」になっていれば成功
select conrelid::regclass as table_name,
       conname,
       case confdeltype when 'n' then 'set null' when 'c' then 'cascade' when 'a' then 'no action' else confdeltype::text end as on_delete
from pg_constraint
where contype = 'f' and connamespace = 'public'::regnamespace
order by 1, 2;
