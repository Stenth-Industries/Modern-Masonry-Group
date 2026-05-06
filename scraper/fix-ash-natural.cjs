const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

async function main() {
  const v = await prisma.variant.findUnique({
    where:  { sku: 'ARRIS-ASH-STK' },
    select: { id: true, imageUrl: true, imagesUrl: true },
  });
  console.log('Before:', v?.imageUrl?.split('/').pop(), '| gallery:', v?.imagesUrl?.map(u => u.split('/').pop()));

  await prisma.variant.update({
    where: { sku: 'ARRIS-ASH-STK' },
    data:  { imageUrl: 'https://arriscraft.com/wp-content/uploads/sites/3/2020/09/Thin-Masonry-Stack-Thin-Stone-Ash-1.jpg' },
  });
  console.log('Done — card image updated for Ash Natural');

  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
