import { Brand } from "./brand";
import { CommandTrigger } from "./command-trigger";

export function MobileTopbar() {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:hidden">
      <Brand />
      <CommandTrigger className="w-40 max-w-none" />
    </header>
  );
}