import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";

import { prisma } from "@/lib/prisma";
import { providers } from "@/lib/auth/providers";
import { callbacks } from "@/lib/auth/callbacks";
import { pages } from "@/lib/auth/pages";

/**
 * NextAuth.js core configuration.
 *
 * Uses:
 * - PrismaAdapter for database-backed users, accounts, and sessions.
 * - JWT session strategy (no database sessions).
 * - Google OAuth provider with a Credentials placeholder.
 * - Custom pages for sign-in, error, etc.
 * - Placeholder callback and event hooks.
 */
export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages,
  providers,
  callbacks,
  events: {
    /**
     * Logged when a user signs in successfully.
     */
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`);
    },
    /**
     * Logged when a user signs out.
     */
    async signOut({ session }) {
      console.log(`User signed out: ${session?.user?.email ?? "unknown"}`);
    },
  },
  debug: process.env.NODE_ENV === "development",
};
