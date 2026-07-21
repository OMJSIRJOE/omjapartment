import Image from "next/image";
import Link from "next/link";
import { BedIcon, GuestsIcon, MapPinIcon, StarIcon } from "@/components/icons";
import { formatNightlyRate } from "@/data/properties";
import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
  searchParams?: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
}

export default function PropertyCard({
  property,
  priority = false,
  searchParams,
}: PropertyCardProps) {
  const params = new URLSearchParams();
  if (searchParams?.checkIn) params.set("checkIn", searchParams.checkIn);
  if (searchParams?.checkOut) params.set("checkOut", searchParams.checkOut);
  if (searchParams?.guests) params.set("guests", searchParams.guests);
  const query = params.toString();
  const href = query
    ? `/properties/${property.slug}?${query}`
    : `/properties/${property.slug}`;

  return (
    <article className="group animate-fade-up">
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-navy/10">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-80" />
          <span className="absolute top-4 left-4 bg-gold px-3 py-1 text-[10px] font-medium tracking-[0.18em] text-navy uppercase">
            Shortlet
          </span>
          <p className="absolute right-4 bottom-4 flex items-center gap-1 text-sm text-white">
            <StarIcon className="h-3.5 w-3.5 text-gold" />
            {property.rating.toFixed(2)}
          </p>
          <p className="absolute bottom-4 left-4 font-display text-2xl text-white">
            {formatNightlyRate(property.pricePerNight)}
          </p>
        </div>

        <div className="border border-t-0 border-navy/10 bg-white px-5 py-5 transition-colors duration-300 group-hover:border-gold/40">
          <h3 className="font-display text-xl text-navy transition-colors group-hover:text-gold-dark">
            {property.title}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-navy/60">
            <MapPinIcon className="h-4 w-4 text-gold" />
            {property.location}, {property.city}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 border-t border-navy/8 pt-4 text-xs tracking-wide text-navy/65 uppercase">
            <span className="flex items-center gap-1.5">
              <BedIcon className="h-4 w-4 text-gold" />
              {property.bedrooms === 0 || /studio/i.test(property.title)
                ? "Studio"
                : `${property.bedrooms} Beds`}
            </span>
            <span className="flex items-center gap-1.5">
              <GuestsIcon className="h-4 w-4 text-gold" />
              {property.maxGuests} Guests
            </span>
            <span className="tracking-[0.12em] text-navy/50">
              Min {property.minNights} night{property.minNights > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
