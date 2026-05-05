/**
 * Patch: Ivory White – Contemporary Brick
 *   imageUrl  → brick close-up (Brick-Arriscraft-Contemporary-Brick-Ivory-White-...)
 *   imagesUrl → house shot (0005-CON-Ivory-White.jpg) first in gallery
 *
 * Run from repo root:
 *   node scraper/patch-ivory-white-con-image.cjs
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });

const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

const TARGET_SLUG   = 'arriscraft-ivory-white-contemporary-brick';
const CARD_IMAGE    = 'https://arriscraft.com/wp-content/uploads/sites/3/2020/09/Brick-Arriscraft-Contemporary-Brick-Ivory-White-Contemporary-Brick-1.jpg';
const GALLERY_IMAGE = 'https://arriscraft.com/wp-content/uploads/sites/3/2024/03/0005-CON-Ivory-White.jpg';

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

  const existingGallery = variant.imagesUrl || [];
  const gallery = [
    ...(existingGallery.includes(GALLERY_IMAGE) ? [] : [GALLERY_IMAGE]),
    ...existingGallery.filter(u => u !== CARD_IMAGE),
  ];

  await prisma.variant.update({
    where: { id: variant.id },
    data: {
      imageUrl:  CARD_IMAGE,
      imagesUrl: { set: gallery },
    },
  });

  console.log(`✅  imageUrl (card)        → ${CARD_IMAGE}`);
  console.log(`✅  imagesUrl[0] (gallery) → ${gallery[0]}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
