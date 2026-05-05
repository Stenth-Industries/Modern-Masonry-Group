const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg } = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool } = require(path.join(__dirname, '../Backend/node_modules/pg'));
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
const bricks = require('./arriscraft-bricks.json');

async function main() {
  const dbVariants = await prisma.variant.findMany({
    where: { product: { slug: { startsWith: 'arriscraft-' } } },
    select: { sku: true }
  });
  const dbSkus = new Set(dbVariants.map(v => v.sku));
  console.log('In DB:', dbSkus.size, '| In JSON:', bricks.length);

  bricks.forEach(b => {
    const color = b.color.toUpperCase().replace(/\s+/g, '-').slice(0, 8);
    const s = b.series === 'Architectural Linear Series Brick' ? 'ALSB' :
              b.series === 'Contemporary Brick' ? 'CONT' :
              b.series === 'Tumbled Vintage Brick' ? 'TVB' :
              b.series === 'Tumbled Georgia Brick' ? 'TGB' :
              b.series === 'Avanti' ? 'AVT' : 'BRK';
    const v = b.seriesVariant ? '-' + b.seriesVariant.toUpperCase().replace(/\s+/g, '').slice(0, 4) : '';
    const sku = 'ARRIS-' + color + '-' + s + v;
    if (!dbSkus.has(sku)) {
      console.log('MISSING:', b.color.padEnd(20), b.series.padEnd(35), '| variant:', (b.seriesVariant||'-').padEnd(12), '| SKU:', sku);
    }
  });
}
main().catch(console.error).finally(() => pool.end());
