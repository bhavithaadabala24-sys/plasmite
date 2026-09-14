"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-display text-label-sm text-on-surface">
        {label}
        {hint ? <span className="ml-1 font-body text-code-sm text-secondary">{hint}</span> : null}
      </label>
      {children}
    </div>
  );
}

export const inputField =
  "h-10 w-full rounded-lg border border-border bg-surface-container-lowest px-3 font-body text-body-md text-on-surface placeholder:text-secondary/60 shadow-sm focus:border-2 focus:border-ring focus:outline-none";

export function ModalShell({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse-surface/40 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-2xl border border-surface-variant bg-surface-container-lowest shadow-popover">
        <div className="flex items-center justify-between border-b border-surface-variant px-6 py-4">
          <h2 className="font-display text-headline-md font-medium tracking-tight text-on-surface">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-secondary transition-colors hover:text-on-surface"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function SubmitButtons({
  onCancel,
  loading,
  submitLabel = "Save",
}: {
  onCancel: () => void;
  loading: boolean;
  submitLabel?: string;
}) {
  return (
    <div className="flex justify-end gap-2 pt-1">
      <button
        type="button"
        onClick={onCancel}
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
        {submitLabel}
      </button>
    </div>
  );
}

export function CreateLabModal({ subjects = [] }: { subjects: { id: string; name: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", subject_id: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Lab name is required.");
      return;
    }
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("labs").insert({
      title: form.title.trim(),
      description: form.description.trim() || null,
      subject_id: form.subject_id || null,
      status: "not_started",
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setOpen(false);
    setForm({ title: "", description: "", subject_id: "" });
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 font-label-md font-medium text-on-primary shadow-md transition-all hover:bg-tertiary active:translate-y-px"
      >
        <Plus className="size-4" />
        New Lab
      </button>

      <ModalShell open={open} onClose={() => setOpen(false)} title="Add Lab">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
          <Field label="Lab name" hint="*">
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Computer Networks Lab"
              className={inputField}
            />
          </Field>
          <Field label="Subject">
            <select
              value={form.subject_id}
              onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
              className={`${inputField} cursor-pointer`}
            >
              <option value="">No subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Description">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Manual reference, lab rules, instructor…"
              className={`${inputField} h-auto resize-none py-2`}
            />
          </Field>
          {error ? <p className="font-body text-body-sm text-error">{error}</p> : null}
          <SubmitButtons onCancel={() => setOpen(false)} loading={loading} submitLabel="Save Lab" />
        </form>
      </ModalShell>
    </>
  );
}