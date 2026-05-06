const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

async function main() {
  // Find the Blackrock Highfalls Ledgestone variant
  const variants = await prisma.variant.findMany({
    where: { sku: { contains: 'BLACKROCK' } },
    select: { sku: true, imageUrl: true },
  });
  console.log('Found variants:', JSON.stringify(variants, null, 2));

  // Update all Blackrock variants that are Highfalls Ledgestone
  const hfl = variants.filter(v => v.sku.includes('HFL') || v.sku.includes('HIGHFALLS'));
  if (hfl.length === 0) {
    console.log('No HFL variants found — updating all Blackrock variants');
    for (const v of variants) {
      await prisma.variant.update({
        where: { sku: v.sku },
        data: { imageUrl: 'https://arriscraft.com/wp-content/uploads/sites/3/2021/09/Blackrock-HighfallsLedgestonecropped.jpeg' },
      });
      console.log('Updated', v.sku);
    }
  } else {
    for (const v of hfl) {
      await prisma.variant.update({
        where: { sku: v.sku },
        data: { imageUrl: 'https://arriscraft.com/wp-content/uploads/sites/3/2021/09/Blackrock-HighfallsLedgestonecropped.jpeg' },
      });
      console.log('Updated', v.sku);
    }
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
