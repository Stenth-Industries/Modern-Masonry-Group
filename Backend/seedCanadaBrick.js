/**
 * Seed Canada Brick products into the DB.
 *
 * Reads:  Backend/data/scrape_cni-canada/canadabrick-bricks.json
 * Creates: Manufacturer → Product → Categories (collection + colour) → Variant
 *
 * Images: stored as direct Canada Brick URLs (no Supabase upload — storage full).
 * Colors: hex/standardColor left null — run the color script after seeding.
 * Sizes:  sizeLabel pre-filled from scraped brick_size data; edit CSV + run
 *         push_dimensions.py --confirm to adjust if needed.
 *
 * Safe to re-run — skips any SKU that already exists in the DB.
 *
 * Run: node Backend/seedCanadaBrick.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './config/prisma.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data', 'scrape_cni-canada', 'canadabrick-bricks.json');

const MANUFACTURER_NAME = 'Canada Brick';
const MANUFACTURER_WEBSITE = 'https://canadabrick.com';
const MANUFACTURER_COUNTRY = 'Canada';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Capitalise first letter of each word */
function toTitleCase(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Build sizeLabel string from brickSizes array.
 * Format: "CSR – 70×230×90 mm|Engineer Norman – 70×290×90 mm|..."
 * Pipe-separated so push_dimensions.py handles it correctly.
 */
function buildSizeLabel(brickSizes) {
  if (!brickSizes || brickSizes.length === 0) return null;
  return brickSizes
    .map(s => `${s.name} – ${s.heightMm}×${s.lengthMm}×${s.depthMm} mm`)
    .join('|');
}

/** Find-or-create a Category row */
async function upsertCategory(type, value) {
  return prisma.category.upsert({
    where: { type_value: { type, value } },
    update: {},
    create: { type, value },
  });
}

/** Generate a unique product slug, appending -2 / -3 etc. if needed */
async function uniqueSlug(base) {
  let slug = base;
  let counter = 2;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 Canada Brick Seeder Starting...\n');

  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  const products = JSON.parse(raw);
  console.log(`📦 Loaded ${products.length} products from JSON\n`);

  // Pre-fetch existing SKUs so we can skip duplicates fast
  const existingSkus = new Set(
    (await prisma.variant.findMany({ select: { sku: true } })).map(v => v.sku)
  );
  const toSeed = products.filter(p => !existingSkus.has(p.sku));
  console.log(`Already in DB: ${products.length - toSeed.length} | To seed: ${toSeed.length}\n`);

  if (toSeed.length === 0) {
    console.log('Nothing to seed — all SKUs already exist.');
    return;
  }

  // Ensure the single manufacturer exists
  let manufacturer = await prisma.manufacturer.findFirst({ where: { name: MANUFACTURER_NAME } });
  if (!manufacturer) {
    manufacturer = await prisma.manufacturer.create({
      data: {
        name: MANUFACTURER_NAME,
        website: MANUFACTURER_WEBSITE,
        country: MANUFACTURER_COUNTRY,
        description: "Canada Brick is one of Canada's leading brick manufacturers, producing clay and calcium silicate bricks for architectural and residential projects.",
      },
    });
  }
  console.log(`✅ Manufacturer: ${manufacturer.name} (${manufacturer.id})\n`);

  let created = 0, failed = 0;

  for (let i = 0; i < toSeed.length; i++) {
    const item = toSeed[i];
    process.stdout.write(`[${i + 1}/${toSeed.length}] ${item.name.padEnd(45)}`);

    try {
      // ── Categories ──────────────────────────────────────────────────────────
      const categoryIds = [];

      // Collection
      if (item.collection) {
        const cat = await upsertCategory('collection', item.collection);
        categoryIds.push(cat.id);
      }

      // Colour — hex/standardColor filled later by color script
      if (item.color) {
        const colourValue = toTitleCase(item.color);
        const cat = await upsertCategory('colour', colourValue);
        categoryIds.push(cat.id);
      }

      // ── Product ─────────────────────────────────────────────────────────────
      const slugBase = item.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

      const slug = await uniqueSlug(slugBase);

      const product = await prisma.product.create({
        data: {
          name: item.name,
          slug,
          description: item.description || null,
          material: 'Brick',
          manufacturers: {
            create: [{ manufacturerId: manufacturer.id }],
          },
          categories: {
            create: categoryIds.map(id => ({ categoryId: id })),
          },
        },
      });

      // ── Variant ─────────────────────────────────────────────────────────────
      const sizeLabel = buildSizeLabel(item.brickSizes);

      // Use first brick size's dimensions as the representative dims for this variant
      const primarySize = item.brickSizes?.[0] ?? null;

      await prisma.variant.create({
        data: {
          productId:  product.id,
          sku:        item.sku,
          colourName: item.color ? toTitleCase(item.color) : null,
          sizeLabel,
          heightMm:   primarySize?.heightMm ?? null,
          widthMm:    primarySize?.lengthMm ?? null,
          depthMm:    primarySize?.depthMm  ?? null,
          imageUrl:   item.imageUrl || null,
          imagesUrl:  [],
          stock:      'In Stock',
          isActive:   true,
        },
      });

      created++;
      console.log(`✓  ${item.collection || '—'}`);

    } catch (err) {
      failed++;
      console.log(`✗  FAILED: ${err.message.slice(0, 80)}`);
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log(`✅ Done.  Created: ${created}  |  Failed: ${failed}`);
  console.log('\nNext steps:');
  console.log('  1. python scripts/export_dimensions.py   → adds new SKUs to CSV');
  console.log('  2. python scripts/extract_brick_colors.py → extracts hex/lab from images');
  console.log('  3. python scripts/push_dimensions.py --confirm → syncs CSV back to DB\n');
}

main()
  .catch(err => {
    console.error('\n💥 Fatal:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
