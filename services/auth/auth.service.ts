import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import type { User } from "@/app/generated/prisma/client";

/**
 * Service layer for authentication operations.
 * Keeps business logic out of pages and components.
 */
export const AuthService = {
  /**
   * Retrieves the current session from the server.
   * @returns The current NextAuth session, or null if not authenticated.
   */
  async getSession() {
    return getServerSession(authConfig);
  },

  /**
   * Retrieves the currently authenticated user's session data.
   * @returns The user object from the session, or null.
   */
  async getCurrentUser() {
    const session = await this.getSession();
    return session?.user ?? null;
  },

  /**
   * Retrieves the full user profile from the database.
   * @returns A partial Prisma User record or null if not found.
   */
  async getCurrentUserProfile(): Promise<Partial<User> | null> {
    const session = await this.getSession();
    if (!session?.user?.email) return null;

    return prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        gender: true,
        country: true,
        createdAt: true,
      },
    });
  },

  /**
   * Signs in with Google OAuth.
   * Redirects to Google consent screen.
   */
  async signInWithGoogle() {
    const { signIn } = await import("next-auth/react");
    await signIn(
      "google",
      { callbackUrl: "/dashboard" },
      { prompt: "select_account" },
    );
  },

  /**
   * Signs in with email and password.
   * @remarks Not yet implemented. Credentials provider is a placeholder.
   */
  async signInWithCredentials(_email: string, _password: string) {
    throw new Error("Credentials login is not implemented yet.");
  },

  /**
   * Signs the current user out and redirects to home.
   */
  async signOutUser() {
    const { signOut } = await import("next-auth/react");
    await signOut({ callbackUrl: "/" });
  },
};
