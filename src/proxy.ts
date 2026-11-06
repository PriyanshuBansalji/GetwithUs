import { NextResponse, type NextRequest } from "next/server";

// Auth.js session cookie names: plain on http://localhost, __Secure- prefixed over HTTPS.
const SESSION_COOKIES = ["authjs.session-token", "__Secure-authjs.session-token"];

/**
 * Optimistic admin gate: requests under /admin without a session cookie go to
 * the sign-in page with `next` set. The admin layout and every admin action
 * still verify the session against the database (defense in depth). Security
 * headers are set for every route in next.config.ts.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (SESSION_COOKIES.some((name) => request.cookies.has(name))) return NextResponse.next();
  const login = new URL("/admin/login", request.url);
  login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/admin/:path*"] };
