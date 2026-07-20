"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { formatMoney, formatNightlyRate } from "@/data/properties";
import { addDaysISO, calculateBooking, todayISO } from "@/lib/booking";
import { buildWhatsAppUrl } from "@/lib/utils";
import { Property } from "@/types/property";

interface BookingWidgetProps {
  property: Property;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

export default function BookingWidget({
  property,
  initialCheckIn = "",
  initialCheckOut = "",
  initialGuests = 1,
}: BookingWidgetProps) {
  const minCheckIn = todayISO();
  const [checkIn, setCheckIn] = useState(initialCheckIn || minCheckIn);
  const [checkOut, setCheckOut] = useState(
    initialCheckOut || addDaysISO(property.minNights, initialCheckIn || minCheckIn)
  );
  const [guests, setGuests] = useState(
    Math.min(Math.max(initialGuests, 1), property.maxGuests)
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState<{
    code: string;
    total: number;
    status: string;
  } | null>(null);

  const booking = useMemo(
    () => calculateBooking(property, checkIn, checkOut, guests),
    [property, checkIn, checkOut, guests]
  );

  useEffect(() => {
    let active = true;
    const load = async () => {
      const res = await fetch(
        `/api/availability?propertyId=${encodeURIComponent(property.id)}&from=${minCheckIn}&to=${addDaysISO(120, minCheckIn)}`
      );
      if (!res.ok) return;
      const data = await res.json();
      if (active) setUnavailable(data.unavailable || []);
    };
    load();
    return () => {
      active = false;
    };
  }, [property.id, minCheckIn]);

  const onCheckInChange = (value: string) => {
    setCheckIn(value);
    const minOut = addDaysISO(property.minNights, value);
    if (!checkOut || checkOut <= value || checkOut < minOut) {
      setCheckOut(minOut);
    }
  };

  const onReserve = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!booking) throw new Error("Please select valid check-in and check-out dates.");
      if (booking.nights < property.minNights) {
        throw new Error(
          `Minimum stay is ${property.minNights} night${property.minNights > 1 ? "s" : ""}.`
        );
      }

      const nights = Array.from({ length: booking.nights }, (_, i) =>
        addDaysISO(i, checkIn)
      );
      if (nights.some((d) => unavailable.includes(d))) {
        throw new Error("Selected dates include unavailable nights. Please choose other dates.");
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          checkIn,
          checkOut,
          guests,
          guestName: name,
          guestEmail: email,
          guestPhone: phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to reserve");

      if (data.paymentRequired && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }

      setConfirmed({
        code: data.booking.code,
        total: data.booking.total,
        status: data.booking.status,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reserve");
    } finally {
      setLoading(false);
    }
  };

  if (confirmed && booking) {
    const whatsappMessage = [
      `Hello OMJ Apartment, I reserved ${property.title}.`,
      `Reservation: ${confirmed.code}`,
      `Check-in: ${booking.checkIn}`,
      `Check-out: ${booking.checkOut}`,
      `Guests: ${booking.guests}`,
      `Total: ${formatMoney(confirmed.total)}`,
      `Guest: ${name} (${email}, ${phone})`,
      `Status: ${confirmed.status}`,
    ].join("\n");

    return (
      <div className="border border-gold/40 bg-mist p-6 md:p-8">
        <p className="text-xs tracking-[0.18em] text-gold-dark uppercase">Reservation saved</p>
        <h2 className="mt-2 font-display text-2xl text-navy">You&apos;re almost set</h2>
        <p className="mt-3 text-sm text-navy/65">
          Booking <span className="font-medium text-navy">{confirmed.code}</span> is saved
          {confirmed.status === "pending"
            ? " as pending. Complete payment with the host or enable Paystack for instant checkout."
            : "."}
        </p>
        <dl className="mt-6 space-y-3 text-sm text-navy/75">
          <div className="flex justify-between gap-4">
            <dt>Check-in</dt>
            <dd>{booking.checkIn}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Check-out</dt>
            <dd>{booking.checkOut}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-navy/10 pt-3 font-medium text-navy">
            <dt>Total</dt>
            <dd>{formatMoney(confirmed.total)}</dd>
          </div>
        </dl>
        <a
          href={buildWhatsAppUrl(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#25D366] px-6 py-3 text-xs font-medium tracking-[0.16em] text-white uppercase transition-opacity hover:opacity-90"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Confirm on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onReserve}
      className="border border-navy/10 bg-white p-6 shadow-[0_16px_50px_rgba(10,10,10,0.08)] md:p-8"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-3xl text-navy">
            {formatMoney(property.pricePerNight)}
            <span className="ml-1 text-base text-navy/50">/ night</span>
          </p>
          <p className="mt-1 text-xs tracking-[0.14em] text-navy/45 uppercase">
            {property.rating.toFixed(2)} · {property.reviewCount} reviews
          </p>
        </div>
        <span className="bg-gold px-3 py-1 text-[10px] font-medium tracking-[0.18em] text-navy uppercase">
          Shortlet
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Check-in
          </span>
          <input
            type="date"
            required
            min={minCheckIn}
            value={checkIn}
            onChange={(e) => onCheckInChange(e.target.value)}
            className="field"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Check-out
          </span>
          <input
            type="date"
            required
            min={addDaysISO(property.minNights, checkIn || minCheckIn)}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="field"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Guests
          </span>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="field"
          >
            {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} guest{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      {unavailable.length > 0 && (
        <p className="mt-3 text-xs text-navy/50">
          Some upcoming nights are unavailable. If your dates conflict, choose another stay window.
        </p>
      )}

      <div className="mt-5 grid gap-3">
        <label className="block">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Full name
          </span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field"
            placeholder="Guest name"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Phone / WhatsApp
          </span>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="field"
            placeholder="+234 ..."
          />
        </label>
      </div>

      {booking && (
        <div className="mt-6 space-y-2 border-t border-navy/10 pt-5 text-sm text-navy/70">
          <div className="flex justify-between gap-4">
            <span>
              {formatNightlyRate(property.pricePerNight).replace(" / night", "")} ×{" "}
              {booking.nights} night{booking.nights > 1 ? "s" : ""}
            </span>
            <span>{formatMoney(booking.subtotal)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Caution fee (refundable)</span>
            <span>{formatMoney(booking.cleaningFee)}</span>
          </div>
          <div className="flex justify-between gap-4 border-t border-navy/10 pt-3 text-base font-medium text-navy">
            <span>Total</span>
            <span>{formatMoney(booking.total)}</span>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn-gold mt-6 w-full text-xs tracking-[0.18em] uppercase disabled:opacity-60"
      >
        {loading ? "Processing..." : "Reserve & pay"}
      </button>
      <p className="mt-3 text-center text-xs text-navy/45">
        Min {property.minNights} night{property.minNights > 1 ? "s" : ""} · Up to{" "}
        {property.maxGuests} guests
      </p>
    </form>
  );
}
