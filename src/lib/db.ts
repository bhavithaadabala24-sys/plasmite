import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AppUser = NonNullable<Awaited<ReturnType<typeof requireUser>>>;

export async function requireUser() {
  const supabase = await createClient();
  // Read the session locally from cookies (no network round-trip on every
  // page render). The access token is still validated by PostgREST on every
  // query via RLS, so this stays secure without the latency cost of getUser().
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return { supabase, user: session.user };
}

export async function getUserProfile(userId: string) {
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, branch, year, semester, avatar_url, updated_at")
    .eq("id", userId)
    .maybeSingle();
  return data;
}