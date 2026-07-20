import type { Metadata } from "next";
import ListingFilters from "@/components/ListingFilters";
import PageHero from "@/components/PageHero";
import { getActiveProperties, getLocations } from "@/lib/properties";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book Luxury Shortlets",
  description:
    "Browse and reserve OMJ Apartment luxury shortlets in Lagos. Filter by location, guests, bedrooms, and nightly rate.",
};

interface ListingsPageProps {
  searchParams: Promise<{
    location?: string;
    guests?: string;
    maxPrice?: string;
    bedrooms?: string;
    checkIn?: string;
    checkOut?: string;
  }>;
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;
  const [properties, locations] = await Promise.all([
    getActiveProperties(),
    getLocations(),
  ]);

  return (
    <>
      <PageHero
        title="Luxury Shortlets"
        subtitle="Reserve stylish apartments and villas for nights, weekends, or extended stays across Lagos."
        image="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80"
      />
      <section className="section-pad bg-mist">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <ListingFilters
            properties={properties}
            locations={locations}
            initialLocation={params.location ?? ""}
            initialGuests={params.guests ?? ""}
            initialMaxPrice={params.maxPrice ?? ""}
            initialBedrooms={params.bedrooms ?? ""}
            initialCheckIn={params.checkIn ?? ""}
            initialCheckOut={params.checkOut ?? ""}
          />
        </div>
      </section>
    </>
  );
}
