const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

// Patterns that indicate a house/application photo rather than a stone or brick swatch
const HOUSE_PATTERNS = [
  '-Heritage-Texture-', '-Perla-', '-Bennett-', '-San-Felipe',
  '-Texas-Clay', '-West-Gate', 'Full-Bed-Stone', 'Full-Bed-',
  'ALSB', 'Landscape', 'Gies-Hospice',
];
const isHouse = u => HOUSE_PATTERNS.some(p => (u || '').includes(p));

async function main() {
  const variants = await prisma.variant.findMany({
    where: { isActive: true },
    select: { id: true, colourName: true, imageUrl: true },
  });

  const toFix = variants.filter(v => isHouse(v.imageUrl || ''));
  console.log(`Found ${toFix.length} variants with house/application photos as primary image`);

  for (const v of toFix) {
    await prisma.variant.update({ where: { id: v.id }, data: { imageUrl: null } });
    console.log('  Fixed:', v.colourName, '-', v.imageUrl?.split('/').pop());
  }

  console.log('\nDone — these cards will now show the colour-pattern fallback.');
  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
