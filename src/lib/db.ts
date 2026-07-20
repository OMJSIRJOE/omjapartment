import { PrismaNeonHTTP } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function clean(value: string) {
  // Strip BOM / accidental newlines from env-sync tools (common PowerShell pipe issue)
  return value.replace(/^\uFEFF/, "").trim();
}

function resolveConnectionString() {
  // Prefer discrete Neon vars — more reliable than a full URL that can get mangled in env sync
  const user = clean(process.env.PGUSER || process.env.POSTGRES_USER || "neondb_owner");
  const passwordRaw = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD;
  const hostRaw = process.env.PGHOST || process.env.POSTGRES_HOST;
  const database = clean(process.env.PGDATABASE || process.env.POSTGRES_DATABASE || "neondb");

  if (passwordRaw && hostRaw) {
    const password = clean(passwordRaw);
    const host = clean(hostRaw);
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/${database}?sslmode=require`;
  }

  const urlRaw = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
  if (!urlRaw) {
    throw new Error("DATABASE_URL (or PGHOST/PGPASSWORD) is not set");
  }

  // channel_binding breaks some serverless drivers
  return clean(urlRaw).replace(/([?&])channel_binding=[^&]*&?/g, "$1").replace(/[?&]$/, "");
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
