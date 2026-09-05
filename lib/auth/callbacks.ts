import type { CallbacksOptions } from "next-auth";

import { SESSION_MAX_AGE } from "@/lib/auth/constants";

/**
 * NextAuth.js callbacks configuration.
 * These are placeholder implementations that can be extended as needed.
 */
export const callbacks: Partial<CallbacksOptions> = {
  /**
   * Controls whether a user is allowed to sign in.
   * Currently allows all users who pass the provider's authentication.
   */
  async signIn({ user }) {
    return !!user;
  },

  /**
   * Augments the JWT token with additional user data.
   * On every fresh sign-in (`user` is set), overwrite identity fields so a
   * different Google account cannot leave a previous user's name/email in the JWT.
   */
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.name = user.name;
      token.email = user.email;
      token.picture = user.image;
      token.role = (user as { role?: string }).role;
    }

    // Sliding expiry: extend the token's expiration on every request so the
    // session dies after SESSION_MAX_AGE of inactivity.
    token.exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;

    return token;
  },

  /**
   * Augments the session object with JWT data.
   */
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture as string | null | undefined;
      session.user.role = token.role as string;
    }
    return session;
  },

  /**
   * Controls redirect behavior after sign in / sign out.
   */
  async redirect({ url, baseUrl }) {
    // Guard against a stale/self-reinforcing callback-url cookie pointing at a
    // dead /login/success path. Send the user to the dashboard instead.
    if (url.includes("/login/success")) return `${baseUrl}/`;

    // If the url is a relative path, resolve it against baseUrl but strip any
    // callbackUrl query parameter that NextAuth may have appended.
    if (url.startsWith("/")) {
      const parsed = new URL(url, baseUrl);
      parsed.searchParams.delete("callbackUrl");
      return parsed.pathname + parsed.search;
    }

    // If the url is on the same origin, allow it (also strip callbackUrl).
    try {
      const parsed = new URL(url);
      if (parsed.origin === baseUrl) {
        parsed.searchParams.delete("callbackUrl");
        return parsed.pathname + parsed.search;
      }
    } catch {
      // fall through
    }

    return baseUrl;
  },
};
