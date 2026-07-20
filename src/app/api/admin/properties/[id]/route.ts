import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { mapDbProperty, serializePropertyInput } from "@/lib/property-mapper";

const propertySchema = z.object({
  slug: z.string().min(2).optional(),
  title: z.string().min(2).optional(),
  location: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  address: z.string().min(2).optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  area: z.number().int().min(1).optional(),
  pricePerNight: z.number().int().min(1).optional(),
  cleaningFee: z.number().int().min(0).optional(),
  maxGuests: z.number().int().min(1).optional(),
  minNights: z.number().int().min(1).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  description: z.string().min(10).optional(),
  amenities: z.array(z.string()).optional(),
  houseRules: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  checkInNotes: z.string().optional(),
});

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteProps) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const row = await prisma.property.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ property: mapDbProperty(row) });
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = propertySchema.parse(await request.json());
    const data: Record<string, unknown> = { ...body };

    if (body.amenities || body.houseRules || body.images) {
      const current = await prisma.property.findUnique({ where: { id } });
      if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });
      Object.assign(
        data,
        serializePropertyInput({
          amenities: body.amenities ?? (JSON.parse(current.amenities) as string[]),
          houseRules: body.houseRules ?? (JSON.parse(current.houseRules) as string[]),
          images: body.images ?? (JSON.parse(current.images) as string[]),
        })
      );
    }

    delete data.amenities;
    delete data.houseRules;
    delete data.images;

    if (body.amenities) data.amenities = JSON.stringify(body.amenities);
    if (body.houseRules) data.houseRules = JSON.stringify(body.houseRules);
    if (body.images) data.images = JSON.stringify(body.images);

    const updated = await prisma.property.update({
      where: { id },
      data,
    });
    return NextResponse.json({ property: mapDbProperty(updated) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update property";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.property.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
