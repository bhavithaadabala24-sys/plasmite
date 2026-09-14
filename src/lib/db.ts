import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AppUser = NonNullable<Awaited<ReturnType<typeof requireUser>>>;

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  return { supabase, user: user! };
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