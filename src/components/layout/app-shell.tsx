import { CommandTrigger } from "./command-trigger";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { MobileTopbar } from "./mobile-topbar";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh overflow-x-clip bg-background text-foreground md:flex">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar />

        <div className="hidden h-14 shrink-0 items-center justify-between border-b border-border px-6 md:flex">
          <p className="font-display text-label-sm uppercase tracking-wider text-secondary/60">
            Folio Journal
          </p>
          <CommandTrigger />
        </div>

        <main className="flex-1 px-4 pb-28 pt-6 sm:px-6 md:px-8 md:pb-8 md:pt-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}