import { PrismaNeonHTTP } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function resolveConnectionString() {
  // Prefer discrete Neon vars — more reliable than a full URL that can get mangled in env sync
  const user = process.env.PGUSER || process.env.POSTGRES_USER || "neondb_owner";
  const password = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD;
  const host = process.env.PGHOST || process.env.POSTGRES_HOST;
  const database = process.env.PGDATABASE || process.env.POSTGRES_DATABASE || "neondb";

  if (password && host) {
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/${database}?sslmode=require`;
  }

  const url = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error("DATABASE_URL (or PGHOST/PGPASSWORD) is not set");
  }

  // channel_binding breaks some serverless drivers
  return url.replace(/([?&])channel_binding=[^&]*&?/g, "$1").replace(/[?&]$/, "");
}

function createPrismaClient() {
  const connectionString = resolveConnectionString();
  const adapter = new PrismaNeonHTTP(connectionString, {});
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
