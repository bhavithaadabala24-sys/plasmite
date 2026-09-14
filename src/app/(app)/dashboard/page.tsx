import { NotebookText } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Folio · Workspace"
        title="Dashboard"
        description="Your engineering notebook workspace. Personal content lands here as the notebook features are built."
      />

      <section
        aria-label="Workspace status"
        className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface-container-lowest px-6 py-16 text-center shadow-card"
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-surface-container-highest text-primary">
          <NotebookText className="size-5" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-headline-md font-medium tracking-tight text-on-surface">
            The notebook is being prepared
          </h2>
          <p className="max-w-sm font-body text-body-md text-on-surface-variant">
            Notes, subjects, labs, and projects arrive in the next build milestones. The
            application shell, design system, and navigation are in place.
          </p>
        </div>
      </section>
    </div>
  );
}