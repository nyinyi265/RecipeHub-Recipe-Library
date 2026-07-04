import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth/config";

/**
 * Retrieves the current server-side session.
 * Must be called in a Server Component or Route Handler.
 *
 * @returns The current session, or null if unauthenticated.
 */
export async function auth() {
  return getServerSession(authConfig);
}

/**
 * Programmatically sign in (server-side redirect).
 * For client-side sign-in, use `signIn` from `next-auth/react`.
 */
export async function signIn(provider: string, options?: Record<string, unknown>) {
  const { signIn: nextAuthSignIn } = await import("next-auth/react");
  return nextAuthSignIn(provider, options);
}

/**
 * Programmatically sign out (server-side redirect).
 * For client-side sign-out, use `signOut` from `next-auth/react`.
 */
export async function signOut(options?: Record<string, unknown>) {
  const { signOut: nextAuthSignOut } = await import("next-auth/react");
  return nextAuthSignOut(options);
}
