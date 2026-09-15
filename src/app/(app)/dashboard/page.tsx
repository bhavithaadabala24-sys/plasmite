import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  Check,
  Circle,
  Clock3,
  FlaskConical,
  NotebookText,
  RefreshCw,
} from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { ProgressBar } from "@/components/app/progress-bar";
import { StatCard } from "@/components/app/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/db";
import { embedValue } from "@/lib/utils";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function firstWord(name: string) {
  return name.trim().split(/\s+/)[0] || "Engineer";
}

function daysBetween(from: Date, to: Date) {
  return Math.ceil((to.getTime() - from.getTime()) / 86400000);
}

export default async function DashboardPage() {
  const { supabase, user } = await requireUser();
  const now = new Date();
  const weekEnd = new Date(now.getTime() + 7 * 86400000);

  const [{ data: profile }, { data: subjects }, { data: topics }, { data: recentNotes }, { count: notesCount }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, branch, semester")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("subjects")
        .select("id, name, code, semester, exam_date, color")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("topics")
        .select("id, subject_id, status")
        .eq("user_id", user.id),
      supabase
        .from("notes")
        .select("id, title, updated_at")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("updated_at", { ascending: false })
        .limit(5),
      supabase
        .from("notes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_archived", false),
    ]);

  const [{ data: openTasks }, { data: projects }, { data: revisionItems }] = await Promise.all([
    supabase
      .from("project_tasks")
      .select("id, title, due_date, project:projects(name)")
      .eq("user_id", user.id)
      .in("status", ["todo", "in_progress"])
      .order("due_date", { ascending: true, nullsFirst: true })
      .limit(8),
    supabase
      .from("projects")
      .select("id, name, deadline, status")
      .eq("user_id", user.id),
    supabase
      .from("revision_items")
      .select("id")
      .eq("user_id", user.id)
      .neq("status", "mastered"),
  ]);

  const subjectProgress = new Map<
    string,
    { total: number; completed: number }
  >();
  for (const t of topics ?? []) {
    const entry = subjectProgress.get(t.subject_id) ?? { total: 0, completed: 0 };
    entry.total += 1;
    if (t.status === "completed") entry.completed += 1;
    subjectProgress.set(t.subject_id, entry);
  }

  const dueThisWeek: Array<{ label: string; date: string }> = [];
  for (const s of subjects ?? []) {
    if (s.exam_date) {
      const d = new Date(`${s.exam_date}T23:59:59`);
      if (d >= now && d <= weekEnd) dueThisWeek.push({ label: `${s.code || s.name} exam`, date: s.exam_date });
    }
  }
  for (const p of projects ?? []) {
    if (p.deadline) {
      const d = new Date(`${p.deadline}T23:59:59`);
      if (d >= now && d <= weekEnd) dueThisWeek.push({ label: `${p.name} deadline`, date: p.deadline });
    }
  }

  const coursesTotal = subjects?.length ?? 0;
  const notesTotal = notesCount ?? 0;
  const revisionPending = revisionItems?.length ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Folio · Workspace"
        title={
          <>
            {greeting()}, {firstWord(profile?.full_name || "")}.
          </>
        }
        description={
          profile?.semester
            ? `Semester ${profile.semester}${profile.branch ? ` · ${profile.branch}` : ""}.`
            : "Your engineering notebook workspace."
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Active Subjects"
          value={String(coursesTotal)}
          detail={`${topics?.length ?? 0} syllabus topics`}
        />
        <StatCard
          icon={NotebookText}
          label="Notes"
          value={String(notesTotal)}
          detail="Recent folio entries"
        />
        <StatCard
          icon={RefreshCw}
          label="Revision Pending"
          value={String(revisionPending)}
          detail="Awaiting review"
        />
        <StatCard
          icon={CalendarDays}
          label="Due This Week"
          value={String(dueThisWeek.length)}
          detail={dueThisWeek.slice(0, 1).map((d) => `${d.label} · ${d.date}`)[0] ?? "Nothing scheduled"}
        />
      </div>

      {(openTasks ?? []).length > 0 ? (
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-surface-variant bg-surface-container-lowest shadow-card">
            <div className="flex items-center justify-between border-b border-surface-variant px-5 py-4">
              <h2 className="font-display text-headline-sm font-medium tracking-tight text-on-surface">
                Pending Actions
              </h2>
              <Link
                href="/projects"
                className="font-display text-label-sm text-primary transition-colors hover:text-on-surface"
              >
                Open workspace →
              </Link>
            </div>
            <ul className="divide-y divide-surface-variant">
              {(openTasks ?? []).map((t) => (
                <li key={t.id} className="flex items-center gap-3.5 px-5 py-3.5">
                  <Circle className="size-4 shrink-0 text-outline-variant" strokeWidth={2} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body text-body-md text-on-surface">{t.title}</p>
                    <p className="font-display text-code-sm text-secondary">
                      {embedValue(t.project)?.name ?? "Unassigned"}
                      {t.due_date ? ` · Due ${t.due_date}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-surface-variant bg-surface-container-lowest shadow-card">
            <div className="flex items-center justify-between border-b border-surface-variant px-5 py-4">
              <h2 className="font-display text-headline-sm font-medium tracking-tight text-on-surface">
                Active Curricula
              </h2>
              <Link
                href="/subjects"
                className="font-display text-label-sm text-primary transition-colors hover:text-on-surface"
              >
                Manage syllabus →
              </Link>
            </div>
            <ul className="divide-y divide-surface-variant">
              {(subjects ?? []).slice(0, 5).map((s) => {
                const prog = subjectProgress.get(s.id);
                const pct = prog?.total ? (prog.completed / prog.total) * 100 : 0;
                return (
                  <li key={s.id} className="px-5 py-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="min-w-0 flex-1 truncate font-display text-label-md text-on-surface">
                        {s.name}
                      </p>
                      <span className="shrink-0 font-display text-code-sm text-secondary">
                        {prog ? `${prog.completed}/${prog.total} units` : "—"}
                      </span>
                    </div>
                    <ProgressBar value={pct} className="mt-2" />
                  </li>
                );
              })}
              {(subjects ?? []).length === 0 ? (
                <li className="px-5 py-10 text-center">
                  <p className="font-body text-body-md text-on-surface-variant">
                    Add your first subject to track syllabus progress.
                  </p>
                  <Link
                    href="/subjects"
                    className="mt-2 inline-block font-display text-label-sm text-primary transition-colors hover:text-on-surface"
                  >
                    Add a subject →
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </section>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <EmptyState
            icon={Check}
            title="No open tasks"
            description="Tasks from your projects and milestones will appear here as pending actions."
          />
          <div className="rounded-xl border border-surface-variant bg-surface-container-lowest shadow-card">
            <div className="flex items-center justify-between border-b border-surface-variant px-5 py-4">
              <h2 className="font-display text-headline-sm font-medium tracking-tight text-on-surface">
                Active Curricula
              </h2>
              <Link
                href="/subjects"
                className="font-display text-label-sm text-primary transition-colors hover:text-on-surface"
              >
                Manage syllabus →
              </Link>
            </div>
            <ul className="divide-y divide-surface-variant">
              {(subjects ?? []).slice(0, 5).map((s) => {
                const prog = subjectProgress.get(s.id);
                const pct = prog?.total ? (prog.completed / prog.total) * 100 : 0;
                return (
                  <li key={s.id} className="px-5 py-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="min-w-0 flex-1 truncate font-display text-label-md text-on-surface">
                        {s.name}
                      </p>
                      <span className="shrink-0 font-display text-code-sm text-secondary">
                        {prog ? `${prog.completed}/${prog.total} units` : "—"}
                      </span>
                    </div>
                    <ProgressBar value={pct} className="mt-2" />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-surface-variant bg-surface-container-lowest shadow-card">
          <div className="flex items-center justify-between border-b border-surface-variant px-5 py-4">
            <h2 className="font-display text-headline-sm font-medium tracking-tight text-on-surface">
              Recent Notes
            </h2>
            <Link
              href="/notes"
              className="font-display text-label-sm text-primary transition-colors hover:text-on-surface"
            >
              Notes library →
            </Link>
          </div>
          {(recentNotes ?? []).length > 0 ? (
            <ul className="divide-y divide-surface-variant">
              {(recentNotes ?? []).map((n) => (
                <li key={n.id}>
                  <Link
                    href={`/notes/${n.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-surface-container"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <NotebookText className="size-4 shrink-0 text-primary" />
                      <span className="truncate font-body text-body-md text-on-surface">
                        {n.title || "Untitled"}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 font-display text-code-sm text-secondary">
                      <Clock3 className="size-3.5" />
                      {new Date(n.updated_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-10 text-center">
              <p className="font-body text-body-md text-on-surface-variant">
                Your latest notes will appear here.
              </p>
              <Link
                href="/notes/new"
                className="mt-2 inline-block font-display text-label-sm text-primary transition-colors hover:text-on-surface"
              >
                Write your first note →
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-surface-variant bg-surface-container-lowest shadow-card">
          <div className="flex items-center justify-between border-b border-surface-variant px-5 py-4">
            <h2 className="font-display text-headline-sm font-medium tracking-tight text-on-surface">
              Deadlines & Practicals
            </h2>
            <Link
              href="/revision"
              className="font-display text-label-sm text-primary transition-colors hover:text-on-surface"
            >
              Revision deck →
            </Link>
          </div>
          {dueThisWeek.length > 0 ? (
            <ul className="divide-y divide-surface-variant">
              {dueThisWeek.map((d, i) => (
                <li key={`${d.label}-${i}`} className="flex items-center gap-3.5 px-5 py-3.5">
                  <FlaskConical className="size-4 shrink-0 text-primary" />
                  <p className="min-w-0 flex-1 truncate font-body text-body-md text-on-surface">
                    {d.label}
                  </p>
                  <span className="shrink-0 font-display text-code-sm text-secondary">
                    {daysBetween(now, new Date(`${d.date}T23:59:59`)) === 0
                      ? "Today"
                      : `In ${daysBetween(now, new Date(`${d.date}T23:59:59`))}d`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="Nothing due this week"
              description="Exam dates and project deadlines will show up here as you add them."
              className="border-0 shadow-none"
            />
          )}
        </div>
      </section>
    </div>
  );
}