import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

/**
 * Retrieves the current server-side session.
 *
 * @returns The current session object, or null if not authenticated.
 */
export async function getCurrentSession() {
  return auth();
}

/**
 * Retrieves the currently authenticated user from the session.
 *
 * @returns The user object from the session, or null if not authenticated.
 */
export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

/**
 * Ensures the user is authenticated.
 * Redirects to /login if not authenticated.
 * Use in Server Components or Route Handlers to guard access.
 *
 * @returns The current session if authenticated.
 */
export async function requireAuth() {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}
