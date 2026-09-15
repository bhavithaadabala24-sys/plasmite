"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

import { GoogleButton } from "@/components/auth/google-button";
import { FormError, FormNotice } from "@/components/auth/submit-button";
import { createClient } from "@/lib/supabase/client";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
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

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!/\d/.test(password)) {
      setError("Password must include at least 1 number.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      setNotice("Workspace created. Opening your notebook…");
      const { data: profile } = await supabase
        .from("profiles")
        .select("branch")
        .eq("id", data.user?.id ?? "")
        .maybeSingle();
      router.push(profile?.branch ? "/dashboard" : "/setup");
      router.refresh();
    } else {
      setNotice(
        "Check your inbox for a confirmation link, then sign in to open your notebook.",
      );
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <GoogleButton label="Continue with Google" />

      <div className="relative my-1 flex items-center justify-center">
        <div className="w-full h-px bg-surface-variant" />
        <span className="absolute bg-surface-container-lowest px-4 font-display text-label-sm uppercase tracking-wider text-secondary">
          or create with email
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="reg-name"
            className="font-display text-label-sm font-medium tracking-wide text-on-surface"
          >
            Full Name
          </label>
          <input
            id="reg-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Alex Mercer"
            className="h-11 w-full rounded-lg border border-border bg-surface-container-lowest px-3.5 font-body text-body-md text-on-surface placeholder:text-secondary/60 shadow-sm focus:border-2 focus:border-ring focus:bg-surface-container-lowest focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-end justify-between">
            <label
              htmlFor="reg-email"
              className="font-display text-label-sm font-medium tracking-wide text-on-surface"
            >
              College Email
            </label>
            <span className="font-display text-code-sm text-secondary/80">
              University domain preferred
            </span>
          </div>
          <input
            id="reg-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@college.edu"
            className="h-11 w-full rounded-lg border border-border bg-surface-container-lowest px-3.5 font-body text-body-md text-on-surface placeholder:text-secondary/60 shadow-sm focus:border-2 focus:border-ring focus:bg-surface-container-lowest focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="reg-pass"
            className="font-display text-label-sm font-medium tracking-wide text-on-surface"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <input
              id="reg-pass"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="h-11 w-full rounded-lg border border-border bg-surface-container-lowest px-3.5 pr-10 font-body text-body-md text-on-surface placeholder:text-secondary/60 shadow-sm focus:border-2 focus:border-ring focus:bg-surface-container-lowest focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 text-secondary transition-colors hover:text-on-surface"
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

        <div className="flex flex-col gap-4 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-display font-medium text-primary-foreground shadow-md transition-all hover:bg-tertiary disabled:cursor-not-allowed disabled:opacity-70 active:translate-y-px"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Creating workspace…</span>
              </>
            ) : (
              <>
                <span>Continue to Academic Setup</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
          <p className="text-center font-body text-body-sm text-secondary">
            You own and can export your notes at any time.
          </p>
        </div>
      </form>
    </div>
  );
}