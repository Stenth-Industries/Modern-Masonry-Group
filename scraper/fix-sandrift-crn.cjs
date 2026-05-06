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
    where: { sku: { contains: 'SANDRIFT' } },
    select: { sku: true, imageUrl: true },
  });
  console.log('Found:', JSON.stringify(variants, null, 2));

  const target = variants.find(v => v.sku.includes('CRN') || v.sku.includes('RNS') || v.sku.includes('REN') || v.sku.includes('GRN'));
  if (!target) { console.log('No Renaissance variant found'); await prisma.$disconnect(); await pool.end(); return; }

  await prisma.variant.update({
    where: { sku: target.sku },
    data: { imageUrl: 'https://arriscraft.com/wp-content/uploads/sites/3/2022/06/Renaissance_22_Sandrift.jpeg' },
  });
  console.log('Updated', target.sku);

  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
