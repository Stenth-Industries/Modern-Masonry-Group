/**
 * Patch: set card imageUrl for Walnut ALSB (Canadian Standard) to the new swatch,
 * and move the old card image into the "In Application" gallery.
 *
 * Run from repo root:
 *   node scraper/patch-walnut-image.cjs
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });

const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

const TARGET_SLUG   = 'arriscraft-walnut-architectural-linear-series-brick';
const NEW_CARD_URL  = 'https://arriscraft.com/wp-content/uploads/sites/3/2023/03/ALSB-Walnut-SO.jpeg';

async function main() {
  const variant = await prisma.variant.findFirst({
    where: { product: { slug: TARGET_SLUG } },
    include: { product: true },
  });

  if (!variant) {
    console.error(`❌  Variant not found for slug: ${TARGET_SLUG}`);
    process.exit(1);
  }

  console.log(`Found: ${variant.product.name} (id: ${variant.id})`);
  console.log(`  Current imageUrl: ${variant.imageUrl}`);

  const oldCardImage = variant.imageUrl;
  const existingGallery = variant.imagesUrl || [];

  // Move old card image into gallery (first position), avoid duplicates
  const gallery = [
    ...(oldCardImage && !existingGallery.includes(oldCardImage) ? [oldCardImage] : []),
    ...existingGallery.filter(u => u !== NEW_CARD_URL),
  ];

  await prisma.variant.update({
    where: { id: variant.id },
    data: {
      imageUrl:  NEW_CARD_URL,
      imagesUrl: { set: gallery },
    },
  });

  console.log(`✅  imageUrl (card)       → ${NEW_CARD_URL}`);
  console.log(`✅  imagesUrl[0] (gallery) → ${gallery[0]}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
