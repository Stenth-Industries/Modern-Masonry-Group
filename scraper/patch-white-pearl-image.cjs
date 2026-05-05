/**
 * Patch: set the primary imageUrl for White Pearl ALSB (Georgia Standard)
 * to the correct product shot from Arriscraft.
 *
 * Run from repo root:
 *   node scraper/patch-white-pearl-image.cjs
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });

const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg } = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool } = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TARGET_SLUG = 'arriscraft-white-pearl-georgia-architectural-linear-series-brick';
const CARD_IMAGE_URL = 'https://arriscraft.com/wp-content/uploads/sites/3/2020/09/Brick-Architectural-Linear-Brick-White-Pearl-Georgia-Architectural-Linear-Series-Brick-1.jpg';
const GALLERY_IMAGE = 'https://arriscraft.com/wp-content/uploads/sites/3/2024/03/0002-ALSB-White-Pearl.jpg';

async function main() {
  const variant = await prisma.variant.findFirst({
    where: { product: { slug: TARGET_SLUG } },
    include: { product: true },
  });

  if (!variant) {
    console.error(`❌  Variant not found for slug: ${TARGET_SLUG}`);
    process.exit(1);
  }

  console.log(`Found variant: ${variant.product.name} (id: ${variant.id})`);

  // Restore original card image; add the Arriscraft house shot to the gallery if not already present
  const existingGallery = variant.imagesUrl || [];
  const gallery = existingGallery.includes(GALLERY_IMAGE)
    ? existingGallery
    : [GALLERY_IMAGE, ...existingGallery];

  await prisma.variant.update({
    where: { id: variant.id },
    data: {
      imageUrl: CARD_IMAGE_URL,
      imagesUrl: { set: gallery },
    },
  });

  console.log(`✅  imageUrl (card)  → ${CARD_IMAGE_URL}`);
  console.log(`✅  imagesUrl[0] (gallery) → ${GALLERY_IMAGE}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
