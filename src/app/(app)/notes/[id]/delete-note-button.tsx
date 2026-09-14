"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export function DeleteNoteButton({ noteId }: { noteId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Delete this note permanently? This cannot be undone.")) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("notes").delete().eq("id", noteId);
    setLoading(false);
    router.push("/notes");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface-container-lowest px-3 font-label-md text-error transition-colors hover:bg-error-container/40 disabled:opacity-60"
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      Delete
    </button>
  );
}