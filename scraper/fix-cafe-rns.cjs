const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

async function main() {
  // Set correct image on Georgia Renaissance Cafe
  await prisma.variant.update({
    where: { sku: 'ARRIS-CAFE-GRN' },
    data: { imageUrl: 'https://arriscraft.com/wp-content/uploads/sites/3/2020/09/Full-Bed-Stone-Renaissance-Georgia-Cafe-1.jpg' },
  });
  console.log('Updated ARRIS-CAFE-GRN');

  // Revert ACP and ATL to their original images
  await prisma.variant.update({
    where: { sku: 'ARRIS-CAFE-ACP' },
    data: { imageUrl: 'https://arriscraft.com/wp-content/uploads/sites/3/2024/11/Web-ARRISclip-Cafe-1.jpg' },
  });
  console.log('Reverted ARRIS-CAFE-ACP');

  await prisma.variant.update({
    where: { sku: 'ARRIS-CAFE-ATL' },
    data: { imageUrl: 'https://arriscraft.com/wp-content/uploads/sites/3/2024/11/Web-ARRIStile-Cafe.jpg' },
  });
  console.log('Reverted ARRIS-CAFE-ATL');

  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
