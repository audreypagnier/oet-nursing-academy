-- ─── User profiles ────────────────────────────────────────────────
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

create table if not exists public.user_profiles (
  id         uuid        references auth.users (id) on delete cascade primary key,
  email      text        not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Row-level security: each user can only see and edit their own row
alter table public.user_profiles enable row level security;

create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
