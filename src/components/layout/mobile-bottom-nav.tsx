"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid2X2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { mobileNav, navGroups } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" || pathname === "" : pathname.startsWith(href);

  const moreActive = navGroups
    .flatMap((g) => g.items)
    .some((i) => isActive(i.href) && !mobileNav.some((m) => m.href === i.href));

  useEffect(() => {
    if (!moreOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  return (
    <>
      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="grid grid-cols-5">
          {mobileNav.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-w-0 flex-col items-center gap-0.5 px-1 pb-1.5 pt-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                    active ? "text-on-surface" : "text-surface-tint hover:text-on-surface",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 items-center justify-center rounded-full px-3 transition-colors",
                      active ? "bg-surface-container" : "",
                    )}
                  >
                    <item.icon className="size-5 shrink-0" strokeWidth={active ? 2.2 : 1.8} />
                  </span>
                  <span
                    className={cn(
                      "max-w-full truncate text-[0.6875rem] font-display leading-none tracking-wide",
                      active ? "font-medium" : "text-secondary",
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            );
          })}

          <li>
            <button
              type="button"
              aria-label={moreOpen ? "Close more menu" : "Open more menu"}
              aria-haspopup="true"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((v) => !v)}
              className={cn(
                "flex min-w-0 w-full flex-col items-center gap-0.5 px-1 pb-1.5 pt-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                moreActive || moreOpen
                  ? "text-on-surface"
                  : "text-surface-tint hover:text-on-surface",
              )}
            >
              <span
                className={cn(
                  "flex h-7 items-center justify-center rounded-full px-3 transition-colors",
                  moreActive || moreOpen ? "bg-surface-container" : "",
                )}
              >
                <Grid2X2 className="size-5 shrink-0" strokeWidth={moreActive || moreOpen ? 2.2 : 1.8} />
              </span>
              <span
                className={cn(
                  "max-w-full truncate text-[0.6875rem] font-display leading-none tracking-wide",
                  moreActive || moreOpen ? "font-medium" : "text-secondary",
                )}
              >
                More
              </span>
            </button>
          </li>
        </ul>
      </nav>

      {moreOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
            className="flex-1 bg-inverse-surface/40"
          />
          <div className="max-h-[70dvh] overflow-y-auto rounded-t-2xl border-t border-surface-variant bg-surface-container-lowest p-4 pb-[max(env(safe-area-inset-bottom),1rem)] shadow-floating">
            <div className="flex items-center justify-between px-1 pb-3">
              <p className="font-display text-headline-sm font-medium tracking-tight text-on-surface">
                More
              </p>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMoreOpen(false)}
                className="text-secondary transition-colors hover:text-on-surface"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex flex-col gap-5">
              {navGroups.map((group) => (
                <div key={group.key}>
                  {group.label ? (
                    <p className="mb-1.5 px-2 font-display text-label-sm uppercase tracking-wider text-secondary/70">
                      {group.label}
                    </p>
                  ) : null}
                  <ul className="flex flex-col gap-0.5">
                    {group.items.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            onClick={() => setMoreOpen(false)}
                            className={cn(
                              "flex items-center gap-2.5 rounded-sm px-2.5 py-2 font-display text-label-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                              active
                                ? "bg-surface-container font-medium text-on-surface"
                                : "text-on-surface-variant hover:bg-surface-container/70 hover:text-on-surface",
                            )}
                          >
                            <item.icon className="size-4 shrink-0" />
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}