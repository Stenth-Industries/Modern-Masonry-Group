/**
 * One-off patch: fix truncated descriptions for Canada Brick products.
 * Re-fetches each product page and updates the description in DB.
 *
 * Run: node Backend/patchCanadaBrickDescriptions.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './config/prisma.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data', 'scrape_cni-canada', 'canadabrick-bricks.json');
const HEADERS   = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' };
const DELAY_MS  = 1000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function extractDescription(html) {
  const bodyText = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');

  const mfgIdx = bodyText.indexOf('Manufactured In:');
  if (mfgIdx === -1) return null;

  // Find "Canada" (part of "Ontario Canada") and start description after it
  const canadaIdx = bodyText.indexOf('Canada', mfgIdx + 16);
  const descStart = canadaIdx !== -1 ? canadaIdx + 6 : mfgIdx + 33;

  let descEnd = bodyText.length;
  for (const marker of ['Download:', 'COLOR DISCLAIMER', 'Send us a message']) {
    const idx = bodyText.indexOf(marker, descStart);
    if (idx !== -1 && idx < descEnd) descEnd = idx;
  }

  return bodyText.slice(descStart, descEnd).trim() || null;
}

async function main() {
  console.log('\n🔧 Patching Canada Brick descriptions...\n');

  const raw      = await fs.readFile(DATA_FILE, 'utf-8');
  const products = JSON.parse(raw);

  // Fetch all Canada Brick product slugs from DB so we can update by slug
  const dbProducts = await prisma.product.findMany({
    where: { manufacturers: { some: { manufacturer: { name: 'Canada Brick' } } } },
    select: { id: true, slug: true, description: true },
  });

  // Map slug → db id
  const slugToId = Object.fromEntries(dbProducts.map(p => [p.slug, p.id]));

  let updated = 0, skipped = 0, failed = 0;

  for (let i = 0; i < products.length; i++) {
    const item = products[i];
    const slug = item.url.replace('https://canadabrick.com/products/', '').replace(/\/$/, '');
    const productId = slugToId[slug] || slugToId[slug + '-2'] || null;

    process.stdout.write(`[${i + 1}/${products.length}] ${item.name.padEnd(45)}`);

    if (!productId) {
      skipped++;
      console.log(`⚠  not found in DB`);
      continue;
    }

    try {
      const res  = await fetch(item.url, { headers: HEADERS });
      const html = await res.text();
      const desc = extractDescription(html);

      if (!desc) {
        skipped++;
        console.log(`⚠  no description extracted`);
        continue;
      }

      await prisma.product.update({
        where: { id: productId },
        data:  { description: desc },
      });

      // Also patch the JSON file entry
      products[i].description = desc;

      updated++;
      console.log(`✓  ${desc.slice(0, 50)}...`);
    } catch (err) {
      failed++;
      console.log(`✗  ${err.message.slice(0, 60)}`);
    }

    if (i < products.length - 1) await sleep(DELAY_MS);
  }

  // Save corrected descriptions back to JSON
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2));

  console.log(`\n${'='.repeat(70)}`);
  console.log(`✅ Done.  Updated: ${updated}  |  Skipped: ${skipped}  |  Failed: ${failed}\n`);
}

main()
  .catch(err => { console.error('\n💥 Fatal:', err.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
