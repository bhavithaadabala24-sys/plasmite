import { Brand } from "./brand";
import { CommandTrigger } from "./command-trigger";

export function MobileTopbar() {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
      <Brand className="shrink-0" />
      <CommandTrigger className="min-w-0 flex-1 max-w-xs" />
    </header>
  );
}