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
   * On every fresh sign-in (`user` is set), overwrite identity fields so a
   * different Google account cannot leave a previous user's name/email in the JWT.
   */
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.name = user.name;
      token.email = user.email;
      token.picture = user.image;
    }
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
