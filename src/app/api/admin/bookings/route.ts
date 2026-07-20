import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { sendBookingEmails } from "@/lib/email";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookings = await prisma.booking.findMany({
    include: { property: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    bookings: bookings.map((b) => ({
      id: b.id,
      code: b.code,
      status: b.status,
      guestName: b.guestName,
      guestEmail: b.guestEmail,
      guestPhone: b.guestPhone,
      checkIn: b.checkIn.toISOString().slice(0, 10),
      checkOut: b.checkOut.toISOString().slice(0, 10),
      guests: b.guests,
      nights: b.nights,
      total: b.total,
      propertyTitle: b.property.title,
      propertyId: b.propertyId,
      createdAt: b.createdAt.toISOString(),
    })),
  });
}

const patchSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["pending", "paid", "cancelled", "failed"]),
});

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = patchSchema.parse(await request.json());
    const updated = await prisma.booking.update({
      where: { id: body.id },
      data: { status: body.status },
      include: { property: true },
    });

    if (body.status === "paid") {
      await sendBookingEmails({
        code: updated.code,
        guestName: updated.guestName,
        guestEmail: updated.guestEmail,
        guestPhone: updated.guestPhone,
        propertyTitle: updated.property.title,
        propertyAddress: updated.property.address,
        checkInNotes: updated.property.checkInNotes,
        checkIn: updated.checkIn.toISOString().slice(0, 10),
        checkOut: updated.checkOut.toISOString().slice(0, 10),
        guests: updated.guests,
        nights: updated.nights,
        total: updated.total,
        status: "confirmed & paid",
      });
    }

    return NextResponse.json({ ok: true, status: updated.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update booking";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
