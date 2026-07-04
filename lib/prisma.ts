/**
 * Prisma schema uses a custom output path (app/generated/prisma/).
 * We import from the generated path directly instead of @prisma/client,
 * which would try to resolve the default .prisma/client/ location.
 *
 * Prisma v7 requires a driver adapter for database connectivity.
 * Neon adapter is used here since the database is hosted on Neon.
 */
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Singleton Prisma Client to prevent multiple instances during development.
 * In production, a single instance is created.
 * In development, the client is cached on globalThis to survive hot reloads.
 */
export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
