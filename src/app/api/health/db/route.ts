import { createHash } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fingerprint(value: string | undefined) {
  if (!value) return null;
  return {
    length: value.length,
    sha12: createHash("sha256").update(value).digest("hex").slice(0, 12),
    hasWhitespace: /\s/.test(value),
    hasBom: value.charCodeAt(0) === 0xfeff,
  };
}

export async function GET() {
  // Temporary production diagnostic — remove after DB auth is fixed
  const password = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD;
  const host = process.env.PGHOST || process.env.POSTGRES_HOST;
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;

  let urlPasswordFp = null;
  if (databaseUrl) {
    try {
      const u = new URL(databaseUrl);
      urlPasswordFp = fingerprint(decodeURIComponent(u.password));
    } catch {
      urlPasswordFp = { parseError: true };
    }
  }

  let connect: { ok: boolean; error?: string } = { ok: false };
  try {
    const { prisma } = await import("@/lib/db");
    const count = await prisma.property.count();
    connect = { ok: true, error: `count=${count}` };
  } catch (e) {
    connect = { ok: false, error: e instanceof Error ? e.message.slice(0, 160) : "unknown" };
  }

  return NextResponse.json({
    hasPgPassword: Boolean(password),
    hasPgHost: Boolean(host),
    hasDatabaseUrl: Boolean(databaseUrl),
    pgPassword: fingerprint(password),
    databaseUrlPassword: urlPasswordFp,
    pgHostSuffix: host ? host.slice(-24) : null,
    connect,
  });
}
