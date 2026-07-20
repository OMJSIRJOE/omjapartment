import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import { getAdminSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen bg-mist text-navy">
      <header className="border-b border-navy/10 bg-navy text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div>
            <Link href="/admin" className="font-display text-2xl tracking-[0.04em]">
              OMJ <span className="text-gold">Admin</span>
            </Link>
            {session && (
              <p className="mt-1 text-xs tracking-[0.12em] text-white/50 uppercase">{session.email}</p>
            )}
          </div>
          {session && (
            <nav className="flex flex-wrap items-center gap-4 text-xs tracking-[0.14em] uppercase">
              <Link href="/admin" className="text-white/80 hover:text-gold">
                Dashboard
              </Link>
              <Link href="/admin/properties" className="text-white/80 hover:text-gold">
                Shortlets
              </Link>
              <Link href="/admin/bookings" className="text-white/80 hover:text-gold">
                Bookings
              </Link>
              <Link href="/admin/calendar" className="text-white/80 hover:text-gold">
                Calendar
              </Link>
              <Link href="/" className="text-white/80 hover:text-gold">
                View Site
              </Link>
              <LogoutButton />
            </nav>
          )}
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">{children}</div>
    </div>
  );
}
