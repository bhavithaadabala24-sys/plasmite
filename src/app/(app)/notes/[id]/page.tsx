import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { NoteEditor } from "@/components/notes/note-editor";
import { requireUser } from "@/lib/db";
import { DeleteNoteButton } from "./delete-note-button";

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { supabase, user } = await requireUser();
  const { id } = await params;

  const [{ data: note }, { data: subjects }, { data: topics }] = await Promise.all([
    supabase
      .from("notes")
      .select(
        "id, title, content, is_pinned, is_archived, subject_id, topic_id, created_at, updated_at",
      )
      .eq("user_id", user.id)
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("subjects")
      .select("id, name")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase.from("topics").select("id, subject_id, name").eq("user_id", user.id),
  ]);

  if (!note) notFound();

  const subjectOptions = (subjects ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    topics: (topics ?? [])
      .filter((t) => t.subject_id === s.id)
      .map((t) => ({ id: t.id, name: t.name })),
  }));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Link
          href="/notes"
          className="inline-flex w-fit items-center gap-1.5 font-display text-label-sm text-secondary transition-colors hover:text-on-surface"
        >
          <ArrowLeft className="size-4" />
          Notes Library
        </Link>
        <DeleteNoteButton noteId={note.id} />
      </div>

      <NoteEditor
        noteId={note.id}
        initialTitle={note.title ?? ""}
        initialContent={note.content ?? ""}
        initialSubjectId={note.subject_id}
        initialTopicId={note.topic_id}
        initialPinned={note.is_pinned ?? false}
        initialArchived={note.is_archived ?? false}
        subjects={subjectOptions}
      />
    </div>
  );
}