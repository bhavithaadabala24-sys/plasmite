"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function GoogleButton({ label }: { label: string }) {
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    });
    if (error) setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleGoogle}
      disabled={loading}
      className="group relative flex h-11 w-full items-center justify-center rounded-lg bg-surface-container-low font-label-md text-label-md text-on-surface shadow-sm transition-all hover:bg-surface-container active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span className="absolute left-3.5 flex items-center justify-center">
        <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            fill="#EA4335"
          />
          <path
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            fill="#4285F4"
          />
          <path
            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8 0-1.3.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
            fill="#FBBC05"
          />
          <path
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
            fill="#34A853"
          />
        </svg>
      </span>
      <span className="group-hover:text-primary">{label}</span>
    </button>
  );
}