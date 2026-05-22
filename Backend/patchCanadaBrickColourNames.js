/**
 * Patch Canada Brick variant colourName to use the actual brick name
 * instead of the generic colour category (Buff, Red, Brown, etc.).
 *
 * Run: node Backend/patchCanadaBrickColourNames.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '.env') });

const { Client } = pg;
const DATA_FILE = path.join(__dirname, 'data', 'scrape_cni-canada', 'canadabrick-bricks.json');

async function main() {
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  const products = JSON.parse(raw);
  console.log(`\nLoaded ${products.length} products from JSON\n`);

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  let updated = 0, skipped = 0, failed = 0;

  for (const item of products) {
    try {
      const res = await client.query(
        `UPDATE "Variant" SET "colourName" = $1 WHERE sku = $2`,
        [item.name, item.sku]
      );

      if (res.rowCount > 0) {
        updated += res.rowCount;
        console.log(`✓  ${item.sku.padEnd(40)} → "${item.name}"`);
      } else {
        skipped++;
        console.log(`—  ${item.sku.padEnd(40)} (not in DB, skipped)`);
      }
    } catch (err) {
      failed++;
      console.log(`✗  ${item.sku} FAILED: ${err.message.slice(0, 80)}`);
    }
  }

  await client.end();

  console.log(`\n${'='.repeat(70)}`);
  console.log(`Updated: ${updated}  |  Skipped: ${skipped}  |  Failed: ${failed}\n`);
}

main().catch(err => {
  console.error('\nFatal:', err.message);
  process.exit(1);
});
