import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Supabase not configured — pass requests through untouched.
    return { supabaseResponse, user: null };
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Fast, cookie-only session check (no network round-trip).
  // The JWT is still validated server-side on every app page via
  // requireUser() -> getUser(), and RLS scopes every query by user_id.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;

  const pathname = request.nextUrl.pathname;

  // Protected app routes — signed-out visitors are sent to sign-in.
  const protectedRoutes = [
    "/dashboard",
    "/notes",
    "/subjects",
    "/labs",
    "/projects",
    "/questions",
    "/revision",
    "/viva",
    "/ideas",
    "/bugs",
    "/tools",
    "/settings",
    "/profile",
    "/search",
    "/setup",
  ];
  const isProtected = protectedRoutes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (!user && isProtected) {
    return {
      supabaseResponse: NextResponse.redirect(new URL("/sign-in", request.url)),
      user: null,
    };
  }

  // Signed-in users skip the public auth pages.
  const authRoutes = ["/sign-in", "/sign-up"];
  const isAuthRoute = authRoutes.some((p) => pathname.startsWith(p));
  if (user && isAuthRoute) {
    return {
      supabaseResponse: NextResponse.redirect(new URL("/dashboard", request.url)),
      user,
    };
  }

  return { supabaseResponse, user };
}