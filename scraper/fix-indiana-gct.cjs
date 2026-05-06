const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

async function main() {
  await prisma.variant.update({
    where: { sku: 'ARRIS-INDIANA-BL-GCT' },
    data: { imageUrl: 'https://arriscraft.com/wp-content/uploads/sites/3/2023/03/GA-Citadel_IndianaBlend.jpeg' },
  });
  console.log('Updated ARRIS-INDIANA-BL-GCT');
  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
