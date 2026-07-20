import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/db";
import { sendBookingEmails } from "@/lib/email";
import { toPaystackAmountKobo, verifyPaystackPayment } from "@/lib/paystack";

const PENDING_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

export type BookingSummary = {
  code: string;
  status: string;
  total: number;
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInNotes: string;
  address: string;
};

function toSummary(booking: {
  code: string;
  status: string;
  total: number;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  property: { title: string; checkInNotes: string; address: string };
}): BookingSummary {
  return {
    code: booking.code,
    status: booking.status,
    total: booking.total,
    propertyTitle: booking.property.title,
    checkIn: booking.checkIn.toISOString().slice(0, 10),
    checkOut: booking.checkOut.toISOString().slice(0, 10),
    guests: booking.guests,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    checkInNotes: booking.property.checkInNotes,
    address: booking.property.address,
  };
}

/** Cancel abandoned pending bookings so dates unlock. */
export async function expireStalePendingBookings() {
  const cutoff = new Date(Date.now() - PENDING_TTL_MS);
  await prisma.booking.updateMany({
    where: {
      status: "pending",
      createdAt: { lt: cutoff },
    },
    data: { status: "cancelled" },
  });
}

/**
 * Verify Paystack payment for a booking reference and mark paid + email once.
 */
export async function confirmPaidBooking(reference: string): Promise<BookingSummary> {
  const booking = await prisma.booking.findUnique({
    where: { paystackRef: reference },
    include: { property: true },
  });

  if (!booking) {
    throw Object.assign(new Error("Booking not found"), { status: 404 });
  }

  if (booking.status === "paid") {
    return toSummary(booking);
  }

  const payment = await verifyPaystackPayment(reference);
  if (payment.status !== "success") {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "failed" },
    });
    throw Object.assign(new Error("Payment was not successful"), { status: 402 });
  }

  const expectedKobo = toPaystackAmountKobo(booking.total);
  if (payment.amount !== expectedKobo) {
    throw Object.assign(
      new Error(
        `Payment amount mismatch (expected ${expectedKobo} kobo, got ${payment.amount})`,
      ),
      { status: 402 },
    );
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "paid" },
    include: { property: true },
  });

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

  return toSummary(updated);
}

export function verifyPaystackWebhookSignature(rawBody: string, signature: string | null) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;
  const hash = createHmac("sha512", secret).update(rawBody).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
  } catch {
    return false;
  }
}
