import { prisma } from "@/lib/db";
import { nightsBetween, parseDateOnly } from "@/lib/booking";
import { expireStalePendingBookings } from "@/lib/booking-payment";

function startOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function eachNight(checkIn: string, checkOut: string): Date[] {
  const nights = nightsBetween(checkIn, checkOut);
  const start = parseDateOnly(checkIn);
  if (!start || nights <= 0) return [];

  return Array.from({ length: nights }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return startOfDay(d);
  });
}

export async function getUnavailableDates(
  propertyId: string,
  fromISO: string,
  toISO: string
): Promise<string[]> {
  await expireStalePendingBookings();

  const from = parseDateOnly(fromISO);
  const to = parseDateOnly(toISO);
  if (!from || !to) return [];

  const fromDate = startOfDay(from);
  const toDate = startOfDay(to);

  const [blocked, bookings] = await Promise.all([
    prisma.blockedDate.findMany({
      where: {
        propertyId,
        date: { gte: fromDate, lt: toDate },
      },
      select: { date: true },
    }),
    prisma.booking.findMany({
      where: {
        propertyId,
        status: { in: ["pending", "paid"] },
        checkIn: { lt: toDate },
        checkOut: { gt: fromDate },
      },
      select: { checkIn: true, checkOut: true },
    }),
  ]);

  const unavailable = new Set<string>();

  for (const row of blocked) {
    unavailable.add(row.date.toISOString().slice(0, 10));
  }

  for (const booking of bookings) {
    const cursor = new Date(booking.checkIn);
    while (cursor < booking.checkOut) {
      unavailable.add(cursor.toISOString().slice(0, 10));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  }

  return Array.from(unavailable).sort();
}

export async function assertDatesAvailable(
  propertyId: string,
  checkIn: string,
  checkOut: string,
  excludeBookingId?: string
): Promise<void> {
  await expireStalePendingBookings();

  const nights = eachNight(checkIn, checkOut);
  if (nights.length === 0) {
    throw new Error("Invalid stay dates.");
  }

  const checkInDate = nights[0];
  const checkOutDate = parseDateOnly(checkOut);
  if (!checkOutDate) throw new Error("Invalid check-out date.");

  const blocked = await prisma.blockedDate.findFirst({
    where: {
      propertyId,
      date: { in: nights },
    },
  });
  if (blocked) {
    throw new Error("Selected dates include blocked nights.");
  }

  const conflict = await prisma.booking.findFirst({
    where: {
      propertyId,
      status: { in: ["pending", "paid"] },
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      checkIn: { lt: startOfDay(checkOutDate) },
      checkOut: { gt: checkInDate },
    },
  });

  if (conflict) {
    throw new Error("Selected dates are already reserved.");
  }
}
