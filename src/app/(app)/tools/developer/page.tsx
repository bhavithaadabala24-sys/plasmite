"use client";

import { useState } from "react";
import { Binary, Ruler } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";

function parseBase(s: string, base: number): bigint | null {
  try {
    return BigInt.parseInt(s.trim(), base);
  } catch {
    return null;
  }
}

const FACTORS: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  mg: 1e-6,
  g: 0.001,
  kg: 1,
  lb: 0.45359237,
  oz: 0.028349523125,
};

const UNITS = {
  length: ["mm", "cm", "m", "km", "in", "ft"],
  mass: ["mg", "g", "kg", "lb", "oz"],
} as const;

type UnitKind = keyof typeof UNITS;

function toBase(v: number, u: string) {
  return v * FACTORS[u];
}
function fromBase(v: number, u: string) {
  return v / FACTORS[u];
}

function BaseConverter() {
  const [value, setValue] = useState("");
  const [base, setBase] = useState(10);
  const rows = [
    { base: 2, label: "Binary" },
    { base: 8, label: "Octal" },
    { base: 10, label: "Decimal" },
    { base: 16, label: "Hex" },
  ];
  const parsed = parseBase(value || "0", base);
  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-1 flex-col gap-1.5 min-w-44">
          <label className="font-display text-label-sm text-secondary">Input</label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={base === 10 ? "e.g. 255" : base === 16 ? "e.g. FF" : "e.g. 11111111"}
            className="h-10 rounded-lg border border-border bg-surface-container-lowest px-3 font-mono text-body-md text-on-surface shadow-sm focus:border-2 focus:border-ring focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-display text-label-sm text-secondary">Base</label>
          <select
            value={base}
            onChange={(e) => setBase(Number(e.target.value))}
            className="h-10 cursor-pointer rounded-lg border border-border bg-surface-container-lowest px-3 font-body text-body-sm text-on-surface shadow-sm focus:border-2 focus:border-ring focus:outline-none"
          >
            {rows.map((r) => (
              <option key={r.base} value={r.base}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {rows.map((r) => (
          <div
            key={r.base}
            className="flex items-center justify-between rounded-lg border border-surface-variant bg-surface-container px-4 py-2.5"
          >
            <span className="font-display text-code-sm uppercase tracking-wider text-secondary">
              {r.label}
            </span>
            <span className="font-mono text-body-lg text-on-surface">
              {parsed !== null ? parsed.toString(r.base).toUpperCase() : "—"}
            </span>
          </div>
        ))}
        {parsed === null ? (
          <p className="font-body text-code-sm text-error">Invalid input for the selected base.</p>
        ) : null}
      </div>
    </div>
  );
}

function UnitConverter() {
  const [kind, setKind] = useState<UnitKind>("length");
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  const num = Number(value);
  const units = UNITS[kind];
  const out = Number.isFinite(num) ? fromBase(toBase(num, from), to) : NaN;

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="font-display text-label-sm text-secondary">Type</label>
          <select
            value={kind}
            onChange={(e) => {
              setKind(e.target.value);
              setFrom(e.target.value === "mass" ? "kg" : "m");
              setTo(e.target.value === "mass" ? "g" : "cm");
            }}
            className="h-10 cursor-pointer rounded-lg border border-border bg-surface-container-lowest px-3 font-body text-body-sm text-on-surface shadow-sm focus:border-2 focus:border-ring focus:outline-none"
          >
            <option value="length">Length</option>
            <option value="mass">Mass</option>
          </select>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 min-w-32">
          <label className="font-display text-label-sm text-secondary">Value</label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode="decimal"
            className="h-10 rounded-lg border border-border bg-surface-container-lowest px-3 font-mono text-body-md text-on-surface shadow-sm focus:border-2 focus:border-ring focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-display text-label-sm text-secondary">From</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-10 cursor-pointer rounded-lg border border-border bg-surface-container-lowest px-3 font-body text-body-sm text-on-surface shadow-sm focus:border-2 focus:border-ring focus:outline-none"
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-display text-label-sm text-secondary">To</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="h-10 cursor-pointer rounded-lg border border-border bg-surface-container-lowest px-3 font-body text-body-sm text-on-surface shadow-sm focus:border-2 focus:border-ring focus:outline-none"
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg border border-surface-variant bg-surface-container px-4 py-3">
        <span className="font-mono text-body-md text-on-surface-variant">
          {Number.isFinite(num) ? value : "—"} {from}
        </span>
        <span className="font-mono text-headline-md font-medium text-on-surface">
          {Number.isFinite(out) ? String(Math.round(out * 1e6) / 1e6) + " " + to : "—"}
        </span>
      </div>
    </div>
  );
}

export default function DeveloperToolsPage() {
  const [tab, setTab] = useState<"base" | "units">("base");
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Engineer Utilities"
        title="Developer Tools"
        description="Small utilities for quick conversions while you code and debug."
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("base")}
          className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 font-label-md transition-colors ${
            tab === "base"
              ? "bg-on-surface text-surface"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          <Binary className="size-4" />
          Number Bases
        </button>
        <button
          type="button"
          onClick={() => setTab("units")}
          className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 font-label-md transition-colors ${
            tab === "units"
              ? "bg-on-surface text-surface"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          <Ruler className="size-4" />
          Unit Converter
        </button>
      </div>

      <div className="mx-auto w-full max-w-xl rounded-2xl border border-surface-variant bg-surface-container-lowest p-6 shadow-card">
        {tab === "base" ? <BaseConverter /> : <UnitConverter />}
      </div>
    </div>
  );
}