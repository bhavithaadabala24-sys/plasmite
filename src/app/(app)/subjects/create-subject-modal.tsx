"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";

import { FormError } from "@/components/auth/submit-button";
import { createClient, getCurrentUserId } from "@/lib/supabase/client";

export function CreateSubjectModal({ triggerLabel = "Add Subject" }: { triggerLabel?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    semester: "",
    year: "",
    description: "",
    exam_date: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Subject name is required.");
      return;
    }
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const userId = await getCurrentUserId();
    if (!userId) {
      setError("You must be signed in to add a subject.");
      setLoading(false);
      return;
    }
    const { error: insertError } = await supabase.from("subjects").insert({
      user_id: userId,
      name: form.name.trim(),
      code: form.code.trim() || null,
      semester: form.semester ? Number(form.semester) : null,
      year: form.year ? Number(form.year) : null,
      description: form.description.trim() || null,
      exam_date: form.exam_date || null,
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setOpen(false);
    setForm({ name: "", code: "", semester: "", year: "", description: "", exam_date: "" });
    router.refresh();
  }

  const field =
    "h-10 w-full rounded-lg border border-border bg-surface-container-lowest px-3 font-body text-body-md text-on-surface placeholder:text-secondary/60 shadow-sm focus:border-2 focus:border-ring focus:outline-none";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 font-label-md font-medium text-on-primary shadow-md transition-all hover:bg-tertiary active:translate-y-px"
      >
        <Plus className="size-4" />
        {triggerLabel}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse-surface/40 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-2xl border border-surface-variant bg-surface-container-lowest shadow-popover">
            <div className="flex items-center justify-between border-b border-surface-variant px-6 py-4">
              <h2 className="font-display text-headline-md font-medium tracking-tight text-on-surface">
                Add Subject
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
                <label htmlFor="subj-name" className="font-display text-label-sm text-on-surface">
                  Subject name <span className="text-error">*</span>
                </label>
                <input
                  id="subj-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Data Structures & Algorithms"
                  className={field}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subj-code" className="font-display text-label-sm text-on-surface">
                    Code
                  </label>
                  <input
                    id="subj-code"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="CS-301"
                    className={field}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subj-sem" className="font-display text-label-sm text-on-surface">
                    Semester
                  </label>
                  <input
                    id="subj-sem"
                    inputMode="numeric"
                    value={form.semester}
                    onChange={(e) => setForm({ ...form, semester: e.target.value })}
                    placeholder="3"
                    className={field}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subj-year" className="font-display text-label-sm text-on-surface">
                    Year
                  </label>
                  <input
                    id="subj-year"
                    inputMode="numeric"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="2"
                    className={field}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subj-date" className="font-display text-label-sm text-on-surface">
                    Exam date
                  </label>
                  <input
                    id="subj-date"
                    type="date"
                    value={form.exam_date}
                    onChange={(e) => setForm({ ...form, exam_date: e.target.value })}
                    className={field}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="subj-desc" className="font-display text-label-sm text-on-surface">
                  Description
                </label>
                <textarea
                  id="subj-desc"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Syllabus overview, reference texts, instructor…"
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
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}