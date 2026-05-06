/**
 * Remove orphaned variants whose SKUs used the old (no-suffix) format
 * for series that now use per-finish/size SKUs.
 *
 * Affected series:
 *   Coastal  – Natural/Sawn split  → old base SKU is now Natural, Sawn gets -SAWN suffix
 *   Stack    – Natural/Sawn split  → same pattern
 *   Midtown  – 3 sizes × Sawn/Natural → old base SKU is fully orphaned
 *
 * Safe to re-run.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

// Old Midtown base SKUs — these are fully orphaned because all Midtown products
// now have size-suffixed SKUs (e.g. -218, -358SAWN, etc.)
const ORPHANED_MIDTOWN_SKUS = [
  'ARRIS-ABBEY-ROAD-MDT',
  'ARRIS-BISCAYNE-MDT',
  'ARRIS-LOMBARD-MDT',
  'ARRIS-MANHATTAN-MDT',
  'ARRIS-PEACHTREE-MDT',
];

async function main() {
  const deleted = await prisma.variant.deleteMany({
    where: { sku: { in: ORPHANED_MIDTOWN_SKUS } },
  });
  console.log(`Deleted ${deleted.count} orphaned Midtown variants`);

  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
