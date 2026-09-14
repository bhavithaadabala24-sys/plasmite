import { Search } from "lucide-react";

export function CommandTrigger({ className }: { className?: string }) {
  return (
    <div
      role="search"
      aria-label="Search PLASMITE"
      className={
        className ??
        "flex w-full max-w-xs items-center gap-2 rounded-sm border border-border bg-surface-container-lowest px-2.5 py-1.5 shadow-card"
      }
    >
      <Search className="size-3.5 shrink-0 text-secondary" />
      <span className="flex-1 text-left font-display text-label-sm text-secondary">
        Search PLASMITE…
      </span>
      <kbd className="rounded-sm border border-border bg-surface-container px-1.5 py-0.5 font-display text-label-sm text-secondary">
        ⌘K
      </kbd>
    </div>
  );
}