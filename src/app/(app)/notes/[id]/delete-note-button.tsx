"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export function DeleteNoteButton({ noteId }: { noteId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!window.confirm("Delete this note permanently? This cannot be undone.")) return;
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("notes").delete().eq("id", noteId);
    setLoading(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    router.push("/notes");
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface-container-lowest px-3 font-label-md text-error transition-colors hover:bg-error-container/40 disabled:opacity-60"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
        Delete
      </button>
      {error ? <p className="font-body text-code-sm text-error">{error}</p> : null}
    </div>
  );
}