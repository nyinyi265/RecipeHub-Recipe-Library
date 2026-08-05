import type { Provider } from "next-auth/providers/index";
import Google from "next-auth/providers/google";

/**
 * Configured authentication providers.
 * - Google: OAuth2 provider for social login.
 * - Credentials: Placeholder for email/password login (not yet implemented).
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
  {
    id: "credentials",
    name: "Credentials",
    type: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize() {
      // TODO: Implement credentials login
      return null;
    },
  },
];
