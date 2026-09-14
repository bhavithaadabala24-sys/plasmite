import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 font-display text-headline-xl font-semibold tracking-tight text-primary">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl font-body text-body-md text-on-surface-variant">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}