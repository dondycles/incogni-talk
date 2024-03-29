import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && request.nextUrl.pathname === "/log-in")
    return NextResponse.redirect(new URL("/feed", request.url));
  if (user && request.nextUrl.pathname === "/sign-up")
    return NextResponse.redirect(new URL("/feed", request.url));

  if (user && request.nextUrl.pathname === "/")
    return NextResponse.redirect(new URL("/feed", request.url));

  if (!user && request.nextUrl.pathname === "/feed")
    return NextResponse.redirect(new URL("/log-in", request.url));

  if (!user && request.nextUrl.pathname === "/user")
    return NextResponse.redirect(new URL("/log-in", request.url));

  return response;
}

export const config = {
  matcher: ["/", "/feed", "/log-in", "/sign-up", "/user"],
};
