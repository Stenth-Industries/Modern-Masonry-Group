/**
 * Populates techSheetUrl on Brampton Stone variants based on their collection (series).
 *
 * Usage:
 *   node pushBramptonStoneTechSheet.js           # dry-run
 *   node pushBramptonStoneTechSheet.js --confirm # write to DB
 */

import prisma from "./config/prisma.js";

const SERIES_URLS = {
  "Artiste 2":  "https://bramptonbrick.com/sites/default/files/resource_file/Artiste_2_Product_Tech_Sheet_Cnd%20Eng.pdf",
  "Bonneville": "https://bramptonbrick.com/sites/default/files/resource_file/Bonneville_PTDS_Eng_2025.pdf",
  "Preston":    "https://bramptonbrick.com/sites/default/files/resource_file/Preston_PTDS_Eng_2025.pdf",
  "Granada":    "https://bramptonbrick.com/sites/default/files/resource_file/Granada_PTDS_Eng_2025.pdf",
  "Finesse":    "https://bramptonbrick.com/sites/default/files/resource_file/Finesse_PTS_Eng_2025.pdf",
  // Contempo Stone, Talia, Vivace Stone — no PDF available yet
};

const confirm = process.argv.includes("--confirm");

const variants = await prisma.variant.findMany({
  where: {
    product: {
      material: { equals: "Stone", mode: "insensitive" },
      manufacturers: { some: { manufacturer: { name: { contains: "Brampton", mode: "insensitive" } } } },
    },
  },
  include: {
    product: { include: { categories: { include: { category: true } } } },
  },
});

console.log(`\nFound ${variants.length} Brampton Stone variants\n`);

let updated = 0, skipped = 0;

for (const v of variants) {
  const collection = v.product.categories.find(pc => pc.category.type === "collection")?.category.value ?? null;
  const url = SERIES_URLS[collection] ?? null;

  if (!url) {
    console.log(`  SKIP  ${(v.sku ?? v.id).padEnd(30)}  series=${JSON.stringify(collection)}`);
    skipped++;
    continue;
  }

  console.log(`  ${confirm ? "SET " : "DRY "}  ${(v.sku ?? v.id).padEnd(30)}  series=${JSON.stringify(collection)}`);
  if (confirm) {
    await prisma.variant.update({ where: { id: v.id }, data: { techSheetUrl: url } });
  }
  updated++;
}

await prisma.$disconnect();

console.log(`\n${confirm ? "Updated" : "Would update"}: ${updated}  |  Skipped (no URL): ${skipped}`);
if (!confirm) console.log("\nRe-run with --confirm to write changes.");
