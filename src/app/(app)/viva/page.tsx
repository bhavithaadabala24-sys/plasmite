import Link from "next/link";
import { ArrowRight, ShieldQuestion } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/db";
import { embedValue } from "@/lib/utils";

export default async function VivaPage() {
  const { supabase, user } = await requireUser();

  const { data: experiments } = await supabase
    .from("lab_experiments")
    .select("id, title, viva_questions, lab:labs(title)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(200);

  function questionsOf(e: {
    viva_questions: unknown;
  }): string[] {
    const raw = e.viva_questions;
    if (Array.isArray(raw)) return raw.filter((q): q is string => typeof q === "string");
    if (typeof raw === "string") {
      try {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter((q): q is string => typeof q === "string");
      } catch {
        return [];
      }
    }
    return [];
  }

  const items = (experiments ?? []).flatMap((e) => {
    const lab = embedValue(e.lab);
    return questionsOf(e).map((q, i) => ({
      id: `${e.id}-${i}`,
      question: q,
      experimentId: e.id,
      experimentTitle: e.title,
      labTitle: lab?.title ?? "Lab",
    }));
  });

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

      {(experiments ?? []).some((e) => questionsOf(e).length > 0) ? (
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
                <div className="max-w-[45%] shrink-0 text-right">
                  <p className="truncate font-display text-code-sm text-secondary">{it.labTitle}</p>
                  <p className="mt-0.5 flex items-center justify-end gap-1 font-display text-code-sm text-on-surface-variant">
                    <span className="truncate">{it.experimentTitle}</span>
                    <ArrowRight className="size-3 shrink-0 transition-transform group-hover:translate-x-0.5" />
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