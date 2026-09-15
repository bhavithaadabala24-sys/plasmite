import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";

import { ProgressBar } from "@/components/app/progress-bar";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/db";
import { CreateProjectModal } from "./create-project-modal";

export default async function ProjectsPage() {
  const { supabase, user } = await requireUser();

  const [{ data: projects }, { data: tasks }, { data: milestones }] = await Promise.all([
    supabase
      .from("projects")
      .select("id, name, description, technologies, start_date, deadline, status, progress, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false }),
    supabase.from("project_tasks").select("id, project_id, status").eq("user_id", user.id),
    supabase.from("project_milestones").select("id, project_id, completed").eq("user_id", user.id),
  ]);

  const infoByProject = new Map<
    string,
    { tasks: number; done: number; milestones: number; msDone: number }
  >();
  for (const t of tasks ?? []) {
    const e = infoByProject.get(t.project_id) ?? { tasks: 0, done: 0, milestones: 0, msDone: 0 };
    e.tasks += 1;
    if (t.status === "done") e.done += 1;
    infoByProject.set(t.project_id, e);
  }
  for (const m of milestones ?? []) {
    const e = infoByProject.get(m.project_id) ?? { tasks: 0, done: 0, milestones: 0, msDone: 0 };
    e.milestones += 1;
    if (m.completed) e.msDone += 1;
    infoByProject.set(m.project_id, e);
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Build Notes · Workspaces"
        title="Projects"
        description="Project workspaces: milestones, tasks, and build progress."
        actions={<CreateProjectModal />}
      />

      {(projects ?? []).length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No projects yet"
          description="Sketch an idea, plan milestones, and track your builds here."
          action={<CreateProjectModal />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(projects ?? []).map((p) => {
            const info = infoByProject.get(p.id);
            const pct = info && info.tasks ? (info.done / info.tasks) * 100 : p.progress ?? 0;
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="group flex flex-col gap-4 rounded-xl border border-surface-variant bg-surface-container-lowest p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-popover"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-headline-md font-medium tracking-tight text-on-surface group-hover:text-primary">
                      {p.name}
                    </h2>
                    {p.description ? (
                      <p className="mt-1 line-clamp-2 font-body text-body-sm text-on-surface-variant">
                        {p.description}
                      </p>
                    ) : null}
                  </div>
                  <span className="shrink-0 rounded-full bg-surface-container px-2.5 py-1 font-display text-code-sm text-on-surface">
                    {p.status}
                  </span>
                </div>

                {(p.technologies ?? []).length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {p.technologies.map((t: string) => (
                      <span
                        key={t}
                        className="rounded-full bg-secondary-container px-2 py-0.5 font-display text-code-sm text-on-secondary-container"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
                      Progress
                    </p>
                    <span className="font-display text-code-sm text-on-surface">{Math.round(pct)}%</span>
                  </div>
                  <ProgressBar value={pct} className="mt-2" />
                  <p className="mt-1.5 font-body text-body-sm text-on-surface-variant">
                    {info
                      ? `${info.done}/${info.tasks} tasks · ${info.msDone}/${info.milestones} milestones`
                      : "No tasks yet"}
                    {p.deadline ? ` · Due ${p.deadline}` : ""}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-surface-variant pt-4">
                  <span className="min-w-0 truncate font-display text-code-sm text-on-surface-variant">
                    {p.start_date ? `Started ${p.start_date}` : "Open workspace"}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1.5 font-display text-label-sm text-primary transition-colors group-hover:text-on-surface">
                    Open Workspace
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}