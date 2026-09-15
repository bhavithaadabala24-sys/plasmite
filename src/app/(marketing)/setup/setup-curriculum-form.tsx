"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Check, Loader2, Plus } from "lucide-react";

import { createClient, getCurrentUserId } from "@/lib/supabase/client";

export function SetupCurriculumForm() {
  const router = useRouter();
  const [added, setAdded] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", code: "" });

  async function addSubject(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const userId = await getCurrentUserId();
    if (!userId) {
      setError("You must be signed in to add subjects.");
      setLoading(false);
      return;
    }
    const { data, error: insertError } = await supabase
      .from("subjects")
      .insert({
        user_id: userId,
        name: form.name.trim(),
        code: form.code.trim() || null,
      })
      .select("id, name")
      .single();
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    if (data) setAdded((a) => [...a, { id: data.id, name: data.name }]);
    setForm({ name: "", code: "" });
  }

  const field =
    "h-12 w-full rounded-xl border border-border bg-surface-container-lowest px-4 font-body text-body-lg text-on-surface placeholder:text-secondary/60 shadow-sm focus:border-2 focus:border-ring focus:outline-none";

  return (
    <div className="mt-8 flex flex-col gap-6">
      <form onSubmit={addSubject} className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g., Operating Systems"
            className={field}
          />
          <input
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            placeholder="CS-304"
            className={field}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={!form.name.trim() || loading}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 font-display text-primary-foreground transition-all hover:bg-tertiary disabled:opacity-50"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Add Subject
          </button>
          {error ? <p className="font-body text-body-sm text-error">{error}</p> : null}
        </div>
      </form>

      {added.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {added.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-xl border border-surface-variant bg-surface-container-lowest px-4 py-3"
            >
              <span className="flex items-center gap-2.5 font-body text-body-md text-on-surface">
                <BookOpen className="size-4 text-primary" />
                {s.name}
              </span>
              <span className="flex items-center gap-1 font-display text-code-sm text-on-surface-variant">
                <Check className="size-3.5 text-primary" />
                Added
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-on-surface font-display text-label-md font-medium text-surface shadow-sm transition-colors hover:bg-primary-container hover:text-on-primary-container"
      >
        Continue to My Notebook
        <ArrowRight className="size-4" />
      </button>
      {added.length === 0 ? (
        <p className="text-center font-display text-code-sm text-secondary">
          You can add subjects later from the Syllabus page.
        </p>
      ) : null}
    </div>
  );
}