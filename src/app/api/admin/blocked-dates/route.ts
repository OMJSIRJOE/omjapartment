import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { nightsBetween, parseDateOnly } from "@/lib/booking";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const propertyId = new URL(request.url).searchParams.get("propertyId");
  const rows = await prisma.blockedDate.findMany({
    where: propertyId ? { propertyId } : undefined,
    include: { property: { select: { title: true } } },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({
    blockedDates: rows.map((row) => ({
      id: row.id,
      propertyId: row.propertyId,
      propertyTitle: row.property.title,
      date: row.date.toISOString().slice(0, 10),
      reason: row.reason,
    })),
  });
}

const createSchema = z.object({
  propertyId: z.string().min(1),
  startDate: z.string().min(1).optional(),
  endDate: z.string().min(1).optional(),
  date: z.string().min(1).optional(),
  reason: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = createSchema.parse(await request.json());
    const startISO = body.startDate || body.date;
    const endISO = body.endDate || body.startDate || body.date;
    if (!startISO || !endISO) {
      return NextResponse.json({ error: "Date range required" }, { status: 400 });
    }

    const start = parseDateOnly(startISO);
    const end = parseDateOnly(endISO);
    if (!start || !end) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    if (end < start) {
      return NextResponse.json({ error: "End date must be on or after start date" }, { status: 400 });
    }

    // Inclusive range: nights from start through end
    const span = nightsBetween(startISO, endISO) + 1;
    if (span > 90) {
      return NextResponse.json({ error: "Block at most 90 nights at a time" }, { status: 400 });
    }

    const reason = body.reason || "Blocked by host";
    const dates: Date[] = [];
    for (let i = 0; i < span; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }

    await prisma.$transaction(
      dates.map((date) =>
        prisma.blockedDate.upsert({
          where: {
            propertyId_date: {
              propertyId: body.propertyId,
              date,
            },
          },
          update: { reason },
          create: {
            propertyId: body.propertyId,
            date,
            reason,
          },
        }),
      ),
    );

    return NextResponse.json({ ok: true, count: dates.length }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to block date";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

const deleteSchema = z.object({ id: z.string().min(1) });

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = deleteSchema.parse(await request.json());
    await prisma.blockedDate.delete({ where: { id: body.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to unblock date";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
