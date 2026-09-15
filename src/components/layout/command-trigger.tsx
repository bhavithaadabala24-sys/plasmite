"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

export function CommandTrigger({ className }: { className?: string }) {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        router.push("/search");
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <Link
      href="/search"
      prefetch
      role="search"
      aria-label="Search PLASMITE"
      className={cn(
        "inline-flex w-full max-w-xs items-center gap-2 rounded-sm border border-border bg-surface-container-lowest px-2.5 py-1.5 text-secondary shadow-card transition-colors hover:border-ring hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <Search className="size-3.5 shrink-0" />
      <span className="min-w-0 flex-1 truncate text-left font-display text-label-sm">
        Search PLASMITE…
      </span>
      <kbd className="shrink-0 rounded-sm border border-border bg-surface-container px-1.5 py-0.5 font-display text-label-sm">
        ⌘K
      </kbd>
    </Link>
  );
}