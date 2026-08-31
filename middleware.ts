import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Next.js middleware that protects specified routes.
 * Unauthenticated users are redirected to /login.
 * /admin routes are restricted to ADMIN role only.
 */
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Protect admin routes: only ADMIN role allowed
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token;
      },
    },
  },
);

/**
 * Routes that require authentication.
 * All sub-paths under these routes are also protected.
 */
export const config = {
  matcher: ["/profile/:path*", "/settings/:path*", "/recipe/:path*", "/meal-planner", "/admin/:path*"],
};
