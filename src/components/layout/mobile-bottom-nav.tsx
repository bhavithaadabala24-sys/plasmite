"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { mobileNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" || pathname === "" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {mobileNav.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 transition-colors",
                  active
                    ? "text-on-surface"
                    : "text-surface-tint hover:text-on-surface",
                )}
              >
                <item.icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                <span
                  className={cn(
                    "font-display text-label-sm tracking-wide",
                    active ? "font-medium" : "text-secondary",
                  )}
                >
                  {item.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}