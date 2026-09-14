import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  FolderKanban,
  NotebookText,
  RefreshCw,
} from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/db";

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "E"
  );
}

export default async function ProfilePage() {
  const { supabase, user } = await requireUser();

  const [{ data: profile }, { data: notes }, { data: subjects }, { data: experiments }, { data: projects }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, branch, year, semester, created_at")
        .eq("id", user.id)
        .maybeSingle(),
      supabase.from("notes").select("id").eq("user_id", user.id),
      supabase.from("subjects").select("id").eq("user_id", user.id),
      supabase
        .from("lab_experiments")
        .select("id, status")
        .eq("user_id", user.id),
      supabase.from("projects").select("id").eq("user_id", user.id),
    ]);

  const fullName = profile?.full_name || user.email?.split("@")[0] || "Engineer";
  const experimentsDone =
    experiments?.filter((e) => e.status === "completed").length ?? 0;

  const stats = [
    { icon: BookOpen, label: "Subjects", value: subjects?.length ?? 0, href: "/subjects" },
    { icon: NotebookText, label: "Notes", value: notes?.length ?? 0, href: "/notes" },
    {
      icon: FlaskConical,
      label: "Experiments Done",
      value: `${experimentsDone}/${experiments?.length ?? 0}`,
      href: "/labs",
    },
    { icon: FolderKanban, label: "Projects", value: projects?.length ?? 0, href: "/projects" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Engineering Identity" title="Profile" description="A summary of your folio footprint." />

      <section className="overflow-hidden rounded-2xl border border-surface-variant bg-surface-container-lowest shadow-card">
        <div className="h-24 bg-surface-container" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex size-20 items-center justify-center rounded-full border-4 border-surface-container-lowest bg-primary-container font-display text-headline-lg font-medium text-on-primary-container">
            {initials(fullName)}
          </div>
          <h2 className="mt-4 font-display text-headline-lg font-medium tracking-tight text-on-surface">
            {fullName}
          </h2>
          <p className="font-body text-body-sm text-on-surface-variant">{user.email}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile?.branch ? (
              <span className="rounded-full bg-surface-container px-3 py-1 font-display text-code-sm text-on-surface">
                {profile.branch}
              </span>
            ) : null}
            {profile?.year ? (
              <span className="rounded-full bg-surface-container px-3 py-1 font-display text-code-sm text-on-surface">
                Year {profile.year}
              </span>
            ) : null}
            {profile?.semester ? (
              <span className="rounded-full bg-surface-container px-3 py-1 font-display text-code-sm text-on-surface">
                Semester {profile.semester}
              </span>
            ) : null}
            <Link
              href="/settings"
              className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1 font-display text-code-sm text-on-secondary-container transition-colors hover:bg-surface-container-high"
            >
              Edit
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-xl border border-surface-variant bg-surface-container-lowest p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-popover"
          >
            <s.icon className="size-5 text-primary" strokeWidth={1.75} />
            <p className="mt-3 font-display text-headline-md font-medium text-on-surface">
              {s.value}
            </p>
            <p className="font-display text-label-sm text-secondary">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href="/revision"
          className="flex items-center justify-between rounded-xl border border-surface-variant bg-surface-container-lowest px-5 py-4 shadow-card transition-colors hover:bg-surface-container"
        >
          <span className="flex items-center gap-3 font-body text-body-md text-on-surface">
            <RefreshCw className="size-4 text-primary" />
            Open your revision deck
          </span>
          <ArrowRight className="size-4 text-secondary" />
        </Link>
        <Link
          href="/questions"
          className="flex items-center justify-between rounded-xl border border-surface-variant bg-surface-container-lowest px-5 py-4 shadow-card transition-colors hover:bg-surface-container"
        >
          <span className="flex items-center gap-3 font-body text-body-md text-on-surface">
            <CheckCircle2 className="size-4 text-primary" />
            Jump into your question vault
          </span>
          <ArrowRight className="size-4 text-secondary" />
        </Link>
      </div>
    </div>
  );
}