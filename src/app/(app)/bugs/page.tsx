import { Bug } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/db";
import { AddBugModal, BugDiagnosis, BugStatusSelect, SEVERITY_META } from "./bug-card";

export default async function BugsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; severity?: string }>;
}) {
  const { supabase, user } = await requireUser();
  const { status, severity } = await searchParams;

  let query = supabase
    .from("bugs")
    .select("id, title, severity, status, symptom, root_cause, remedy, project:projects(name)")
    .eq("user_id", user.id);
  if (status) query = query.eq("status", status);
  if (severity) query = query.eq("severity", severity);
  query = query.order("updated_at", { ascending: false });
  const { data: bugs } = await query;

  const [{ data: projects }] = await Promise.all([
    supabase.from("projects").select("id, name").eq("user_id", user.id),
  ]);

  const openCount = bugs?.filter((b) => b.status === "open").length ?? 0;
  const investigatingCount = bugs?.filter((b) => b.status === "investigating").length ?? 0;
  const resolvedCount = bugs?.filter((b) => b.status === "resolved").length ?? 0;

  const filterChip = (key: string, label: string, active: boolean) =>
    key ? (
      <a
        href={active ? "/bugs" : `/bugs?${key}`}
        className={`rounded-full px-3.5 py-1.5 font-display text-code-sm transition-colors ${
          active
            ? "bg-on-surface text-surface"
            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
        }`}
      >
        {label}
      </a>
    ) : null;

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
            { key: "", label: `All · ${bugs?.length ?? 0}`, active: !status && !severity },
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
              {sev} · {bugs?.filter((b) => b.severity === sev).length ?? 0}
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
                    {b.project?.[0]?.name ?? "No project"}
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
                    className={`rounded-full px-2.5 py-1 font-display text-code-sm capitalize ${SEVERITY_META[b.severity].className}`}
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