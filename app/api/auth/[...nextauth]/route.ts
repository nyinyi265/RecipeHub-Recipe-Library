import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/config";

/**
 * Auth.js API route handler (NextAuth v4).
 * Handles all authentication flow requests: sign in, callback, sign out, etc.
 */
const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
