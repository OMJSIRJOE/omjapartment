import { NextResponse } from "next/server";
import {
  confirmPaidBooking,
  verifyPaystackWebhookSignature,
} from "@/lib/booking-payment";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!verifyPaystackWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: { reference?: string; status?: string };
    };

    if (event.event === "charge.success" && event.data?.reference) {
      await confirmPaidBooking(event.data.reference);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed";
    // Acknowledge non-fatal so Paystack does not retry forever for unknown refs
    if (message === "Booking not found") {
      return NextResponse.json({ received: true, ignored: true });
    }
    console.error("Paystack webhook error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
