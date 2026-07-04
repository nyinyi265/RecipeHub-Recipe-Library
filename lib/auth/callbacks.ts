import type { CallbacksOptions } from "next-auth";

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
   */
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
    }
    return token;
  },

  /**
   * Augments the session object with JWT data.
   */
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
    }
    return session;
  },

  /**
   * Controls redirect behavior after sign in / sign out.
   */
  async redirect({ url, baseUrl }) {
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    if (new URL(url).origin === baseUrl) return url;
    return baseUrl;
  },
};
