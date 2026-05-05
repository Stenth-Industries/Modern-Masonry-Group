const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg } = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool } = require(path.join(__dirname, '../Backend/node_modules/pg'));
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
const bricks = require('./arriscraft-bricks.json');

function expectedSku(b) {
  const c = b.color.toUpperCase().replace(/\s+/g, '-').slice(0, 8);
  const s = b.series === 'Architectural Linear Series Brick' ? 'ALSB' :
            b.series === 'Contemporary Brick' ? 'CONT' :
            b.series === 'Tumbled Vintage Brick' ? 'TVB' :
            b.series === 'Tumbled Georgia Brick' ? 'TGB' :
            b.series === 'Avanti' ? 'AVT' : 'BRK';
  const v = b.seriesVariant ? '-' + b.seriesVariant.toUpperCase().split(/\s+/).map(w => w[0]).join('') : '';
  return `ARRIS-${c}-${s}${v}`;
}

async function main() {
  const variants = await prisma.variant.findMany({
    where: { product: { slug: { startsWith: 'arriscraft-' } } },
    select: { id: true, sku: true, colourName: true, product: { select: { slug: true } } },
    orderBy: { sku: 'asc' },
  });

  const expectedSkus = new Set(bricks.map(expectedSku));
  console.log('DB count:', variants.length, '| Expected:', expectedSkus.size);
  console.log('\nExtra (not in expected set):');
  variants.filter(v => !expectedSkus.has(v.sku)).forEach(v =>
    console.log(' EXTRA:', v.sku, '|', v.product.slug)
  );
  console.log('\nMissing from DB:');
  bricks.forEach(b => {
    const sku = expectedSku(b);
    if (!variants.find(v => v.sku === sku))
      console.log(' MISSING:', sku, '|', b.color, b.series, b.seriesVariant||'');
  });
}
main().catch(console.error).finally(() => pool.end());
