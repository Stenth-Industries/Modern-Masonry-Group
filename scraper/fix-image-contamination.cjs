/**
 * Fix cross-contaminated images in arriscraft-stone.json and sync to DB.
 *
 * Root cause: Arriscraft product pages display a gallery of ALL color swatches
 * for the entire series. The scraper grabbed every image on the page,
 * so each product got every other color's images mixed in.
 *
 * Fix: for each product, keep only images where the color name appears
 * in the filename. For Sawn finish products, also require 'sawn' in filename.
 * For Natural finish products, exclude filenames containing 'sawn'.
 *
 * Run: node scraper/fix-image-contamination.cjs
 */
const path = require('path');
const fs   = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL, max: 3, keepAlive: true, idleTimeoutMillis: 0 });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

// Normalize a string to lowercase alphanumeric only (removes spaces, hyphens, underscores, dots)
function norm(s) { return (s || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }

// Check whether a color name matches a filename.
// Handles: compound words (Redrock→Red-Rock), Gray/Grey alias, multi-word colors.
function colorMatchesFilename(color, filename) {
  const fn = norm(filename);
  const cn = norm(color);

  // Direct normalized match (e.g. "redrock" vs "redrock" from "Red-Rock.jpg")
  if (fn.includes(cn)) return true;

  // Gray ↔ Grey alias
  if (cn.includes('gray') && fn.includes(cn.replace('gray', 'grey'))) return true;
  if (cn.includes('grey') && fn.includes(cn.replace('grey', 'gray'))) return true;

  // Multi-word: every word must appear (e.g. "Cape Cod" → "cape" AND "cod")
  const words = color.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim().split(/\s+/);
  if (words.length > 1 && words.every(w => fn.includes(norm(w)))) return true;

  return false;
}

// House/building application photos — kept in gallery, never used as card thumbnail
const HOUSE_PATTERNS = ['Full-Bed-Stone', 'Full-Bed-', 'ALSB', 'Landscape', 'Gies-Hospice'];
const isHousePhoto = (u) => HOUSE_PATTERNS.some(p => u.includes(p));

// Pick primary card image (swatch priority, fall back to house photo if nothing else)
function pickPrimary(images) {
  const jpgs = images.filter(u => /\.(jpg|jpeg|png)$/i.test(u));
  const noHouse = jpgs.filter(u => !isHousePhoto(u));

  // Prefer full-size (non-thumbnail) images over 1024x* resized versions
  const fullSize  = noHouse.filter(u => !/[-_]1024x/.test(u));
  const thumbnail = noHouse.filter(u => /[-_]1024x/.test(u));

  return fullSize[0] || thumbnail[0] || jpgs[0] || null;
}

async function main() {
  const jsonPath = path.join(__dirname, 'arriscraft-stone.json');
  const allStones = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const stones = allStones.filter(s => s.series !== 'Elevation Thin Brick');

  console.log(`Processing ${stones.length} stone products...\n`);

  let updated = 0, skipped = 0, noMatch = 0;

  for (const stone of stones) {
    const productSlug = `arriscraft-${stone.slug}`;
    const jpgImages = stone.imageUrls.filter(u => /\.(jpg|jpeg|png)$/i.test(u));

    // ── Step 1: keep only images belonging to this color ──────────────────────
    let ownImages = jpgImages.filter(u => colorMatchesFilename(stone.color, u.split('/').pop()));

    // ── Step 2: apply finish split for Sawn vs Natural ────────────────────────
    if (stone.finish === 'Sawn') {
      const sawnOnly = ownImages.filter(u => /sawn/i.test(u));
      if (sawnOnly.length > 0) ownImages = sawnOnly;
    } else if (stone.finish === 'Natural') {
      const naturalOnly = ownImages.filter(u => !/sawn/i.test(u));
      if (naturalOnly.length > 0) ownImages = naturalOnly;
    }

    // ── Step 3: fallback if color matching produced nothing ───────────────────
    if (ownImages.length === 0) {
      // Use all non-contaminated (house) images as last resort
      ownImages = jpgImages.filter(u => !isHousePhoto(u));
      if (ownImages.length === 0) ownImages = jpgImages;
      noMatch++;
      console.log(`  ? No color match for: ${stone.color} – ${stone.series} (using ${ownImages.length} fallback images)`);
    }

    const primaryImage = pickPrimary(ownImages);
    const galleryImages = ownImages.filter(u => u !== primaryImage);

    // ── Step 4: find the variant in DB and update ─────────────────────────────
    try {
      const product = await prisma.product.findUnique({ where: { slug: productSlug }, select: { id: true } });
      if (!product) { skipped++; continue; }

      const variant = await prisma.variant.findFirst({
        where: { productId: product.id, colourName: stone.color },
        select: { id: true, imageUrl: true },
      });
      if (!variant) { skipped++; continue; }

      await prisma.variant.update({
        where: { id: variant.id },
        data: {
          imageUrl:  primaryImage,
          imagesUrl: { set: galleryImages },
        },
      });

      process.stdout.write(`  ✓ ${(stone.color + ' – ' + stone.series).padEnd(55)} card=${primaryImage?.split('/').pop() || 'null'}  gallery=${galleryImages.length}\n`);
      updated++;
    } catch (err) {
      console.error(`  ✗ ${stone.slug}: ${err.message}`);
    }
  }

  // ── Also update the JSON file so future seeders start clean ────────────────
  console.log('\nUpdating arriscraft-stone.json...');
  const fixedStones = allStones.map(stone => {
    if (stone.series === 'Elevation Thin Brick') return stone;
    const jpgImages = stone.imageUrls.filter(u => /\.(jpg|jpeg|png)$/i.test(u));
    let ownImages = jpgImages.filter(u => colorMatchesFilename(stone.color, u.split('/').pop()));
    if (stone.finish === 'Sawn') {
      const sawnOnly = ownImages.filter(u => /sawn/i.test(u));
      if (sawnOnly.length > 0) ownImages = sawnOnly;
    } else if (stone.finish === 'Natural') {
      const naturalOnly = ownImages.filter(u => !/sawn/i.test(u));
      if (naturalOnly.length > 0) ownImages = naturalOnly;
    }
    if (ownImages.length === 0) {
      ownImages = jpgImages.filter(u => !isHousePhoto(u));
      if (ownImages.length === 0) ownImages = jpgImages;
    }
    return { ...stone, imageUrls: ownImages };
  });
  fs.writeFileSync(jsonPath, JSON.stringify(fixedStones, null, 2));

  console.log('\n' + '='.repeat(70));
  console.log(`Done. ${updated} updated, ${skipped} skipped, ${noMatch} color-match fallbacks`);

  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
