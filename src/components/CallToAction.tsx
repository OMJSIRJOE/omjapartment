import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-navy">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(212,175,55,0.2)_0%,transparent_45%,rgba(255,255,255,0.04)_100%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-20 md:flex-row md:items-center md:px-8 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.22em] text-gold uppercase">Reserve Your Stay</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-5xl">
            Ready to book your next shortlet?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
            Choose dates, select guests, and reserve a luxury apartment in minutes.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/listings" className="btn-gold text-xs tracking-[0.18em] uppercase">
            Browse Shortlets
          </Link>
          <Link href="/contact" className="btn-outline-light text-xs tracking-[0.18em] uppercase">
            Contact Host
          </Link>
        </div>
      </div>
    </section>
  );
}
