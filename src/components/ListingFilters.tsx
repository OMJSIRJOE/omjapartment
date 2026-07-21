"use client";

import { useMemo, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/types/property";

interface ListingFiltersProps {
  properties: Property[];
  locations: string[];
  initialLocation?: string;
  initialGuests?: string;
  initialMaxPrice?: string;
  initialBedrooms?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
}

export default function ListingFilters({
  properties,
  locations,
  initialLocation = "",
  initialGuests = "",
  initialMaxPrice = "",
  initialBedrooms = "",
  initialCheckIn = "",
  initialCheckOut = "",
}: ListingFiltersProps) {
  const [location, setLocation] = useState(initialLocation);
  const [guests, setGuests] = useState(initialGuests);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [bedrooms, setBedrooms] = useState(initialBedrooms);

  const filtered = useMemo(() => {
    return properties.filter((property) => {
      if (location && property.location !== location) return false;
      if (guests && property.maxGuests < Number(guests)) return false;
      if (maxPrice && property.pricePerNight > Number(maxPrice)) return false;
      if (bedrooms) {
        if (bedrooms === "studio") {
          const isStudio =
            property.bedrooms === 0 || /studio/i.test(property.title);
          if (!isStudio) return false;
        } else if (bedrooms === "duplex") {
          if (property.bedrooms !== 4 && property.bedrooms !== 5) return false;
        } else if (bedrooms === "1") {
          if (property.bedrooms !== 1 || /studio/i.test(property.title)) return false;
        } else if (property.bedrooms !== Number(bedrooms)) {
          return false;
        }
      }
      return true;
    });
  }, [properties, location, guests, maxPrice, bedrooms]);

  const clearFilters = () => {
    setLocation("");
    setGuests("");
    setMaxPrice("");
    setBedrooms("");
  };

  const searchParams = {
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
    guests: guests || initialGuests,
  };

  return (
    <div>
      <div className="border border-navy/10 bg-white p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <label className="block flex-1">
            <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
              Location
            </span>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="field"
            >
              <option value="">All locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </label>

          <label className="block flex-1">
            <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
              Guests
            </span>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="field"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                <option key={n} value={String(n)}>
                  {n}+
                </option>
              ))}
            </select>
          </label>

          <label className="block flex-1">
            <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
              Bedrooms
            </span>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="field"
            >
              <option value="">Any</option>
              <option value="studio">Studio</option>
              <option value="1">1 bed</option>
              <option value="2">2 beds</option>
              <option value="3">3 beds</option>
              <option value="duplex">4/5 bed duplex</option>
              <option value="4">4 beds</option>
              <option value="5">5 beds</option>
            </select>
          </label>

          <label className="block flex-1">
            <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
              Max / night
            </span>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="field"
            >
              <option value="">No limit</option>
              <option value="200000">₦200,000</option>
              <option value="400000">₦400,000</option>
              <option value="700000">₦700,000</option>
              <option value="1000000">₦1,000,000</option>
              <option value="2000000">₦2,000,000</option>
            </select>
          </label>

          <button
            type="button"
            onClick={clearFilters}
            className="btn-outline-navy shrink-0 text-xs tracking-[0.16em] uppercase"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-end justify-between gap-4">
        <p className="text-sm text-navy/60">
          Showing <span className="font-medium text-navy">{filtered.length}</span>{" "}
          shortlet{filtered.length === 1 ? "" : "s"} available to book
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              searchParams={searchParams}
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 border border-navy/10 bg-mist px-6 py-16 text-center">
          <p className="font-display text-2xl text-navy">No shortlets match</p>
          <p className="mt-3 text-sm text-navy/60">
            Adjust your dates, guest count, or filters to see more stays.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="btn-gold mt-6 text-xs tracking-[0.16em] uppercase"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
