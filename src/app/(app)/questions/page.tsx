import { CheckCircle2, HelpCircle, RefreshCcw, ShieldQuestion } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/db";
import { AddQuestionModal } from "./add-question-modal";
import { QuestionStatusSelect } from "./question-status-select";

const DIFFICULTY_CLASS: Record<string, string> = {
  easy: "bg-surface-container text-on-surface-variant",
  medium: "bg-tertiary-container text-on-tertiary-container",
  hard: "bg-error-container text-on-error-container",
};

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { supabase, user } = await requireUser();
  const { status } = await searchParams;

  let query = supabase
    .from("questions")
    .select("id, question, answer, difficulty, status, subject:subjects(name), topic:topics(name)")
    .eq("user_id", user.id);
  if (status) query = query.eq("status", status);
  query = query.order("updated_at", { ascending: false });
  const { data: questions } = await query;

  const [{ data: subjects }, { data: topics }] = await Promise.all([
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

  const counts = (q: typeof questions) => ({
    total: q?.length ?? 0,
    unanswered: q?.filter((x) => x.status === "unanswered").length ?? 0,
    needsRevision: q?.filter((x) => x.status === "needs_revision").length ?? 0,
    understood: q?.filter((x) => x.status === "understood").length ?? 0,
  });

  const c = counts(questions);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Exam Prep · Question Vault"
        title="Questions"
        description="Capture questions from exams, assignments, and lecture doubts."
        actions={<AddQuestionModal subjects={subjectOptions} />}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <a
            href="/questions"
            className={`rounded-full px-3.5 py-1.5 font-display text-code-sm transition-colors ${
              !status
                ? "bg-on-surface text-surface"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            All · {c.total}
          </a>
          {[
            { key: "unanswered", label: "Unanswered", icon: HelpCircle, count: c.unanswered },
            { key: "needs_revision", label: "Needs Revision", icon: RefreshCcw, count: c.needsRevision },
            { key: "understood", label: "Understood", icon: CheckCircle2, count: c.understood },
          ].map((f) => (
            <a
              key={f.key}
              href={`/questions?status=${f.key}`}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-display text-code-sm transition-colors ${
                status === f.key
                  ? "bg-on-surface text-surface"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <f.icon className="size-3.5" />
              {f.label} · {f.count}
            </a>
          ))}
        </div>
      </div>

      {(questions ?? []).length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-surface-variant bg-surface-container-lowest px-6 py-16 shadow-card">
          <ShieldQuestion className="size-8 text-secondary" />
          <p className="font-display text-headline-sm font-medium tracking-tight text-on-surface">
            {status ? "No questions in this filter" : "Your vault is empty"}
          </p>
          <p className="max-w-sm text-center font-body text-body-sm text-on-surface-variant">
            Every time a question comes up, capture it here. Your vault becomes your exam revision fuel.
          </p>
          <div className="mt-2">
            <AddQuestionModal subjects={subjectOptions} />
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {(questions ?? []).map((q) => (
            <article
              key={q.id}
              className="rounded-xl border border-surface-variant bg-surface-container-lowest shadow-card"
            >
              <div className="grid gap-4 p-5 lg:grid-cols-[1fr_auto]">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-display text-code-sm capitalize ${DIFFICULTY_CLASS[q.difficulty]}`}
                    >
                      {q.difficulty}
                    </span>
                    <span className="font-display text-code-sm text-secondary">
                      {q.subject?.[0]?.name ?? "General"}
                      {q.topic?.[0]?.name ? ` · ${q.topic[0].name}` : ""}
                    </span>
                  </div>
                  <p className="mt-2.5 font-body text-body-lg leading-relaxed text-on-surface">
                    {q.question}
                  </p>
                  {q.answer ? (
                    <div className="mt-4 rounded-lg border border-surface-variant bg-surface-container p-4">
                      <p className="mb-1.5 font-display text-label-sm uppercase tracking-wider text-secondary">
                        Reference Answer
                      </p>
                      <p className="whitespace-pre-wrap font-body text-body-md text-on-surface-variant">
                        {q.answer}
                      </p>
                    </div>
                  ) : null}
                </div>
                <div className="flex items-start justify-between lg:justify-end">
                  <QuestionStatusSelect questionId={q.id} status={q.status} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}