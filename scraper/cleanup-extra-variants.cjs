const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg } = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool } = require(path.join(__dirname, '../Backend/node_modules/pg'));
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const OLD_SKUS = [
  'ARRIS-CHARCOAL-ALSB-CANA', 'ARRIS-CHARCOAL-ALSB-WASH',
  'ARRIS-GEORGETO-ALSB-CANA', 'ARRIS-GEORGETO-ALSB-WASH',
  'ARRIS-MAHOGANY-ALSB-CANA', 'ARRIS-MAHOGANY-ALSB-WASH',
  'ARRIS-MIDNIGHT-ALSB-CANA', 'ARRIS-MIDNIGHT-ALSB-WASH',
  'ARRIS-MILLSTON-ALSB-CANA', 'ARRIS-MILLSTON-ALSB-WASH',
  'ARRIS-OBSIDIAN-ALSB-CANA', 'ARRIS-OBSIDIAN-ALSB-WASH',
  'ARRIS-OPAL-ALSB-CANA',     'ARRIS-OPAL-ALSB-WASH',
  'ARRIS-WALNUT-ALSB-CANA',   'ARRIS-WALNUT-ALSB-WASH',
];

async function main() {
  const deleted = await prisma.variant.deleteMany({ where: { sku: { in: OLD_SKUS } } });
  console.log(`Deleted ${deleted.count} old extra variants`);

  const remaining = await prisma.variant.count({
    where: { product: { slug: { startsWith: 'arriscraft-' } } },
  });
  console.log(`Arriscraft variants remaining: ${remaining}`);
}
main().catch(console.error).finally(() => pool.end());
