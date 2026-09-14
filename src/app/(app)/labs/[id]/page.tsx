import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, FlaskConical } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { requireUser } from "@/lib/db";
import { embedValue } from "@/lib/utils";
import { AddExperimentModal } from "../add-experiment-modal";

export default async function LabDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase, user } = await requireUser();
  const { id } = await params;

  const [{ data: lab }, { data: experiments }] = await Promise.all([
    supabase
      .from("labs")
      .select("id, title, description, status, subject_id, created_at, updated_at, subject:subjects(name)")
      .eq("user_id", user.id)
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("lab_experiments")
      .select("id, experiment_number, title, status, updated_at")
      .eq("lab_id", id)
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true })
      .order("experiment_number", { ascending: true, nullsFirst: true })
      .order("created_at", { ascending: true }),
  ]);

  if (!lab) notFound();

  const labSubjectName = embedValue(lab.subject)?.name;
  const done = experiments?.filter((e) => e.status === "completed").length ?? 0;
  const pct = experiments?.length ? (done / experiments.length) * 100 : 0;
  const nextNumber =
    Math.max(0, ...(experiments ?? []).map((e) => e.experiment_number ?? 0)) + 1;

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/labs"
        className="inline-flex w-fit items-center gap-1.5 font-display text-label-sm text-secondary transition-colors hover:text-on-surface"
      >
        <ArrowLeft className="size-4" />
        Labs
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
            {labSubjectName ? `${labSubjectName} · ` : ""}Experiment Record
          </p>
          <h1 className="mt-1 font-display text-headline-xl font-medium tracking-tight text-on-surface">
            {lab.title}
          </h1>
          {lab.description ? (
            <p className="mt-2 max-w-2xl font-body text-body-md text-on-surface-variant">
              {lab.description}
            </p>
          ) : null}
          <p className="mt-3 font-display text-code-sm text-on-surface-variant">
            {done}/{experiments?.length ?? 0} experiments completed · {Math.round(pct)}%
          </p>
        </div>
        <AddExperimentModal labId={lab.id} nextNumber={nextNumber} />
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>

      {(experiments ?? []).length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="No experiments yet"
          description="Add the experiments in your lab manual — each opens a structured notebook record."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {(experiments ?? []).map((exp, i) => (
            <li key={exp.id}>
              <Link
                href={`/labs/experiment/${exp.id}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-surface-variant bg-surface-container-lowest p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-popover"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-container font-display text-label-md text-on-surface">
                    {exp.experiment_number ?? i + 1}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-label-md text-on-surface group-hover:text-primary">
                      {exp.title}
                    </h2>
                    <p className="font-display text-code-sm text-secondary">
                      {exp.status.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <ArrowRight className="size-4 shrink-0 text-secondary transition-transform group-hover:translate-x-0.5 group-hover:text-on-surface" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}