import { BookingDetails, Property } from "@/types/property";

export function parseDateOnly(value: string): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const start = parseDateOnly(checkIn);
  const end = parseDateOnly(checkOut);
  if (!start || !end) return 0;
  const diff = end.getTime() - start.getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export function calculateBooking(
  property: Property,
  checkIn: string,
  checkOut: string,
  guests: number
): BookingDetails | null {
  const nights = nightsBetween(checkIn, checkOut);
  if (nights <= 0) return null;

  const subtotal = nights * property.pricePerNight;
  const cleaningFee = property.cleaningFee;
  return {
    checkIn,
    checkOut,
    guests,
    nights,
    subtotal,
    cleaningFee,
    total: subtotal + cleaningFee,
  };
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(days: number, from = todayISO()): string {
  const date = parseDateOnly(from) ?? new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function generateReservationCode(): string {
  return `OMJ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
