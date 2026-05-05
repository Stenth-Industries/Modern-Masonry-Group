const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg } = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool } = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Get all variants, check imageUrl filename
  const variants = await prisma.variant.findMany({
    orderBy: { createdAt: 'asc' },
    include: { product: { select: { name: true } } }
  });

  const bad = [];
  for (const v of variants) {
    const url = v.imageUrl || '';
    const f = url.split('/').pop();
    // Flag if filename looks like a building/project photo
    const isBuildingShot =
      (/^Brick-(Architectural|Arriscraft)-/i.test(f) ||
      /^\d{3,4}-/i.test(f) ||
      (/_\d{4}_/.test(f) && !/^wAvanti_/i.test(f)) ||
      /(Garland|Charlie-West|10-Lenox|Pier-\d|Chestnut|LeRoy|Avalanche|MPArch|Princeton|Yeh-College|Hope|Parliament|ADA|UL-[A-Z]|Smooth-and-Split|TVB\d+)/i.test(f)) &&
      !/^wAvanti_\d+_[A-Za-z][^-]+-24\.(jpg|jpeg)$/i.test(f);

    if (isBuildingShot) {
      bad.push({ sku: v.sku, name: v.product.name, file: f });
    }
  }

  if (bad.length === 0) {
    console.log('✅  All variants have swatch images — no building shots found as primary!');
  } else {
    console.log(`\n🚨  ${bad.length} variant(s) still have building/project shots as imageUrl:\n`);
    bad.forEach(b => console.log(`  ${b.sku}\n    ${b.name}\n    => ${b.file}\n`));
  }

  console.log(`\nTotal variants checked: ${variants.length}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
