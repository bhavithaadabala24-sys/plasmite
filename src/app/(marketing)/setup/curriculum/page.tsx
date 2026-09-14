import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireUser } from "@/lib/db";
import { SetupCurriculumForm } from "./setup-curriculum-form";

export default async function SetupCurriculumPage() {
  const { supabase, user } = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 py-10">
      <Link
        href="/setup"
        className="inline-flex w-fit items-center gap-1.5 font-display text-label-sm text-secondary transition-colors hover:text-on-surface"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      <div className="mt-8">
        <p className="font-display text-label-sm uppercase tracking-widest text-primary">
          Step 2 of 2
        </p>
        <h1 className="mt-2 font-body text-headline-xl font-normal tracking-tight text-on-surface">
          Add your first subjects.
        </h1>
        <p className="mt-3 font-body text-body-md text-on-surface-variant">
          {profile?.full_name
            ? `Nice to meet you, ${profile.full_name.split(" ")[0]}.`
            : "Nice to meet you."}{" "}
          Drop in a few subjects to get your syllabus started.
        </p>
      </div>

      <SetupCurriculumForm />
    </div>
  );
}