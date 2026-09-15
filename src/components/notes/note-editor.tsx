"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  Bold,
  Check,
  Code,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pin,
  RotateCcw,
  Save,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const EDITOR_ID = "note-body";

const TOOLBAR: { icon: typeof Bold; label: string; prefix: string; suffix: string; placeholder: string }[] = [
  { icon: Bold, label: "Bold", prefix: "**", suffix: "**", placeholder: "bold text" },
  { icon: Italic, label: "Italic", prefix: "_", suffix: "_", placeholder: "italic text" },
  { icon: Code, label: "Inline code", prefix: "`", suffix: "`", placeholder: "code" },
  { icon: Heading2, label: "Heading", prefix: "## ", suffix: "", placeholder: "Heading" },
  { icon: Link2, label: "Link", prefix: "[", suffix: "](https://)", placeholder: "link text" },
  { icon: List, label: "Bullet list", prefix: "\n- ", suffix: "", placeholder: "list item" },
  { icon: ListOrdered, label: "Numbered list", prefix: "\n1. ", suffix: "", placeholder: "list item" },
];

export type EditorSubject = { id: string; name: string; topics: { id: string; name: string }[] };

type SaveState = "saved" | "saving" | "error";

function stripMarkdown(md: string) {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/(\*\*|__|`|\*|_)/g, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/[|]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 500);
}

export function NoteEditor({
  noteId,
  initialTitle,
  initialContent,
  initialSubjectId,
  initialTopicId,
  initialPinned,
  initialArchived,
  subjects,
}: {
  noteId: string;
  initialTitle: string;
  initialContent: string;
  initialSubjectId: string | null;
  initialTopicId: string | null;
  initialPinned: boolean;
  initialArchived: boolean;
  subjects: EditorSubject[];
}) {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [subjectId, setSubjectId] = useState(initialSubjectId ?? "");
  const [topicId, setTopicId] = useState(initialTopicId ?? "");
  const [pinned, setPinned] = useState(initialPinned);
  const [archived, setArchived] = useState(initialArchived);
  const [saveState, setSaveState] = useState<SaveState>("saved");

  const latestRef = useRef({ title, content });

useEffect(() => {
    document.title = `${title || "Untitled"} · Folio`;
  }, [title]);

  const selectedSubject = subjects.find((s) => s.id === subjectId);

  const persist = useCallback(
    async (patch: { title: string; content: string }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("notes")
        .update({
          title: patch.title,
          content: patch.content,
          plain_text: stripMarkdown(patch.content),
        })
        .eq("id", noteId);
      setSaveState(error ? "error" : "saved");
    },
    [noteId],
  );

  const onDraftChange = useCallback(
    (nextTitle: string, nextContent: string) => {
      setTitle(nextTitle);
      setContent(nextContent);
      setSaveState("saving");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => persist({ title: nextTitle, content: nextContent }), 700);
    },
    [persist],
  );

  useEffect(() => {
    document.title = `${title || "Untitled"} · Folio`;
  }, [title]);

  useEffect(() => {
    const last = latestRef.current;
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        void persist({ title: last.title, content: last.content });
      }
    };
  }, [persist]);

  async function updateMeta(
    patch: { is_pinned?: boolean; is_archived?: boolean; subject_id?: string | null; topic_id?: string | null },
  ) {
    const supabase = createClient();
    await supabase.from("notes").update(patch).eq("id", noteId);
    if (patch.is_pinned !== undefined) setPinned(patch.is_pinned);
    if (patch.is_archived !== undefined) setArchived(patch.is_archived);
    router.refresh();
  }

  function wrapSelection(prefix: string, suffix = prefix, placeholder = "") {
    const ta = document.getElementById(EDITOR_ID) as HTMLTextAreaElement | null;
    if (!ta) return;
    const { selectionStart: start, selectionEnd: end, value } = ta;
    const selected = value.slice(start, end) || placeholder;
    const replacement = `${prefix}${selected}${suffix}`;
    const next = `${value.slice(0, start)}${replacement}${value.slice(end)}`;
    onDraftChange(title, next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    });
  }

  const editorField =
    "w-full bg-transparent font-body text-on-surface placeholder:text-secondary/40 focus:outline-none";

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
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
                <Check className="size-3.5" />
                Saved
              </>
            ) : saveState === "saving" ? (
              <>
                <Save className="size-3.5 animate-pulse" />
                Saving…
              </>
            ) : (
              <>
                <RotateCcw className="size-3.5" />
                Changes not saved
              </>
            )}
          </span>
          {archived ? (
            <span className="inline-flex items-center rounded-full bg-surface-container px-3 py-1 font-display text-code-sm text-on-surface-variant">
              <Archive className="mr-1.5 size-3.5" />
              Archived
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateMeta({ is_pinned: !pinned })}
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 font-label-md transition-colors ${
              pinned
                ? "border-primary bg-primary text-on-primary"
                : "border-border bg-surface-container-lowest text-on-surface hover:bg-surface"
            }`}
          >
            <Pin className="size-4" />
            {pinned ? "Pinned" : "Pin"}
          </button>
          <button
            type="button"
            onClick={() => updateMeta({ is_archived: !archived })}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface-container-lowest px-3 font-label-md text-on-surface transition-colors hover:bg-surface"
          >
            <Archive className="size-4" />
            {archived ? "Unarchive" : "Archive"}
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="note-subject" className="font-display text-label-sm text-secondary">
            Subject
          </label>
          <select
            id="note-subject"
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
              setTopicId("");
              updateMeta({ subject_id: e.target.value || null, topic_id: null });
            }}
            className="h-9 w-full min-w-44 cursor-pointer rounded-lg border border-border bg-surface-container-lowest px-3 font-body text-body-sm text-on-surface shadow-sm focus:border-2 focus:border-ring focus:outline-none"
          >
            <option value="">General</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        {selectedSubject ? (
          <div className="flex flex-col gap-1">
            <label htmlFor="note-topic" className="font-display text-label-sm text-secondary">
              Topic
            </label>
            <select
              id="note-topic"
              value={topicId}
              onChange={(e) => updateMeta({ topic_id: e.target.value || null })}
              className="h-9 w-full min-w-44 cursor-pointer rounded-lg border border-border bg-surface-container-lowest px-3 font-body text-body-sm text-on-surface shadow-sm focus:border-2 focus:border-ring focus:outline-none"
            >
              <option value="">No topic</option>
              {selectedSubject.topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-surface-variant bg-surface-container-lowest shadow-card">
        <input
          type="text"
          value={title}
          onChange={(e) => onDraftChange(e.target.value, content)}
          placeholder="Note title…"
          className="h-16 w-full rounded-t-xl bg-transparent px-6 pt-2 font-display text-headline-lg font-medium tracking-tight text-on-surface placeholder:text-secondary/40 focus:outline-none"
        />

        <div className="flex items-center gap-1 border-y border-surface-variant px-3 py-1.5">
          {TOOLBAR.map((b) => (
            <button
              key={b.label}
              type="button"
              title={b.label}
              aria-label={b.label}
              onClick={() => wrapSelection(b.prefix, b.suffix, b.placeholder)}
              className="inline-flex size-8 items-center justify-center rounded-md text-secondary transition-colors hover:bg-surface-container hover:text-on-surface"
            >
              <b.icon className="size-4" strokeWidth={1.75} />
            </button>
          ))}
          <span className="mx-1 font-display text-code-sm text-on-surface-variant">Markdown</span>
        </div>

        <textarea
          id={EDITOR_ID}
          value={content}
          onChange={(e) => onDraftChange(title, e.target.value)}
          placeholder={"Write your note in Markdown…\n\nYou can include proofs, formulas, and code blocks.\n\n```c\nvoid* learn(void) { int ok = 1; return ok ? (void*)0 : 0; }\n```"}
          className={`h-[60vh] w-full resize-none rounded-b-xl px-6 py-4 font-mono text-body-md leading-relaxed ${editorField}`}
          spellCheck={false}
        />
      </div>

      <p className="text-right font-display text-code-sm text-secondary">
        Autosaves every few seconds · Markdown supported
      </p>
    </div>
  );
}