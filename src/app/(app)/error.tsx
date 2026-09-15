"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[40dvh] flex-col items-center justify-center gap-4 text-center">
      <AlertTriangle className="size-6 text-error" />
      <p className="font-display text-headline-sm font-medium text-on-surface">
        Something went wrong
      </p>
      <p className="max-w-md font-body text-body-sm text-on-surface-variant">
        This page hit an error while loading. Try again — if it keeps happening, refresh the page
        or come back in a few minutes.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-1 inline-flex h-10 items-center justify-center rounded-lg bg-on-surface px-5 font-display text-label-md font-medium text-surface transition-colors hover:bg-primary-container hover:text-on-primary-container"
      >
        Try again
      </button>
    </div>
  );
}