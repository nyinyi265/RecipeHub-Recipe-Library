import { withAuth } from "next-auth/middleware";

/**
 * Next.js middleware that protects specified routes.
 * Unauthenticated users are redirected to /login.
 */
export default withAuth({
  callbacks: {
    authorized({ token }) {
      return !!token;
    },
  },
});

/**
 * Routes that require authentication.
 * All sub-paths under these routes are also protected.
 */
export const config = {
  matcher: ["/profile/:path*", "/settings/:path*"],
};
