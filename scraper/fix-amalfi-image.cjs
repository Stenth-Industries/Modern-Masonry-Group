const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

const PRIMARY = 'https://arriscraft.com/wp-content/uploads/sites/3/2024/06/Coastal_Amalfi-1024x768.jpg';

async function main() {
  // Sawn: 1 image only (just the primary, no gallery)
  await prisma.variant.update({
    where: { sku: 'ARRIS-AMALFI-CST-SAWN' },
    data:  { imageUrl: PRIMARY, imagesUrl: { set: [] } },
  });
  console.log('ARRIS-AMALFI-CST-SAWN → 1 image');

  // Natural: 3 images (primary + full-size swatch + tile/application image)
  await prisma.variant.update({
    where: { sku: 'ARRIS-AMALFI-CST' },
    data:  {
      imageUrl:  PRIMARY,
      imagesUrl: { set: [
        'https://arriscraft.com/wp-content/uploads/sites/3/2024/06/Coastal_Amalfi.jpg',
        'https://arriscraft.com/wp-content/uploads/sites/3/2024/03/1001-TILE-Limestone-COA-Amalfi.jpg',
      ] },
    },
  });
  console.log('ARRIS-AMALFI-CST       → 3 images');

  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
