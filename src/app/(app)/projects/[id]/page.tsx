import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { requireUser } from "@/lib/db";
import { ProjectBoard } from "../project-board";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { supabase, user } = await requireUser();
  const { id } = await params;

  const [{ data: project }, { data: tasks }, { data: milestones }, { data: bugs }] =
    await Promise.all([
      supabase
        .from("projects")
        .select(
          "id, name, description, problem_statement, solution, technologies, team_members, start_date, deadline, status, progress",
        )
        .eq("user_id", user.id)
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("project_tasks")
        .select("id, title, status, due_date")
        .eq("project_id", id)
        .eq("user_id", user.id)
        .order("position", { ascending: true }),
      supabase
        .from("project_milestones")
        .select("id, title, completed, due_date")
        .eq("project_id", id)
        .eq("user_id", user.id)
        .order("position", { ascending: true }),
      supabase
        .from("bugs")
        .select("id, title, severity, status")
        .eq("project_id", id)
        .eq("user_id", user.id),
    ]);

  if (!project) notFound();

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/projects"
        className="inline-flex w-fit items-center gap-1.5 font-display text-label-sm text-secondary transition-colors hover:text-on-surface"
      >
        <ArrowLeft className="size-4" />
        Projects
      </Link>

      <div className="flex flex-col gap-4">
        <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
          {project.deadline ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              Deadline {project.deadline}
            </span>
          ) : (
            "Project Workspace"
          )}
        </p>
        <h1 className="font-display text-headline-xl font-medium tracking-tight text-on-surface">
          {project.name}
        </h1>
        {project.description ? (
          <p className="max-w-2xl font-body text-body-md text-on-surface-variant">
            {project.description}
          </p>
        ) : null}

        {(project.technologies ?? []).length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((t: string) => (
              <span
                key={t}
                className="rounded-full bg-secondary-container px-2.5 py-1 font-display text-code-sm text-on-secondary-container"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {project.problem_statement ? (
        <section className="rounded-xl border border-surface-variant bg-surface-container-lowest p-5 shadow-card">
          <h2 className="font-display text-label-sm uppercase tracking-wider text-secondary">
            Problem Statement
          </h2>
          <p className="mt-2 max-w-3xl whitespace-pre-wrap font-body text-body-md text-on-surface">
            {project.problem_statement}
          </p>
        </section>
      ) : null}

      <ProjectBoard
        projectId={project.id}
        initialStatus={project.status}
        initialTasks={(tasks ?? []).map((t) => ({
          id: t.id,
          title: t.title,
          status: t.status,
          due_date: t.due_date,
        }))}
        initialMilestones={(milestones ?? []).map((m) => ({
          id: m.id,
          title: m.title,
          completed: m.completed,
          due_date: m.due_date,
        }))}
      />

      {(bugs ?? []).length > 0 ? (
        <section className="rounded-xl border border-surface-variant bg-surface-container-lowest shadow-card">
          <div className="flex items-center justify-between border-b border-surface-variant px-5 py-4">
            <h2 className="font-display text-headline-sm font-medium tracking-tight text-on-surface">
              Bug Journal for this project
            </h2>
            <Link
              href="/bugs"
              className="font-display text-label-sm text-primary transition-colors hover:text-on-surface"
            >
              Open bug journal →
            </Link>
          </div>
          <ul className="divide-y divide-surface-variant">
            {(bugs ?? []).map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <span className="truncate font-body text-body-md text-on-surface">{b.title}</span>
                <span className="shrink-0 font-display text-code-sm text-secondary">
                  {b.severity} · {b.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}