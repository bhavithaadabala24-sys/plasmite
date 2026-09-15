"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bug, ChevronDown, Loader2, X } from "lucide-react";

import { createClient, getCurrentUserId } from "@/lib/supabase/client";

export const STATUS_META = {
  open: { label: "Open", className: "bg-surface-container text-on-surface-variant" },
  investigating: { label: "Investigating", className: "bg-tertiary-container text-on-tertiary-container" },
  fixed: { label: "Fixed", className: "bg-secondary-container text-on-secondary-container" },
  resolved: { label: "Resolved", className: "bg-primary-container text-on-primary-container" },
} as const;

export const SEVERITY_META = {
  low: { label: "Low", className: "bg-surface-container text-on-surface-variant" },
  medium: { label: "Medium", className: "bg-tertiary-container text-on-tertiary-container" },
  high: { label: "High", className: "bg-secondary-container text-on-secondary-container" },
  critical: { label: "Critical", className: "bg-error-container text-on-error-container" },
} as const;

export type BugStatus = keyof typeof STATUS_META;

export function BugStatusSelect({ bugId, status }: { bugId: string; status: BugStatus }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const current = STATUS_META[status];

  async function update(next: BugStatus) {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase.from("bugs").update({ status: next }).eq("id", bugId);
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="relative inline-flex flex-col items-start gap-1">
      <div className="relative inline-flex items-center">
        <select
          aria-label="Bug status"
          value={status}
          disabled={loading}
          onChange={(e) => update(e.target.value as BugStatus)}
          className={`h-8 cursor-pointer appearance-none rounded-full pl-3 pr-8 font-display text-code-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:opacity-60 ${current.className}`}
        >
          {Object.entries(STATUS_META).map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </select>
        {loading ? (
          <Loader2 className="absolute right-2 size-3.5 animate-spin text-on-surface-variant" />
        ) : (
          <span className="pointer-events-none absolute right-2.5 text-on-surface-variant">▾</span>
        )}
      </div>
      {error ? (
        <p role="alert" className="font-body text-code-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function AddBugModal({
  projects = [],
  defaultProjectId = "",
}: {
  projects?: { id: string; name: string }[];
  defaultProjectId?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    severity: "medium",
    symptom: "",
    project_id: defaultProjectId,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Bug title is required.");
      return;
    }
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const userId = await getCurrentUserId();
    if (!userId) {
      setError("You must be signed in to log a bug.");
      setLoading(false);
      return;
    }
    const { error: insertError } = await supabase.from("bugs").insert({
      user_id: userId,
      title: form.title.trim(),
      severity: form.severity,
      status: "open",
      symptom: form.symptom.trim() || null,
      project_id: form.project_id || null,
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setOpen(false);
    setForm({ title: "", severity: "medium", symptom: "", project_id: defaultProjectId });
    router.refresh();
  }

  const field =
    "h-10 w-full rounded-lg border border-border bg-surface-container-lowest px-3 font-body text-body-md text-on-surface placeholder:text-secondary/60 shadow-sm focus:border-2 focus:border-ring focus:outline-none";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 font-display font-medium text-primary-foreground shadow-md transition-all hover:bg-tertiary active:translate-y-px"
      >
        <Bug className="size-4" />
        Log a Bug
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse-surface/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl border border-surface-variant bg-surface-container-lowest shadow-popover max-h-[calc(100dvh-2rem)] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-variant px-6 py-4">
              <h2 className="font-display text-headline-md font-medium tracking-tight text-on-surface">
                Log a Bug
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-secondary transition-colors hover:text-on-surface"
              >
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-label-sm text-on-surface">
                  Summary <span className="text-error">*</span>
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., NaN appears in AVL height after delete"
                  className={field}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-label-sm text-on-surface">Symptom</label>
                <textarea
                  rows={3}
                  value={form.symptom}
                  onChange={(e) => setForm({ ...form, symptom: e.target.value })}
                  placeholder="What did you observe?"
                  className={`${field} h-auto resize-none py-2`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-label-sm text-on-surface">Severity</label>
                  <select
                    value={form.severity}
                    onChange={(e) => setForm({ ...form, severity: e.target.value })}
                    className={`${field} cursor-pointer`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-label-sm text-on-surface">Project</label>
                  <select
                    value={form.project_id}
                    onChange={(e) => setForm({ ...form, project_id: e.target.value })}
                    className={`${field} cursor-pointer`}
                  >
                    <option value="">No project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {error ? <p className="font-body text-body-sm text-error">{error}</p> : null}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-surface-variant bg-surface-container-lowest px-4 font-display text-on-surface transition-colors hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 font-display font-medium text-primary-foreground transition-all hover:bg-tertiary disabled:opacity-70"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                  Log Bug
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function BugDiagnosis({ bug }: { bug: { root_cause: string | null; remedy: string | null } }) {
  const [open, setOpen] = useState(false);
  const hasData = bug.root_cause || bug.remedy;
  if (!hasData) return null;
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 font-display text-code-sm text-secondary transition-colors hover:text-on-surface"
      >
        Diagnosis
        <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="mt-2 space-y-2 rounded-lg bg-surface-container p-3.5">
          {bug.root_cause ? (
            <p className="font-body text-body-sm text-on-surface">
              <span className="font-display text-code-sm uppercase tracking-wider text-secondary">
                Root cause ·{" "}
              </span>
              {bug.root_cause}
            </p>
          ) : null}
          {bug.remedy ? (
            <p className="font-body text-body-sm text-on-surface">
              <span className="font-display text-code-sm uppercase tracking-wider text-secondary">
                Remedy ·{" "}
              </span>
              {bug.remedy}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}