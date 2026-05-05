/**
 * Patches specific variants that have no clean swatch image.
 * Sets imageUrl = null so the frontend falls back to the BrickWallPattern SVG.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });

const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg } = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool } = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Exact replacement imageUrl for each SKU
const PATCHES = [
  {
    sku: 'ARRIS-IVORY-WH-CONT',
    imageUrl: 'https://arriscraft.com/wp-content/uploads/sites/3/2020/09/Brick-Arriscraft-Contemporary-Brick-Ivory-White-Contemporary-Brick-1.jpg',
  },
  {
    sku: 'ARRIS-MYSTIC-G-CONT',
    imageUrl: 'https://arriscraft.com/wp-content/uploads/sites/3/2020/09/Brick-Arriscraft-Contemporary-Brick-Mystic-Grey-Contemporary-Brick-1.jpg',
  },
  {
    sku: 'ARRIS-MYSTIC-G-TVB',
    imageUrl: 'https://arriscraft.com/wp-content/uploads/sites/3/2020/09/Brick-Arriscraft-Tumbled-Vintage-Brick-Mystic-Grey-Tumbled-Vintage-Brick-1.jpg',
  },
];

async function main() {
  console.log('🔧  Patching imageUrl for 3 variants with user-supplied images...\n');

  for (const { sku, imageUrl } of PATCHES) {
    const variant = await prisma.variant.findUnique({ where: { sku } });
    if (!variant) {
      console.log(`  ⚠  SKU not found: ${sku}`);
      continue;
    }
    await prisma.variant.update({
      where: { sku },
      data: { imageUrl },
    });
    console.log(`  ✓  ${sku}`);
    console.log(`     => ${imageUrl.split('/').pop()}`);
  }

  console.log('\n✅  Done.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
