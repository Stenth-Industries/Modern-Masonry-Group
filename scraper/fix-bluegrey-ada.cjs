const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

const IMAGE = 'https://arriscraft.com/wp-content/uploads/sites/3/2020/10/ADA-Blue-Grey_MedDressed_Veined.jpeg';

async function main() {
  const skus = ['ARRIS-BLUE-GREY--ADL', 'ARRIS-BLUE-GREY-ADM'];
  for (const sku of skus) {
    await prisma.variant.update({
      where: { sku },
      data: { imageUrl: IMAGE },
    });
    console.log('Updated', sku);
  }
  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
