import { NextResponse } from "next/server";
import { addDaysISO, todayISO } from "@/lib/booking";
import { getUnavailableDates } from "@/lib/availability";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    if (!propertyId) {
      return NextResponse.json({ error: "propertyId is required" }, { status: 400 });
    }

    const from = searchParams.get("from") || todayISO();
    const to = searchParams.get("to") || addDaysISO(90, from);
    const unavailable = await getUnavailableDates(propertyId, from, to);

    return NextResponse.json({ unavailable });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load availability";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
