import { NextResponse } from "next/server";
import { confirmPaidBooking } from "@/lib/booking-payment";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");
    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    const booking = await confirmPaidBooking(reference);
    return NextResponse.json({ booking });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    const status =
      typeof error === "object" &&
      error &&
      "status" in error &&
      typeof (error as { status: unknown }).status === "number"
        ? (error as { status: number }).status
        : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
