import { Layers, Sparkles } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/db";
import { embedValue } from "@/lib/utils";
import { AddRevisionCardModal, RevisionStatusSelect } from "./revision-card";

const DIFFICULTY_CLASS: Record<string, string> = {
  easy: "bg-surface-container text-on-surface-variant",
  medium: "bg-tertiary-container text-on-tertiary-container",
  hard: "bg-error-container text-on-error-container",
};

export default async function RevisionPage() {
  const { supabase, user } = await requireUser();

  const [{ data: cards }, { data: subjects }, { data: topics }] = await Promise.all([
    supabase
      .from("revision_items")
      .select("id, title, content, status, difficulty, revised_at, updated_at, subject:subjects(name)")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false }),
    supabase.from("subjects").select("id, name").eq("user_id", user.id),
    supabase.from("topics").select("id, subject_id, name").eq("user_id", user.id),
  ]);

  const subjectOptions = (subjects ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    topics: (topics ?? [])
      .filter((t) => t.subject_id === s.id)
      .map((t) => ({ id: t.id, name: t.name })),
  }));

  const toRevise = cards?.filter((c) => c.status === "to_revise").length ?? 0;
  const revising = cards?.filter((c) => c.status === "revising").length ?? 0;
  const mastered = cards?.filter((c) => c.status === "mastered").length ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Spaced Repetition · Review Deck"
        title="Revision"
        description="Calm, spaced review of the ideas you need at exam time."
        actions={<AddRevisionCardModal subjects={subjectOptions} />}
      />

      {(cards ?? []).length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No revision cards yet"
          description="Turn exam topics and weak points into review cards. Spaced repetition keeps them fresh."
          action={<AddRevisionCardModal subjects={subjectOptions} />}
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-4">
            <div className="rounded-xl border border-surface-variant bg-surface-container-lowest px-4 py-3 shadow-card">
              <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
                To Revise
              </p>
              <p className="font-display text-headline-md font-medium text-on-surface">{toRevise}</p>
            </div>
            <div className="rounded-xl border border-surface-variant bg-surface-container-lowest px-4 py-3 shadow-card">
              <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
                In Progress
              </p>
              <p className="font-display text-headline-md font-medium text-on-surface">{revising}</p>
            </div>
            <div className="rounded-xl border border-surface-variant bg-surface-container-lowest px-4 py-3 shadow-card">
              <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
                Mastered
              </p>
              <p className="font-display text-headline-md font-medium text-primary">{mastered}</p>
            </div>
            <div className="rounded-xl border border-surface-variant bg-surface-container-lowest px-4 py-3 shadow-card">
              <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
                Total
              </p>
              <p className="font-display text-headline-md font-medium text-on-surface">
                {cards?.length ?? 0}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {(cards ?? []).map((c) => (
              <article
                key={c.id}
                className="flex flex-col gap-3 rounded-xl border border-surface-variant bg-surface-container-lowest p-5 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-body text-body-lg font-medium leading-snug text-on-surface">
                    {c.title}
                  </p>
                  <RevisionStatusSelect itemId={c.id} status={c.status} />
                </div>
                {c.content ? (
                  <p className="line-clamp-4 whitespace-pre-wrap font-body text-body-sm text-on-surface-variant">
                    {c.content}
                  </p>
                ) : null}
                <div className="flex items-center justify-between border-t border-surface-variant pt-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`rounded-full px-2 py-0.5 font-display text-code-sm capitalize ${DIFFICULTY_CLASS[c.difficulty]}`}
                    >
                      {c.difficulty}
                    </span>
                    <span className="font-display text-code-sm text-secondary">
                      {embedValue(c.subject)?.name ?? "General"}
                    </span>
                  </div>
                  {c.revised_at ? (
                    <span className="font-display text-code-sm text-on-surface-variant">
                      <Sparkles className="mr-1 inline size-3" />
                      {c.status === "mastered" ? "Mastered" : "Reviewed"}{" "}
                      {new Date(c.revised_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}