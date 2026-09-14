import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/db";
import { CreateLabModal } from "./create-lab-modal";

export default async function LabsPage() {
  const { supabase, user } = await requireUser();

  const [{ data: labs }, { data: experiments }, { data: subjects }] = await Promise.all([
    supabase
      .from("labs")
      .select("id, title, description, status, subject_id, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false }),
    supabase.from("lab_experiments").select("id, lab_id, status").eq("user_id", user.id),
    supabase.from("subjects").select("id, name").eq("user_id", user.id),
  ]);

  const subjectName = new Map((subjects ?? []).map((s) => [s.id, s.name]));
  const expByLab = new Map<string, { total: number; done: number }>();
  for (const exp of experiments ?? []) {
    const e = expByLab.get(exp.lab_id) ?? { total: 0, done: 0 };
    e.total += 1;
    if (exp.status === "completed") e.done += 1;
    expByLab.set(exp.lab_id, e);
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Practical Records · Experiments"
        title="Labs"
        description="Structured lab notebooks: aim, algorithm, observations, results, viva."
        actions={<CreateLabModal subjects={subjects ?? []} />}
      />

      {(labs ?? []).length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="No labs yet"
          description="Create a lab notebook for each practical you take this term."
          action={<CreateLabModal subjects={subjects ?? []} />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(labs ?? []).map((lab) => {
            const prog = expByLab.get(lab.id);
            return (
              <Link
                key={lab.id}
                href={`/labs/${lab.id}`}
                className="group flex flex-col justify-between gap-5 rounded-xl border border-surface-variant bg-surface-container-lowest p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-popover"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-headline-md font-medium tracking-tight text-on-surface group-hover:text-primary">
                      {lab.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 font-body text-body-sm text-on-surface-variant">
                      {lab.description || "Practical record"}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-surface-container px-2.5 py-1 font-display text-code-sm text-on-surface">
                    <span className="size-1.5 rounded-full bg-primary" />
                    {lab.status.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-surface-variant pt-4">
                  <span className="font-display text-code-sm text-on-surface-variant">
                    {subjectName.get(lab.subject_id ?? "") ?? "General lab"}
                    {prog ? ` · ${prog.done}/${prog.total} experiments` : ""}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-display text-label-sm text-primary transition-colors group-hover:text-on-surface">
                    Open Notebook
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