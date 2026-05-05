/**
 * Patch: Replace flat Arriscraft collection categories with the 6 proper ones:
 *   - Architectural Linear Series Brick – Canadian Selection
 *   - Architectural Linear Series Brick – United States Selection
 *   - Avanti
 *   - Contemporary Brick
 *   - Tumbled Georgia Brick
 *   - Tumbled Vintage Brick
 *
 * Run from repo root:
 *   node scraper/patch-arriscraft-collections.cjs
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });

const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

const bricks = require('./arriscraft-bricks.json');

// Map from arriscraft-bricks.json series+seriesVariant → new collection value
// Canadian variants: "Canadian Standard", "Washed" (Cambridge, Ontario)
// US variants: "Georgia Standard", "Georgia Rough Hewn" (Fort Valley, Georgia)
function resolveCollection(brick) {
  if (brick.series === 'Architectural Linear Series Brick') {
    const v = brick.seriesVariant || '';
    const isCanadian = v.toLowerCase().includes('canadian') || v.toLowerCase() === 'washed';
    return isCanadian
      ? 'Architectural Linear Series Brick – Canadian Selection'
      : 'Architectural Linear Series Brick – United States Selection';
  }
  return brick.series;
}

const NEW_COLLECTIONS = [
  'Architectural Linear Series Brick – Canadian Selection',
  'Architectural Linear Series Brick – United States Selection',
  'Avanti',
  'Contemporary Brick',
  'Tumbled Georgia Brick',
  'Tumbled Vintage Brick',
];

// Old flat collection values to remove from Arriscraft products
const OLD_ALSB_COLLECTIONS = [
  'Architectural Linear Series Brick',
];

async function main() {
  console.log('🧱  Patching Arriscraft collections...\n');

  // 1. Upsert the 6 new collection categories
  const catMap = {};
  for (const name of NEW_COLLECTIONS) {
    const cat = await prisma.category.upsert({
      where: { type_value: { type: 'collection', value: name } },
      update: {},
      create: { type: 'collection', value: name },
    });
    catMap[name] = cat;
    console.log(`✅  Category: ${name}`);
  }

  // 2. Find old flat ALSB category ids to unlink
  const oldCats = await prisma.category.findMany({
    where: { type: 'collection', value: { in: OLD_ALSB_COLLECTIONS } },
  });
  const oldCatIds = oldCats.map(c => c.id);

  // 3. Process each Arriscraft product
  for (const brick of bricks) {
    const slug = `arriscraft-${brick.slug}`;
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) { console.warn(`  ⚠️  Not found: ${slug}`); continue; }

    const newCollectionName = resolveCollection(brick);
    const newCat = catMap[newCollectionName];

    // Remove old flat ALSB collection links
    if (oldCatIds.length) {
      await prisma.productCategory.deleteMany({
        where: { productId: product.id, categoryId: { in: oldCatIds } },
      });
    }

    // Link to new collection (upsert — safe to re-run)
    await prisma.productCategory.upsert({
      where: { productId_categoryId: { productId: product.id, categoryId: newCat.id } },
      update: {},
      create: { productId: product.id, categoryId: newCat.id },
    });

    console.log(`  ✓ ${product.name.padEnd(55)} → ${newCollectionName}`);
  }

  console.log('\n✅  Done.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
