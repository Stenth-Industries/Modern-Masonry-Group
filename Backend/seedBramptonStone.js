import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, ".env") });

import prisma from "./config/prisma.js";
import supabase from "./config/supabase.js";

const BUCKET_NAME = "stenth-canada";
const DATA_FILE = path.join(__dirname, "data", "brampton-stone.json");

async function downloadAndUploadImage(url, filename) {
  if (!url) return null;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; bot/1.0)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, buf, { upsert: true, contentType });

    if (error) {
      console.warn(`  ⚠ Supabase upload error for ${filename}: ${error.message}`);
      return url;
    }
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename);
    return data.publicUrl;
  } catch (err) {
    console.warn(`  ⚠ Image fetch failed for ${url}: ${err.message} — using source URL`);
    return url;
  }
}

async function ensureCategory(type, value) {
  let cat = await prisma.category.findUnique({
    where: { type_value: { type, value } },
  });
  if (!cat) {
    cat = await prisma.category.create({ data: { type, value } });
  }
  return cat;
}

async function linkProductCategory(productId, categoryId) {
  const exists = await prisma.productCategory.findUnique({
    where: { productId_categoryId: { productId, categoryId } },
  });
  if (!exists) {
    await prisma.productCategory.create({ data: { productId, categoryId } });
  }
}

async function main() {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const products = JSON.parse(raw);
  console.log(`\nLoaded ${products.length} stone series from JSON\n`);

  let mfg = await prisma.manufacturer.findFirst({ where: { name: "Brampton Brick" } });
  if (!mfg) {
    mfg = await prisma.manufacturer.create({
      data: {
        name: "Brampton Brick",
        country: "Canada",
        description: "Manufacturer of quality masonry products.",
        website: "https://www.bramptonbrick.com",
      },
    });
    console.log("Created manufacturer: Brampton Brick");
  }

  for (const item of products) {
    console.log(`\n── ${item.series_name} (${item.colours.length} colours) ──`);

    const slug = item.series_name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    let product = await prisma.product.findUnique({ where: { slug } });

    if (!product) {
      const collectionCat = await ensureCategory("collection", item.series_name);

      const colourClasses = item.colour_class
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      const colourCats = await Promise.all(
        colourClasses.map((c) => ensureCategory("colour", c))
      );

      product = await prisma.product.create({
        data: {
          name: item.series_name,
          slug,
          description: item.description,
          material: "Stone",
          manufacturers: { create: [{ manufacturerId: mfg.id }] },
          categories: {
            create: [collectionCat, ...colourCats].map((c) => ({ categoryId: c.id })),
          },
        },
      });
      console.log(`  ✓ Created Product: ${product.name}`);
    } else {
      console.log(`  – Product already exists: ${product.name}`);
    }

    if (item.colours.length === 0) {
      console.log("  (no colour variants to seed — skipping)");
      continue;
    }

    for (const colour of item.colours) {
      const existing = await prisma.variant.findUnique({ where: { sku: colour.sku } });
      if (existing) {
        console.log(`  – Variant already exists: ${colour.sku}`);
        continue;
      }

      const safeFilename = `bb-stone-${colour.sku.toLowerCase()}-${Date.now()}.webp`;
      console.log(`  Uploading image for ${colour.name}...`);
      const imageUrl = await downloadAndUploadImage(colour.image, safeFilename);

      const colourNameCat = await ensureCategory("colour", colour.name);
      await linkProductCategory(product.id, colourNameCat.id);

      await prisma.variant.create({
        data: {
          productId: product.id,
          sku: colour.sku,
          colourName: colour.name,
          hexCode: "#808080",
          sizeLabel: item.size_label,
          widthMm: null,
          heightMm: null,
          depthMm: null,
          imageUrl,
          imagesUrl: [],
          stock: colour.stocked ? "In Stock" : "Made to Order",
          isActive: true,
        },
      });
      console.log(`  ✓ Created Variant: ${colour.name} (${colour.sku})`);
    }
  }

  console.log("\n✓ Brampton Brick stone seeding complete.\n");
}

main()
  .catch((err) => {
    console.error("\nFatal:", err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
