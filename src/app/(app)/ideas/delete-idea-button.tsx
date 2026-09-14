"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export function DeleteIdeaButton({ ideaId }: { ideaId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!window.confirm("Delete this idea? This cannot be undone.")) return;
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("ideas").delete().eq("id", ideaId);
    setLoading(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    router.refresh();
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        aria-label="Delete idea"
        title={error ?? undefined}
        className="text-secondary transition-colors hover:text-error disabled:opacity-60"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      </button>
      {error ? <span className="font-body text-code-sm text-error">{error}</span> : null}
    </span>
  );
}