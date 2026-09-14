import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

function safeNext(path: string | null): string {
  if (path && path.startsWith("/") && !path.startsWith("//")) return path;
  return "/dashboard";
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}/sign-in?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/sign-in?error=exchange_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let target = next;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("branch")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile?.branch) target = "/setup";
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocal = process.env.NODE_ENV === "development";
  if (isLocal && forwardedHost) {
    return NextResponse.redirect(`http://${forwardedHost}${target}`);
  }
  return NextResponse.redirect(`${origin}${target}`);
}