import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { embedValue } from "@/lib/utils";

type ResultRow = { id: string; title: string; sub?: string; href: string };
type ResultGroup = { label: string; href: string; rows: ResultRow[] };

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

export async function GET(request: NextRequest) {
  const term = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!term) {
    return NextResponse.json({ groups: [], total: 0 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const like = `%${escapeLike(term)}%`;

  const [{ data: notes }, { data: subjects }, { data: subjectsByCode }, { data: topics }, { data: questions }, { data: revisions }] =
    await Promise.all([
      supabase
        .from("notes")
        .select("id, title, updated_at")
        .eq("user_id", user.id)
        .ilike("title", like)
        .limit(8),
      supabase
        .from("subjects")
        .select("id, name, code, semester")
        .eq("user_id", user.id)
        .ilike("name", like)
        .limit(8),
      supabase
        .from("subjects")
        .select("id, name, code, semester")
        .eq("user_id", user.id)
        .ilike("code", like)
        .limit(8),
      supabase
        .from("topics")
        .select("id, name, subject:subjects(id, name)")
        .eq("user_id", user.id)
        .ilike("name", like)
        .limit(8),
      supabase
        .from("questions")
        .select("id, question, subject:subjects(name)")
        .eq("user_id", user.id)
        .ilike("question", like)
        .limit(8),
      supabase
        .from("revision_items")
        .select("id, title")
        .eq("user_id", user.id)
        .ilike("title", like)
        .limit(8),
    ]);

  const groups: ResultGroup[] = [];

  if (notes?.length) {
    groups.push({
      label: "Notes",
      href: `/notes?q=${encodeURIComponent(term)}`,
      rows: notes.map((r) => ({
        id: r.id,
        title: r.title || "Untitled note",
        href: `/notes/${r.id}`,
      })),
    });
  }
  {
    const merged = new Map<string, NonNullable<typeof subjects>[number]>();
    for (const s of [...(subjects ?? []), ...(subjectsByCode ?? [])]) merged.set(s.id, s);
    const rows = [...merged.values()];
    if (rows.length) {
      groups.push({
        label: "Subjects",
        href: `/subjects`,
        rows: rows.slice(0, 8).map((r) => ({
          id: r.id,
          title: r.name,
          sub: r.code ?? undefined,
          href: `/subjects/${r.id}`,
        })),
      });
    }
  }
  if (topics?.length) {
    groups.push({
      label: "Syllabus Topics",
      href: `/subjects`,
      rows: topics.map((r) => ({
        id: r.id,
        title: r.name,
        sub: embedValue(r.subject)?.name ?? undefined,
        href: `/subjects/${embedValue(r.subject)?.id ?? ""}`,
      })),
    });
  }
  if (questions?.length) {
    groups.push({
      label: "Questions",
      href: `/questions`,
      rows: questions.map((r) => ({
        id: r.id,
        title: r.question,
        sub: embedValue(r.subject)?.name ?? undefined,
        href: `/questions`,
      })),
    });
  }
  if (revisions?.length) {
    groups.push({
      label: "Revision Cards",
      href: `/revision`,
      rows: revisions.map((r) => ({ id: r.id, title: r.title, href: `/revision` })),
    });
  }

  const total = groups.reduce((acc, g) => acc + g.rows.length, 0);
  return NextResponse.json({ groups, total });
}