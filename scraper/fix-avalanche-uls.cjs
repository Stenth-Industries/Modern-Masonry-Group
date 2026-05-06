const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

const TARGET = 'https://arriscraft.com/wp-content/uploads/sites/3/2020/09/Full-Bed-Stone-Arriscraft-Building-Stone-Urban-Ledgestone-Ontario-Avalanche-1.jpg';

async function main() {
  const v = await prisma.variant.findUnique({
    where:  { sku: 'ARRIS-AVALANCHE-ULS' },
    select: { id: true, imagesUrl: true },
  });

  // Put TARGET first, then the rest (excluding any duplicate)
  const rest = (v.imagesUrl || []).filter(u => u !== TARGET);
  const gallery = [TARGET, ...rest];

  await prisma.variant.update({
    where: { sku: 'ARRIS-AVALANCHE-ULS' },
    data:  { imagesUrl: { set: gallery } },
  });
  console.log('Gallery:', gallery.map(u => u.split('/').pop()));
  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
