"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AtSign, Eye, EyeOff } from "lucide-react";

import { GoogleButton } from "@/components/auth/google-button";
import { FormError, FormNotice, SubmitButton } from "@/components/auth/submit-button";
import { createClient } from "@/lib/supabase/client";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setNotice("Session initialized. Opening your folio…");
    router.push("/dashboard");
    router.refresh();
  }

  async function handleReset(e: React.MouseEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!email) {
      setError("Enter your account email first to request a reset link.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setNotice("If that account exists, a reset link has been sent.");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <GoogleButton label="Continue with Google" />

      <div className="relative my-1 flex items-center justify-center">
        <div className="w-full h-px bg-surface-variant" />
        <span className="absolute bg-surface-container-lowest px-4 font-display text-label-sm uppercase tracking-wider text-secondary">
          or continue with email
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="font-display text-label-sm uppercase tracking-wider text-on-surface"
          >
            Account ID / Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="archivist@folio.plasma"
              className="h-11 w-full rounded-lg border border-border bg-surface-container-low px-3.5 pr-10 font-body text-body-md text-on-surface placeholder:text-secondary focus:border-2 focus:border-ring focus:bg-surface-container-lowest focus:outline-none"
            />
            <AtSign className="pointer-events-none absolute right-3 top-1/2 size-[18px] -translate-y-1/2 text-outline" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="font-display text-label-sm uppercase tracking-wider text-on-surface"
            >
              Cipher / Key
            </label>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="font-display text-label-sm text-secondary underline-offset-4 transition-colors hover:text-primary hover:underline disabled:opacity-60"
            >
              Recover passkey?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="h-11 w-full rounded-lg border border-border bg-surface-container-low px-3.5 pr-10 font-body text-body-md text-on-surface placeholder:text-secondary focus:border-2 focus:border-ring focus:bg-surface-container-lowest focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title="Toggle Visibility"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-secondary transition-colors hover:text-on-surface"
            >
              {showPassword ? (
                <EyeOff className="size-[18px]" />
              ) : (
                <Eye className="size-[18px]" />
              )}
            </button>
          </div>
        </div>

        <FormError message={error} />
        <FormNotice message={notice} />

        <div className="flex flex-col gap-1 pt-1">
          <SubmitButton loading={loading} label="Authenticate & Open Folio" />
        </div>
      </form>
    </div>
  );
}