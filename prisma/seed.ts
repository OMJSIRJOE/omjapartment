import { PrismaClient } from "@prisma/client";
import { properties } from "../src/data/properties";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@omjapartments.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "OMJAdmin123!";
  const passwordHash = hashPassword(password);

  await prisma.adminUser.upsert({
    where: { email },
    update: {
      passwordHash,
    },
    create: {
      email,
      name: "OMJ Admin",
      passwordHash,
    },
  });

  for (const property of properties) {
    await prisma.property.upsert({
      where: { slug: property.slug },
      update: {
        title: property.title,
        location: property.location,
        city: property.city,
        address: property.address,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        pricePerNight: property.pricePerNight,
        cleaningFee: property.cleaningFee,
        maxGuests: property.maxGuests,
        minNights: property.minNights,
        rating: property.rating,
        reviewCount: property.reviewCount,
        featured: property.featured,
        active: true,
        description: property.description,
        amenities: JSON.stringify(property.amenities),
        houseRules: JSON.stringify(property.houseRules),
        images: JSON.stringify(property.images),
      },
      create: {
        slug: property.slug,
        title: property.title,
        location: property.location,
        city: property.city,
        address: property.address,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        pricePerNight: property.pricePerNight,
        cleaningFee: property.cleaningFee,
        maxGuests: property.maxGuests,
        minNights: property.minNights,
        rating: property.rating,
        reviewCount: property.reviewCount,
        featured: property.featured,
        active: true,
        description: property.description,
        amenities: JSON.stringify(property.amenities),
        houseRules: JSON.stringify(property.houseRules),
        images: JSON.stringify(property.images),
      },
    });
  }

  console.log(`Seeded ${properties.length} shortlets and admin ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
