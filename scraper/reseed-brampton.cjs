/**
 * Re-seed Brampton Brick with correct structure:
 *   Product  = Series  (e.g. "Dorset", slug "brampton-dorset")
 *   Variant  = brick colour name (e.g. "Ashland")
 *   imageUrl = brick swatch image (direct bramptonbrick.com URL)
 *   imagesUrl = house/application images array
 *
 * Run from repo root:
 *   node scraper/reseed-brampton.cjs
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });

const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

const bricks = require('../Backend/data/brampton_brick.json');

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  console.log('🧱  Re-seeding Brampton Brick...\n');

  // 1. Find the manufacturer (must already exist)
  const mfg = await prisma.manufacturer.findFirst({ where: { name: 'Brampton Brick' } });
  if (!mfg) throw new Error('Manufacturer "Brampton Brick" not found — run seedBrampton first to create it');

  // 2. Collect all product IDs linked to Brampton Brick
  const existingLinks = await prisma.productManufacturer.findMany({
    where: { manufacturerId: mfg.id },
    select: { productId: true },
  });
  const oldProductIds = existingLinks.map(l => l.productId);
  console.log(`Found ${oldProductIds.length} existing Brampton products to wipe.\n`);

  if (oldProductIds.length) {
    // Delete in dependency order
    await prisma.variant.deleteMany({ where: { productId: { in: oldProductIds } } });
    await prisma.productCategory.deleteMany({ where: { productId: { in: oldProductIds } } });
    await prisma.productManufacturer.deleteMany({ where: { productId: { in: oldProductIds } } });
    await prisma.product.deleteMany({ where: { id: { in: oldProductIds } } });
    console.log('✅  Old data wiped.\n');
  }

  // 3. Upsert collection categories for all 6 series
  const seriesNames = [...new Set(bricks.map(b => b.series_name))];
  const collectionMap = {};
  for (const name of seriesNames) {
    const cat = await prisma.category.upsert({
      where: { type_value: { type: 'collection', value: name } },
      update: {},
      create: { type: 'collection', value: name },
    });
    collectionMap[name] = cat;
    console.log(`✅  Collection category: ${name}`);
  }
  console.log('');

  // 4. Group bricks by series
  const bySeries = {};
  for (const brick of bricks) {
    if (!bySeries[brick.series_name]) bySeries[brick.series_name] = [];
    bySeries[brick.series_name].push(brick);
  }

  // 5. For each series create a Product, then one Variant per brick
  for (const [seriesName, items] of Object.entries(bySeries)) {
    const slug = `brampton-${toSlug(seriesName)}`;
    const collCat = collectionMap[seriesName];

    // Build colour category ids for this series
    const colourClasses = [...new Set(
      items.flatMap(i =>
        (i.features?.['COLOUR CLASS'] || '')
          .split(',')
          .map(s => s.trim().toLowerCase())
          .filter(Boolean)
          .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      )
    )];

    const colourCatIds = [];
    for (const colourValue of colourClasses) {
      const cat = await prisma.category.upsert({
        where: { type_value: { type: 'colour', value: colourValue } },
        update: {},
        create: { type: 'colour', value: colourValue },
      });
      colourCatIds.push(cat.id);
    }

    // Collect style categories
    const styleValues = [...new Set(
      items.flatMap(i =>
        (i.features?.STYLE || '')
          .split(',')
          .map(s => s.trim().toLowerCase())
          .filter(Boolean)
          .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      )
    )];

    const styleCatIds = [];
    for (const styleValue of styleValues) {
      const cat = await prisma.category.upsert({
        where: { type_value: { type: 'style', value: styleValue } },
        update: {},
        create: { type: 'style', value: styleValue },
      });
      styleCatIds.push(cat.id);
    }

    const allCategoryIds = [collCat.id, ...colourCatIds, ...styleCatIds];

    // Representative description from first item
    const firstItem = items[0];
    const description = `Brampton Brick ${seriesName} series. ${firstItem.features?.['RECOMMENDED USE'] ? 'Recommended for: ' + firstItem.features['RECOMMENDED USE'] + '.' : ''}`.trim();

    // Create the product
    const product = await prisma.product.create({
      data: {
        name: seriesName,
        slug,
        description,
        material: firstItem.features?.MATERIAL || 'Concrete',
        manufacturers: { create: [{ manufacturerId: mfg.id }] },
        categories: { create: allCategoryIds.map(id => ({ categoryId: id })) },
      },
    });
    console.log(`\n📦  Product: ${seriesName} (${slug})`);

    // Create one variant per brick
    for (const brick of items) {
      const colourName = brick.variant;

      // Dimensions
      let widthMm = null, heightMm = null, depthMm = null;
      if (brick.dimensions) {
        const wm = brick.dimensions.match(/LENGTH\s+([\d.]+)\s*MM/i);
        const hm = brick.dimensions.match(/HEIGHT\s+([\d.]+)\s*MM/i);
        const dm = brick.dimensions.match(/DEPTH\s+([\d.]+)\s*MM/i);
        if (wm) widthMm = parseFloat(wm[1]);
        if (hm) heightMm = parseFloat(hm[1]);
        if (dm) depthMm = parseFloat(dm[1]);
      }

      const skuBase = `BB-${toSlug(seriesName).substring(0, 4).toUpperCase()}-${toSlug(colourName).substring(0, 4).toUpperCase()}`;
      const sku = `${skuBase}-${Math.floor(1000 + Math.random() * 9000)}`;

      await prisma.variant.create({
        data: {
          productId: product.id,
          sku,
          colourName,
          sizeLabel: brick.dimensions
            ? brick.dimensions.split('\n')[0].replace(/\s+/g, ' ').trim()
            : null,
          widthMm,
          heightMm,
          depthMm,
          imageUrl: brick.brick_image || null,
          imagesUrl: brick.house_images || [],
          isActive: true,
        },
      });
      console.log(`   ✓ ${colourName.padEnd(40)} [img: ${brick.brick_image ? 'YES' : 'NO'}, gallery: ${brick.house_images?.length || 0}]`);
    }
  }

  console.log('\n✅  Done. Brampton Brick re-seeded correctly.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
