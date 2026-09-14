import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-xl border border-surface-variant bg-surface-container-lowest px-6 py-14 text-center shadow-card",
        className,
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-full bg-surface-container text-primary">
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-headline-md font-medium tracking-tight text-on-surface">
          {title}
        </h3>
        <p className="mx-auto max-w-sm font-body text-body-md text-on-surface-variant">
          {description}
        </p>
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}