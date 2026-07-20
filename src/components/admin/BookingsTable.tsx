"use client";

import { useRouter } from "next/navigation";
import { formatMoney } from "@/data/properties";

export type AdminBooking = {
  id: string;
  code: string;
  status: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: number;
  propertyTitle: string;
};

export default function BookingsTable({ bookings }: { bookings: AdminBooking[] }) {
  const router = useRouter();

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) router.refresh();
  };

  return (
    <div className="overflow-x-auto border border-navy/10 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-navy/10 bg-mist text-xs tracking-[0.14em] text-navy/50 uppercase">
          <tr>
            <th className="px-4 py-3">Booking</th>
            <th className="px-4 py-3">Guest</th>
            <th className="px-4 py-3">Stay</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-navy/55">
                No bookings yet.
              </td>
            </tr>
          )}
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-navy/8 align-top">
              <td className="px-4 py-4">
                <p className="font-medium">{booking.code}</p>
                <p className="text-navy/55">{booking.propertyTitle}</p>
              </td>
              <td className="px-4 py-4">
                <p>{booking.guestName}</p>
                <p className="text-navy/55">{booking.guestEmail}</p>
                <p className="text-navy/55">{booking.guestPhone}</p>
              </td>
              <td className="px-4 py-4">
                {booking.checkIn} → {booking.checkOut}
                <p className="text-navy/55">
                  {booking.nights} night{booking.nights > 1 ? "s" : ""} · {booking.guests} guests
                </p>
              </td>
              <td className="px-4 py-4 font-medium">{formatMoney(booking.total)}</td>
              <td className="px-4 py-4 uppercase tracking-[0.12em] text-navy/50">
                {booking.status}
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-col gap-2">
                  {booking.status !== "paid" && (
                    <button
                      type="button"
                      className="text-left text-xs tracking-[0.12em] text-emerald-700 uppercase hover:underline"
                      onClick={() => updateStatus(booking.id, "paid")}
                    >
                      Mark paid
                    </button>
                  )}
                  {booking.status !== "cancelled" && (
                    <button
                      type="button"
                      className="text-left text-xs tracking-[0.12em] text-red-700 uppercase hover:underline"
                      onClick={() => updateStatus(booking.id, "cancelled")}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
