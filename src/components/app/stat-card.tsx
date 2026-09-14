import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  detail?: string;
  iconClassName?: string;
};

export function StatCard({ icon: Icon, label, value, detail }: StatCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-surface-variant bg-surface-container-lowest p-4 shadow-card">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary">
        <Icon className="size-[18px]" strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
          {label}
        </p>
        <p className="mt-0.5 font-display text-headline-md font-medium tracking-tight text-on-surface">
          {value}
        </p>
        {detail ? (
          <p className="mt-0.5 truncate font-body text-body-sm text-on-surface-variant">
            {detail}
          </p>
        ) : null}
      </div>
    </div>
  );
}