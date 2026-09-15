"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { createClient, getCurrentUserId } from "@/lib/supabase/client";

export default function NewNotePage() {
  const router = useRouter();
  const createdRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (createdRef.current) return;
    createdRef.current = true;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const userId = await getCurrentUserId();
      if (cancelled) return;
      if (!userId) {
        router.replace("/sign-in?next=/notes/new");
        return;
      }
      const { data, error: insertError } = await supabase
        .from("notes")
        .insert({ user_id: userId, title: "Untitled note", content: "", plain_text: "" })
        .select("id")
        .single();
      if (cancelled) return;
      if (insertError || !data) {
        setError(insertError?.message ?? "Could not create note");
        return;
      }
      router.replace(`/notes/${data.id}`);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) {
    return (
      <div className="rounded-xl border border-error-container bg-error-container/40 px-4 py-3 font-body text-body-sm text-on-error-container">
        Could not create that note. {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <Loader2 className="size-6 animate-spin text-secondary" />
      <p className="font-body text-body-sm text-on-surface-variant">
        Setting up a fresh page…
      </p>
    </div>
  );
}