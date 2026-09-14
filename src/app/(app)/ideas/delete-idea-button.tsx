"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export function DeleteIdeaButton({ ideaId }: { ideaId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Delete this idea? This cannot be undone.")) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("ideas").delete().eq("id", ideaId);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      aria-label="Delete idea"
      className="text-secondary transition-colors hover:text-error disabled:opacity-60"
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </button>
  );
}