const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg } = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool } = require(path.join(__dirname, '../Backend/node_modules/pg'));
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const OLD_COLLISION_SKUS = [
  'ARRIS-BURNT-UM-ALSB-GEOR',
  'ARRIS-CEDAR-WO-ALSB-GEOR',
  'ARRIS-CHATEAU--ALSB-GEOR',
  'ARRIS-EVENING--ALSB-GEOR',
  'ARRIS-FORGED-S-ALSB-GEOR',
  'ARRIS-HARBOR-G-ALSB-GEOR',
  'ARRIS-RED-SUMA-ALSB-GEOR',
  'ARRIS-WHITE-PE-ALSB-GEOR',
];

async function main() {
  const deleted = await prisma.variant.deleteMany({
    where: { sku: { in: OLD_COLLISION_SKUS } },
  });
  console.log(`Deleted ${deleted.count} old colliding variants`);
}
main().catch(console.error).finally(() => pool.end());
