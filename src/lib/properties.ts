import { prisma } from "@/lib/db";
import { mapDbProperty } from "@/lib/property-mapper";
import { Property } from "@/types/property";

export async function getActiveProperties(): Promise<Property[]> {
  const rows = await prisma.property.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(mapDbProperty);
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const rows = await prisma.property.findMany({
    where: { active: true, featured: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapDbProperty);
}

export async function getPropertiesByBedrooms(bedrooms: number): Promise<Property[]> {
  const rows = await prisma.property.findMany({
    where: { active: true, bedrooms },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(mapDbProperty);
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const row = await prisma.property.findFirst({
    where: { slug, active: true },
  });
  return row ? mapDbProperty(row) : null;
}

export async function getPropertyById(id: string) {
  return prisma.property.findUnique({ where: { id } });
}

export async function getLocations(): Promise<string[]> {
  const rows = await prisma.property.findMany({
    where: { active: true },
    select: { location: true },
    distinct: ["location"],
    orderBy: { location: "asc" },
  });
  return rows.map((r) => r.location);
}
