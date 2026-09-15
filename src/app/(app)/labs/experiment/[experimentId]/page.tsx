import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { LabRecordForm } from "@/components/labs/lab-record-form";
import { requireUser } from "@/lib/db";
import { embedValue } from "@/lib/utils";

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ experimentId: string }>;
}) {
  const { supabase, user } = await requireUser();
  const { experimentId } = await params;

  const { data: experiment } = await supabase
    .from("lab_experiments")
    .select(
      "id, experiment_number, title, aim, objective, requirements, theory, algorithm, procedure, code, input, output, observation, result, conclusion, viva_questions, teacher_remarks, status, lab:labs(id, title)",
    )
    .eq("user_id", user.id)
    .eq("id", experimentId)
    .maybeSingle();

  if (!experiment) notFound();

  const lab = embedValue(experiment.lab);

  const record = {
    ...experiment,
    experiment_number: experiment.experiment_number ?? "",
    viva_questions: experiment.viva_questions ?? [],
  };

  return (
    <div className="flex flex-col gap-6">
      {lab ? (
        <Link
          href={`/labs/${lab.id}`}
          className="inline-flex w-fit items-center gap-1.5 font-display text-label-sm text-secondary transition-colors hover:text-on-surface"
        >
          <ArrowLeft className="size-4" />
          {lab.title ?? "Lab Notebook"}
        </Link>
      ) : null}

      <div className="flex flex-col gap-2">
        <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
          {record.experiment_number ? `Experiment ${record.experiment_number}` : "Experiment Record"}
        </p>
        <h1 className="font-display text-headline-xl font-medium tracking-tight text-on-surface">
          {record.title}
        </h1>
      </div>

      <LabRecordForm experimentId={experiment.id} initial={record} />
    </div>
  );
}