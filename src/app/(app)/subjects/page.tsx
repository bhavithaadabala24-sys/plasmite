import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { ProgressBar } from "@/components/app/progress-bar";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/db";
import { CreateSubjectModal } from "./create-subject-modal";

export default async function SubjectsPage() {
  const { supabase, user } = await requireUser();

  const [{ data: subjects }, { data: topics }, { data: profile }] = await Promise.all([
    supabase
      .from("subjects")
      .select("id, name, code, semester, year, description, exam_date, sort_order")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("topics")
      .select("id, subject_id, status")
      .eq("user_id", user.id),
    supabase
      .from("profiles")
      .select("branch, semester")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  const progressBySubject = new Map<string, { total: number; completed: number }>();
  for (const t of topics ?? []) {
    const e = progressBySubject.get(t.subject_id) ?? { total: 0, completed: 0 };
    e.total += 1;
    if (t.status === "completed") e.completed += 1;
    progressBySubject.set(t.subject_id, e);
  }

  const totalUnits = topics?.length ?? 0;
  const masteredUnits = topics?.filter((t) => t.status === "completed").length ?? 0;
  const pct = totalUnits ? (masteredUnits / totalUnits) * 100 : 0;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Registry Index · Syllabus"
        title="Subjects & Syllabus"
        description={`${
          profile?.semester ? `Semester ${profile.semester} · ` : ""
        }${profile?.branch ?? "Your engineering program"}${totalUnits ? ` · ${masteredUnits}/${totalUnits} syllabus units mastered` : ""}`}
        actions={<CreateSubjectModal />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-surface-variant bg-surface-container-lowest p-4 shadow-card">
          <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
            Cumulative Syllabus
          </p>
          <p className="mt-1 font-display text-headline-md font-medium text-on-surface">
            {totalUnits ? `${masteredUnits} / ${totalUnits}` : "0 / 0"}
          </p>
          <ProgressBar value={pct} className="mt-3" />
        </div>
        <div className="rounded-xl border border-surface-variant bg-surface-container-lowest p-4 shadow-card">
          <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
            Active Subjects
          </p>
          <p className="mt-1 font-display text-headline-md font-medium text-on-surface">
            {subjects?.length ?? 0}
          </p>
          <p className="mt-1 font-body text-body-sm text-on-surface-variant">
            Enrolled this term
          </p>
        </div>
        <div className="rounded-xl border border-surface-variant bg-surface-container-lowest p-4 shadow-card">
          <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
            Next Exam Watch
          </p>
          <p className="mt-1 truncate font-display text-headline-sm font-medium text-on-surface">
            {(() => {
              const upcoming = (subjects ?? [])
                .filter((s) => s.exam_date)
                .sort((a, b) => a.exam_date!.localeCompare(b.exam_date!));
              return upcoming[0]?.exam_date
                ? `${upcoming[0].code || upcoming[0].name}`
                : "No exams scheduled";
            })()}
          </p>
          <p className="mt-1 font-body text-body-sm text-on-surface-variant">
            {(() => {
              const upcoming = (subjects ?? [])
                .filter((s) => s.exam_date)
                .sort((a, b) => a.exam_date!.localeCompare(b.exam_date!))[0];
              return upcoming?.exam_date ?? "Set exam dates on subjects";
            })()}
          </p>
        </div>
      </div>

      {(subjects ?? []).length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No subjects yet"
          description="Add the subjects you're studying this term to build your syllabus hub."
          action={<CreateSubjectModal />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(subjects ?? []).map((s) => {
            const prog = progressBySubject.get(s.id);
            const spct = prog?.total ? (prog.completed / prog.total) * 100 : 0;
            return (
              <article
                key={s.id}
                className="flex flex-col gap-4 rounded-xl border border-surface-variant bg-surface-container-lowest p-5 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
                      {s.code ?? "Module Registry"}
                    </p>
                    <h2 className="mt-0.5 truncate font-display text-headline-md font-medium tracking-tight text-on-surface">
                      {s.name}
                    </h2>
                    {s.description ? (
                      <p className="mt-1 line-clamp-2 font-body text-body-sm text-on-surface-variant">
                        {s.description}
                      </p>
                    ) : null}
                  </div>
                  <span className="shrink-0 rounded-full bg-surface-container px-2.5 py-1 font-display text-code-sm text-on-surface">
                    Sem {s.semester ?? "—"}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
                      Syllabus Progress
                    </p>
                    <span className="font-display text-code-sm text-on-surface">
                      {Math.round(spct)}%
                    </span>
                  </div>
                  <ProgressBar value={spct} className="mt-2" />
                  <p className="mt-1.5 font-body text-body-sm text-on-surface-variant">
                    {prog?.total
                      ? `${prog.completed}/${prog.total} units · ${totalUnits ? "" : ""}`
                      : "No syllabus topics yet"}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-surface-variant pt-4">
                  <span className="font-display text-code-sm text-on-surface-variant">
                    {s.exam_date ? `Exam ${s.exam_date}` : "Open to syllabus"}
                  </span>
                  <Link
                    href={`/subjects/${s.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-on-surface px-3.5 py-2 font-label-md font-medium text-surface transition-colors hover:bg-primary-container hover:text-on-primary-container"
                  >
                    Open Subject
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}