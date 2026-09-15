"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";

import { createClient, getCurrentUserId } from "@/lib/supabase/client";

export function CreateProjectModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    problem_statement: "",
    technologies: "",
    start_date: "",
    deadline: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const userId = await getCurrentUserId();
    if (!userId) {
      setError("You must be signed in to create a project.");
      setLoading(false);
      return;
    }
    const { error: insertError } = await supabase.from("projects").insert({
      user_id: userId,
      name: form.name.trim(),
      description: form.description.trim() || null,
      problem_statement: form.problem_statement.trim() || null,
      technologies: form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      start_date: form.start_date || null,
      deadline: form.deadline || null,
      status: "planning",
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setOpen(false);
    setForm({
      name: "",
      description: "",
      problem_statement: "",
      technologies: "",
      start_date: "",
      deadline: "",
    });
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
        <Plus className="size-4" />
        New Project
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse-surface/40 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-2xl border border-surface-variant bg-surface-container-lowest shadow-popover max-h-[calc(100dvh-2rem)] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-variant px-6 py-4">
              <h2 className="font-display text-headline-md font-medium tracking-tight text-on-surface">
                New Project
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
                  Project name <span className="text-error">*</span>
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Heart-beat Detection System"
                  className={field}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-label-sm text-on-surface">Problem statement</label>
                <textarea
                  rows={3}
                  value={form.problem_statement}
                  onChange={(e) => setForm({ ...form, problem_statement: e.target.value })}
                  placeholder="What problem does the project solve?"
                  className={`${field} h-auto resize-none py-2`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-label-sm text-on-surface">Technologies</label>
                <input
                  value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                  placeholder="React, Arduino, Python, SQLite…"
                  className={field}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-label-sm text-on-surface">Start date</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className={field}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-label-sm text-on-surface">Deadline</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className={field}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-label-sm text-on-surface">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short project summary"
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
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}