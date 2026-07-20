import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { mapDbProperty, serializePropertyInput } from "@/lib/property-mapper";

const propertySchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(2),
  location: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(2),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  area: z.number().int().min(1),
  pricePerNight: z.number().int().min(1),
  cleaningFee: z.number().int().min(0),
  maxGuests: z.number().int().min(1),
  minNights: z.number().int().min(1),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  description: z.string().min(10),
  amenities: z.array(z.string()).default([]),
  houseRules: z.array(z.string()).default([]),
  images: z.array(z.string().url()).min(1),
  checkInNotes: z.string().optional(),
});

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await prisma.property.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ properties: rows.map(mapDbProperty) });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = propertySchema.parse(await request.json());
    const serialized = serializePropertyInput(body);
    const created = await prisma.property.create({
      data: {
        slug: body.slug,
        title: body.title,
        location: body.location,
        city: body.city,
        address: body.address,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        area: body.area,
        pricePerNight: body.pricePerNight,
        cleaningFee: body.cleaningFee,
        maxGuests: body.maxGuests,
        minNights: body.minNights,
        rating: body.rating ?? 5,
        reviewCount: body.reviewCount ?? 0,
        featured: body.featured ?? false,
        active: body.active ?? true,
        description: body.description,
        checkInNotes: body.checkInNotes ?? "",
        ...serialized,
      },
    });
    return NextResponse.json({ property: mapDbProperty(created) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create property";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
