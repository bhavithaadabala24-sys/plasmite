import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Check,
  FlaskConical,
  Layers,
  NotebookText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { ProgressBar } from "@/components/app/progress-bar";

const learningLoop = [
  { step: "01", title: "Learn", body: "Lecture notes & concepts" },
  { step: "02", title: "Write", body: "Formulas & mathematical proofs" },
  { step: "03", title: "Build", body: "Lab code & project schematics" },
  { step: "04", title: "Break", body: "Hardware & bug journals" },
  { step: "05", title: "Revise", body: "Oral viva prep & spaced decks" },
];

const features = [
  {
    icon: Layers,
    title: "Specialized Engineering Blocks",
    body: "Inline formulas, proof cells, and code blocks designed for technical writing — not blog posts.",
  },
  {
    icon: FlaskConical,
    title: "Structured Lab Notebooks",
    body: "Aim, algorithm, observations, results, and viva questions in one exportable record.",
  },
  {
    icon: RefreshCw,
    title: "Questions Vault & Spaced Revision",
    body: "Collect exam questions, tag weak topics, and revise with calm, spaced review decks.",
  },
  {
    icon: ShieldCheck,
    title: "Local-First Data Ownership",
    body: "Your folio is exportable at any time — ZIP, JSON, or compiled PDF. No proprietary lock-in.",
  },
];

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-8 sm:space-y-32">
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 pt-20 text-center sm:pt-24">
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
            href="#learning-loop"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg font-display text-label-md text-on-surface transition-colors hover:text-secondary sm:w-auto"
          >
            Read Product Philosophy
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

      {/* App preview frame */}
      <section className="mx-auto max-w-5xl px-4">
        <div className="overflow-hidden rounded-2xl border border-surface-variant bg-surface-container-lowest shadow-card">
          <div className="flex items-center justify-between border-b border-surface-variant px-5 py-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-surface-container-highest" />
              <span className="size-2.5 rounded-full bg-surface-container-highest" />
              <span className="size-2.5 rounded-full bg-surface-container-highest" />
            </div>
            <span className="font-display text-code-sm text-secondary">
              folio · curriculum node — semester living syllabus
            </span>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-secondary-container px-2 py-0.5 font-display text-code-sm text-on-secondary-container">
                Verified Note
              </span>
            </div>
          </div>

          <div className="grid gap-px bg-surface-variant sm:grid-cols-5">
            <div className="space-y-4 bg-surface-container-lowest p-5 sm:col-span-2">
              <div>
                <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
                  Curriculum Nodes
                </p>
                <div className="mt-2 space-y-1.5">
                  {["Data Structures", "Operating Systems", "Computer Networks", "Database Systems"].map(
                    (s) => (
                      <div
                        key={s}
                        className="flex items-center justify-between rounded-lg border border-surface-variant bg-surface-container-lowest px-3 py-2"
                      >
                        <span className="font-display text-label-md text-on-surface">{s}</span>
                        <span className="flex items-center gap-1 font-display text-code-sm text-primary">
                          <Sparkles className="size-3" /> Synced
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-surface-variant p-3">
                <div className="flex items-center justify-between">
                  <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
                    Active Ledger
                  </p>
                  <span className="font-display text-code-sm text-on-surface-variant">14.2 MB / 50 MB</span>
                </div>
                <ProgressBar value={28} className="mt-2.5" />
              </div>
            </div>

            <div className="space-y-4 bg-surface-container-lowest p-5 sm:col-span-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
                    Upcoming Deliverables
                  </p>
                  <p className="mt-1 font-display text-headline-md font-medium tracking-tight text-on-surface">
                    Distance Vector Routing
                  </p>
                  <p className="font-body text-body-sm text-on-surface-variant">
                    Computer Networks Lab — Due Tomorrow
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-secondary-container px-2.5 py-1 font-display text-code-sm font-medium text-on-secondary-container">
                  <span className="size-1.5 rounded-full bg-on-secondary-container" />
                  3 deliverables
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: "Implement DV algorithm", done: true },
                  { label: "Observe count-to-infinity", done: true },
                  { label: "Prove O(n) split-horizon update", done: false },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-2.5">
                    <span
                      className={`flex size-4 items-center justify-center rounded-full border ${
                        t.done
                          ? "border-primary bg-primary text-on-primary"
                          : "border-outline-variant"
                      }`}
                    >
                      {t.done ? <Check className="size-2.5" strokeWidth={3} /> : null}
                    </span>
                    <span
                      className={`font-body text-body-md ${
                        t.done ? "text-on-surface-variant line-through" : "text-on-surface"
                      }`}
                    >
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-surface-variant bg-surface-container p-3.5">
                <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
                  Latest Note
                </p>
                <p className="mt-1 flex items-center gap-2 font-display text-label-md text-on-surface">
                  <NotebookText className="size-4 text-primary" />
                  Binary Search Trees & Complexity Analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning loop */}
      <section id="learning-loop" className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <p className="font-display text-label-sm uppercase tracking-widest text-secondary">
            The Engineering Learning Loop
          </p>
          <h2 className="mt-2 font-body text-headline-xl font-normal tracking-tight text-on-surface">
            Built around how engineers actually retain knowledge
          </h2>
        </div>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {learningLoop.map((s) => (
            <li
              key={s.step}
              className="rounded-xl border border-surface-variant bg-surface-container-lowest p-5 shadow-card"
            >
              <span className="font-display text-code-sm text-primary">{s.step}</span>
              <h3 className="mt-2 font-display text-headline-md font-medium tracking-tight text-on-surface">
                {s.title}
              </h3>
              <p className="mt-1 font-body text-body-sm text-on-surface-variant">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <p className="font-display text-label-sm uppercase tracking-widest text-secondary">
            Purpose-built
          </p>
          <h2 className="mt-2 font-body text-headline-xl font-normal tracking-tight text-on-surface">
            Features for notes that carry proofs, code, and lab evidence
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <article
              key={f.title}
              className="flex gap-4 rounded-xl border border-surface-variant bg-surface-container-lowest p-6 shadow-card"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary">
                <f.icon className="size-5" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-display text-headline-sm font-medium tracking-tight text-on-surface">
                  {f.title}
                </h3>
                <p className="mt-1 max-w-prose font-body text-body-md text-on-surface-variant">
                  {f.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="font-display text-code-sm uppercase tracking-widest text-primary">
            <BookOpenText className="mr-1.5 inline size-4" />
            Folio
          </span>
          <h2 className="font-body text-headline-lg font-normal tracking-tight text-on-surface">
            Open your first notebook page.
          </h2>
          <Link
            href="/sign-up"
            className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-on-surface px-6 font-display text-label-md font-medium text-surface shadow-sm transition-colors hover:bg-primary-container hover:text-on-primary-container"
          >
            Start Writing — Free
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}