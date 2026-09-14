import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireUser } from "@/lib/db";
import { SetupProfileForm } from "./setup-profile-form";

export default async function SetupPage() {
  const { supabase, user } = await requireUser();

  const [{ data: profile }, { data: subjects }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, branch, year, semester")
      .eq("id", user.id)
      .maybeSingle(),
    supabase.from("subjects").select("id").eq("user_id", user.id).limit(1),
  ]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 py-10">
      <Link
        href="/dashboard"
        className="inline-flex w-fit items-center gap-1.5 font-display text-label-sm text-secondary transition-colors hover:text-on-surface"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>

      <div className="mt-8">
        <p className="font-display text-label-sm uppercase tracking-widest text-primary">
          Step 1 of 2
        </p>
        <h1 className="mt-2 font-body text-headline-xl font-normal tracking-tight text-on-surface">
          Introduce your engineering self.
        </h1>
        <p className="mt-3 font-body text-body-md text-on-surface-variant">
          This fills your profile and powers semester context across the notebook.
        </p>
      </div>

      <SetupProfileForm
        profile={{
          full_name: profile?.full_name ?? "",
          branch: profile?.branch ?? null,
          year: profile?.year ?? null,
          semester: profile?.semester ?? null,
        }}
        alreadySetup={(subjects?.length ?? 0) > 0}
      />
    </div>
  );
}