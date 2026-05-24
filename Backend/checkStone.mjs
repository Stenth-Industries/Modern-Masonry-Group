import prisma from "./config/prisma.js";

const variants = await prisma.variant.findMany({
  where: { sku: { startsWith: "BB-STONE" } },
  select: { sku: true, colourName: true, imageUrl: true, stock: true },
});

console.log("Stone variants in DB:", variants.length);
for (const v of variants) {
  console.log(` ${v.sku} | ${v.colourName} | ${v.stock} | ${v.imageUrl ? "has image" : "NO IMAGE"}`);
}

const products = await prisma.product.findMany({
  where: { variants: { some: { sku: { startsWith: "BB-STONE" } } } },
  select: { name: true, slug: true, _count: { select: { variants: true } } },
});
console.log("\nStone products in DB:", products.length);
for (const p of products) {
  console.log(` ${p.name} (${p._count.variants} variants)`);
}

await prisma.$disconnect();
