/**
 * Patch Brampton Brick variant imageUrls using Kings Masonry images.
 * Matches by colourName (strips ", Premier Plus (PRP)" and ", Smooth Finish" suffixes).
 *
 * Run: node scraper/patch-brampton-kings-images.cjs
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });

const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg }     = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool }         = require(path.join(__dirname, '../Backend/node_modules/pg'));

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma  = new PrismaClient({ adapter: new PrismaPg(pool) });

const kings = require('../Backend/kings.json');

// Build a lookup: normalised name → image URL
const kingsMap = {};
for (const k of kings) {
  if (!k.manufacturer?.toLowerCase().includes('brampton')) continue;
  if (!k.image) continue;
  const key = k.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  kingsMap[key] = k.image;
}

function normalise(colourName) {
  return colourName
    .replace(/, Premier Plus \(PRP\)/i, '')
    .replace(/, Smooth Finish/i, '')
    .replace(/, Matt Finish/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

async function main() {
  console.log('🖼️  Patching Brampton Brick images from Kings data...\n');

  const mfg = await prisma.manufacturer.findFirst({ where: { name: 'Brampton Brick' } });
  if (!mfg) throw new Error('Brampton Brick manufacturer not found');

  const links = await prisma.productManufacturer.findMany({
    where: { manufacturerId: mfg.id },
    select: { productId: true },
  });
  const productIds = links.map(l => l.productId);

  const variants = await prisma.variant.findMany({
    where: { productId: { in: productIds } },
    select: { id: true, colourName: true, imageUrl: true },
  });

  let updated = 0, skipped = 0;

  for (const v of variants) {
    const key = normalise(v.colourName || '');
    const kingsUrl = kingsMap[key];

    if (!kingsUrl) {
      console.log(`  ⚠️  No kings match: "${v.colourName}" (key: ${key})`);
      skipped++;
      continue;
    }

    await prisma.variant.update({
      where: { id: v.id },
      data: { imageUrl: kingsUrl },
    });
    console.log(`  ✓ ${(v.colourName || '').padEnd(45)} → ${kingsUrl.split('/').pop()}`);
    updated++;
  }

  console.log(`\n✅  Done. Updated: ${updated}, No match: ${skipped}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
