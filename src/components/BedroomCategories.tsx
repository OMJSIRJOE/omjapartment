import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { ArrowRightIcon } from "@/components/icons";
import {
  getOneBedProperties,
  getPropertiesByBedroomValues,
  getPropertiesByBedrooms,
  getStudioProperties,
} from "@/lib/properties";
import { Property } from "@/types/property";

type Category = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  load: () => Promise<Property[]>;
};

const categories: Category[] = [
  {
    id: "studio",
    title: "Studio Apartment",
    subtitle: "Compact, stylish shortlets for solo travelers and couples.",
    href: "/listings?bedrooms=studio",
    load: getStudioProperties,
  },
  {
    id: "1bed",
    title: "1 Bed Apartment",
    subtitle: "Comfortable one-bedroom stays with space to work and unwind.",
    href: "/listings?bedrooms=1",
    load: getOneBedProperties,
  },
  {
    id: "2bed",
    title: "2 Bed Apartment",
    subtitle: "Spacious two-bedroom stays for friends and small families.",
    href: "/listings?bedrooms=2",
    load: () => getPropertiesByBedrooms(2),
  },
  {
    id: "3bed",
    title: "3 Bed Apartment",
    subtitle: "Roomy three-bedroom homes for longer Lagos getaways.",
    href: "/listings?bedrooms=3",
    load: () => getPropertiesByBedrooms(3),
  },
  {
    id: "duplex",
    title: "4/5 Bed Duplex",
    subtitle: "Premium duplexes and large homes for groups and family stays.",
    href: "/listings?bedrooms=duplex",
    load: () => getPropertiesByBedroomValues([4, 5]),
  },
];

export default async function BedroomCategories() {
  const sections = await Promise.all(
    categories.map(async (category) => ({
      ...category,
      properties: (await category.load()).slice(0, 3),
    })),
  );

  return (
    <section className="section-pad relative bg-white">
      <div className="mx-auto max-w-7xl space-y-20 px-5 md:px-8">
        {sections.map((section) => (
          <div key={section.id}>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-xs tracking-[0.22em] text-gold-dark uppercase">Browse by type</p>
                <h2 className="mt-3 font-display text-3xl text-navy md:text-5xl">
                  {section.title}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-navy/65 md:text-base">
                  {section.subtitle}
                </p>
              </div>
              <Link
                href={section.href}
                className="group inline-flex items-center gap-2 text-xs tracking-[0.18em] text-navy uppercase transition-colors hover:text-gold-dark"
              >
                See all apartments
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {section.properties.length > 0 ? (
              <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {section.properties.map((property, index) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    priority={index === 0 && section.id === "studio"}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-12 rounded-2xl border border-dashed border-navy/15 bg-mist px-6 py-10 text-sm text-navy/70">
                New {section.title.toLowerCase()} listings are coming soon.
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
