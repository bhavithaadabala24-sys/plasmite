import { NotebookPen } from "lucide-react";

import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] w-full flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-[460px]">
        <div className="rounded-xl border border-surface-variant bg-surface-container-lowest p-8 shadow-card transition-all sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex size-8 items-center justify-center rounded-full bg-surface-container-low text-primary">
              <NotebookPen className="size-4" />
            </div>
            <h1 className="font-display text-headline-xl font-normal tracking-tight text-primary">
              Create your notebook
            </h1>
            <p className="mt-1 max-w-[32ch] font-body text-body-md text-secondary">
              A calm, structured workspace for your engineering degree.
            </p>
          </div>

          <SignUpForm />
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 font-display text-code-sm text-secondary/80 sm:flex-row sm:gap-8">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary-fixed-dim" />
            Zero tracking analytics
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary-fixed-dim" />
            Offline markdown compatibility
          </span>
        </div>
      </div>
    </div>
  );
}