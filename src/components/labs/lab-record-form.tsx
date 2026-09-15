"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, RotateCcw, Save, ShieldQuestion, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { inputField } from "@/app/(app)/labs/create-lab-modal";

const STATUS_META = {
  not_started: { label: "Not Started", className: "bg-surface-container text-on-surface-variant" },
  in_progress: { label: "In Progress", className: "bg-tertiary-container text-on-tertiary-container" },
  completed: { label: "Completed", className: "bg-primary-container text-on-primary-container" },
} as const;

type Status = keyof typeof STATUS_META;
type SaveState = "saved" | "saving" | "error";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-surface-variant bg-surface-container-lowest shadow-card">
      <h2 className="border-b border-surface-variant px-5 py-3.5 font-display text-headline-sm font-medium tracking-tight text-on-surface">
        {title}
      </h2>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function LabRecordForm({
  experimentId,
  initial,
}: {
  experimentId: string;
  initial: Record<string, unknown>;
}) {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown>>({ ...initial });
  const [vivas, setVivas] = useState<string[]>(
    Array.isArray(initial.viva_questions) ? (initial.viva_questions as string[]) : [],
  );
  const [vivaInput, setVivaInput] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [error, setError] = useState<string | null>(null);

  const persist = useCallback(
    async (next: Record<string, unknown>, nextVivas: string[]) => {
      const rawNumber = next.experiment_number;
      const parsedNumber =
        rawNumber === "" || rawNumber == null || Number.isNaN(Number(rawNumber))
          ? null
          : Number(rawNumber);

      const payload: Record<string, unknown> = {
        title: next.title,
        experiment_number: parsedNumber,
        aim: next.aim || null,
        objective: next.objective || null,
        requirements: next.requirements || null,
        theory: next.theory || null,
        algorithm: next.algorithm || null,
        procedure: next.procedure || null,
        code: next.code || null,
        input: next.input || null,
        output: next.output || null,
        observation: next.observation || null,
        result: next.result || null,
        conclusion: next.conclusion || null,
        teacher_remarks: next.teacher_remarks || null,
        status: next.status,
        viva_questions: nextVivas,
      };
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("lab_experiments")
        .update(payload)
        .eq("id", experimentId);
      if (updateError) setError(updateError.message);
      setSaveState(updateError ? "error" : "saved");
    },
    [experimentId],
  );

  function update(patch: Record<string, unknown>, clearError = true) {
    const next = { ...draft, ...patch };
    setDraft(next);
    if (clearError) setError(null);
    setSaveState("saving");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => persist(next, vivas), 600);
  }

  function saveNow() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveState("saving");
    persist(draft, vivas);
    router.refresh();
  }

  function addViva() {
    const q = vivaInput.trim();
    if (!q) return;
    const next = [...vivas, q];
    setVivas(next);
    setVivaInput("");
    setSaveState("saving");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => persist(draft, next), 600);
  }

  function removeViva(index: number) {
    const next = vivas.filter((_, i) => i !== index);
    setVivas(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => persist(draft, next), 600);
  }

  const textArea = `${inputField} h-auto min-h-28 resize-y py-2 font-mono text-body-md leading-relaxed`;
  const status = (draft.status as Status) ?? "not_started";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-code-sm font-medium ${
              saveState === "saved"
                ? "bg-primary-container text-on-primary-container"
                : saveState === "saving"
                  ? "bg-surface-container text-on-surface-variant"
                  : "bg-error-container text-on-error-container"
            }`}
          >
            {saveState === "saved" ? (
              <>
                <Check className="size-3.5" /> Saved
              </>
            ) : saveState === "saving" ? (
              <>
                <Save className="size-3.5 animate-pulse" /> Saving…
              </>
            ) : (
              <>
                <RotateCcw className="size-3.5" /> Not saved
              </>
            )}
          </span>
          <select
            aria-label="Record status"
            value={status}
            onChange={(e) => update({ status: e.target.value }, false)}
            className={`h-8 cursor-pointer appearance-none rounded-full pl-3 pr-8 font-display text-code-sm font-medium transition-colors ${STATUS_META[status].className}`}
          >
            {Object.entries(STATUS_META).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={saveNow}
          disabled={saveState === "saving"}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 font-label-md font-medium text-on-primary shadow-md transition-all hover:bg-tertiary active:translate-y-px disabled:opacity-60"
        >
          {saveState === "saving" ? <Save className="size-4 animate-pulse" /> : <Save className="size-4" />}
          Save Record
        </button>
      </div>

      <Section title="Experiment">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="font-display text-label-sm text-on-surface">Title</label>
            <input
              value={(draft.title as string) ?? ""}
              onChange={(e) => update({ title: e.target.value })}
              className={`${inputField} mt-1.5`}
            />
          </div>
          <div>
            <label className="font-display text-label-sm text-on-surface">Experiment number</label>
            <input
              value={(draft.experiment_number as string) ?? ""}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => update({ experiment_number: e.target.value.replace(/\D/g, "") })}
              className={`${inputField} mt-1.5`}
            />
          </div>
        </div>
      </Section>

      <Section title="Plan & Approach">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-display text-label-sm text-on-surface">Aim</label>
            <textarea
              value={(draft.aim as string) ?? ""}
              onChange={(e) => update({ aim: e.target.value })}
              placeholder="To implement and study…"
              className={`${textArea} mt-1.5`}
            />
          </div>
          <div>
            <label className="font-display text-label-sm text-on-surface">Objective</label>
            <textarea
              value={(draft.objective as string) ?? ""}
              onChange={(e) => update({ objective: e.target.value })}
              className={`${textArea} mt-1.5`}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="font-display text-label-sm text-on-surface">Requirements / Apparatus</label>
            <textarea
              value={(draft.requirements as string) ?? ""}
              onChange={(e) => update({ requirements: e.target.value })}
              placeholder="Software, hardware, libraries…"
              className={`${textArea} mt-1.5`}
            />
          </div>
        </div>
      </Section>

      <Section title="Theory">
        <textarea
          value={(draft.theory as string) ?? ""}
          onChange={(e) => update({ theory: e.target.value })}
          placeholder="Background, formulas, derivations…"
          className={`${textArea} min-h-40 mt-1.5`}
        />
      </Section>

      <Section title="Algorithm">
        <textarea
          value={(draft.algorithm as string) ?? ""}
          onChange={(e) => update({ algorithm: e.target.value })}
          placeholder={"1. Initialize routing table\n2. Exchange distance vectors with neighbors"}
          className={`${textArea} min-h-40 mt-1.5`}
        />
        <div className="mt-3">
          <label className="font-display text-label-sm text-on-surface">Procedure</label>
          <textarea
            value={(draft.procedure as string) ?? ""}
            onChange={(e) => update({ procedure: e.target.value })}
            className={`${textArea} mt-1.5`}
          />
        </div>
      </Section>

      <Section title="Code">
        <textarea
          value={(draft.code as string) ?? ""}
          onChange={(e) => update({ code: e.target.value })}
          placeholder="Paste your implementation here. Code blocks are preserved verbatim."
          className={`${textArea} min-h-56 mt-1.5 font-mono`}
          spellCheck={false}
        />
      </Section>

      <Section title="Observations & Results">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-display text-label-sm text-on-surface">Input</label>
            <textarea
              value={(draft.input as string) ?? ""}
              onChange={(e) => update({ input: e.target.value })}
              className={`${textArea} mt-1.5`}
            />
          </div>
          <div>
            <label className="font-display text-label-sm text-on-surface">Output</label>
            <textarea
              value={(draft.output as string) ?? ""}
              onChange={(e) => update({ output: e.target.value })}
              className={`${textArea} mt-1.5`}
            />
          </div>
          <div>
            <label className="font-display text-label-sm text-on-surface">Observation</label>
            <textarea
              value={(draft.observation as string) ?? ""}
              onChange={(e) => update({ observation: e.target.value })}
              className={`${textArea} mt-1.5`}
            />
          </div>
          <div>
            <label className="font-display text-label-sm text-on-surface">Result</label>
            <textarea
              value={(draft.result as string) ?? ""}
              onChange={(e) => update({ result: e.target.value })}
              className={`${textArea} mt-1.5`}
            />
          </div>
        </div>
      </Section>

      <Section title="Conclusion">
        <textarea
          value={(draft.conclusion as string) ?? ""}
          onChange={(e) => update({ conclusion: e.target.value })}
          className={`${textArea} min-h-32 mt-1.5`}
        />
        <div className="mt-3">
          <label className="font-display text-label-sm text-on-surface">Teacher remarks</label>
          <textarea
            value={(draft.teacher_remarks as string) ?? ""}
            onChange={(e) => update({ teacher_remarks: e.target.value })}
            className={`${textArea} mt-1.5`}
          />
        </div>
      </Section>

      <Section title="Viva Questions">
        <div className="flex flex-col gap-3">
          {(vivas.length === 0 ? null : (
            <ul className="flex flex-col gap-2">
              {vivas.map((v, i) => (
                <li
                  key={`${v}-${i}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-surface-variant bg-surface-container-lowest px-3.5 py-2.5"
                >
                  <span className="flex items-start gap-2.5 font-body text-body-md text-on-surface">
                    <ShieldQuestion className="mt-0.5 size-4 shrink-0 text-primary" />
                    {v}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeViva(i)}
                    aria-label={`Remove viva question ${i + 1}`}
                    className="text-secondary transition-colors hover:text-error"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          ))}
          <div className="flex gap-2">
            <input
              value={vivaInput}
              onChange={(e) => setVivaInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addViva();
                }
              }}
              placeholder="Add a likely viva question…"
              className={inputField}
            />
            <button
              type="button"
              onClick={addViva}
              disabled={!vivaInput.trim()}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-secondary-container px-4 font-label-md text-on-secondary-container transition-colors hover:bg-surface-container-high disabled:opacity-50"
            >
              <Plus className="size-4" />
              Add
            </button>
          </div>
        </div>
      </Section>

      {error ? (
        <p className="rounded-lg bg-error-container px-4 py-3 font-body text-body-sm text-on-error-container">
          {error}
        </p>
      ) : null}
    </div>
  );
}