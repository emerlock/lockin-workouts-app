-- Initial schema for LockIn Workouts

create extension if not exists "pgcrypto";

-- Enums
DO $$ BEGIN
  CREATE TYPE exercise_type AS ENUM ('standing', 'bodyweight', 'warmup', 'cooldown');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE posture_type AS ENUM ('standing', 'hands', 'back', 'prone');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE tag_category AS ENUM ('type', 'focus', 'posture');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE interval_kind AS ENUM ('exercise', 'walk', 'rest');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Core data tables
create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  type exercise_type not null,
  posture posture_type not null,
  infographic_key text,
  created_at timestamptz not null default now()
);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category tag_category not null,
  created_at timestamptz not null default now()
);

create table if not exists exercise_tags (
  exercise_id uuid not null references exercises(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (exercise_id, tag_id)
);

create table if not exists workouts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  estimated_minutes int not null check (estimated_minutes > 0),
  is_warmup boolean not null default false,
  is_cooldown boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists workout_intervals (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references workouts(id) on delete cascade,
  exercise_id uuid references exercises(id) on delete set null,
  label text,
  description text not null default '',
  kind interval_kind not null,
  duration_seconds int not null check (duration_seconds > 0),
  position int not null,
  created_at timestamptz not null default now(),
  unique (workout_id, position)
);

create table if not exists workout_tags (
  workout_id uuid not null references workouts(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (workout_id, tag_id)
);

-- Helpful indexes for filtering/search paths
create index if not exists idx_exercises_type on exercises(type);
create index if not exists idx_exercises_posture on exercises(posture);
create index if not exists idx_exercises_name on exercises(name);

create index if not exists idx_tags_category on tags(category);
create index if not exists idx_exercise_tags_tag_id on exercise_tags(tag_id);

create index if not exists idx_workouts_name on workouts(name);
create index if not exists idx_workouts_is_warmup on workouts(is_warmup);
create index if not exists idx_workouts_is_cooldown on workouts(is_cooldown);
create index if not exists idx_workout_tags_tag_id on workout_tags(tag_id);

create index if not exists idx_workout_intervals_workout_position
  on workout_intervals(workout_id, position);

-- RLS
alter table exercises enable row level security;
alter table tags enable row level security;
alter table exercise_tags enable row level security;
alter table workouts enable row level security;
alter table workout_intervals enable row level security;
alter table workout_tags enable row level security;

-- Public read policies
DROP POLICY IF EXISTS "public read exercises" ON exercises;
create policy "public read exercises"
  on exercises for select
  using (true);

DROP POLICY IF EXISTS "public read tags" ON tags;
create policy "public read tags"
  on tags for select
  using (true);

DROP POLICY IF EXISTS "public read exercise_tags" ON exercise_tags;
create policy "public read exercise_tags"
  on exercise_tags for select
  using (true);

DROP POLICY IF EXISTS "public read workouts" ON workouts;
create policy "public read workouts"
  on workouts for select
  using (true);

DROP POLICY IF EXISTS "public read workout_intervals" ON workout_intervals;
create policy "public read workout_intervals"
  on workout_intervals for select
  using (true);

DROP POLICY IF EXISTS "public read workout_tags" ON workout_tags;
create policy "public read workout_tags"
  on workout_tags for select
  using (true);
