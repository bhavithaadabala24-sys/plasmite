"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Layers, RotateCcw, X } from "lucide-react";

import { createClient, getCurrentUserId } from "@/lib/supabase/client";

const STATUS_META = {
  to_revise: { label: "To Revise", className: "bg-surface-container text-on-surface-variant" },
  revising: { label: "Revising", className: "bg-tertiary-container text-on-tertiary-container" },
  revised: { label: "Revised", className: "bg-secondary-container text-on-secondary-container" },
  mastered: { label: "Mastered", className: "bg-primary-container text-on-primary-container" },
} as const;

export type RevisionStatus = keyof typeof STATUS_META;

export function RevisionStatusSelect({
  itemId,
  status,
}: {
  itemId: string;
  status: RevisionStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const current = STATUS_META[status];

  async function update(next: RevisionStatus) {
    setLoading(true);
    const supabase = createClient();
    const patch: Record<string, unknown> = { status: next };
    if (next === "mastered" || next === "revised") patch.revised_at = new Date().toISOString();
    await supabase.from("revision_items").update(patch).eq("id", itemId);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="relative inline-flex items-center">
      <select
        aria-label="Revision status"
        value={status}
        disabled={loading}
        onChange={(e) => update(e.target.value as RevisionStatus)}
        className={`h-8 cursor-pointer appearance-none rounded-full pl-3 pr-8 font-display text-code-sm font-medium transition-colors disabled:opacity-60 ${current.className}`}
      >
        {Object.entries(STATUS_META).map(([value, meta]) => (
          <option key={value} value={value}>
            {meta.label}
          </option>
        ))}
      </select>
      {loading ? (
        <RotateCcw className="absolute right-2 size-3.5 animate-spin text-on-surface-variant" />
      ) : (
        <span className="pointer-events-none absolute right-2.5 text-on-surface-variant">▾</span>
      )}
    </div>
  );
}

export function AddRevisionCardModal({
  subjects = [],
}: {
  subjects: { id: string; name: string; topics: { id: string; name: string }[] }[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    subject_id: "",
    topic_id: "",
    difficulty: "medium",
  });

  const selectedSubject = subjects.find((s) => s.id === form.subject_id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Card title is required.");
      return;
    }
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const userId = await getCurrentUserId();
    if (!userId) {
      setError("You must be signed in to add a revision card.");
      setLoading(false);
      return;
    }
    const { error: insertError } = await supabase.from("revision_items").insert({
      user_id: userId,
      title: form.title.trim(),
      content: form.content.trim() || null,
      subject_id: form.subject_id || null,
      topic_id: form.topic_id || null,
      difficulty: form.difficulty,
      status: "to_revise",
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setOpen(false);
    setForm({ title: "", content: "", subject_id: "", topic_id: "", difficulty: "medium" });
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
        <Layers className="size-4" />
        New Revision Card
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse-surface/40 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-2xl border border-surface-variant bg-surface-container-lowest shadow-popover">
            <div className="flex items-center justify-between border-b border-surface-variant px-6 py-4">
              <h2 className="font-display text-headline-md font-medium tracking-tight text-on-surface">
                New Revision Card
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
                  Card title <span className="text-error">*</span>
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Dijkstra's algorithm — proof outline"
                  className={field}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-label-sm text-on-surface">Card content</label>
                <textarea
                  rows={4}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Key facts, proofs snippets, marks-relevant points…"
                  className={`${field} h-auto resize-none py-2`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-label-sm text-on-surface">Subject</label>
                  <select
                    value={form.subject_id}
                    onChange={(e) => setForm({ ...form, subject_id: e.target.value, topic_id: "" })}
                    className={`${field} cursor-pointer`}
                  >
                    <option value="">General</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-label-sm text-on-surface">Topic</label>
                  <select
                    value={form.topic_id}
                    disabled={!selectedSubject}
                    onChange={(e) => setForm({ ...form, topic_id: e.target.value })}
                    className={`${field} cursor-pointer disabled:opacity-50`}
                  >
                    <option value="">No topic</option>
                    {(selectedSubject?.topics ?? []).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-label-sm text-on-surface">Difficulty</label>
                <div className="flex gap-2">
                  {["easy", "medium", "hard"].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setForm({ ...form, difficulty: d })}
                      className={`h-9 flex-1 rounded-lg border font-label-md capitalize transition-colors ${
                        form.difficulty === d
                          ? "border-primary bg-primary text-on-primary"
                          : "border-border bg-surface-container-lowest text-on-surface hover:bg-surface"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              {error ? <p className="font-body text-body-sm text-error">{error}</p> : null}
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
                  {loading ? <RotateCcw className="size-4 animate-spin" /> : null}
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}