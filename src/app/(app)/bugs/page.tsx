import { Bug } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/db";
import { embedValue } from "@/lib/utils";
import { AddBugModal, BugDiagnosis, BugStatusSelect, SEVERITY_META } from "./bug-card";

export default async function BugsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; severity?: string }>;
}) {
  const { supabase, user } = await requireUser();
  const params = await searchParams;

  const VALID_STATUS = ["open", "investigating", "fixed", "resolved"] as const;
  const VALID_SEVERITY = ["low", "medium", "high", "critical"] as const;
  const status = VALID_STATUS.includes(params.status as (typeof VALID_STATUS)[number])
    ? (params.status as (typeof VALID_STATUS)[number])
    : undefined;
  const severity = VALID_SEVERITY.includes(params.severity as (typeof VALID_SEVERITY)[number])
    ? (params.severity as (typeof VALID_SEVERITY)[number])
    : undefined;

  const { data: allBugs } = await supabase
    .from("bugs")
    .select("id, title, severity, status, symptom, root_cause, remedy, updated_at, project:projects(name)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const bugs =
    status || severity
      ? (allBugs ?? []).filter(
          (b) => (!status || b.status === status) && (!severity || b.severity === severity),
        )
      : allBugs ?? [];

  const [{ data: projects }] = await Promise.all([
    supabase.from("projects").select("id, name").eq("user_id", user.id),
  ]);

  const all = allBugs ?? [];
  const openCount = all.filter((b) => b.status === "open").length;
  const investigatingCount = all.filter((b) => b.status === "investigating").length;
  const resolvedCount = all.filter((b) => b.status === "resolved").length;

  const filterChip = (query: string, label: string, active: boolean) => (
  <a
    href={active ? "/bugs" : query ? `/bugs?${query}` : "/bugs"}
    className={`rounded-full px-3.5 py-1.5 font-display text-code-sm transition-colors ${
      active
        ? "bg-on-surface text-surface"
        : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
    }`}
  >
    {label}
  </a>
);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Debug Ledger · Faq"
        title="Bugs"
        description="Track failures, root causes, and fixes as you build."
        actions={<AddBugModal projects={projects ?? []} />}
      />

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "", label: `All · ${all.length}`, active: !status && !severity },
            { key: "status=open", label: `Open · ${openCount}`, active: status === "open" },
            {
              key: "status=investigating",
              label: `Investigating · ${investigatingCount}`,
              active: status === "investigating",
            },
            {
              key: "status=resolved",
              label: `Resolved · ${resolvedCount}`,
              active: status === "resolved",
            },
          ].map((f, i) => (
            <span key={f.key || `all-${i}`}>
              {filterChip(f.key, f.label, f.active)}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(["low", "medium", "high", "critical"] as const).map((sev) => (
            <a
              key={sev}
              href={severity === sev ? "/bugs" : `/bugs?severity=${sev}`}
              className={`rounded-full px-3 py-1 font-display text-code-sm capitalize transition-colors ${
                severity === sev
                  ? "bg-on-surface text-surface"
                  : `${SEVERITY_META[sev].className} hover:opacity-80`
              }`}
            >
              {sev} · {all.filter((b) => b.severity === sev).length}
            </a>
          ))}
        </div>
      </div>

      {(bugs ?? []).length === 0 ? (
        <EmptyState
          icon={Bug}
          title={status || severity ? "No bugs match this filter" : "No bugs logged"}
          description="The bugs you chase down — and their fixes — become wisdom for the next one."
          action={<AddBugModal projects={projects ?? []} />}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {(bugs ?? []).map((b) => (
            <article
              key={b.id}
              className="rounded-xl border border-surface-variant bg-surface-container-lowest p-4 shadow-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-body text-body-lg font-medium leading-snug text-on-surface">
                    {b.title}
                  </p>
                  <p className="mt-0.5 font-display text-code-sm text-secondary">
                    {embedValue(b.project)?.name ?? "No project"}
                    {b.updated_at
                      ? ` · ${new Date(b.updated_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}`
                      : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 font-display text-code-sm capitalize ${SEVERITY_META[b.severity as keyof typeof SEVERITY_META].className}`}
                  >
                    {b.severity}
                  </span>
                  <BugStatusSelect bugId={b.id} status={b.status} />
                </div>
              </div>
              {b.symptom ? (
                <p className="mt-3 whitespace-pre-wrap border-t border-surface-variant pt-3 font-body text-body-sm text-on-surface-variant">
                  {b.symptom}
                </p>
              ) : null}
              <BugDiagnosis bug={b} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}