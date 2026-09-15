"use client";

import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ResultRow = { id: string; title: string; sub?: string; href: string };
type ResultGroup = { label: string; href: string; rows: ResultRow[] };

type SearchResult = { q: string; groups: ResultGroup[]; total: number; error?: boolean };

export function SearchClient({ initialTerm = "" }: { initialTerm?: string }) {
  const [term, setTerm] = useState(initialTerm);
  const [result, setResult] = useState<SearchResult | null>(null);
  const requestRef = useRef(0);

  useEffect(() => {
    const q = term.trim();
    if (!q) return;

    const requestId = ++requestRef.current;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (requestId !== requestRef.current) return;
        if (res.ok) {
          const data = await res.json();
          setResult({ q, groups: data.groups ?? [], total: data.total ?? 0 });
        } else {
          setResult({ q, groups: [], total: 0, error: true });
        }
      } catch {
        if (requestId === requestRef.current) {
          setResult({ q, groups: [], total: 0, error: true });
        }
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [term]);

  const q = term.trim();
  const isFresh = result !== null && result.q === q;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 border-b border-border pb-6">
        <div className="min-w-0">
          <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
            Find Anything
          </p>
          <h1 className="mt-1 font-display text-headline-xl font-semibold tracking-tight text-primary">
            Search
          </h1>
          <p className="mt-1.5 max-w-2xl font-body text-body-md text-on-surface-variant">
            Search across your notes, subjects, questions, and revision cards.
          </p>
        </div>
      </header>

      <form className="relative" onSubmit={(e) => e.preventDefault()}>
        <Search className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-secondary" />
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          autoFocus
          placeholder="Search your folio…"
          className="h-12 w-full rounded-xl border border-border bg-surface-container-lowest pl-11 pr-4 font-body text-body-md text-on-surface placeholder:text-secondary/60 shadow-sm focus:border-2 focus:border-ring focus:outline-none"
        />
        {q !== "" && !isFresh ? (
          <Loader2 className="absolute right-3.5 top-1/2 size-5 -translate-y-1/2 animate-spin text-secondary" />
        ) : null}
      </form>

      {q === "" ? (
        <p className="rounded-xl border border-dashed border-surface-variant bg-surface-container-lowest px-6 py-12 text-center font-body text-body-sm text-on-surface-variant">
          Start typing to search your entire notebook.
        </p>
      ) : !isFresh ? (
        <p className="rounded-xl border border-dashed border-surface-variant bg-surface-container-lowest px-6 py-12 text-center font-body text-body-sm text-on-surface-variant">
          Searching…
        </p>
      ) : result.error ? (
        <p className="rounded-xl border border-dashed border-error/60 bg-surface-container-lowest px-6 py-12 text-center font-body text-body-sm text-error">
          Search hit a problem. Please try again.
        </p>
      ) : result.groups.length === 0 ? (
        <p className="rounded-xl border border-dashed border-surface-variant bg-surface-container-lowest px-6 py-12 text-center font-body text-body-sm text-on-surface-variant">
          Nothing found for “{q}”. Try a broader term or check spelling.
        </p>
      ) : (
        <>
          <p className="font-display text-code-sm text-secondary">
            {result.total} result{result.total === 1 ? "" : "s"} for “{q}”
          </p>
          <div className="flex flex-col gap-6">
            {result.groups.map((g) => (
              <section key={g.label}>
                <h2 className="font-display text-headline-sm font-medium tracking-tight text-on-surface">
                  {g.label}
                  <span className="ml-2 font-display text-code-sm text-secondary">
                    {g.rows.length}
                  </span>
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
                          <span className="shrink-0 font-display text-code-sm text-secondary">
                            {r.sub}
                          </span>
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