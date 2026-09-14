import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, ListTodo, RotateCcw } from "lucide-react";

import { ProgressBar } from "@/components/app/progress-bar";
import { requireUser } from "@/lib/db";
import { AddTopicModal } from "../add-topic-modal";
import { DeleteSubjectButton } from "../delete-subject-button";
import { TopicStatusSelect } from "../topic-status-select";

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { supabase, user } = await requireUser();
  const { id } = await params;

  const [{ data: subject }, { data: topics }] = await Promise.all([
    supabase
      .from("subjects")
      .select("id, name, code, semester, year, description, exam_date, created_at")
      .eq("user_id", user.id)
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("topics")
      .select("id, unit_number, name, description, status, sort_order")
      .eq("subject_id", id)
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true })
      .order("unit_number", { ascending: true, nullsFirst: true })
      .order("created_at", { ascending: true }),
  ]);

  if (!subject) notFound();

  const total = topics?.length ?? 0;
  const completed = topics?.filter((t) => t.status === "completed").length ?? 0;
  const inProgress =
    topics?.filter((t) => t.status === "learning" || t.status === "practicing").length ?? 0;
  const needsRevision = topics?.filter((t) => t.status === "needs_revision").length ?? 0;
  const pct = total ? (completed / total) * 100 : 0;

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/subjects"
        className="inline-flex w-fit items-center gap-1.5 font-display text-label-sm text-secondary transition-colors hover:text-on-surface"
      >
        <ArrowLeft className="size-4" />
        Subjects
      </Link>

      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
            {subject.code ?? "Module Registry"}
            {subject.semester ? ` · Semester ${subject.semester}` : ""}
            {subject.year ? ` · Year ${subject.year}` : ""}
          </p>
          <h1 className="mt-1 font-display text-headline-xl font-medium tracking-tight text-on-surface">
            {subject.name}
          </h1>
          {subject.description ? (
            <p className="mt-2 max-w-2xl font-body text-body-md text-on-surface-variant">
              {subject.description}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {subject.exam_date ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 font-display text-code-sm text-on-surface">
                <CalendarDays className="size-3.5 text-primary" />
                Exam {subject.exam_date}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-display text-code-sm text-secondary">
                <Clock3 className="size-3.5" />
                No exam date set
              </span>
            )}
          </div>
        </div>
        <DeleteSubjectButton subjectId={subject.id} subjectName={subject.name} />
      </div>

      <div className="rounded-xl border border-surface-variant bg-surface-container-lowest p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-headline-sm font-medium tracking-tight text-on-surface">
            Syllabus Progress
          </h2>
          <span className="font-display text-headline-md font-medium text-on-surface">
            {Math.round(pct)}%
          </span>
        </div>
        <ProgressBar value={pct} className="mt-3" />
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <span className="font-body text-body-sm text-on-surface-variant">
            <CheckCircle2 className="mr-1.5 inline size-4 text-primary" />
            {completed} completed
          </span>
          <span className="font-body text-body-sm text-on-surface-variant">
            <Clock3 className="mr-1.5 inline size-4 text-tertiary" />
            {inProgress} in progress
          </span>
          <span className="font-body text-body-sm text-on-surface-variant">
            <RotateCcw className="mr-1.5 inline size-4 text-on-error-container" />
            {needsRevision} needs revision
          </span>
          <span className="font-body text-body-sm text-on-surface-variant">
            <ListTodo className="mr-1.5 inline size-4 text-secondary" />
            {total} topics total
          </span>
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-headline-lg font-medium tracking-tight text-on-surface">
            Syllabus Topics
          </h2>
          <span className="font-display text-code-sm text-secondary">
            {completed}/{total} mastered
          </span>
        </div>

        {(topics ?? []).length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-surface-variant bg-surface-container-lowest px-6 py-12 text-center shadow-card">
            <p className="font-display text-headline-sm font-medium tracking-tight text-on-surface">
              No syllabus units yet
            </p>
            <p className="max-w-sm font-body text-body-sm text-on-surface-variant">
              Add unit-level topics for {subject.name} to track your coverage this term.
            </p>
            <div className="mt-2 w-56">
              <AddTopicModal subjectId={subject.id} />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {(topics ?? []).map((topic, i) => (
                <div
                  key={topic.id}
                  className="flex flex-col gap-3 rounded-xl border border-surface-variant bg-surface-container-lowest p-4 shadow-card sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-container font-display text-label-sm text-on-surface">
                      {topic.unit_number ?? i + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-label-md text-on-surface">{topic.name}</h3>
                      {topic.description ? (
                        <p className="mt-0.5 line-clamp-2 font-body text-body-sm text-on-surface-variant">
                          {topic.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <TopicStatusSelect topicId={topic.id} status={topic.status} />
                </div>
              ))}
            </div>
            <div className="mt-4 w-full sm:w-72">
              <AddTopicModal subjectId={subject.id} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}