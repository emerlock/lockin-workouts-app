-- Per-user workouts persisted with auth.uid()-scoped RLS

create table if not exists user_workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null,
  tags text[] not null default '{}',
  sets int not null check (sets > 0),
  reps int not null check (reps > 0),
  exercises jsonb not null,
  routine jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_workouts_user_id on user_workouts(user_id);
create index if not exists idx_user_workouts_created_at on user_workouts(created_at desc);

alter table user_workouts enable row level security;

drop policy if exists "user can read own workouts" on user_workouts;
create policy "user can read own workouts"
  on user_workouts for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "user can insert own workouts" on user_workouts;
create policy "user can insert own workouts"
  on user_workouts for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "user can update own workouts" on user_workouts;
create policy "user can update own workouts"
  on user_workouts for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "user can delete own workouts" on user_workouts;
create policy "user can delete own workouts"
  on user_workouts for delete
  to authenticated
  using (auth.uid() = user_id);
