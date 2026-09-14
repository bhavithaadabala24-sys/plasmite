"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Field, inputField, ModalShell, SubmitButtons } from "@/app/(app)/labs/create-lab-modal";

export function AddQuestionModal({ subjects = [] }: { subjects: { id: string; name: string; topics: { id: string; name: string }[] }[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    subject_id: "",
    topic_id: "",
    difficulty: "medium",
  });

  const selectedSubject = subjects.find((s) => s.id === form.subject_id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.question.trim()) {
      setError("Question text is required.");
      return;
    }
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("questions").insert({
      question: form.question.trim(),
      answer: form.answer.trim() || null,
      subject_id: form.subject_id || null,
      topic_id: form.topic_id || null,
      difficulty: form.difficulty,
      status: "unanswered",
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setOpen(false);
    setForm({ question: "", answer: "", subject_id: "", topic_id: "", difficulty: "medium" });
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
        Add Question
      </button>

      <ModalShell open={open} onClose={() => setOpen(false)} title="Capture a Question">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
          <Field label="Question" hint="*">
            <textarea
              required
              rows={3}
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="e.g., Prove that Dijkstra's algorithm is O(V·log V + E·log V)."
              className={`${inputField} h-auto resize-none py-2`}
            />
          </Field>
          <Field label="Reference answer">
            <textarea
              rows={4}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              placeholder="Full solution, marks breakdown, or reference index…"
              className={`${inputField} h-auto resize-none py-2`}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Subject">
              <select
                value={form.subject_id}
                onChange={(e) => setForm({ ...form, subject_id: e.target.value, topic_id: "" })}
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
            <Field label="Topic">
              <select
                value={form.topic_id}
                disabled={!selectedSubject}
                onChange={(e) => setForm({ ...form, topic_id: e.target.value })}
                className={`${inputField} cursor-pointer disabled:opacity-50`}
              >
                <option value="">No topic</option>
                {(selectedSubject?.topics ?? []).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Difficulty">
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
          </Field>
          {error ? <p className="font-body text-body-sm text-error">{error}</p> : null}
          <SubmitButtons
            onCancel={() => setOpen(false)}
            loading={loading}
            submitLabel="Save Question"
          />
        </form>
      </ModalShell>
    </>
  );
}