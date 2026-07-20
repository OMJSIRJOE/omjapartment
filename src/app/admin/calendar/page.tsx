import { redirect } from "next/navigation";
import CalendarManager from "@/components/admin/CalendarManager";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminCalendarPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [properties, blockedDates] = await Promise.all([
    prisma.property.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
    prisma.blockedDate.findMany({
      include: { property: { select: { title: true } } },
      orderBy: { date: "asc" },
    }),
  ]);

  return (
    <div>
      <h1 className="font-display text-4xl text-navy">Availability calendar</h1>
      <p className="mt-2 mb-8 text-sm text-navy/60">
        Mark nights as unavailable for maintenance, owner use, or manual holds.
      </p>
      <CalendarManager
        properties={properties}
        blockedDates={blockedDates.map((row) => ({
          id: row.id,
          propertyId: row.propertyId,
          propertyTitle: row.property.title,
          date: row.date.toISOString().slice(0, 10),
          reason: row.reason,
        }))}
      />
    </div>
  );
}
