/**
 * Fix variants that have null imageUrl by assigning them the first available JPG
 * from the scraped arriscraft-stone.json data.
 *
 * Run from repo root: node scraper/fix-null-images.cjs
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

const allStones = require('./arriscraft-stone.json');

function slugify(text) {
  return text.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function main() {
  // Find all Arriscraft stone variants with null imageUrl
  const nullVariants = await prisma.variant.findMany({
    where: { imageUrl: null, isActive: true },
    include: {
      product: { select: { slug: true, name: true } },
    },
  });

  console.log(`Found ${nullVariants.length} variants with null imageUrl\n`);

  let fixed = 0;
  for (const v of nullVariants) {
    const slug = v.product.slug.replace(/^arriscraft-/, '');
    const stone = allStones.find(s => s.slug === slug);
    if (!stone) {
      console.log(`  ? No JSON entry for slug: ${slug}`);
      continue;
    }

    const jpgImages = stone.imageUrls.filter(u => /\.(jpg|jpeg|png)$/i.test(u));
    const firstImage = jpgImages[0] || null;
    if (!firstImage) {
      console.log(`  - No images available for ${v.colourName} (${slug})`);
      continue;
    }

    await prisma.variant.update({
      where: { id: v.id },
      data:  { imageUrl: firstImage },
    });
    console.log(`  ✓ Fixed: ${v.colourName.padEnd(25)} → ${firstImage.split('/').pop()}`);
    fixed++;
  }

  console.log(`\nDone. ${fixed} variants updated.`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
