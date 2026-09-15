import { useState } from "react";
import { Loader2 } from "lucide-react";

export function useSubmitState() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  return { loading, setLoading, error, setError, notice, setNotice };
}

export function SubmitButton({
  loading,
  label,
  loadingLabel = "Working…",
}: {
  loading: boolean;
  label: string;
  loadingLabel?: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-label-md font-medium text-primary-foreground shadow-sm transition-all hover:bg-tertiary disabled:cursor-not-allowed disabled:opacity-70 active:translate-y-px"
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="flex items-center gap-2 rounded-lg border border-error/30 bg-error/10 px-3 py-2 font-body text-body-sm text-error"
    >
      {message}
    </p>
  );
}

export function FormNotice({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="status"
      className="flex items-center gap-2 rounded-lg border border-surface-variant bg-surface-container px-3 py-2 font-body text-body-sm text-on-surface-variant"
    >
      {message}
    </p>
  );
}