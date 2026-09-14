import Link from "next/link";
import { Search } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/db";
import { embedValue } from "@/lib/utils";

type ResultGroup = {
  label: string;
  href: string;
  rows: { id: string; title: string; sub?: string; href: string }[];
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { supabase, user } = await requireUser();
  const { q } = await searchParams;
  const term = q?.trim() ?? "";

  const groups: ResultGroup[] = [];
  let total = 0;

  if (term) {
    const like = `%${term}%`;

    const [{ data: notes }, { data: subjects }, { data: topics }, { data: questions }, { data: revisions }] =
      await Promise.all([
        supabase
          .from("notes")
          .select("id, title, updated_at")
          .eq("user_id", user.id)
          .ilike("title", like)
          .limit(8),
        supabase
          .from("subjects")
          .select("id, name, code, semester")
          .eq("user_id", user.id)
          .or(`name.ilike.${like},code.ilike.${like}`)
          .limit(8),
        supabase
          .from("topics")
          .select("id, name, subject:subjects(id, name)")
          .eq("user_id", user.id)
          .ilike("name", like)
          .limit(8),
        supabase
          .from("questions")
          .select("id, question, subject:subjects(name)")
          .eq("user_id", user.id)
          .ilike("question", like)
          .limit(8),
        supabase
          .from("revision_items")
          .select("id, title")
          .eq("user_id", user.id)
          .ilike("title", like)
          .limit(8),
      ]);

    if (notes?.length) {
      groups.push({
        label: "Notes",
        href: `/notes?q=${encodeURIComponent(term)}`,
        rows: notes.map((r) => ({
          id: r.id,
          title: r.title || "Untitled note",
          href: `/notes/${r.id}`,
        })),
      });
    }
    if (subjects?.length) {
      groups.push({
        label: "Subjects",
        href: `/subjects`,
        rows: subjects.map((r) => ({
          id: r.id,
          title: r.name,
          sub: r.code ?? undefined,
          href: `/subjects/${r.id}`,
        })),
      });
    }
    if (topics?.length) {
      groups.push({
        label: "Syllabus Topics",
        href: `/subjects`,
        rows: topics.map((r) => ({
          id: r.id,
          title: r.name,
          sub: embedValue(r.subject)?.name ?? undefined,
          href: `/subjects/${embedValue(r.subject)?.id ?? ""}`,
        })),
      });
    }
    if (questions?.length) {
      groups.push({
        label: "Questions",
        href: `/questions`,
        rows: questions.map((r) => ({
          id: r.id,
          title: r.question,
          sub: embedValue(r.subject)?.name ?? undefined,
          href: `/questions`,
        })),
      });
    }
    if (revisions?.length) {
      groups.push({
        label: "Revision Cards",
        href: `/revision`,
        rows: revisions.map((r) => ({ id: r.id, title: r.title, href: `/revision` })),
      });
    }

    total = groups.reduce((acc, g) => acc + g.rows.length, 0);
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Find Anything"
        title="Search"
        description="Search across your notes, subjects, questions, and revision cards."
      />

      <form method="get" action="/search" className="relative">
        <Search className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-secondary" />
        <input
          type="text"
          name="q"
          defaultValue={term}
          placeholder={'Search your folio…'}          autoFocus
          className="h-12 w-full rounded-xl border border-border bg-surface-container-lowest pl-11 pr-4 font-body text-body-md text-on-surface placeholder:text-secondary/60 shadow-sm focus:border-2 focus:border-ring focus:outline-none"
        />
      </form>

      {term === "" ? (
        <p className="rounded-xl border border-dashed border-surface-variant bg-surface-container-lowest px-6 py-12 text-center font-body text-body-sm text-on-surface-variant">
          Start typing to search your entire notebook.
        </p>
      ) : groups.length === 0 ? (
        <p className="rounded-xl border border-dashed border-surface-variant bg-surface-container-lowest px-6 py-12 text-center font-body text-body-sm text-on-surface-variant">
          Nothing found for “{term}”. Try a broader term or check spelling.
        </p>
      ) : (
        <>
          <p className="font-display text-code-sm text-secondary">
            {total} result{total === 1 ? "" : "s"} for “{term}”
          </p>
          <div className="flex flex-col gap-6">
            {groups.map((g) => (
              <section key={g.label}>
                <h2 className="font-display text-headline-sm font-medium tracking-tight text-on-surface">
                  {g.label}
                  <span className="ml-2 font-display text-code-sm text-secondary">{g.rows.length}</span>
                </h2>
                <ul className="mt-3 divide-y divide-surface-variant overflow-hidden rounded-xl border border-surface-variant bg-surface-container-lowest shadow-card">
                  {g.rows.map((r) => (
                    <li key={`${g.label}-${r.id}`}>
                      <Link
                        href={r.href}
                        className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-surface-container"
                      >
                        <span className="min-w-0 truncate font-body text-body-md text-on-surface">
                          {r.title}
                        </span>
                        {r.sub ? (
                          <span className="shrink-0 font-display text-code-sm text-secondary">{r.sub}</span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}