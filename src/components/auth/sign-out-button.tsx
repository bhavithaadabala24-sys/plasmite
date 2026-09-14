"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setLoading(false);
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={loading}
      className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-surface-container-lowest px-4 font-label-md text-error transition-colors hover:bg-error-container/40 disabled:opacity-60"
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
      Sign Out
    </button>
  );
}