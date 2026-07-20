import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/data/properties";
import { isEmailConfigured } from "@/lib/email";
import { isPaystackConfigured } from "@/lib/paystack";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [propertyCount, bookingCount, paidCount, pendingCount, recent] = await Promise.all([
    prisma.property.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "paid" } }),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { property: true },
    }),
  ]);

  const cards = [
    { label: "Shortlets", value: propertyCount },
    { label: "Total bookings", value: bookingCount },
    { label: "Paid", value: paidCount },
    { label: "Pending", value: pendingCount },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl text-navy">Dashboard</h1>
      <p className="mt-2 text-sm text-navy/60">Overview of your shortlet business.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="border border-navy/10 bg-white px-5 py-6">
            <p className="text-xs tracking-[0.16em] text-navy/45 uppercase">{card.label}</p>
            <p className="mt-3 font-display text-4xl text-navy">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <SetupCard
          title="Paystack"
          ready={isPaystackConfigured()}
          hint="Add PAYSTACK_SECRET_KEY and NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY"
        />
        <SetupCard
          title="Email (Resend)"
          ready={isEmailConfigured()}
          hint="Add RESEND_API_KEY and verify EMAIL_FROM"
        />
        <SetupCard
          title="Business details"
          ready={Boolean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)}
          hint="Update WhatsApp, phone, email in .env"
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/admin/properties" className="btn-gold text-xs tracking-[0.16em] uppercase">
          Manage shortlets
        </Link>
        <Link href="/admin/bookings" className="btn-outline-navy text-xs tracking-[0.16em] uppercase">
          View bookings
        </Link>
        <Link href="/admin/calendar" className="btn-outline-navy text-xs tracking-[0.16em] uppercase">
          Block dates
        </Link>
      </div>

      <div className="mt-12 border border-navy/10 bg-white">
        <div className="border-b border-navy/10 px-5 py-4">
          <h2 className="font-display text-2xl">Recent bookings</h2>
        </div>
        <div className="divide-y divide-navy/10">
          {recent.length === 0 && (
            <p className="px-5 py-8 text-sm text-navy/55">No bookings yet.</p>
          )}
          {recent.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-2 px-5 py-4 text-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium text-navy">
                  {booking.code} · {booking.property.title}
                </p>
                <p className="text-navy/55">
                  {booking.guestName} · {booking.checkIn.toISOString().slice(0, 10)} →{" "}
                  {booking.checkOut.toISOString().slice(0, 10)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatMoney(booking.total)}</p>
                <p className="uppercase tracking-[0.12em] text-navy/45">{booking.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SetupCard({
  title,
  ready,
  hint,
}: {
  title: string;
  ready: boolean;
  hint: string;
}) {
  return (
    <div className="border border-navy/10 bg-white px-5 py-5">
      <p className="text-xs tracking-[0.16em] text-navy/45 uppercase">{title}</p>
      <p className={`mt-2 text-sm font-medium ${ready ? "text-emerald-700" : "text-amber-700"}`}>
        {ready ? "Configured" : "Needs setup"}
      </p>
      <p className="mt-2 text-xs text-navy/55">{hint}</p>
    </div>
  );
}
