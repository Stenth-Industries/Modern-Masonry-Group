/**
 * Fixes Arriscraft stone products incorrectly stored with material='Brick'.
 * Finds any product linked to a stone-type collection and sets material='Stone'.
 * Safe to re-run — only touches products that still have the wrong material.
 *
 * Run against production:
 *   DATABASE_URL=<prod-url> node Backend/fixStoneMaterial.mjs
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import pg from "pg";
const { Pool } = pg;

const STONE_COLLECTIONS = [
  'Adair Anchored Dimension Stone',
  'Adair Limestone',
  'Adair Masonry Units',
  'Adair Parliament',
  'Arris Cast',
  'Arris Clip',
  'Arris Tile',
  'Cambridge Renaissance',
  'Coastal',
  'Edge Rock',
  'Evolution',
  'Fresco',
  'Georgia Citadel',
  'Georgia Renaissance',
  'Highfalls Ledgestone',
  'Laurier',
  'Matterhorn',
  'Midtown',
  'Old Country',
  'Shadow Stone',
  'Sills',
  'Stack',
  'Urban Ledgestone',
];

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Find products with wrong material that have a stone collection
  const wrongProducts = await prisma.product.findMany({
    where: {
      material: { equals: 'Brick', mode: 'insensitive' },
      categories: {
        some: {
          category: {
            type: 'collection',
            value: { in: STONE_COLLECTIONS },
          },
        },
      },
    },
    select: { id: true, name: true },
  });

  console.log(`Found ${wrongProducts.length} stone products with material='Brick' to fix.`);
  if (wrongProducts.length === 0) {
    console.log('Nothing to do.');
    await prisma.$disconnect();
    await pool.end();
    return;
  }

  wrongProducts.slice(0, 5).forEach(p => console.log(`  - ${p.name}`));
  if (wrongProducts.length > 5) console.log(`  ... and ${wrongProducts.length - 5} more`);

  const ids = wrongProducts.map(p => p.id);
  const result = await prisma.product.updateMany({
    where: { id: { in: ids } },
    data: { material: 'Stone' },
  });

  console.log(`\nDone. Updated ${result.count} products to material='Stone'.`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
