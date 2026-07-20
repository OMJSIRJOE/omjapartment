import { NextResponse } from "next/server";
import { z } from "zod";
import { assertDatesAvailable } from "@/lib/availability";
import { calculateBooking, generateReservationCode, parseDateOnly } from "@/lib/booking";
import { siteConfig } from "@/lib/config";
import { prisma } from "@/lib/db";
import { mapDbProperty } from "@/lib/property-mapper";
import { initializePaystackPayment, isPaystackConfigured, toPaystackAmountKobo } from "@/lib/paystack";

const schema = z.object({
  propertyId: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  guests: z.number().int().min(1),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(7),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const propertyRow = await prisma.property.findFirst({
      where: { id: body.propertyId, active: true },
    });

    if (!propertyRow) {
      return NextResponse.json({ error: "Shortlet not found" }, { status: 404 });
    }

    const property = mapDbProperty(propertyRow);
    if (body.guests > property.maxGuests) {
      return NextResponse.json(
        { error: `Maximum ${property.maxGuests} guests allowed` },
        { status: 400 }
      );
    }

    const quote = calculateBooking(property, body.checkIn, body.checkOut, body.guests);
    if (!quote || quote.nights < property.minNights) {
      return NextResponse.json(
        { error: `Minimum stay is ${property.minNights} night(s)` },
        { status: 400 }
      );
    }

    await assertDatesAvailable(property.id, body.checkIn, body.checkOut);

    const checkInDate = parseDateOnly(body.checkIn);
    const checkOutDate = parseDateOnly(body.checkOut);
    if (!checkInDate || !checkOutDate) {
      return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
    }

    const code = generateReservationCode();
    const paystackRef = `OMJ_${code.replace(/-/g, "")}_${Date.now()}`;

    const booking = await prisma.booking.create({
      data: {
        code,
        propertyId: property.id,
        guestName: body.guestName.trim(),
        guestEmail: body.guestEmail.trim().toLowerCase(),
        guestPhone: body.guestPhone.trim(),
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: body.guests,
        nights: quote.nights,
        subtotal: quote.subtotal,
        cleaningFee: quote.cleaningFee,
        total: quote.total,
        currency: "NGN",
        status: "pending",
        paystackRef,
      },
    });

    if (!isPaystackConfigured()) {
      return NextResponse.json({
        booking: {
          id: booking.id,
          code: booking.code,
          status: booking.status,
          total: booking.total,
        },
        paymentRequired: false,
        message:
          "Reservation saved as pending. Add Paystack keys to enable online payment, or confirm payment in admin.",
      });
    }

    const payment = await initializePaystackPayment({
      email: booking.guestEmail,
      amountKobo: toPaystackAmountKobo(booking.total),
      reference: paystackRef,
      callbackUrl: `${siteConfig.siteUrl}/booking/success?reference=${encodeURIComponent(paystackRef)}`,
      metadata: {
        bookingCode: booking.code,
        propertySlug: property.slug,
        propertyTitle: property.title,
      },
    });

    return NextResponse.json({
      booking: {
        id: booking.id,
        code: booking.code,
        status: booking.status,
        total: booking.total,
      },
      paymentRequired: true,
      authorizationUrl: payment.authorization_url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create booking";
    const status = message.includes("already") || message.includes("blocked") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
