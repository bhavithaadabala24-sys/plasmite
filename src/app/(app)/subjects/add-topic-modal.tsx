"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";

import { FormError } from "@/components/auth/submit-button";
import { createClient, getCurrentUserId } from "@/lib/supabase/client";

export function AddTopicModal({ subjectId }: { subjectId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ unit_number: "", name: "", description: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Topic name is required.");
      return;
    }
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const userId = await getCurrentUserId();
    if (!userId) {
      setError("You must be signed in to add a topic.");
      setLoading(false);
      return;
    }
    const { error: insertError } = await supabase.from("topics").insert({
      user_id: userId,
      subject_id: subjectId,
      unit_number: form.unit_number ? Number(form.unit_number) : null,
      name: form.name.trim(),
      description: form.description.trim() || null,
      status: "not_started",
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setOpen(false);
    setForm({ unit_number: "", name: "", description: "" });
    router.refresh();
  }

  const field =
    "h-10 w-full rounded-lg border border-border bg-surface-container-lowest px-3 font-body text-body-md text-on-surface placeholder:text-secondary/60 shadow-sm focus:border-2 focus:border-ring focus:outline-none";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 font-label-md font-medium text-on-primary transition-all hover:bg-tertiary active:translate-y-px"
      >
        <Plus className="size-4" />
        Add Syllabus Topic
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse-surface/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl border border-surface-variant bg-surface-container-lowest shadow-popover">
            <div className="flex items-center justify-between border-b border-surface-variant px-6 py-4">
              <h2 className="font-display text-headline-md font-medium tracking-tight text-on-surface">
                Add Syllabus Topic
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
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="topic-unit" className="font-display text-label-sm text-on-surface">
                    Unit
                  </label>
                  <input
                    id="topic-unit"
                    inputMode="numeric"
                    value={form.unit_number}
                    onChange={(e) => setForm({ ...form, unit_number: e.target.value })}
                    placeholder="1"
                    className={field}
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label htmlFor="topic-name" className="font-display text-label-sm text-on-surface">
                    Topic name <span className="text-error">*</span>
                  </label>
                  <input
                    id="topic-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Recursion & Backtracking"
                    className={field}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="topic-desc" className="font-display text-label-sm text-on-surface">
                  Description
                </label>
                <textarea
                  id="topic-desc"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Key concepts, reference sections, practical notes…"
                  className={`${field} h-auto resize-none py-2`}
                />
              </div>

              <FormError message={error} />

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-surface-variant bg-surface-container-lowest px-4 font-label-md text-on-surface transition-colors hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 font-label-md font-medium text-on-primary transition-all hover:bg-tertiary disabled:opacity-70"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                  Save Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}