import { redirect } from "next/navigation";

import { requireUser } from "@/lib/db";

export default async function NewNotePage() {
  const { supabase, user } = await requireUser();

  const { data, error } = await supabase
    .from("notes")
    .insert({ user_id: user.id, title: "Untitled note", content: "", plain_text: "" })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/notes?error=${encodeURIComponent(error?.message ?? "Could not create note")}`);
  }

  redirect(`/notes/${data.id}`);
}