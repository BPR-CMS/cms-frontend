import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthenticated = request.cookies.get("token") !== undefined;

  // Allow the requests for the sign-in page or static files
  if (
    pathname.startsWith("/_next") ||
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // If not authenticated, redirect to the sign-in page
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}
