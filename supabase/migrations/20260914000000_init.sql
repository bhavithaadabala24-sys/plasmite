-- ============================================================
-- PLASMITE · Engineer Notebook — Initial schema (M3 / Prompt 09)
-- MVP domain: profiles, subjects, topics, notes, tags, labs,
-- lab_experiments, projects, tasks, milestones, questions,
-- revision_items, attachments.
-- Every user-owned table is scoped to auth.uid() via RLS.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Lookups / enums
-- ------------------------------------------------------------
create type topic_status as enum ('not_started', 'learning', 'practicing', 'completed', 'needs_revision');
create type record_status as enum ('not_started', 'in_progress', 'completed');
create type project_status as enum ('idea', 'research', 'planning', 'building', 'testing', 'completed', 'archived');
create type task_status as enum ('todo', 'in_progress', 'done');
create type question_status as enum ('unanswered', 'learning', 'understood', 'needs_revision');
create type difficulty as enum ('easy', 'medium', 'hard');
create type revision_status as enum ('to_revise', 'revising', 'revised', 'mastered');
create type attachment_type as enum ('note', 'lab_experiment', 'project', 'question', 'previous_paper', 'assignment');

-- ------------------------------------------------------------
-- shared updated_at trigger
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- profiles
-- ------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  full_name     text not null default '',
  branch        text,
  year          smallint,
  semester      smallint,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint profiles_year_range check (year between 1 and 8),
  constraint profiles_semester_range check (semester between 1 and 16)
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- auto-create a profile when an auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- profiles RLS
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- ------------------------------------------------------------
-- subjects
-- ------------------------------------------------------------
create table public.subjects (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  name          text not null,
  code          text,
  semester      smallint,
  year          smallint,
  description   text,
  credits       numeric(4,1),
  exam_date     date,
  color         text default 'parchment',
  icon          text default 'BookOpen',
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger subjects_set_updated_at
  before update on public.subjects
  for each row execute function public.set_updated_at();

create index subjects_user_idx on public.subjects (user_id);
create index subjects_user_semester_idx on public.subjects (user_id, year, semester);

alter table public.subjects enable row level security;

create policy "subjects_select_own" on public.subjects
  for select using (auth.uid() = user_id);
create policy "subjects_insert_own" on public.subjects
  for insert with check (auth.uid() = user_id);
create policy "subjects_update_own" on public.subjects
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "subjects_delete_own" on public.subjects
  for delete using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- topics
-- ------------------------------------------------------------
create table public.topics (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  subject_id    uuid not null references public.subjects (id) on delete cascade,
  unit_number   smallint,
  name          text not null,
  description   text,
  status        topic_status not null default 'not_started',
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger topics_set_updated_at
  before update on public.topics
  for each row execute function public.set_updated_at();

create index topics_subject_idx on public.topics (subject_id);
create index topics_user_idx on public.topics (user_id);

alter table public.topics enable row level security;

create policy "topics_select_own" on public.topics
  for select using (auth.uid() = user_id);
create policy "topics_insert_own" on public.topics
  for insert with check (auth.uid() = user_id);
create policy "topics_update_own" on public.topics
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "topics_delete_own" on public.topics
  for delete using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- notes
-- ------------------------------------------------------------
create table public.notes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  subject_id    uuid references public.subjects (id) on delete set null,
  topic_id      uuid references public.topics (id) on delete set null,
  title         text not null default 'Untitled',
  content       text not null default '',
  plain_text    text not null default '',
  summary       text,
  is_favorite   boolean not null default false,
  is_pinned     boolean not null default false,
  is_archived   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger notes_set_updated_at
  before update on public.notes
  for each row execute function public.set_updated_at();

create index notes_user_idx on public.notes (user_id);
create index notes_user_recent_idx on public.notes (user_id, updated_at desc);
create index notes_subject_idx on public.notes (subject_id);
create index notes_topic_idx on public.notes (topic_id);
create index notes_favorite_user_idx on public.notes (user_id) where is_favorite = true;
create index notes_pinned_user_idx on public.notes (user_id) where is_pinned = true;

-- full-text search support (ranked title-first in queries)
alter table public.notes
  add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(plain_text, '')), 'B')
  ) stored;

create index notes_search_vector_idx on public.notes using gin (search_vector);

alter table public.notes enable row level security;

create policy "notes_select_own" on public.notes
  for select using (auth.uid() = user_id);
create policy "notes_insert_own" on public.notes
  for insert with check (auth.uid() = user_id);
create policy "notes_update_own" on public.notes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notes_delete_own" on public.notes
  for delete using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- tags (per-user unique), note_tags join table
-- ------------------------------------------------------------
create table public.tags (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  name          text not null,
  color         text default 'parchment',
  created_at    timestamptz not null default now(),
  unique (user_id, lower(name))
);

create table public.note_tags (
  note_id       uuid not null references public.notes (id) on delete cascade,
  tag_id        uuid not null references public.tags (id) on delete cascade,
  primary key (note_id, tag_id)
);

create index note_tags_tag_idx on public.note_tags (tag_id);

alter table public.tags enable row level security;
alter table public.note_tags enable row level security;

create policy "tags_select_own" on public.tags
  for select using (auth.uid() = user_id);
create policy "tags_insert_own" on public.tags
  for insert with check (auth.uid() = user_id);
create policy "tags_update_own" on public.tags
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tags_delete_own" on public.tags
  for delete using (auth.uid() = user_id);

-- note_tags: ownership follows the note
create policy "note_tags_select_via_note" on public.note_tags
  for select using (exists (
    select 1 from public.notes n
    where n.id = note_tags.note_id and n.user_id = auth.uid()
  ));
create policy "note_tags_insert_via_note" on public.note_tags
  for insert with check (exists (
    select 1 from public.notes n
    where n.id = note_tags.note_id and n.user_id = auth.uid()
  ));
create policy "note_tags_delete_via_note" on public.note_tags
  for delete using (exists (
    select 1 from public.notes n
    where n.id = note_tags.note_id and n.user_id = auth.uid()
  ));

-- ------------------------------------------------------------
-- labs + experiments
-- ------------------------------------------------------------
create table public.labs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  subject_id    uuid references public.subjects (id) on delete set null,
  title         text not null,
  description   text,
  status        record_status not null default 'not_started',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.lab_experiments (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  lab_id           uuid not null references public.labs (id) on delete cascade,
  experiment_number integer,
  title            text not null,
  aim              text,
  objective        text,
  requirements     text,
  theory           text,
  algorithm        text,
  procedure        text,
  code             text,
  input            text,
  output           text,
  observation      text,
  result           text,
  conclusion       text,
  viva_questions   jsonb not null default '[]'::jsonb,
  teacher_remarks  text,
  status           record_status not null default 'not_started',
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger labs_set_updated_at
  before update on public.labs
  for each row execute function public.set_updated_at();
create trigger lab_experiments_set_updated_at
  before update on public.lab_experiments
  for each row execute function public.set_updated_at();

create index labs_user_idx on public.labs (user_id);
create index labs_subject_idx on public.labs (subject_id);
create index lab_experiments_lab_idx on public.lab_experiments (lab_id);
create index lab_experiments_user_idx on public.lab_experiments (user_id);

alter table public.labs enable row level security;
alter table public.lab_experiments enable row level security;

create policy "labs_select_own" on public.labs
  for select using (auth.uid() = user_id);
create policy "labs_insert_own" on public.labs
  for insert with check (auth.uid() = user_id);
create policy "labs_update_own" on public.labs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "labs_delete_own" on public.labs
  for delete using (auth.uid() = user_id);

create policy "lab_experiments_select_own" on public.lab_experiments
  for select using (auth.uid() = user_id);
create policy "lab_experiments_insert_own" on public.lab_experiments
  for insert with check (auth.uid() = user_id);
create policy "lab_experiments_update_own" on public.lab_experiments
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "lab_experiments_delete_own" on public.lab_experiments
  for delete using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- projects + tasks + milestones
-- ------------------------------------------------------------
create table public.projects (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  name             text not null,
  description      text,
  problem_statement text,
  solution         text,
  technologies     text[] not null default '{}',
  team_members     text[] not null default '{}',
  start_date       date,
  deadline         date,
  status           project_status not null default 'idea',
  progress         smallint not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint projects_progress_range check (progress between 0 and 100)
);

create table public.project_tasks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  project_id    uuid not null references public.projects (id) on delete cascade,
  title         text not null,
  description   text,
  status        task_status not null default 'todo',
  priority      smallint not null default 0,
  due_date      date,
  position      integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.project_milestones (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  project_id    uuid not null references public.projects (id) on delete cascade,
  title         text not null,
  description   text,
  due_date      date,
  completed     boolean not null default false,
  position      integer not null default 0,
  created_at    timestamptz not null default now()
);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();
create trigger project_tasks_set_updated_at
  before update on public.project_tasks
  for each row execute function public.set_updated_at();

create index projects_user_idx on public.projects (user_id);
create index project_tasks_project_idx on public.project_tasks (project_id);
create index project_milestones_project_idx on public.project_milestones (project_id);

alter table public.projects enable row level security;
alter table public.project_tasks enable row level security;
alter table public.project_milestones enable row level security;

create policy "projects_select_own" on public.projects
  for select using (auth.uid() = user_id);
create policy "projects_insert_own" on public.projects
  for insert with check (auth.uid() = user_id);
create policy "projects_update_own" on public.projects
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "projects_delete_own" on public.projects
  for delete using (auth.uid() = user_id);

create policy "project_tasks_select_own" on public.project_tasks
  for select using (auth.uid() = user_id);
create policy "project_tasks_insert_own" on public.project_tasks
  for insert with check (auth.uid() = user_id);
create policy "project_tasks_update_own" on public.project_tasks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "project_tasks_delete_own" on public.project_tasks
  for delete using (auth.uid() = user_id);

create policy "project_milestones_select_own" on public.project_milestones
  for select using (auth.uid() = user_id);
create policy "project_milestones_insert_own" on public.project_milestones
  for insert with check (auth.uid() = user_id);
create policy "project_milestones_update_own" on public.project_milestones
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "project_milestones_delete_own" on public.project_milestones
  for delete using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- questions (vault) + revision items
-- ------------------------------------------------------------
create table public.questions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  subject_id    uuid references public.subjects (id) on delete set null,
  topic_id      uuid references public.topics (id) on delete set null,
  question      text not null,
  answer        text,
  difficulty    difficulty not null default 'medium',
  status        question_status not null default 'unanswered',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.revision_items (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  subject_id    uuid references public.subjects (id) on delete set null,
  topic_id      uuid references public.topics (id) on delete set null,
  note_id       uuid references public.notes (id) on delete set null,
  title         text not null,
  content       text,
  status        revision_status not null default 'to_revise',
  difficulty    difficulty not null default 'medium',
  revised_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger questions_set_updated_at
  before update on public.questions
  for each row execute function public.set_updated_at();
create trigger revision_items_set_updated_at
  before update on public.revision_items
  for each row execute function public.set_updated_at();

create index questions_user_idx on public.questions (user_id);
create index questions_subject_idx on public.questions (subject_id);
create index revision_items_user_idx on public.revision_items (user_id);
create index revision_items_user_status_idx on public.revision_items (user_id, status);

alter table public.questions enable row level security;
alter table public.revision_items enable row level security;

create policy "questions_select_own" on public.questions
  for select using (auth.uid() = user_id);
create policy "questions_insert_own" on public.questions
  for insert with check (auth.uid() = user_id);
create policy "questions_update_own" on public.questions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "questions_delete_own" on public.questions
  for delete using (auth.uid() = user_id);

create policy "revision_items_select_own" on public.revision_items
  for select using (auth.uid() = user_id);
create policy "revision_items_insert_own" on public.revision_items
  for insert with check (auth.uid() = user_id);
create policy "revision_items_update_own" on public.revision_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "revision_items_delete_own" on public.revision_items
  for delete using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- attachments (polymorphic parent via parent_type + parent_id)
-- ------------------------------------------------------------
create table public.attachments (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  parent_type   attachment_type not null,
  parent_id     uuid not null,
  name          text not null,
  mime_type     text,
  size_bytes    bigint,
  storage_path  text not null,
  created_at    timestamptz not null default now()
);

create index attachments_user_idx on public.attachments (user_id);
create index attachments_parent_idx on public.attachments (parent_type, parent_id);

alter table public.attachments enable row level security;

create policy "attachments_select_own" on public.attachments
  for select using (auth.uid() = user_id);
create policy "attachments_insert_own" on public.attachments
  for insert with check (auth.uid() = user_id);
create policy "attachments_delete_own" on public.attachments
  for delete using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- storage: private "attachments" bucket, per-user folders
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

create policy "attachments_storage_select_own" on storage.objects
  for select using (bucket_id = 'attachments' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "attachments_storage_insert_own" on storage.objects
  for insert with check (bucket_id = 'attachments' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "attachments_storage_update_own" on storage.objects
  for update using (bucket_id = 'attachments' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "attachments_storage_delete_own" on storage.objects
  for delete using (bucket_id = 'attachments' and (storage.foldername(name))[1] = auth.uid()::text);