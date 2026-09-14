"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navGroups } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Brand } from "./brand";

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" || pathname === "" : pathname.startsWith(href);

  return (
    <aside className="hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-background md:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
        <Brand />
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Primary">
        {navGroups.map((group) => {
          if (group.items.length === 1 && group.key !== "account") {
            const single = group.items[0];
            const SingleIcon = single.icon;

            return (
              <Link
                key={group.key}
                href={single.href}
                aria-current={isActive(single.href) ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-sm px-2.5 py-1.5 font-display text-label-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  isActive(single.href)
                    ? "bg-surface-container font-medium text-on-surface"
                    : "text-on-surface-variant hover:bg-surface-container/70 hover:text-on-surface",
                )}
              >
                <SingleIcon className="size-4 shrink-0" />
                {single.title}
              </Link>
            );
          }

          return (
            <div key={group.key}>
              <p className="mb-1.5 px-2 font-display text-label-sm uppercase tracking-wider text-secondary/70">
                {group.label}
              </p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-sm px-2.5 py-1.5 font-display text-label-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                        isActive(item.href)
                          ? "bg-surface-container font-medium text-on-surface"
                          : "text-on-surface-variant hover:bg-surface-container/70 hover:text-on-surface",
                      )}
                    >
                      {isActive(item.href) && (
                        <span className="absolute left-0 top-1/2 h-3.5 w-[2px] -translate-y-1/2 rounded-full bg-primary" />
                      )}
                      <item.icon className="size-4 shrink-0" />
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-border px-5 py-3">
        <p className="font-display text-label-sm uppercase tracking-wider text-secondary/50">
          Folio · v0.1.0
        </p>
      </div>
    </aside>
  );
}