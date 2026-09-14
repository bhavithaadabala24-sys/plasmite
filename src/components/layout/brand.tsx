import Image from "next/image";

import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/plasmite-logo.png"
        alt="PLASMITE"
        width={300}
        height={100}
        priority
        className="h-7 w-auto object-contain lg:h-8"
      />
    </div>
  );
}