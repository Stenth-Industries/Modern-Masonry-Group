/**
 * Correctly splits Arriscraft images into:
 *   imageUrl   = the plain brick swatch (texture/close-up, no building context)
 *   imagesUrl  = applied/installation shots (brick on houses, walls, buildings)
 *
 * Detection rules derived from filename patterns:
 *
 *  SWATCH (plain brick):
 *    - WEB-<Series>-<Color>.jpg
 *    - ALSB-<Color>.jpeg          (color selector thumbnail)
 *    - ALSB-AW-<Color>.jpeg       (washed color thumbnail)
 *    - GA-ALSB-Rough-Hewn-<Color>.jpg
 *    - GA-ALSB-<Color>.jpg
 *    - wAvanti_NN_<Color>-24.jpg
 *    - TGB-<Color>.jpg            (no building suffix)
 *    - TumbledVintageBrick-<Color>.png
 *    = simple name, no project reference, no underscore-number, no building names
 *
 *  APPLIED (brick on buildings / project shots):
 *    - Contains _\d{4}_ (e.g. _0000_10-Lenox, _0001_Charlie-West)
 *    - Starts with Brick-Architectural- or Brick-Arriscraft-
 *    - Starts with \d{3,4}- followed by series code (numbered hero shots)
 *    - Contains known building/project name
 *
 * Run: node scraper/fix-arriscraft-images.cjs
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });

const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });
const bricks  = require('./arriscraft-bricks.json');

// All known color slugs — to filter out cross-product contamination
const allColorSlugs = bricks.map(b => b.color.toLowerCase().replace(/\s+/g, '-'));

function filename(url) {
  return url.split('/').pop();
}

function isResized(url) {
  return /-\d{2,4}x\d{2,4}\.(jpg|jpeg|png|webp)$/i.test(url);
}

function isSwatch(url) {
  const f = filename(url);

  // Explicit swatch patterns — ONLY verified close-up texture images
  if (/^WEB-/i.test(f))                          return true; // WEB-Contemporary-Alpine-White.jpg
  if (/^GA-ALSB-Rough-Hewn-[A-Za-z]/i.test(f))  return true; // GA-ALSB-Rough-Hewn-Burnt-Umber.jpg (full-name, no dims suffix)
  if (/^GA-ALSB-[A-Za-z]/i.test(f) && !/^\d/.test(f) && !/_\d{4}_/.test(f) && !isApplied(url)) return true;
  if (/^ALSB-AW-[A-Za-z]/i.test(f))              return true; // ALSB-AW-Charcoal.jpeg
  if (/^ALSB-[A-Za-z][^_-]*\.(jpeg|jpg)$/i.test(f) && !isApplied(url)) return true; // ALSB-Charcoal.jpeg (short, no suffix)
  if (/^wAvanti_\d+_[A-Za-z][^-]+-24\.(jpg|jpeg)$/i.test(f)) return true; // wAvanti_0003_Black-Coral-24.jpg (exact swatch)
  if (/^TGB-[A-Za-z][^-]*(-[A-Za-z][^-]*)*\.(jpg|jpeg)$/i.test(f) && !isApplied(url)) return true; // TGB-Sandy-Shore.jpg
  if (/^TumbledVintageBrick-/i.test(f))          return true; // TumbledVintageBrick-Alpine-White.png
  if (/^Avanti-[A-Za-z]/i.test(f) && !isApplied(url)) return true; // Avanti-Coastal-Fog-RGB.jpg

  return false;
}

function isApplied(url) {
  const f = filename(url);

  if (/_\d{4}_/.test(f))                         return true; // _0000_10-Lenox, ALSB-Obsidian_0000_111-LeRoy
  if (/^Brick-Architectural-/i.test(f))          return true; // Brick-Architectural-Linear-Brick-...
  if (/^Brick-Arriscraft-/i.test(f))             return true; // Brick-Arriscraft-...
  // ANY file starting with a digit (0xxx- or 1xxx- etc) = project/applied shot
  if (/^\d{3,4}-/i.test(f))                      return true; // 0001-TVB-*, 0002-ALSB-*, 1001-REN-*, 1002-TGB-*
  // Named building/project references anywhere in filename
  if (/(Garland|Charlie-West|10-Lenox|Pier-\d|Chestnut|LeRoy|Avalanche|MPArch|Princeton|Yeh-College|Hope|Lenox|Parliament|ADA|UL-[A-Z]|Smooth-and-Split|TVB\d+|SandyShore)/i.test(f)) return true;

  return false;
}

function isForeignColor(url, ownColorSlug) {
  const f = filename(url).toLowerCase();
  const ownParts = ownColorSlug.split('-');
  const containsOwn = ownParts.length >= 2
    ? ownParts.every(p => f.includes(p))
    : f.includes(ownColorSlug);
  if (containsOwn) return false;

  // Contains another color's slug?
  return allColorSlugs.some(slug =>
    slug !== ownColorSlug &&
    slug.length >= 5 &&
    slug.split('-').every(p => f.includes(p))
  );
}

async function main() {
  console.log('🧱  Splitting Arriscraft images: swatch vs applied shots\n');

  const variants = await prisma.variant.findMany({
    where: { product: { slug: { startsWith: 'arriscraft-' } } },
    include: { product: true },
    orderBy: { createdAt: 'asc' },
  });

  for (const v of variants) {
    const brick = bricks.find(b => v.product.slug === `arriscraft-${b.slug}`);
    if (!brick) continue;

    const colorSlug = brick.color.toLowerCase().replace(/\s+/g, '-');

    // Deduplicate original images, remove resized versions
    const deduped = [];
    const seen = new Set();
    for (const url of brick.imageUrls) {
      const base = url.split('/').pop().replace(/-\d{3,4}x\d{3,4}/, '');
      if (seen.has(base) || isResized(url)) continue;
      seen.add(base);
      deduped.push(url);
    }

    // Remove cross-product contamination (other colors' swatches)
    const ownImages = deduped.filter(url => !isForeignColor(url, colorSlug));

    // Split into swatch vs applied
    const swatches = ownImages.filter(isSwatch);
    const applied  = ownImages.filter(isApplied);
    const uncategorised = ownImages.filter(u => !isSwatch(u) && !isApplied(u));

    // imageUrl = best swatch (prefer WEB- first, then GA-ALSB-Rough-Hewn-, then first swatch)
    const swatchUrl =
      swatches.find(u => /^WEB-/i.test(filename(u))) ||
      swatches.find(u => /^GA-ALSB-Rough-Hewn-/i.test(filename(u))) ||
      swatches[0] ||
      ownImages[0];

    // Gallery = applied shots + any uncategorised (but not the chosen swatch)
    const gallery = [...applied, ...uncategorised].filter(u => u !== swatchUrl);

    await prisma.variant.update({
      where: { id: v.id },
      data: {
        imageUrl: swatchUrl || null,
        imagesUrl: { set: gallery },
      },
    });

    const swatchFile = swatchUrl ? filename(swatchUrl) : 'NONE';
    console.log(
      `  ✓ ${brick.color.padEnd(18)} | swatch: ${swatchFile.padEnd(45)} | gallery: ${gallery.length} applied shot(s)` +
      (gallery.length ? '\n      ' + gallery.map(u => filename(u)).join('\n      ') : '')
    );
  }

  console.log('\n✅  Done.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
