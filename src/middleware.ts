import { decryptSession } from "@/lib/session";
import { type NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/home", "/admin", "/places", "/profile"];
const AUTH_ROUTES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Extract custom session cookie
  const cookie = request.cookies.get("session")?.value;
  
  // decryptSession is secure and fully compatible with Edge middleware
  const session = cookie ? await decryptSession(cookie) : null;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => path.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => path.startsWith(route));

  // 1. Guard Protection: Redirect unauthenticated user to login screen
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", request.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Auth Restriction: Redirect authenticated users away from Login / Register
  if (isAuthRoute && session) {
    const redirectUrl = new URL("/home", request.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// Optimize middleware execution on pages only
export const config = {
  matcher: [
    "/home/:path*",
    "/admin/:path*",
    "/places/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
