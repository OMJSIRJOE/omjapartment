import { Property as DbProperty } from "@prisma/client";
import { Property } from "@/types/property";

export function mapDbProperty(row: DbProperty): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    location: row.location,
    city: row.city,
    address: row.address,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    area: row.area,
    pricePerNight: row.pricePerNight,
    cleaningFee: row.cleaningFee,
    maxGuests: row.maxGuests,
    minNights: row.minNights,
    rating: row.rating,
    reviewCount: row.reviewCount,
    featured: row.featured,
    description: row.description,
    amenities: JSON.parse(row.amenities) as string[],
    houseRules: JSON.parse(row.houseRules) as string[],
    images: JSON.parse(row.images) as string[],
    checkInNotes: row.checkInNotes || "",
  };
}

export function serializePropertyInput(data: {
  amenities: string[];
  houseRules: string[];
  images: string[];
}) {
  return {
    amenities: JSON.stringify(data.amenities),
    houseRules: JSON.stringify(data.houseRules),
    images: JSON.stringify(data.images),
  };
}
