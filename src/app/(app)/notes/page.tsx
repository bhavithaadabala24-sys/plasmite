import Link from "next/link";
import { NotebookText, Pin, Plus, Search } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/db";
import { embedValue } from "@/lib/utils";

export default async function NotesLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; subject?: string; error?: string }>;
}) {
  const { supabase, user } = await requireUser();
  const { q, subject, error } = await searchParams;

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const validSubject = subject && UUID_RE.test(subject) ? subject : undefined;

  let query = supabase
    .from("notes")
    .select("id, title, is_pinned, is_archived, updated_at, subject:subjects(name)")
    .eq("user_id", user.id)
    .eq("is_archived", false);

  if (validSubject) query = query.eq("subject_id", validSubject);
  if (q) query = query.ilike("title", `%${q.replace(/[\\%_]/g, "\\$&")}%`);

  query = query.order("is_pinned", { ascending: false }).order("updated_at", { ascending: false });

  const { data: notes } = await query;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Folio · Note Index"
        title="Notes"
        description="Your lecture notes, formulas, and proofs."
        actions={
          <Link
            href="/notes/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 font-label-md font-medium text-on-primary shadow-md transition-all hover:bg-tertiary active:translate-y-px"
          >
            <Plus className="size-4" />
            New Note
          </Link>
        }
      />

      {error ? (
        <div className="rounded-xl border border-error-container bg-error-container/40 px-4 py-3 font-body text-body-sm text-on-error-container">
          Could not create that note. {error}
        </div>
      ) : null}

      <form method="get" action="/notes" className="relative">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-secondary" />
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search your notes…"
          className="h-11 w-full rounded-xl border border-border bg-surface-container-lowest pl-10 pr-4 font-body text-body-md text-on-surface placeholder:text-secondary/60 shadow-sm focus:border-2 focus:border-ring focus:outline-none"
        />
        {q ? (
          <Link
            href="/notes"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 font-display text-code-sm text-secondary hover:text-on-surface"
          >
            Clear
          </Link>
        ) : null}
      </form>

      {(notes ?? []).length === 0 ? (
        <EmptyState
          icon={NotebookText}
          title={q ? "No notes match your search" : "Your folio is empty"}
          description={
            q
              ? "Try a different search term or clear the filter."
              : "Notes you write show up here — organized, searchable, ready to revise."
          }
          action={
            <Link
              href="/notes/new"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 font-label-md font-medium text-on-primary"
            >
              <Plus className="size-4" />
              Write your first note
            </Link>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(notes ?? []).map((n) => (
            <Link
              key={n.id}
              href={`/notes/${n.id}`}
              className="group flex flex-col justify-between gap-6 rounded-xl border border-surface-variant bg-surface-container-lowest p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-popover"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-body text-body-md font-medium leading-snug text-on-surface group-hover:text-primary">
                    {n.title || "Untitled note"}
                  </p>
                  {n.is_pinned ? (
                    <Pin className="mt-0.5 size-4 shrink-0 fill-primary text-primary" />
                  ) : null}
                </div>
                <p className="mt-2 font-display text-code-sm text-secondary">
                  {embedValue(n.subject)?.name ?? "General"}
                </p>
              </div>
              <span className="font-display text-code-sm text-on-surface-variant">
                Edited {new Date(n.updated_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}