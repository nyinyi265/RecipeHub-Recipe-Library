import type { PagesOptions } from "next-auth";

/**
 * Custom NextAuth.js page routes.
 * Overrides the default Auth.js pages with the application's own routes.
 */
export const pages: Partial<PagesOptions> = {
  signIn: "/login",
  signOut: "/",
  error: "/login",
  verifyRequest: "/verify-email",
  newUser: "/register",
};
