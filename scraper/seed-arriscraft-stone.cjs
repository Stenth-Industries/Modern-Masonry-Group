/**
 * Arriscraft stone seeder
 * Reads scraper/arriscraft-stone.json and upserts into the Prisma DB.
 *
 * Run from repo root:
 *   node scraper/seed-arriscraft-stone.cjs
 *
 * Safe to re-run — uses upsert patterns throughout.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });

const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({
  connectionString:   process.env.DATABASE_URL,
  max:                3,
  idleTimeoutMillis:  0,       // never drop idle connections
  keepAlive:          true,
});
pool.on('error', (err) => console.error('[pool]', err.message));
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

// Exclude only Elevation Thin Brick — everything else is stone
const allStones = require('./arriscraft-stone.json');
const stones = allStones.filter(s => s.series !== 'Elevation Thin Brick');

// ── Colour hex map ─────────────────────────────────────────────────────────────
const COLOR_HEX = {
  // Fresco
  'Cashmere':            '#D4C4A8',
  'Charcoal':            '#4A4A4A',
  'Driftwood':           '#B8A888',
  'French Country':      '#C8B898',
  'Greige':              '#B0A090',
  'Infinity':            '#686058',
  'Moonstone':           '#C8C8C0',
  'Silverado':           '#A0A098',
  'Traditional Grey':    '#909088',
  // Laurier
  'Bloomington':         '#D0C0A0',
  'Ivory White':         '#EDE0C4',
  'Mahogany':            '#6B3A2A',
  'Midnight Grey':       '#3A3A3A',
  'Onyx':                '#1A1A1A',
  'Opal':                '#C8C0B8',
  'Walnut':              '#5A4030',
  // Coastal
  'Amalfi':              '#D0C8B0',
  'Baja':                '#C8B890',
  'Cape Cod':            '#B0B0A0',
  'Dark Shore':          '#706858',
  'Monterey':            '#A09880',
  'White Cliff':         '#E8E0D0',
  // Stack
  'Anvil':               '#707070',
  'Ash':                 '#B8B0A8',
  'Beach':               '#D8C8A8',
  'Desert Sand':         '#C8B888',
  'Ice':                 '#D8D8D0',
  'Matrix':              '#808880',
  'Sedona Red':          '#A04830',
  'Sterling':            '#A0A0A0',
  // Midtown
  'Abbey Road':          '#B0A890',
  'Biscayne':            '#C0B898',
  'Lombard':             '#C8B888',
  'Manhattan':           '#A09880',
  'Peachtree':           '#D0B898',
  // Shadow Stone
  'Steel Grey':          '#707880',
  'Tacoma':              '#907860',
  // Urban Ledgestone
  'Avalanche':           '#E0D8D0',
  'Driftwood':           '#B8A888',
  'Steel Grey':          '#707880',
  // Edge Rock
  'Glacier':             '#C8D0D0',
  // Highfalls Ledgestone
  'Beech Mountain':      '#C0B090',
  'Blackrock':           '#3A3530',
  'Cloudland':           '#A8A090',
  // Georgia Renaissance
  'Basalt':              '#505850',
  'Cafe':                '#9A7858',
  'Champagne':           '#D0C0A0',
  'Ginger':              '#B07848',
  'Limestone':           '#D0C8B0',
  'Magnolia':            '#E0D8C8',
  'Montecito':           '#C0A878',
  'Mountain Ridge':      '#907060',
  'Oak Ridge':           '#A89070',
  'Redrock':             '#A04030',
  'Sunset':              '#C07848',
  // Georgia Citadel
  'Cobble Hill':         '#9A8870',
  'Indiana Blend':       '#A09070',
  'Mocha':               '#7A5A40',
  'Rockport Grey':       '#808880',
  'Savannah':            '#C0A878',
  'Silver Slate':        '#909098',
  'Weatherwood':         '#A09080',
  // Cambridge Renaissance
  'Bedford':             '#D0C8B0',
  'Birchbark':           '#D8D0C0',
  'Blacksmith':          '#505048',
  'Carbon':              '#404038',
  'Ironstone':           '#706858',
  'Nutmeg':              '#A07848',
  'Sandrift':            '#C8B898',
  'White':               '#E8E4DC',
  // Matterhorn
  'Augusta':             '#B0A090',
  'Barnwood':            '#907868',
  'Blueridge':           '#708090',
  'Chalet':              '#C0B098',
  'Cotton Creek':        '#D0C8B0',
  'Saddle':              '#A07858',
  // Evolution
  // Adair
  'Blue Grey':           '#8090A0',
  'Sepia':               '#9A7858',
  'Blue Grey Georgian Blend': '#7888A0',
  'Sepia Georgian Blend':     '#9A7858',
  // Sills
  'Gray':                '#909090',
  'Brown':               '#7A6050',
  'Tan':                 '#C4A57B',
  // Old Country
  'Big Horn':            '#8A7060',
  'Smoky Mountain':      '#786858',
};

function slugify(text) {
  return text.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function generateSku(color, series) {
  const c = color.toUpperCase().replace(/[^A-Z0-9]/g, '-').slice(0, 10);
  const seriesCode = {
    'Fresco':                        'FRE',
    'Laurier':                       'LAU',
    'Coastal':                       'CST',
    'Stack':                         'STK',
    'Midtown':                       'MDT',
    'Shadow Stone':                  'SHS',
    'Urban Ledgestone':              'ULS',
    'Edge Rock':                     'EDR',
    'Highfalls Ledgestone':          'HFL',
    'Georgia Renaissance':           'GRN',
    'Georgia Citadel':               'GCT',
    'Cambridge Renaissance':         'CRN',
    'Matterhorn':                    'MTH',
    'Evolution':                     'EVO',
    'Elevation Thin Brick':          'ETB',
    'Arris Tile':                    'ATL',
    'Arris Clip':                    'ACP',
    'Arris Cast':                    'ACT',
    'Old Country':                   'OLC',
    'Adair Limestone':               'ADL',
    'Adair Masonry Units':           'ADM',
    'Adair Anchored Dimension Stone':'ADA',
    'Adair Parliament':              'ADP',
    'Sills':                         'SIL',
  };
  const s = seriesCode[series] || 'STN';
  return `ARRIS-${c}-${s}`;
}

async function findOrCreateCategory(type, value, hexCode = null) {
  return prisma.category.upsert({
    where:  { type_value: { type, value } },
    update: hexCode ? { hexCode } : {},
    create: { type, value, hexCode },
  });
}

async function main() {
  console.log('🪨  Arriscraft Stone Seeder Starting...\n');

  // ── 1. Upsert manufacturer ─────────────────────────────────────────────────
  const manufacturer = await prisma.manufacturer.upsert({
    where:  { id: 'arriscraft-intl' },
    update: {},
    create: {
      id:          'arriscraft-intl',
      name:        'Arriscraft International',
      website:     'https://arriscraft.com',
      country:     'Canada',
      description: 'Arriscraft International manufactures premium calcium silicate bricks and masonry products at facilities in Cambridge, Ontario and Fort Valley, Georgia.',
    },
  });
  console.log(`✅  Manufacturer: ${manufacturer.name}\n`);

  // ── 2. Pre-build category cache ────────────────────────────────────────────
  const catCache  = new Map();
  const allSeries = [...new Set(stones.map(s => s.series))];
  const allColors = [...new Set(stones.map(s => s.color))];
  const allFinish = [...new Set(stones.map(s => s.finish).filter(Boolean))];
  const allRegion = [...new Set(stones.map(s => s.region))];

  for (const s of allSeries) {
    const cat = await findOrCreateCategory('collection', s);
    catCache.set(`collection:${s}`, cat);
  }
  for (const c of allColors) {
    const hex = COLOR_HEX[c] || null;
    const cat = await findOrCreateCategory('colour', c, hex);
    catCache.set(`colour:${c}`, cat);
  }
  for (const f of allFinish) {
    const cat = await findOrCreateCategory('style', f);
    catCache.set(`style:${f}`, cat);
  }
  for (const r of allRegion) {
    const cat = await findOrCreateCategory('region', r);
    catCache.set(`region:${r}`, cat);
  }
  // Tag all as Stone material
  const stoneCat = await findOrCreateCategory('material', 'Stone');
  catCache.set('material:Stone', stoneCat);

  console.log(`✅  Categories upserted: ${catCache.size} total\n`);

  // ── 3. Seed each product ───────────────────────────────────────────────────
  let upserted = 0, failed = 0;

  for (const stone of stones) {
    const productSlug = `arriscraft-${stone.slug}`;
    const sku         = generateSku(stone.color, stone.series);
    const productName = stone.name;

    const jpgImages = stone.imageUrls.filter(u => /\.(jpg|jpeg|png)$/i.test(u));

    // Image selection priority (best swatch → worst house photo):
    //   1. SS (Stone Swatch) images with the product's color
    //   2. WEB-/Web- prefix images with the color
    //   3. Any color-matched image that isn't a Full-Bed-Stone / ALSB building photo
    //   4. First non-ALSB, non-Full-Bed-Stone image
    //   5. First non-ALSB image
    //   6. Absolute fallback: first image
    //
    // colorParts splits "Steel Grey" → ["steel","grey"] so both hyphens and underscores match.
    // House-photo patterns — never use these as the card thumbnail.
    // If no clean swatch exists, leave imageUrl null so the card renders
    // the colour-pattern fallback instead of a building exterior.
    const HOUSE_PATTERNS = ['Full-Bed-Stone', 'Full-Bed-', 'ALSB', 'Landscape', 'Gies-Hospice'];
    const isHousePhoto = (u) => HOUSE_PATTERNS.some(p => u.includes(p));

    const colorParts = stone.color.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim().split(/\s+/);
    const urlHasColor = (u) => { const l = u.toLowerCase(); return colorParts.every(p => l.includes(p)); };
    const noHouse    = jpgImages.filter(u => !isHousePhoto(u));
    const ssColor    = noHouse.filter(u => /-SS-/i.test(u) && urlHasColor(u));
    const webColor   = noHouse.filter(u => /\/(WEB-|Web-)/i.test(u) && urlHasColor(u));
    const cleanColor = noHouse.filter(u => urlHasColor(u));
    // null means: no clean swatch found — card will use colour-pattern fallback
    const primaryImage = ssColor[0] || webColor[0] || cleanColor[0] || noHouse[0] || null;
    const galleryImages = jpgImages.filter(u => u !== primaryImage);

    try {
      const product = await prisma.product.upsert({
        where:  { slug: productSlug },
        update: { name: productName, description: stone.description, material: stone.material },
        create: { slug: productSlug, name: productName, description: stone.description, material: stone.material },
      });

      // Manufacturer link
      await prisma.productManufacturer.upsert({
        where:  { productId_manufacturerId: { productId: product.id, manufacturerId: manufacturer.id } },
        update: {},
        create: { productId: product.id, manufacturerId: manufacturer.id },
      });

      // Categories
      const cats = [
        catCache.get(`collection:${stone.series}`),
        catCache.get(`colour:${stone.color}`),
        catCache.get(`region:${stone.region}`),
        stone.finish ? catCache.get(`style:${stone.finish}`) : null,
        catCache.get('material:Stone'),
      ].filter(Boolean);

      for (const cat of cats) {
        await prisma.productCategory.upsert({
          where:  { productId_categoryId: { productId: product.id, categoryId: cat.id } },
          update: {},
          create: { productId: product.id, categoryId: cat.id },
        });
      }

      // Variant
      await prisma.variant.upsert({
        where:  { sku },
        update: {
          colourName:  stone.color,
          hexCode:     COLOR_HEX[stone.color] || null,
          sizeLabel:   stone.sizeLabel || null,
          imageUrl:    primaryImage,
          imagesUrl:   { set: galleryImages },
          isActive:    true,
        },
        create: {
          productId:   product.id,
          sku,
          colourName:  stone.color,
          hexCode:     COLOR_HEX[stone.color] || null,
          sizeLabel:   stone.sizeLabel || null,
          imageUrl:    primaryImage,
          imagesUrl:   galleryImages,
          isActive:    true,
        },
      });

      upserted++;
      process.stdout.write(`  ✓ ${productName.padEnd(55)} [${sku}]\n`);
    } catch (err) {
      console.error(`  ✗ FAILED: ${stone.slug} — ${err.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`Done. ${upserted} upserted, ${failed} failed`);
}

main()
  .catch(err => { console.error(err); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
