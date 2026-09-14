import Link from "next/link";

import { Brand } from "@/components/layout/brand";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4 sm:px-8">
        <Link href="/" aria-label="PLASMITE home">
          <Brand />
        </Link>

        <div className="flex items-center gap-4 sm:gap-5">
          <Link
            href="/sign-in"
            className="font-display text-label-md text-secondary transition-colors hover:text-on-surface"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-on-surface px-4 font-display text-label-md font-medium text-surface shadow-sm transition-colors hover:bg-primary-container hover:text-on-primary-container"
          >
            Start Writing
          </Link>
        </div>
      </div>
    </header>
  );
}