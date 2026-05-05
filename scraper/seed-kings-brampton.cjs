/**
 * Seeds Brampton Brick entries from kings_with_series.json into the catalog.
 * Wipes existing Brampton Brick data first, then reseeds from Kings data.
 * Run from repo root: node scraper/seed-kings-brampton.cjs
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });

const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

const allKings = require('../Backend/kings_with_series.json');
const bramptonScrape = require('../Backend/data/brampton_brick.json');

// Valid Brampton series names (from scrape data)
const validBramptonSeries = new Set(bramptonScrape.map(b => b.series_name));

// Lookup: brick name → Brampton series_name
const bramptonByName = {};
bramptonScrape.forEach(b => {
  bramptonByName[b.variant.toLowerCase().trim()] = b.series_name;
});

const kingsBrampton = allKings.filter(b =>
  b.manufacturer && b.manufacturer.toLowerCase().includes('brampton')
);

const bricks = kingsBrampton
  .map(b => {
    // Use Brampton scrape series_name if brick is found there
    const bramptonSeries = bramptonByName[b.name.toLowerCase().trim()];
    const series = bramptonSeries || (validBramptonSeries.has(b.series_name) ? b.series_name : null);
    return { ...b, series_name: series };
  })
  .filter(b =>
    b.series_name &&                     // drop bricks with no valid Brampton series
    b.series_name !== 'Finesse Brick'    // drop Finesse Brick
  );

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  console.log('🧱  Seeding Brampton Brick from Kings data...\n');

  const mfg = await prisma.manufacturer.findFirst({ where: { name: 'Brampton Brick' } });
  if (!mfg) throw new Error('Manufacturer "Brampton Brick" not found');

  // Wipe existing Brampton data
  const existingLinks = await prisma.productManufacturer.findMany({
    where: { manufacturerId: mfg.id },
    select: { productId: true },
  });
  const oldProductIds = existingLinks.map(l => l.productId);
  if (oldProductIds.length) {
    await prisma.variant.deleteMany({ where: { productId: { in: oldProductIds } } });
    await prisma.productCategory.deleteMany({ where: { productId: { in: oldProductIds } } });
    await prisma.productManufacturer.deleteMany({ where: { productId: { in: oldProductIds } } });
    await prisma.product.deleteMany({ where: { id: { in: oldProductIds } } });
    console.log(`Wiped ${oldProductIds.length} existing Brampton products.\n`);
  }

  // Group by series
  const bySeries = {};
  for (const brick of bricks) {
    if (!bySeries[brick.series_name]) bySeries[brick.series_name] = [];
    bySeries[brick.series_name].push(brick);
  }

  for (const [seriesName, items] of Object.entries(bySeries)) {
    const slug = `brampton-${toSlug(seriesName)}`;

    const collCat = await prisma.category.upsert({
      where: { type_value: { type: 'collection', value: seriesName } },
      update: {},
      create: { type: 'collection', value: seriesName },
    });

    const product = await prisma.product.create({
      data: {
        name: seriesName,
        slug,
        description: `Brampton Brick ${seriesName} series.`,
        material: 'Brick',
        manufacturers: { create: [{ manufacturerId: mfg.id }] },
        categories: { create: [{ categoryId: collCat.id }] },
      },
    });
    console.log(`📦  ${seriesName} (${items.length} variants)`);

    for (const brick of items) {
      const sku = `BB-KINGS-${toSlug(seriesName).substring(0, 6).toUpperCase()}-${toSlug(brick.name).substring(0, 8).toUpperCase()}-${brick.id || Math.floor(Math.random()*9000+1000)}`;
      const images = (brick.images || []).filter(u => u && !u.includes('King-Logo'));

      await prisma.variant.create({
        data: {
          productId: product.id,
          sku,
          colourName: brick.name,
          imageUrl: brick.image || images[0] || null,
          imagesUrl: images,
          isActive: true,
        },
      });
      console.log(`   ✓ ${brick.name}`);
    }
  }

  console.log('\n✅  Done.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
