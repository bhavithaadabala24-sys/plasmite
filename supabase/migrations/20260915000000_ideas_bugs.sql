-- ============================================================
-- PLASMITE · Engineer Notebook — Ideas & Bug journal (M3b)
-- Personal ideation journal and bug/faq log tied to projects.
-- ============================================================

create type idea_status as enum ('idea', 'in_progress', 'built', 'archived');
create type bug_severity as enum ('low', 'medium', 'high', 'critical');
create type bug_status as enum ('open', 'investigating', 'fixed', 'resolved');

-- ------------------------------------------------------------
-- ideas
-- ------------------------------------------------------------
create table public.ideas (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  title         text not null,
  content       text,
  status        idea_status not null default 'idea',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger ideas_set_updated_at
  before update on public.ideas
  for each row execute function public.set_updated_at();

create index ideas_user_idx on public.ideas (user_id);
create index ideas_user_status_idx on public.ideas (user_id, status);

alter table public.ideas enable row level security;

create policy "ideas_select_own" on public.ideas
  for select using (auth.uid() = user_id);
create policy "ideas_insert_own" on public.ideas
  for insert with check (auth.uid() = user_id);
create policy "ideas_update_own" on public.ideas
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ideas_delete_own" on public.ideas
  for delete using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- bugs
-- ------------------------------------------------------------
create table public.bugs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  project_id    uuid references public.projects (id) on delete set null,
  title         text not null,
  severity      bug_severity not null default 'medium',
  status        bug_status not null default 'open',
  symptom       text,
  root_cause    text,
  remedy        text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger bugs_set_updated_at
  before update on public.bugs
  for each row execute function public.set_updated_at();

create index bugs_user_idx on public.bugs (user_id);
create index bugs_user_status_idx on public.bugs (user_id, status);
create index bugs_project_idx on public.bugs (project_id);

alter table public.bugs enable row level security;

create policy "bugs_select_own" on public.bugs
  for select using (auth.uid() = user_id);
create policy "bugs_insert_own" on public.bugs
  for insert with check (auth.uid() = user_id);
create policy "bugs_update_own" on public.bugs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "bugs_delete_own" on public.bugs
  for delete using (auth.uid() = user_id);

-- default privileges from 20260914000000_init.sql already grant
-- select/insert/update/delete to anon + authenticated for new tables.