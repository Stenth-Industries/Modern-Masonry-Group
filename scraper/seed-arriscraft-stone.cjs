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

// Build a unique SKU per product using the slug suffix to differentiate
// finish (Sawn/Natural) and size (Midtown 2-1/8, 3-5/8, 5-7/8) variants.
// The slug is already unique, so stripping the {color}-{series} prefix gives
// a reliable disambiguator (e.g. 'sawn', '218sawn', '358').
function generateSku(color, series, slug) {
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

  // Extract any suffix beyond {colorSlug}-{seriesSlug} from the product slug
  const colorSlug  = color.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const seriesSlug = series.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const prefix     = colorSlug + '-' + seriesSlug;
  let suffix = '';
  if (slug && slug.startsWith(prefix)) {
    const extra = slug.slice(prefix.length).replace(/^-/, ''); // e.g. 'sawn', '2-1-8-sawn', '3-5-8'
    if (extra) suffix = '-' + extra.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
  }

  return `ARRIS-${c}-${s}${suffix}`;
}

// Derive a short human-readable variant label from the slug suffix.
// e.g. '2-1-8-sawn' → '2-1/8" Sawn', 'sawn' → 'Sawn', '' → null
function deriveVariantLabel(color, series, slug) {
  const colorSlug  = color.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const seriesSlug = series.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const prefix     = colorSlug + '-' + seriesSlug;
  if (!slug.startsWith(prefix)) return null;
  const suffix = slug.slice(prefix.length).replace(/^-/, '');
  if (!suffix) return null;

  // Size pattern: '2-1-8' or '2-1-8-sawn'
  const sizeMatch = suffix.match(/^(\d+)-(\d+)-(\d+)(?:-(sawn))?$/i);
  if (sizeMatch) {
    const height = `${sizeMatch[1]}-${sizeMatch[2]}/${sizeMatch[3]}"`;
    return sizeMatch[4] ? `${height} Sawn` : height;
  }
  // Plain finish
  if (suffix.toLowerCase() === 'sawn')    return 'Sawn';
  if (suffix.toLowerCase() === 'natural') return 'Natural';
  return suffix;
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

  // ── 3. Group stones by (color, series) so same stone = one product ──────────
  // Different finishes/sizes (Sawn, Natural, 2-1/8", 3-5/8" etc.) become
  // separate variants of the same product rather than separate products.
  const HOUSE_PATTERNS = ['Full-Bed-Stone', 'Full-Bed-', 'ALSB', 'Landscape', 'Gies-Hospice'];
  const isHousePhoto   = (u) => HOUSE_PATTERNS.some(p => u.includes(p));

  function pickPrimaryImage(stone) {
    const jpgImages  = stone.imageUrls.filter(u => /\.(jpg|jpeg|png)$/i.test(u));
    const noHouse    = jpgImages.filter(u => !isHousePhoto(u));
    const fullSize   = noHouse.filter(u => !/[-_]1024x/.test(u));
    const thumbs     = noHouse.filter(u => /[-_]1024x/.test(u));
    return fullSize[0] || thumbs[0] || jpgImages[0] || null;
  }

  // Build ordered groups preserving JSON order
  const groupOrder = [];
  const groups     = new Map();
  for (const stone of stones) {
    const key = `${stone.color}||${stone.series}`;
    if (!groups.has(key)) { groups.set(key, []); groupOrder.push(key); }
    groups.get(key).push(stone);
  }

  let upserted = 0, failed = 0;

  for (const key of groupOrder) {
    const variants    = groups.get(key);
    const primary     = variants[0];
    // Base slug: color + series only (no finish/size suffix)
    const baseSlug    = slugify(primary.color) + '-' + slugify(primary.series);
    const productSlug = `arriscraft-${baseSlug}`;
    const productName = primary.name;

    try {
      const product = await prisma.product.upsert({
        where:  { slug: productSlug },
        update: { name: productName, description: primary.description, material: primary.material },
        create: { slug: productSlug, name: productName, description: primary.description, material: primary.material },
      });

      // Manufacturer link
      await prisma.productManufacturer.upsert({
        where:  { productId_manufacturerId: { productId: product.id, manufacturerId: manufacturer.id } },
        update: {},
        create: { productId: product.id, manufacturerId: manufacturer.id },
      });

      // Categories — use primary variant for shared fields
      const allFinishesInGroup = variants.map(v => v.finish).filter(Boolean);
      const cats = [
        catCache.get(`collection:${primary.series}`),
        catCache.get(`colour:${primary.color}`),
        catCache.get(`region:${primary.region}`),
        ...allFinishesInGroup.map(f => catCache.get(`style:${f}`)).filter(Boolean),
        catCache.get('material:Stone'),
      ].filter((c, i, a) => c && a.findIndex(x => x?.id === c.id) === i); // dedupe

      for (const cat of cats) {
        await prisma.productCategory.upsert({
          where:  { productId_categoryId: { productId: product.id, categoryId: cat.id } },
          update: {},
          create: { productId: product.id, categoryId: cat.id },
        });
      }

      // One variant per finish/size combination
      for (const stone of variants) {
        const sku          = generateSku(stone.color, stone.series, stone.slug);
        const variantLabel = deriveVariantLabel(stone.color, stone.series, stone.slug);
        const primaryImage = pickPrimaryImage(stone);
        const jpgImages    = stone.imageUrls.filter(u => /\.(jpg|jpeg|png)$/i.test(u));
        const galleryImages = jpgImages.filter(u => u !== primaryImage);

        await prisma.variant.upsert({
          where:  { sku },
          update: {
            productId:        product.id,
            colourName:       stone.color,
            hexCode:          COLOR_HEX[stone.color] || null,
            // sizeLabel intentionally omitted on update so we don't clobber
            // enriched values written by scrape_arriscraft_stone_dimensions.py
            // (e.g. Stack-series multi-line size lists).
            dimensionDetails: stone.sizeLabel || null,
            imageUrl:         primaryImage,
            imagesUrl:        { set: galleryImages },
            isActive:         true,
          },
          create: {
            productId:        product.id,
            sku,
            colourName:       stone.color,
            hexCode:          COLOR_HEX[stone.color] || null,
            sizeLabel:        variantLabel,
            dimensionDetails: stone.sizeLabel || null,
            imageUrl:         primaryImage,
            imagesUrl:        galleryImages,
            isActive:         true,
          },
        });
        process.stdout.write(`    · ${stone.color} ${variantLabel ? `[${variantLabel}]` : ''}  ${sku}\n`);
      }

      upserted++;
      process.stdout.write(`  ✓ ${productName.padEnd(55)} (${variants.length} variant${variants.length > 1 ? 's' : ''})\n`);
    } catch (err) {
      console.error(`  ✗ FAILED: ${baseSlug} — ${err.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`Done. ${upserted} upserted, ${failed} failed`);
}

main()
  .catch(err => { console.error(err); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
