import { redirect } from "next/navigation";
import BookingsTable from "@/components/admin/BookingsTable";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminBookingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const bookings = await prisma.booking.findMany({
    include: { property: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-4xl text-navy">Bookings</h1>
      <p className="mt-2 mb-8 text-sm text-navy/60">
        Track reservations, mark payments, and cancel stays.
      </p>
      <BookingsTable
        bookings={bookings.map((b) => ({
          id: b.id,
          code: b.code,
          status: b.status,
          guestName: b.guestName,
          guestEmail: b.guestEmail,
          guestPhone: b.guestPhone,
          checkIn: b.checkIn.toISOString().slice(0, 10),
          checkOut: b.checkOut.toISOString().slice(0, 10),
          guests: b.guests,
          nights: b.nights,
          total: b.total,
          propertyTitle: b.property.title,
        }))}
      />
    </div>
  );
}
