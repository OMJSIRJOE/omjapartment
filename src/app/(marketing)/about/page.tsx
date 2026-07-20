import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "OMJ Apartment offers luxury shortlet apartments across Lagos with simple online reservations.",
};

const values = [
  {
    title: "Easy Booking",
    text: "Search by dates and guests, review nightly rates, and reserve your shortlet in a few steps.",
  },
  {
    title: "Curated Homes",
    text: "We select apartments for comfort, security, and design — so every stay feels premium.",
  },
  {
    title: "Guest Care",
    text: "Clear check-in guidance and responsive support before, during, and after your stay.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Us"
        subtitle="OMJ Apartment makes luxury shortlet stays simple to discover and easy to reserve."
        image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
      />

      <section className="section-pad bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden md:aspect-[5/4]">
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80"
              alt="Luxury shortlet living room ready for guests"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs tracking-[0.22em] text-gold-dark uppercase">Our Story</p>
            <h2 className="mt-3 font-display text-3xl text-navy md:text-5xl">
              Premium shortlets, handled with care
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-navy/70 md:text-base">
              OMJ Apartment is a Lagos shortlet brand built for guests who want hotel-level comfort
              with the privacy of a home. We prepare every stay carefully — clean linens, reliable
              power backup where available, fast Wi-Fi, and clear arrival instructions.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-navy/70 md:text-base">
              Browse studios through three-bedroom homes across Victoria Island, Ikoyi, Lekki Phase
              1, and Ikeja GRA. Pick your dates online, see your total in Naira, and reserve with
              Paystack — or message us on WhatsApp if you prefer a personal recommendation.
            </p>
            <Link href="/listings" className="btn-gold mt-8 text-xs tracking-[0.18em] uppercase">
              Browse Shortlets
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad bg-navy text-white">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.22em] text-gold uppercase">Our Promise</p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl">What every guest can expect</h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="border-t border-gold/40 pt-8">
                <h3 className="font-display text-2xl">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-mist">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <h2 className="font-display text-3xl text-navy md:text-4xl">
            Planning a stay in Lagos?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-navy/65 md:text-base">
            Tell us your dates and preferences — we&apos;ll help you find the right shortlet.
          </p>
          <Link href="/contact" className="btn-gold mt-8 text-xs tracking-[0.18em] uppercase">
            Contact OMJ Apartment
          </Link>
        </div>
      </section>
    </>
  );
}
