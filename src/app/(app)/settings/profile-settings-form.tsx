"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, KeyRound, Loader2 } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { createClient } from "@/lib/supabase/client";

const FIELD =
  "h-10 w-full rounded-lg border border-border bg-surface-container-lowest px-3 font-body text-body-md text-on-surface placeholder:text-secondary/60 shadow-sm focus:border-2 focus:border-ring focus:outline-none";

export function ProfileSettingsForm({
  profile,
  email,
}: {
  profile: { full_name: string; branch: string | null; year: number | null; semester: number | null };
  email?: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [form, setForm] = useState({
    full_name: profile.full_name ?? "",
    branch: profile.branch ?? "",
    year: profile.year ? String(profile.year) : "",
    semester: profile.semester ? String(profile.semester) : "",
  });

  useEffect(() => {
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      setError("You must be signed in to update your profile.");
      return;
    }
    const year = form.year ? Math.min(8, Math.max(1, Number(form.year))) : null;
    const semester = form.semester ? Math.min(16, Math.max(1, Number(form.semester))) : null;
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name.trim(),
        branch: form.branch.trim() || null,
        year,
        semester,
      })
      .eq("id", user.id);
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        onSubmit={save}
        className="rounded-xl border border-surface-variant bg-surface-container-lowest p-6 shadow-card"
      >
        <h2 className="font-display text-headline-sm font-medium tracking-tight text-on-surface">
          Profile
        </h2>
        <p className="mt-1 font-body text-body-sm text-on-surface-variant">
          Shown on your profile and used for semester context.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-display text-label-sm text-on-surface">Full name</label>
            <input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className={FIELD}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-display text-label-sm text-on-surface">Branch</label>
            <input
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
              placeholder="e.g., Computer Engineering"
              className={FIELD}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-display text-label-sm text-on-surface">Year</label>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value.replace(/\D/g, "") })}
                placeholder="2"
                className={FIELD}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-display text-label-sm text-on-surface">Semester</label>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value.replace(/\D/g, "") })}
                placeholder="3"
                className={FIELD}
              />
            </div>
          </div>
          {error ? (
            <p className="rounded-lg bg-error-container px-3 py-2 font-body text-body-sm text-on-error-container">
              {error}
            </p>
          ) : null}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 font-display font-medium text-primary-foreground transition-all hover:bg-tertiary disabled:opacity-70"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              {saved ? "Saved" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>

      <div className="flex flex-col gap-6">
        <section className="rounded-xl border border-surface-variant bg-surface-container-lowest p-6 shadow-card">
          <h2 className="font-display text-headline-sm font-medium tracking-tight text-on-surface">
            Account
          </h2>
          <p className="mt-2 font-body text-body-sm text-on-surface-variant">
            Signed in as <span className="text-on-surface">{email ?? "—"}</span>
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href="/auth/update-password"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-surface-container-lowest px-4 font-display text-on-surface transition-colors hover:bg-surface"
            >
              <KeyRound className="size-4" />
              Update Password
            </a>
            <SignOutButton />
          </div>
        </section>
      </div>
    </div>
  );
}