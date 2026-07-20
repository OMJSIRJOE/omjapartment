const { PrismaClient } = require("@prisma/client");
const { PrismaNeonHTTP } = require("@prisma/adapter-neon");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("NO_URL");
  process.exit(1);
}

const adapter = new PrismaNeonHTTP(url, {});
const prisma = new PrismaClient({ adapter });

prisma.property
  .count()
  .then((c) => {
    console.log("OK count=" + c);
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("FAIL " + e.message);
    await prisma.$disconnect();
    process.exit(1);
  });
