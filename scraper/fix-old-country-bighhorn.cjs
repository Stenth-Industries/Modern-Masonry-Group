const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

async function main() {
  const v = await prisma.variant.findFirst({
    where:  { colourName: 'Big Horn', sku: { contains: 'OLC' } },
    select: { id: true, colourName: true, sku: true, imageUrl: true },
  });
  console.log('Found:', v);

  if (v) {
    await prisma.variant.update({
      where: { id: v.id },
      data:  { imageUrl: 'https://arriscraft.com/wp-content/uploads/sites/3/2020/10/Old-Country_BigHorn.jpeg' },
    });
    console.log('Updated imageUrl → Old-Country_BigHorn.jpeg');
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
