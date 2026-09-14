import Link from "next/link";
import { BookOpen, ShieldCheck } from "lucide-react";

import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] w-full flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-[440px]">
        <div className="rounded-xl border border-surface-variant bg-surface-container-lowest p-8 shadow-card transition-all sm:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-surface-container text-primary">
              <BookOpen className="size-[22px]" strokeWidth={1.75} />
            </div>
            <h1 className="font-display text-headline-lg font-normal tracking-tight text-on-surface">
              Welcome back
            </h1>
            <p className="mt-1 max-w-[34ch] font-body text-body-md text-secondary">
              Sign in to access your curated journals, experimental labs, and folio
              archives.
            </p>
          </div>

          <div className="mt-8">
            <SignInForm />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-container p-4 text-on-surface-variant">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-secondary" />
            <span className="font-display text-label-sm text-on-surface">
              Session protected end-to-end
            </span>
          </div>
          <Link
            href="/sign-up"
            className="font-display text-label-sm text-primary transition-colors hover:text-on-surface"
          >
            Claim workspace →
          </Link>
        </div>
      </div>
    </div>
  );
}