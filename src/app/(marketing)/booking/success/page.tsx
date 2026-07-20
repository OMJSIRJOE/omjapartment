"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { formatMoney } from "@/data/properties";
import { buildWhatsAppUrl } from "@/lib/utils";

type BookingResult = {
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
  checkInNotes?: string;
  address?: string;
};

function SuccessContent() {
  const params = useSearchParams();
  const reference = params.get("reference") || "";
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reference) {
      setError("Missing payment reference.");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/bookings/verify?reference=${encodeURIComponent(reference)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed");
        setBooking(data.booking);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Verification failed");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [reference]);

  if (loading) {
    return (
      <section className="section-pad bg-mist">
        <div className="mx-auto max-w-xl px-5 text-center">
          <p className="font-display text-3xl text-navy">Confirming your payment...</p>
        </div>
      </section>
    );
  }

  if (error || !booking) {
    return (
      <section className="section-pad bg-mist">
        <div className="mx-auto max-w-xl border border-navy/10 bg-white px-6 py-10 text-center">
          <h1 className="font-display text-3xl text-navy">Payment issue</h1>
          <p className="mt-3 text-sm text-navy/65">{error || "Unable to confirm booking."}</p>
          <Link href="/listings" className="btn-gold mt-8 text-xs tracking-[0.16em] uppercase">
            Back to shortlets
          </Link>
        </div>
      </section>
    );
  }

  const whatsappMessage = [
    `Hello OMJ Apartment, my payment is confirmed.`,
    `Reservation: ${booking.code}`,
    `Property: ${booking.propertyTitle}`,
    `Check-in: ${booking.checkIn}`,
    `Check-out: ${booking.checkOut}`,
    `Guests: ${booking.guests}`,
    `Total: ${formatMoney(booking.total)}`,
  ].join("\n");

  return (
    <section className="section-pad bg-mist">
      <div className="mx-auto max-w-xl border border-gold/40 bg-white px-6 py-10 md:px-10">
        <p className="text-xs tracking-[0.18em] text-gold-dark uppercase">Payment successful</p>
        <h1 className="mt-2 font-display text-4xl text-navy">You&apos;re booked</h1>
        <p className="mt-3 text-sm text-navy/65">
          Confirmation <span className="font-medium text-navy">{booking.code}</span> for{" "}
          {booking.propertyTitle}.
        </p>
        <dl className="mt-8 space-y-3 text-sm text-navy/75">
          <div className="flex justify-between gap-4">
            <dt>Check-in</dt>
            <dd>{booking.checkIn}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Check-out</dt>
            <dd>{booking.checkOut}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Guests</dt>
            <dd>{booking.guests}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-navy/10 pt-3 font-medium text-navy">
            <dt>Total paid</dt>
            <dd>{formatMoney(booking.total)}</dd>
          </div>
        </dl>
        {(booking.address || booking.checkInNotes) && (
          <div className="mt-6 border border-gold/30 bg-mist px-4 py-4 text-sm text-navy/80">
            <p className="text-xs tracking-[0.16em] text-gold-dark uppercase">Arrival details</p>
            {booking.address && (
              <p className="mt-2">
                <span className="font-medium text-navy">Address:</span> {booking.address}
              </p>
            )}
            {booking.checkInNotes && (
              <p className="mt-2 whitespace-pre-wrap">{booking.checkInNotes}</p>
            )}
            <p className="mt-3 text-xs text-navy/55">
              The same instructions are in your confirmation email.
            </p>
          </div>
        )}
        <div className="mt-8 flex flex-col gap-3">
          <a
            href={buildWhatsAppUrl(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#25D366] px-6 py-3 text-xs font-medium tracking-[0.16em] text-white uppercase"
          >
            Message host on WhatsApp
          </a>
          <Link href="/listings" className="btn-outline-navy text-center text-xs tracking-[0.16em] uppercase">
            Browse more shortlets
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <section className="section-pad bg-mist">
          <div className="mx-auto max-w-xl px-5 text-center">
            <p className="font-display text-3xl text-navy">Loading...</p>
          </div>
        </section>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
