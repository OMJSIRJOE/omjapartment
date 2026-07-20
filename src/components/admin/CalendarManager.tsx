"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type PropertyOption = { id: string; title: string };
type Blocked = {
  id: string;
  propertyId: string;
  propertyTitle: string;
  date: string;
  reason: string | null;
};

export default function CalendarManager({
  properties,
  blockedDates,
}: {
  properties: PropertyOption[];
  blockedDates: Blocked[];
}) {
  const router = useRouter();
  const [propertyId, setPropertyId] = useState(properties[0]?.id || "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("Blocked by host");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onBlock = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          startDate,
          endDate: endDate || startDate,
          reason,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to block dates");
        return;
      }
      setStartDate("");
      setEndDate("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const onUnblock = async (id: string) => {
    await fetch("/api/admin/blocked-dates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={onBlock} className="space-y-4 border border-navy/10 bg-white p-6">
        <h2 className="font-display text-2xl">Block unavailable nights</h2>
        <p className="text-sm text-navy/60">
          Block a single night or a date range. Paid/pending bookings are blocked automatically.
          Abandoned pending checkouts expire after 2 hours.
        </p>
        <label className="block">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Shortlet
          </span>
          <select
            className="field"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            required
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
              From
            </span>
            <input
              type="date"
              className="field"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
              To (inclusive)
            </span>
            <input
              type="date"
              className="field"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Reason
          </span>
          <input
            className="field"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-gold text-xs tracking-[0.16em] uppercase disabled:opacity-60"
        >
          {loading ? "Blocking..." : "Block nights"}
        </button>
      </form>

      <div className="border border-navy/10 bg-white">
        <div className="border-b border-navy/10 px-5 py-4">
          <h2 className="font-display text-2xl">Blocked nights</h2>
        </div>
        <div className="divide-y divide-navy/10">
          {blockedDates.length === 0 && (
            <p className="px-5 py-8 text-sm text-navy/55">No manually blocked dates.</p>
          )}
          {blockedDates.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between gap-4 px-5 py-4 text-sm"
            >
              <div>
                <p className="font-medium">{row.date}</p>
                <p className="text-navy/55">
                  {row.propertyTitle}
                  {row.reason ? ` · ${row.reason}` : ""}
                </p>
              </div>
              <button
                type="button"
                className="text-xs tracking-[0.12em] text-red-700 uppercase hover:underline"
                onClick={() => onUnblock(row.id)}
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
