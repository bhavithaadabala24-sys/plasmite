# PLASMITE Database Schema

Migration: `supabase/migrations/20260914000000_init.sql`
Scope: MVP domain (Prompt 09). Tables added later phases via new migrations.

## Rules

- Every user-owned row has a `user_id uuid not null` scoped to `auth.users(id)`.
- Row Level Security is enabled on all user tables; policies allow only
  `auth.uid() = user_id` (select/insert/update/delete). Child records are
  protected through their parent ownership path.
- The service role bypasses RLS — never use it from the browser.
- All tables have `created_at`; mutable ones have `updated_at` bumped by the
  shared `public.set_updated_at()` trigger.

## Triggers

- `on_auth_user_created` → `handle_new_user()` auto-creates a `profiles` row
  on signup, carrying `raw_user_meta_data.full_name` into `profiles.full_name`.

## Tables

### profiles
`id` (= auth.users.id), `full_name`, `branch`, `year`, `semester`, `avatar_url`.

### subjects
`name`, `code`, `year`, `semester`, `description`, `credits`, `exam_date`,
`color`, `icon`, `sort_order`. Indexed by `(user_id, year, semester)`.

### topics
Per-subject syllabus units: `subject_id`, `unit_number`, `name`, `description`,
`status` (`topic_status`: not_started / learning / practicing / completed /
needs_revision), `sort_order`. Cascade-deleted with the subject.

### notes
Core content: `title`, `content` (markdown/rich), `plain_text` (for search and
export), `summary`, optional `subject_id`/`topic_id` (set-null on delete),
`is_favorite`, `is_pinned`, `is_archived`.
`search_vector` is a generated tsvector (title weight A, body weight B) with a
GIN index for full-text search. Indexed for "recent" (`user_id, updated_at desc`)
and partial indexes for favorites/pinned.

### tags + note_tags
`tags` are unique per user (`unique (user_id, lower(name))`), with `color`.
`note_tags` is the join; policies resolve ownership through `notes`.

### labs + lab_experiments
`labs`: `subject_id` (optional), `title`, `description`, `status`
(`record_status`).
`lab_experiments`: formatted fields from PROJECT.md §9 — `experiment_number`,
`aim`, `objective`, `requirements`, `theory`, `algorithm`, `procedure`, `code`,
`input`, `output`, `observation`, `result`, `conclusion`, `viva_questions`
(jsonb array), `teacher_remarks`, `status`, `sort_order`.

### projects + project_tasks + project_milestones
`projects`: `problem_statement`, `solution`, `technologies text[]`,
`team_members text[]`, dates, `status` (`project_status`: idea / research /
planning / building / testing / completed / archived), `progress` 0–100.
`project_tasks`: `status` (todo / in_progress / done), `priority`, `due_date`,
`position`. `project_milestones`: `title`, `due_date`, `completed`, `position`.

### questions
Vault: `question`, `answer`, optional `subject_id`/`topic_id`, `difficulty`
(easy / medium / hard), `status` (unanswered / learning / understood /
needs_revision).

### revision_items
`title`, `content`, optional `subject_id`/`topic_id`/`note_id`,
`status` (to_revise / revising / revised / mastered), `difficulty`, `revised_at`.
Indexed by `(user_id, status)`.

### attachments
Polymorphic: `parent_type` (attachment_type enum), `parent_id`, `name`,
`mime_type`, `size_bytes`, `storage_path`.

## Storage

- Private bucket `attachments`. Objects live at `{user_id}/...`.
- Policies on `storage.objects` allow each user to read/write/update/delete
  only within their own user-id folder (`(storage.foldername(name))[1]`).

## Applying

```sh
# Push migrations to the remote project (DSN is in the gitignored supabase/.env.db)
npx -y supabase@latest db push --db-url "$(Get-Content supabase\.env.db)" --include-all --yes
```

Applied to production project `buxfauvofrrwwxxdjwgh` (region ap-southeast-2).
Verify on a clean database before pushing experimental migrations.