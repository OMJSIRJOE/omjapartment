import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-mist px-5 pt-28 pb-20">
      <div className="max-w-lg text-center">
        <p className="text-xs tracking-[0.22em] text-gold-dark uppercase">404</p>
        <h1 className="mt-3 font-display text-4xl text-navy md:text-5xl">Page not found</h1>
        <p className="mt-4 text-sm text-navy/65">
          This shortlet may be unavailable. Explore stays you can reserve instead.
        </p>
        <Link href="/listings" className="btn-gold mt-8 text-xs tracking-[0.18em] uppercase">
          Browse Shortlets
        </Link>
      </div>
    </section>
  );
}
