-- ─── Daily practice progress ──────────────────────────────────────
-- Run in Supabase Dashboard → SQL Editor

create table if not exists public.daily_progress (
  id         uuid        default gen_random_uuid() primary key,
  user_id    uuid        references auth.users (id) on delete cascade not null,
  date       date        not null,
  task_ids   text[]      not null default '{}',
  updated_at timestamptz default now() not null,
  unique (user_id, date)
);

alter table public.daily_progress enable row level security;

create policy "Users can select own daily progress"
  on public.daily_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own daily progress"
  on public.daily_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own daily progress"
  on public.daily_progress for update
  using (auth.uid() = user_id);
