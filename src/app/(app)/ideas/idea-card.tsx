"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, Loader2, X } from "lucide-react";

import { createClient, getCurrentUserId } from "@/lib/supabase/client";

const STATUS_META = {
  idea: { label: "Idea", className: "bg-surface-container text-on-surface-variant" },
  in_progress: { label: "In Progress", className: "bg-tertiary-container text-on-tertiary-container" },
  built: { label: "Built", className: "bg-primary-container text-on-primary-container" },
  archived: { label: "Archived", className: "bg-surface-container-high text-on-surface" },
} as const;

export type IdeaStatus = keyof typeof STATUS_META;

export function IdeaStatusSelect({ ideaId, status }: { ideaId: string; status: IdeaStatus }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const current = STATUS_META[status];

  async function update(next: IdeaStatus) {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase.from("ideas").update({ status: next }).eq("id", ideaId);
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
          aria-label="Idea status"
          value={status}
          disabled={loading}
          onChange={(e) => update(e.target.value as IdeaStatus)}
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

export function AddIdeaModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Idea title is required.");
      return;
    }
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const userId = await getCurrentUserId();
    if (!userId) {
      setError("You must be signed in to save an idea.");
      setLoading(false);
      return;
    }
    const { error: insertError } = await supabase.from("ideas").insert({
      user_id: userId,
      title: form.title.trim(),
      content: form.content.trim() || null,
      status: "idea",
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setOpen(false);
    setForm({ title: "", content: "" });
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
        <Lightbulb className="size-4" />
        New Idea
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse-surface/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl border border-surface-variant bg-surface-container-lowest shadow-popover max-h-[calc(100dvh-2rem)] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-variant px-6 py-4">
              <h2 className="font-display text-headline-md font-medium tracking-tight text-on-surface">
                Capture an Idea
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
                  Idea <span className="text-error">*</span>
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., OCR the last year's circuit diagrams"
                  className={field}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-label-sm text-on-surface">Notes</label>
                <textarea
                  rows={4}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Details, constraints, next steps…"
                  className={`${field} h-auto resize-none py-2`}
                />
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
                  Save Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}