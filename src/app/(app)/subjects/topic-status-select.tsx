"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const STATUS_META = {
  not_started: { label: "Not Started", className: "bg-surface-container text-on-surface-variant" },
  learning: { label: "Learning", className: "bg-tertiary-container text-on-tertiary-container" },
  practicing: { label: "Practicing", className: "bg-secondary-container text-on-secondary-container" },
  completed: { label: "Completed", className: "bg-primary-container text-on-primary-container" },
  needs_revision: {
    label: "Needs Revision",
    className: "bg-error-container text-on-error-container",
  },
} as const;

export type TopicStatus = keyof typeof STATUS_META;

export function TopicStatusSelect({
  topicId,
  status,
}: {
  topicId: string;
  status: TopicStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const current = STATUS_META[status];

  async function update(next: TopicStatus) {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("topics")
      .update({ status: next })
      .eq("id", topicId);
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="relative inline-flex flex-col items-start gap-1">
      <div className="relative inline-flex items-center gap-1.5">
        <select
          aria-label="Topic status"
          value={status}
          disabled={loading}
          onChange={(e) => update(e.target.value as TopicStatus)}
          className={`h-8 cursor-pointer appearance-none rounded-full pl-3 pr-8 font-display text-code-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:opacity-60 ${current.className}`}
        >
          {Object.entries(STATUS_META).map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </select>
        {loading ? (
          <Loader2 className="absolute right-2 size-3.5 animate-spin text-on-surface-variant" />
        ) : (
          <span className="pointer-events-none absolute right-2.5 text-on-surface-variant">▾</span>
        )}
      </div>
      {error ? (
        <p role="alert" className="font-body text-code-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}