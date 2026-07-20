import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingWidget from "@/components/BookingWidget";
import ImageGallery from "@/components/ImageGallery";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  BathIcon,
  BedIcon,
  CheckIcon,
  GuestsIcon,
  MapPinIcon,
  StarIcon,
} from "@/components/icons";
import { formatNightlyRate } from "@/data/properties";
import { getPropertyBySlug } from "@/lib/properties";

export const dynamic = "force-dynamic";

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return { title: "Shortlet Not Found" };
  }

  return {
    title: `Book ${property.title}`,
    description: property.description.slice(0, 155),
    openGraph: {
      title: `Book ${property.title} | OMJ Apartment`,
      description: property.description.slice(0, 155),
      images: [{ url: property.images[0] }],
    },
  };
}

export default async function PropertyDetailsPage({
  params,
  searchParams,
}: PropertyPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return (
    <>
      <div className="bg-navy pt-24 md:pt-28">
        <div className="mx-auto max-w-7xl px-5 pb-6 md:px-8">
          <nav className="text-xs tracking-[0.12em] text-white/50 uppercase">
            <Link href="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/listings" className="transition-colors hover:text-gold">
              Shortlets
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gold">{property.title}</span>
          </nav>
        </div>
      </div>

      <section className="bg-mist pb-8 md:pb-12">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <ImageGallery images={property.images} title={property.title} />
        </div>
      </section>

      <section className="bg-white pb-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[1.4fr_0.9fr] lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-gold px-3 py-1 text-[10px] font-medium tracking-[0.18em] text-navy uppercase">
                Shortlet
              </span>
              <p className="flex items-center gap-1.5 text-sm text-navy/60">
                <MapPinIcon className="h-4 w-4 text-gold" />
                {property.address}
              </p>
            </div>

            <h1 className="mt-4 font-display text-4xl text-navy md:text-5xl">
              {property.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <p className="font-display text-3xl text-gold-dark">
                {formatNightlyRate(property.pricePerNight)}
              </p>
              <p className="flex items-center gap-1.5 text-sm text-navy/60">
                <StarIcon className="h-4 w-4 text-gold" />
                {property.rating.toFixed(2)} · {property.reviewCount} reviews
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 border-y border-navy/10 py-6 text-sm text-navy/70">
              <span className="flex items-center gap-2">
                <BedIcon className="h-5 w-5 text-gold" />
                {property.bedrooms} Bedrooms
              </span>
              <span className="flex items-center gap-2">
                <BathIcon className="h-5 w-5 text-gold" />
                {property.bathrooms} Bathrooms
              </span>
              <span className="flex items-center gap-2">
                <GuestsIcon className="h-5 w-5 text-gold" />
                Up to {property.maxGuests} guests
              </span>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-2xl text-navy md:text-3xl">About this stay</h2>
              <p className="mt-4 text-sm leading-relaxed text-navy/70 md:text-base">
                {property.description}
              </p>
            </div>

            <div className="mt-12">
              <h2 className="font-display text-2xl text-navy md:text-3xl">Amenities</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {property.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-center gap-3 border border-navy/8 bg-mist px-4 py-3 text-sm text-navy/80"
                  >
                    <CheckIcon className="h-4 w-4 shrink-0 text-gold" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12">
              <h2 className="font-display text-2xl text-navy md:text-3xl">House rules</h2>
              <ul className="mt-6 space-y-3">
                {property.houseRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-3 text-sm text-navy/70">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <WhatsAppButton propertyTitle={property.title} />
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <BookingWidget
              property={property}
              initialCheckIn={query.checkIn}
              initialCheckOut={query.checkOut}
              initialGuests={query.guests ? Number(query.guests) : 1}
            />
          </aside>
        </div>
      </section>
    </>
  );
}
