import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// True locally (file-based SQLite always works) and on Vercel once
// TURSO_DATABASE_URL is set. False when deployed without Turso configured,
// since there's no writable filesystem for a local SQLite file there.
export const dbAvailable =
  Boolean(process.env.TURSO_DATABASE_URL) || process.env.VERCEL !== "1";

// On Vercel (and anywhere else with TURSO_DATABASE_URL set) use hosted
// Turso/libSQL, since serverless functions have a read-only filesystem and
// can't persist a local SQLite file. Locally, fall back to a plain file on
// disk so `npm run dev` works with zero extra setup.
function createAdapter() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  if (tursoUrl) {
    return new PrismaLibSql({
      url: tursoUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  });
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: createAdapter() });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
