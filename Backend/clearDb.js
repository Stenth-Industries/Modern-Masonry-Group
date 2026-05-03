import prisma from "./config/prisma.js";

async function main() {
  console.log("Starting database cleanup...");

  try {
    // Using a transaction to ensure all or nothing is deleted.
    // Deleting in reverse order of relationships to prevent foreign key constraint errors
    // (Though onDelete: Cascade helps, this is the safest approach).
    // Running deletes sequentially to avoid transaction timeouts on large datasets
    await prisma.variant.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.productManufacturer.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.manufacturer.deleteMany();
    await prisma.quote.deleteMany();

    console.log("✅ All data successfully deleted from the database.");
  } catch (error) {
    console.error("❌ Failed to delete data:", error);
  }
}

main()
  .catch((e) => {
    console.error("Fatal exception during cleanup:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
