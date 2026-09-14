import Link from "next/link";
import { ArrowRight, ShieldQuestion } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/db";

export default async function VivaPage() {
  const { supabase, user } = await requireUser();

  const { data: experiments } = await supabase
    .from("lab_experiments")
    .select("id, title, viva_questions, lab:labs(title)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const items = (experiments ?? []).flatMap((e) =>
    (Array.isArray(e.viva_questions) ? (e.viva_questions as string[]) : []).map((q, i) => ({
      id: `${e.id}-${i}`,
      question: q,
      experimentId: e.id,
      experimentTitle: e.title,
      labTitle: (e.lab as { title?: string } | null)?.title ?? "Lab",
    })),
  );

  const total = items.length;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Oral Readiness · Mcq Confidence"
        title="Viva Prep"
        description={`${total} viva questions gathered from your lab records.${
          total ? "" : " Record experiments and add viva questions to build your list."
        }`}
      />

      {(experiments ?? []).some((e) => Array.isArray(e.viva_questions) && e.viva_questions.length > 0) ? (
        <div className="flex flex-col gap-3">
          {items.map((it) => (
            <Link
              key={it.id}
              href={`/labs/experiment/${it.experimentId}`}
              className="group rounded-xl border border-surface-variant bg-surface-container-lowest p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-popover"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <ShieldQuestion className="mt-0.5 size-5 shrink-0 text-primary" />
                  <p className="font-body text-body-lg leading-relaxed text-on-surface group-hover:text-primary">
                    {it.question}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-code-sm text-secondary">{it.labTitle}</p>
                  <p className="mt-0.5 flex items-center justify-end gap-1 font-display text-code-sm text-on-surface-variant">
                    {it.experimentTitle}
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ShieldQuestion}
          title="No viva questions yet"
          description="Add likely viva questions to each experiment record — they'll all surface here for quick review before oral exams."
        />
      )}
    </div>
  );
}