"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";

import { createClient, getCurrentUserId } from "@/lib/supabase/client";

export function AddExperimentModal({ labId, nextNumber }: { labId: string; nextNumber: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ experiment_number: String(nextNumber), title: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Experiment title is required.");
      return;
    }
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const userId = await getCurrentUserId();
    if (!userId) {
      setError("You must be signed in to add an experiment.");
      setLoading(false);
      return;
    }
    const { error: insertError } = await supabase.from("lab_experiments").insert({
      user_id: userId,
      lab_id: labId,
      experiment_number: form.experiment_number ? Number(form.experiment_number) : null,
      title: form.title.trim(),
      status: "not_started",
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setOpen(false);
    router.refresh();
  }

  const field =
    "h-10 w-full rounded-lg border border-border bg-surface-container-lowest px-3 font-body text-body-md text-on-surface placeholder:text-secondary/60 shadow-sm focus:border-2 focus:border-ring focus:outline-none";

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 font-display font-medium text-primary-foreground shadow-md transition-all hover:bg-tertiary active:translate-y-px"
      >
        <Plus className="size-4" />
        Add Experiment
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse-surface/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl border border-surface-variant bg-surface-container-lowest shadow-popover max-h-[calc(100dvh-2rem)] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-surface-variant px-6 py-4">
          <h2 className="font-display text-headline-md font-medium tracking-tight text-on-surface">
            Add Experiment
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
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-display text-label-sm text-on-surface">No.</label>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.experiment_number}
                onChange={(e) => setForm({ ...form, experiment_number: e.target.value.replace(/\D/g, "") })}
                className={field}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="font-display text-label-sm text-on-surface">
                Title <span className="text-error">*</span>
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., RIP / Distance Vector Routing"
                className={field}
              />
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
              Save Experiment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}