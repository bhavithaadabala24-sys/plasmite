import Link from "next/link";

import { Brand } from "@/components/layout/brand";

export function PublicFooter() {
  return (
    <footer className="border-t border-surface-variant py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2.5">
          <Brand className="scale-75" />
          <span className="font-display text-label-sm text-secondary">
            Your engineering knowledge, organized.
          </span>
        </div>
        <div className="flex items-center gap-5 font-display text-label-sm text-secondary">
          <Link href="/sign-in" className="transition-colors hover:text-on-surface">
            Sign In
          </Link>
          <Link href="/sign-up" className="transition-colors hover:text-on-surface">
            Sign Up
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-on-surface">
            Folio
          </Link>
        </div>
      </div>
    </footer>
  );
}