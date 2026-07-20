import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { ArrowRightIcon } from "@/components/icons";
import { getFeaturedProperties } from "@/lib/properties";

export default async function FeaturedProperties() {
  const featured = (await getFeaturedProperties()).slice(0, 3);

  return (
    <section className="section-pad relative bg-mist">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#f3f5f8_0%,#ffffff_55%,#f3f5f8_100%)]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs tracking-[0.22em] text-gold-dark uppercase">Featured Stays</p>
            <h2 className="mt-3 font-display text-3xl text-navy md:text-5xl">
              Shortlets guests love
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-navy/65 md:text-base">
              Hand-selected luxury apartments ready for instant reservation — nights, weekends, or
              longer.
            </p>
          </div>
          <Link
            href="/listings"
            className="group inline-flex items-center gap-2 text-xs tracking-[0.18em] text-navy uppercase transition-colors hover:text-gold-dark"
          >
            Browse all shortlets
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((property, index) => (
            <PropertyCard key={property.id} property={property} priority={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
