const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

const BAD_URL = 'https://arriscraft.com/wp-content/uploads/sites/3/2020/10/Old-Country_Smoky-Mountain-1024x767.jpeg';

async function main() {
  const variants = await prisma.variant.findMany({
    where: { sku: { contains: 'OLC' } },
    select: { id: true, colourName: true, imageUrl: true, imagesUrl: true },
  });

  for (const v of variants) {
    const hadInGallery = v.imagesUrl.includes(BAD_URL);
    const isMain = v.imageUrl === BAD_URL;

    if (!hadInGallery && !isMain) continue;

    const newGallery = v.imagesUrl.filter(u => u !== BAD_URL);
    await prisma.variant.update({
      where: { id: v.id },
      data:  {
        imagesUrl: { set: newGallery },
        ...(isMain ? { imageUrl: null } : {}),
      },
    });
    console.log(`Fixed ${v.colourName}: removed from ${isMain ? 'main + gallery' : 'gallery'}`);
  }

  console.log('Done.');
  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
