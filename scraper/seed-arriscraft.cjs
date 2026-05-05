/**
 * Arriscraft brick seeder
 * Reads scraper/arriscraft-bricks.json and upserts into the Prisma DB.
 *
 * Run from repo root:
 *   node scraper/seed-arriscraft.cjs
 *
 * Safe to re-run — uses upsert/findOrCreate patterns throughout.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });

const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg } = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool } = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.on('error', (err) => console.error('[pool]', err.message));
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const bricks = require('./arriscraft-bricks.json');

// ─── Colour map for swatches ───────────────────────────────────────────────────
const COLOR_HEX = {
  'Alpine White':    '#F0EDE8',
  'Ivory White':     '#EDE0C4',
  'Mystic Grey':     '#A0A0A0',
  'Weathered Oak':   '#C8A87A',
  'Black Coral':     '#2C2C2C',
  'Coastal Fog':     '#B8C4C8',
  'Ocean Mist':      '#8EA8B0',
  'Sea Shell':       '#E8D8C8',
  'Charcoal':        '#4A4A4A',
  'Georgetown Blend':'#8C7B6A',
  'Mahogany':        '#6B3A2A',
  'Midnight Grey':   '#3A3A3A',
  'Millstone':       '#7A7268',
  'Obsidian':        '#1A1A1A',
  'Opal':            '#C8C0B8',
  'Walnut':          '#5A4030',
  'Burnt Umber':     '#8B4513',
  'Cedar Woods':     '#7B5234',
  'Chateau Brown':   '#6B4C3B',
  'Evening Shade':   '#5A4A5A',
  'Forged Steel':    '#506070',
  'Harbor Grey':     '#708090',
  'Red Sumac':       '#A03020',
  'White Pearl':     '#F0EDE6',
  'Sandy Shore':     '#C8B890',
  'Southern Dusk':   '#9A7868',
};

function slugify(text) {
  return text.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function generateSku(color, series, variant) {
  const c = color.toUpperCase().replace(/\s+/g, '-').slice(0, 8);
  const s = series === 'Architectural Linear Series Brick' ? 'ALSB' :
            series === 'Contemporary Brick' ? 'CONT' :
            series === 'Tumbled Vintage Brick' ? 'TVB' :
            series === 'Tumbled Georgia Brick' ? 'TGB' :
            series === 'Avanti' ? 'AVT' : 'BRK';
  const v = variant ? '-' + variant.toUpperCase().split(/\s+/).map(w => w[0]).join('') : '';
  return `ARRIS-${c}-${s}${v}`;
}

async function findOrCreateCategory(type, value, hexCode = null) {
  return prisma.category.upsert({
    where: { type_value: { type, value } },
    update: hexCode ? { hexCode } : {},
    create: { type, value, hexCode },
  });
}

async function main() {
  console.log('🧱  Arriscraft Seeder Starting...\n');

  // ── 1. Upsert manufacturer ─────────────────────────────────────────────────
  const manufacturer = await prisma.manufacturer.upsert({
    where: { id: 'arriscraft-intl' },
    update: {},
    create: {
      id: 'arriscraft-intl',
      name: 'Arriscraft International',
      website: 'https://arriscraft.com',
      country: 'Canada',
      description: 'Arriscraft International manufactures premium calcium silicate bricks and masonry products at facilities in Cambridge, Ontario and Fort Valley, Georgia.',
    },
  });
  console.log(`✅  Manufacturer: ${manufacturer.name}\n`);

  // ── 2. Pre-build category cache ────────────────────────────────────────────
  const catCache = new Map(); // "type:value" → category

  const allSeries   = [...new Set(bricks.map(b => b.series))];
  const allVariants = [...new Set(bricks.map(b => b.seriesVariant).filter(Boolean))];
  const allColors   = [...new Set(bricks.map(b => b.color))];
  const allFinishes = [...new Set(bricks.map(b => b.finish).filter(Boolean))];
  const allRegions  = [...new Set(bricks.map(b => b.region))];

  for (const s of allSeries) {
    const cat = await findOrCreateCategory('collection', s);
    catCache.set(`collection:${s}`, cat);
  }
  for (const v of allVariants) {
    const cat = await findOrCreateCategory('style', v);
    catCache.set(`style:${v}`, cat);
  }
  for (const c of allColors) {
    const hex = COLOR_HEX[c] || null;
    const cat = await findOrCreateCategory('colour', c, hex);
    catCache.set(`colour:${c}`, cat);
  }
  for (const f of allFinishes) {
    const cat = await findOrCreateCategory('style', f);
    catCache.set(`style:${f}`, cat);
  }
  for (const r of allRegions) {
    const cat = await findOrCreateCategory('region', r);
    catCache.set(`region:${r}`, cat);
  }
  console.log(`✅  Categories upserted: ${catCache.size} total\n`);

  // ── 3. Seed each product ───────────────────────────────────────────────────
  let created = 0, updated = 0, skipped = 0;

  for (const brick of bricks) {
    const productSlug = `arriscraft-${brick.slug}`;
    const sku = generateSku(brick.color, brick.series, brick.seriesVariant);

    // Determine product name: "Color – Series" (clean)
    const seriesShort = brick.series === 'Architectural Linear Series Brick'
      ? `ALSB${brick.seriesVariant ? ' – ' + brick.seriesVariant : ''}`
      : brick.series;
    const productName = `${brick.color} – ${seriesShort}`;

    // Images: first jpg is primary, rest go in imagesUrl[]
    const jpgImages = brick.imageUrls.filter(u => /\.(jpg|jpeg)$/i.test(u));
    const primaryImage = jpgImages[0] || null;
    const galleryImages = jpgImages.slice(1);

    try {
      // Upsert product
      const product = await prisma.product.upsert({
        where: { slug: productSlug },
        update: {
          name: productName,
          description: brick.description,
          material: brick.material,
        },
        create: {
          slug: productSlug,
          name: productName,
          description: brick.description,
          material: brick.material,
        },
      });

      // Link manufacturer
      await prisma.productManufacturer.upsert({
        where: { productId_manufacturerId: { productId: product.id, manufacturerId: manufacturer.id } },
        update: {},
        create: { productId: product.id, manufacturerId: manufacturer.id },
      });

      // Link categories
      const categoriesToLink = [
        catCache.get(`collection:${brick.series}`),
        brick.seriesVariant ? catCache.get(`style:${brick.seriesVariant}`) : null,
        catCache.get(`colour:${brick.color}`),
        catCache.get(`region:${brick.region}`),
        brick.finish ? catCache.get(`style:${brick.finish}`) : null,
      ].filter(Boolean);

      for (const cat of categoriesToLink) {
        await prisma.productCategory.upsert({
          where: { productId_categoryId: { productId: product.id, categoryId: cat.id } },
          update: {},
          create: { productId: product.id, categoryId: cat.id },
        });
      }

      // Upsert variant (imagesUrl is String[] — must use { set: [] } in update)
      await prisma.variant.upsert({
        where: { sku },
        update: {
          colourName: brick.color,
          hexCode: COLOR_HEX[brick.color] || null,
          sizeLabel: brick.dimensions || null,
          imageUrl: primaryImage,
          imagesUrl: { set: galleryImages },
          isActive: true,
        },
        create: {
          productId: product.id,
          sku,
          colourName: brick.color,
          hexCode: COLOR_HEX[brick.color] || null,
          sizeLabel: brick.dimensions || null,
          imageUrl: primaryImage,
          imagesUrl: galleryImages,
          isActive: true,
        },
      });

      created++;
      process.stdout.write(`  ✓ ${productName.padEnd(60)} [${sku}]\n`);
    } catch (err) {
      console.error(`  ✗ FAILED: ${brick.slug} — ${err.message}`);
      skipped++;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`Done. ${created} upserted, ${skipped} failed`);
  console.log(`Total Arriscraft products in DB: ${created}`);
}

main()
  .catch(err => { console.error(err); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
