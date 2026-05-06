const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

async function main() {
  const variants = await prisma.variant.findMany({
    where: { sku: { contains: 'MOONSTONE' } },
    select: { sku: true, imageUrl: true },
  });
  console.log('Found:', JSON.stringify(variants, null, 2));

  const target = variants.find(v => v.sku.includes('FRE'));
  if (!target) { console.log('No Fresco variant found'); await prisma.$disconnect(); await pool.end(); return; }

  await prisma.variant.update({
    where: { sku: target.sku },
    data: { imageUrl: 'https://arriscraft.com/wp-content/uploads/sites/3/2024/06/0000-FRE-Moonstone.jpg' },
  });
  console.log('Updated', target.sku);

  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
