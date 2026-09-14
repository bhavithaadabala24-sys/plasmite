import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:py-28">
        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-surface-variant bg-surface-container-lowest px-3 py-1 shadow-card">
          <span className="size-1.5 rounded-full bg-primary-fixed-dim" />
          <span className="font-display text-label-sm uppercase tracking-widest text-secondary">
            A Digital Notebook for Engineering Students
          </span>
        </div>

        <h1 className="font-body text-display-lg font-normal tracking-tight text-on-surface">
          Your engineering knowledge, organized.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl font-body text-body-lg text-secondary">
          A calm, structured workspace combining lecture notes, lab records, code blocks,
          and exam revision into a single long-term memory.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Link
            href="/sign-up"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-on-surface px-6 font-display text-label-md font-medium text-surface shadow-sm transition-colors hover:bg-primary-container hover:text-on-primary-container sm:w-auto"
          >
            Start Writing — Free
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-surface-variant bg-surface-container-lowest px-5 font-display text-label-md text-on-surface shadow-sm transition-colors hover:bg-surface sm:w-auto"
          >
            Sign In
          </Link>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 font-display text-code-sm text-secondary">
          <span>No credit card</span>
          <span className="text-outline-variant">·</span>
          <span>Completely free for students</span>
          <span className="text-outline-variant">·</span>
          <span>Export your data anytime</span>
        </p>
      </section>
    </div>
  );
}