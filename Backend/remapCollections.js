/**
 * Remaps Arriscraft brick products in the DB from King's scraped labels
 * to the correct manufacturer series names from scraper/arriscraft-bricks.json
 *
 * King label       → Correct Arriscraft series
 * "Elongated Brick"  → match by color in scrape → correct series
 * "Tumbled"          → "Tumbled Vintage Brick"
 * "Tumbled Brick"    → "Tumbled Vintage Brick"
 */

import fs from 'fs/promises';
import prisma from './config/prisma.js';

const KINGS_WRONG_LABELS = ['Elongated Brick', 'Tumbled', 'Tumbled Brick'];

async function main() {
  const raw = await fs.readFile('../scraper/arriscraft-bricks.json', 'utf-8');
  const scrape = JSON.parse(raw);

  // Build lookup: color (lowercase) → [series, ...] from manufacturer scrape
  const colorToSeries = {};
  for (const b of scrape) {
    const color = b.color?.toLowerCase().trim();
    if (!color) continue;
    if (!colorToSeries[color]) colorToSeries[color] = [];
    if (!colorToSeries[color].includes(b.series)) {
      colorToSeries[color].push(b.series);
    }
  }

  // Get all Arriscraft brick products with King's wrong labels
  const orphans = await prisma.product.findMany({
    where: {
      material: { equals: 'Brick', mode: 'insensitive' },
      manufacturers: { some: { manufacturer: { name: { contains: 'Arriscraft', mode: 'insensitive' } } } },
      categories: {
        some: {
          category: { type: 'collection', value: { in: KINGS_WRONG_LABELS, mode: 'insensitive' } }
        }
      }
    },
    include: {
      categories: { include: { category: true } }
    }
  });

  console.log(`Found ${orphans.length} products with King's labels to remap.\n`);

  let updated = 0;
  let skipped = 0;

  for (const product of orphans) {
    const currentCollCat = product.categories.find(
      c => c.category.type === 'collection' && KINGS_WRONG_LABELS.includes(c.category.value)
    );
    if (!currentCollCat) continue;

    const currentLabel = currentCollCat.category.value;

    // Determine correct series
    let correctSeries;

    if (currentLabel === 'Tumbled' || currentLabel === 'Tumbled Brick') {
      correctSeries = 'Tumbled Vintage Brick';
    } else {
      // "Elongated Brick" — look up color in scrape
      const colorName = product.name.split('–')[0].split('-')[0].trim().toLowerCase();
      const matches = colorToSeries[colorName];
      if (!matches || matches.length === 0) {
        console.log(`  SKIP (no scrape match): ${product.name}`);
        skipped++;
        continue;
      }
      // Prefer ALSB if multiple matches, otherwise take first
      correctSeries = matches.find(s => s.includes('Architectural Linear')) || matches[0];
    }

    console.log(`  ${product.name}: "${currentLabel}" → "${correctSeries}"`);

    // Find or create the correct collection category
    let correctCat = await prisma.category.findUnique({
      where: { type_value: { type: 'collection', value: correctSeries } }
    });
    if (!correctCat) {
      correctCat = await prisma.category.create({
        data: { type: 'collection', value: correctSeries }
      });
    }

    // Remove old wrong category link
    await prisma.productCategory.deleteMany({
      where: {
        productId: product.id,
        categoryId: currentCollCat.categoryId
      }
    });

    // Add correct category link (if not already there)
    const existing = await prisma.productCategory.findUnique({
      where: { productId_categoryId: { productId: product.id, categoryId: correctCat.id } }
    });
    if (!existing) {
      await prisma.productCategory.create({
        data: { productId: product.id, categoryId: correctCat.id }
      });
    }

    updated++;
  }

  console.log(`\nDone. Updated: ${updated} | Skipped: ${skipped}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
