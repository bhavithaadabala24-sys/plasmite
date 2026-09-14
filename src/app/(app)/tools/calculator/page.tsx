"use client";

import { useState } from "react";
import { Delete, History } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";

const SCIENTIFIC: { label: string; insert: string }[] = [
  { label: "sin", insert: "Math.sin(" },
  { label: "cos", insert: "Math.cos(" },
  { label: "tan", insert: "Math.tan(" },
  { label: "ln", insert: "Math.log(" },
  { label: "log", insert: "Math.log10(" },
  { label: "√", insert: "Math.sqrt(" },
  { label: "x²", insert: "**2" },
  { label: "π", insert: "Math.PI" },
];

const KEYS = [
  "7",
  "8",
  "9",
  "÷",
  "4",
  "5",
  "6",
  "×",
  "1",
  "2",
  "3",
  "−",
  "0",
  ".",
  "(",
  "+",
  "^",
  "%",
  "C",
  "=",
];

function toSafeExpr(input: string) {
  return input
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/\^/g, "**")
    .replace(/π/g, "Math.PI");
}

export default function CalculatorPage() {
  const [display, setDisplay] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  function evaluate() {
    const expr = toSafeExpr(display);
    if (!expr.trim()) return;
    if (/[+\-*/%]\.*$/.test(expr) || /\($/.test(expr)) {
      setError("Incomplete expression — close it before evaluating.");
      return;
    }
    try {
      const value = Function(`"use strict"; return (${expr});`)();
      const result = Number(value);
      if (!Number.isFinite(result)) throw new Error("non-finite");
      const formatted = String(Math.round(result * 1e10) / 1e10);
      setHistory((h) => [`${display.replace(/\^/g, "^")} = ${formatted}`, ...h].slice(0, 12));
      setDisplay(formatted);
      setError(null);
    } catch {
      setError("Couldn't evaluate that expression.");
    }
  }

  function key(k: string) {
    setError(null);
    if (k === "C") {
      setDisplay("");
      return;
    }
    if (k === "=") {
      evaluate();
      return;
    }
    if (k === "÷" || k === "×" || k === "−" || k === "+") {
      setDisplay((d) => (d.endsWith(k) ? d : `${d}${k}`));
      return;
    }
    if (k === "^") {
      setDisplay((d) => `${d}^`);
      return;
    }
    if (k === "%") {
      setDisplay((d) => `${d}%`);
      return;
    }
    setDisplay((d) => `${d}${k}`);
  }

  const buttonBase =
    "h-14 rounded-lg font-display text-body-lg transition-all active:translate-y-px disabled:opacity-50";

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Engineer Utilities"
        title="Calculator"
        description="A quick engineering calculator for on-the-fly math."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-surface-variant bg-surface-container-lowest p-5 shadow-card">
            <div className="flex min-h-20 flex-col items-end justify-end rounded-xl bg-surface-container p-4">
              <p className="break-all text-right font-mono text-headline-lg leading-snug text-on-surface">
                {display || "0"}
              </p>
              {error ? <p className="mt-1 text-right font-body text-code-sm text-error">{error}</p> : null}
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {SCIENTIFIC.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setDisplay((d) => `${d}${s.insert}`)}
                  className="h-8 rounded-md bg-secondary-container px-2.5 font-mono text-code-sm text-on-secondary-container transition-colors hover:bg-surface-container-high"
                >
                  {s.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setDisplay((d) => d.slice(0, -1))}
                aria-label="Backspace"
                className="inline-flex h-8 items-center justify-center rounded-md bg-surface-container px-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
              >
                <Delete className="size-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {KEYS.map((k) => {
                const isOp = ["÷", "×", "−", "+", "^", "%"].includes(k);
                const isAction = k === "C" || k === "=";
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => key(k)}
                    className={`${buttonBase} ${
                      isAction
                        ? "bg-primary text-on-primary hover:bg-tertiary"
                        : isOp
                          ? "bg-secondary-container text-on-secondary-container hover:bg-surface-container-high"
                          : "bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container"
                    }`}
                  >
                    {k}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="mx-auto w-full max-w-md rounded-2xl border border-surface-variant bg-surface-container-lowest p-5 shadow-card lg:max-w-none">
          <h2 className="flex items-center gap-2 font-display text-headline-sm font-medium tracking-tight text-on-surface">
            <History className="size-4 text-primary" />
            History
          </h2>
          {history.length === 0 ? (
            <p className="mt-4 font-body text-body-sm text-on-surface-variant">
              Evaluations appear here as you work.
            </p>
          ) : (
            <ol className="mt-3 flex flex-col gap-1.5">
              {history.map((entry, i) => (
                <li
                  key={`${entry}-${i}`}
                  className="rounded-lg bg-surface-container px-3 py-2 font-mono text-code-sm text-on-surface"
                >
                  {entry}
                </li>
              ))}
            </ol>
          )}
          {history.length > 0 ? (
            <button
              type="button"
              onClick={() => setHistory([])}
              className="mt-4 font-display text-label-sm text-secondary transition-colors hover:text-on-surface"
            >
              Clear history
            </button>
          ) : null}
        </aside>
      </div>
    </div>
  );
}