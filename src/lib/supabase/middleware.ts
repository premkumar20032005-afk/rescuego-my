import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "../env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refreshing the auth token
  const { data: { user } } = await supabase.auth.getUser();

  // Protect routes
  const protectedPaths = ['/dashboard', '/request', '/profile', '/provider', '/admin'];
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (isProtectedPath && !user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is logged in and trying to access auth pages, redirect to dashboard
  const authPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];
  const isAuthPath = authPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (isAuthPath && user) {
    const redirectPath = request.nextUrl.searchParams.get('redirect') || '/dashboard';
    // Validate redirect path to prevent open redirect
    const safeRedirect = redirectPath.startsWith('/') ? redirectPath : '/dashboard';
    return NextResponse.redirect(new URL(safeRedirect, request.url));
  }

  return supabaseResponse;
}
