"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export function DeleteSubjectButton({ subjectId, subjectName }: { subjectId: string; subjectName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (
      !window.confirm(
        `Delete "${subjectName}" and its entire syllabus?\n\nNotes linked to this subject will be kept but unlinked. This cannot be undone.`,
      )
    ) {
      return;
    }
    setLoading(true);
    const supabase = createClient();
    await supabase.from("subjects").delete().eq("id", subjectId);
    setLoading(false);
    router.push("/subjects");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 font-label-md text-error transition-colors hover:bg-error-container/40 disabled:opacity-60"
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      Delete Subject
    </button>
  );
}