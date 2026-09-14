"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const FIELD =
  "h-12 w-full rounded-xl border border-border bg-surface-container-lowest px-4 font-body text-body-lg text-on-surface placeholder:text-secondary/60 shadow-sm focus:border-2 focus:border-ring focus:outline-none";

export function SetupProfileForm({
  profile,
  alreadySetup,
}: {
  profile: { full_name: string; branch: string | null; year: number | null; semester: number | null };
  alreadySetup: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: profile.full_name ?? "",
    branch: profile.branch ?? "",
    year: profile.year ? String(profile.year) : "",
    semester: profile.semester ? String(profile.semester) : "",
  });

  async function save(e: React.FormEvent, next: string) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      setError("Session expired — please sign in again.");
      setLoading(false);
      return;
    }
    const { error: updateError } = await supabase.from("profiles").update({
      full_name: form.full_name.trim() || "Engineer",
      branch: form.branch.trim() || null,
      year: form.year ? Number(form.year) : null,
      semester: form.semester ? Number(form.semester) : null,
    }).eq("id", userId);
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={(e) => save(e, "/setup/curriculum")} className="mt-8 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="setup-name" className="font-display text-label-md text-on-surface">
          Full name
        </label>
        <input
          id="setup-name"
          required
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          placeholder="Ada Lovelace"
          className={FIELD}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="setup-branch" className="font-display text-label-md text-on-surface">
          Branch
        </label>
        <input
          id="setup-branch"
          value={form.branch}
          onChange={(e) => setForm({ ...form, branch: e.target.value })}
          placeholder="e.g., Computer Engineering"
          className={FIELD}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="setup-year" className="font-display text-label-md text-on-surface">
            Year
          </label>
          <input
            id="setup-year"
            inputMode="numeric"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            placeholder="2"
            className={FIELD}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="setup-sem" className="font-display text-label-md text-on-surface">
            Semester
          </label>
          <input
            id="setup-sem"
            inputMode="numeric"
            value={form.semester}
            onChange={(e) => setForm({ ...form, semester: e.target.value })}
            placeholder="3"
            className={FIELD}
          />
        </div>
      </div>
      {error ? <p className="font-body text-body-sm text-error">{error}</p> : null}
      <div className="mt-2 flex flex-col items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full max-w-72 items-center justify-center gap-2 rounded-xl bg-on-surface font-display text-label-md font-medium text-surface shadow-sm transition-colors hover:bg-primary-container hover:text-on-primary-container disabled:opacity-70"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Continue to Syllabus
          <ArrowRight className="size-4" />
        </button>
        {alreadySetup ? (
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="font-display text-code-sm text-secondary transition-colors hover:text-on-surface"
          >
            Skip — take me to my dashboard
          </button>
        ) : null}
      </div>
    </form>
  );
}