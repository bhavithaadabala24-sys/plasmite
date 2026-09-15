import { redirect } from "next/navigation";
import { KeyRound } from "lucide-react";

import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function UpdatePasswordPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] w-full items-center justify-center px-4">
        <p className="max-w-md text-center font-body text-body-md text-secondary">
          Authentication is not configured yet. Add{" "}
          <code className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-code-sm text-on-surface">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          and{" "}
          <code className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-code-sm text-on-surface">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          to <span className="text-on-surface">.env.local</span> to enable passkey recovery.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] w-full flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-[440px]">
        <div className="rounded-xl border border-surface-variant bg-surface-container-lowest p-8 shadow-card sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-surface-container text-primary">
              <KeyRound className="size-[22px]" strokeWidth={1.75} />
            </div>
            <h1 className="font-display text-headline-lg font-normal tracking-tight text-on-surface">
              Set a new passkey
            </h1>
            <p className="mt-1 max-w-[34ch] font-body text-body-md text-secondary">
              Choose a fresh key for your folio. This replaces your current passkey.
            </p>
          </div>
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
}