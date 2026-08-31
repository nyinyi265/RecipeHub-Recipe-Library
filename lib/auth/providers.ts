import type { Provider } from "next-auth/providers/index";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";

/**
 * Configured authentication providers.
 * - Google: OAuth2 provider for social login.
 * - Credentials: Email/password login for registered users.
 */
export const providers: Provider[] = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    authorization: {
      params: {
        // Force the Google account picker so SSO does not silently
        // reuse the browser's previously authorized Google identity.
        prompt: "select_account",
      },
    },
  }),
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.trim().toLowerCase();
      const password = credentials?.password;

      if (!email || !password) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user?.password) {
        return null;
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      };
    },
  }),
];
