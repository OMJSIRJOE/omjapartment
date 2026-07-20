"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { addDaysISO, todayISO } from "@/lib/booking";

export default function HeroSearch({ locations = [] }: { locations?: string[] }) {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(addDaysISO(2));
  const [guests, setGuests] = useState("2");

  const onCheckInChange = (value: string) => {
    setCheckIn(value);
    if (!checkOut || checkOut <= value) {
      setCheckOut(addDaysISO(1, value));
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    const query = params.toString();
    router.push(query ? `/listings?${query}` : "/listings");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="animate-fade-up-delay-2 w-full max-w-5xl overflow-hidden border border-white/20 bg-white/95 p-3 shadow-[0_20px_60px_rgba(10,10,10,0.35)] backdrop-blur-sm md:p-4"
    >
      <div className="grid min-w-0 gap-3 md:grid-cols-[1.2fr_1fr_1fr_0.8fr_auto]">
        <label className="block min-w-0">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Location
          </span>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="field"
          >
            <option value="">Any neighborhood</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </label>

        <label className="block w-full min-w-0 overflow-hidden">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Check-in
          </span>
          <input
            type="date"
            min={todayISO()}
            value={checkIn}
            onChange={(e) => onCheckInChange(e.target.value)}
            className="field"
          />
        </label>

        <label className="block w-full min-w-0 overflow-hidden">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Check-out
          </span>
          <input
            type="date"
            min={addDaysISO(1, checkIn || todayISO())}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="field"
          />
        </label>

        <label className="block min-w-0">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Guests
          </span>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="field"
          >
            {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
              <option key={n} value={String(n)}>
                {n}+
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            className="btn-gold w-full px-8 py-3 text-xs tracking-[0.18em] uppercase md:min-w-[140px]"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
