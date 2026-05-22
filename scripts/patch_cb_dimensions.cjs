#!/usr/bin/env node
/**
 * Patch sizeLabel for Canada Brick variants that were missing dimensions.
 * Dimensions sourced directly from canadabrick.com product pages.
 *
 * Usage:
 *   node scripts/patch_cb_dimensions.cjs          # preview
 *   node scripts/patch_cb_dimensions.cjs --confirm  # write to DB
 */

const { Client } = require('pg');
require('dotenv').config({ path: './Backend/.env' });

// Dimensions sourced from canadabrick.com "Available Sizes" section on each product page.
// Imperial conversions: 1-5/8"=41mm, 2-1/4"=57mm, 3-1/8"=79mm, 3-1/2"=89mm, 3-3/4"=95mm,
//                       3-5/8"=92mm, 10-1/8"=257mm, 23-5/8"=600mm
const PATCHES = [
  // ── Standard format 79×257×90 mm (Max Dimensions listed on site) ──────────────
  { sku: 'CB-ALBION',          sizeLabel: 'Standard – 79×257×90 mm' },
  { sku: 'CB-CALEDONIA',       sizeLabel: 'Standard – 79×257×90 mm' },
  { sku: 'CB-CAVENDISH-II',    sizeLabel: 'Standard – 79×257×90 mm' },
  { sku: 'CB-CONESTOGA',       sizeLabel: 'Standard – 79×257×90 mm' },
  { sku: 'CB-CORTES',          sizeLabel: 'Standard – 79×257×90 mm' },
  { sku: 'CB-DAKOTA',          sizeLabel: 'Standard – 79×257×90 mm' },
  { sku: 'CB-HAZELTON',        sizeLabel: 'Standard – 79×257×90 mm' },
  { sku: 'CB-HUDSON',          sizeLabel: 'Standard – 79×257×90 mm' },
  { sku: 'CB-KELOWNA',         sizeLabel: 'Standard – 79×257×90 mm' },
  { sku: 'CB-LABRADOR',        sizeLabel: 'Standard – 79×257×90 mm' },
  { sku: 'CB-LAKESHORE',       sizeLabel: 'Standard – 79×257×90 mm' },
  { sku: 'CB-PORTLAND',        sizeLabel: 'Standard – 79×257×90 mm' },
  { sku: 'CB-RUTHERFORD',      sizeLabel: 'Standard – 79×257×90 mm' },
  { sku: 'CB-SUSSEX',          sizeLabel: 'Standard – 79×257×90 mm' },
  { sku: 'CB-TRINITY',         sizeLabel: 'Standard – 79×257×90 mm' },
  { sku: 'CB-VANIER',          sizeLabel: 'Standard – 79×257×90 mm' },
  { sku: 'CB-WELLINGTON',      sizeLabel: 'Standard – 79×257×90 mm' },
  { sku: 'CB-WESTFORD-SQUARE', sizeLabel: 'Standard – 79×257×90 mm' },

  // ── Avanti series: AVA 1-5/8" H × up to 23-5/8" L × 3-5/8" D ───────────────
  { sku: 'CB-BLACK-CORAL-AVANTI',  sizeLabel: 'AVA – 41×up to 600×92 mm' },
  { sku: 'CB-COASTAL-FOG-AVANTI',  sizeLabel: 'AVA – 41×up to 600×92 mm' },
  { sku: 'CB-OCEAN-MIST-AVANTI',   sizeLabel: 'AVA – 41×up to 600×92 mm' },
  { sku: 'CB-SEA-SHELL-AVANTI',    sizeLabel: 'AVA – 41×up to 600×92 mm' },

  // ── Architectural Linear Series: LS22 2-1/4" × up to 23-5/8" L × 3-3/4" D ──
  { sku: 'CB-CHARCOAL-ARCHITECTURAL-LINEAR-SERIES-BRICK',  sizeLabel: 'LS22 – 57×up to 600×95 mm' },
  { sku: 'CB-MIDNIGHT-GREY-ARCHITECTURAL-LINEAR-SERIES-BRICK', sizeLabel: 'LS22 – 57×up to 600×95 mm' },
  { sku: 'CB-OBSIDIAN-ARCHITECTURAL-LINEAR-SERIES-BRICK',  sizeLabel: 'LS22 – 57×up to 600×95 mm' },
  { sku: 'CB-OPAL-ARCHITECTURAL-LINEAR-SERIES-BRICK',      sizeLabel: 'LS22 – 57×up to 600×95 mm' },

  // ── Contemporary: CON31 3-1/8" H × Random L × 3-1/2" D ─────────────────────
  { sku: 'CB-IVORY-WHITE-CONTEMPORARY-BRICK',  sizeLabel: 'CON31 – 79×random L×89 mm' },
  { sku: 'CB-MYSTIC-GREY-CONTEMPORARY-BRICK',  sizeLabel: 'CON31 – 79×random L×89 mm' },

  // ── Tumbled Vintage: 3-1/8" H × 10-1/8" L × 3-1/2" D ───────────────────────
  { sku: 'CB-ALPINE-WHITE-TUMBLED-VINTAGE-BRICK',   sizeLabel: 'Tumbled Vintage – 79×257×89 mm' },
  { sku: 'CB-MYSTIC-GREY-TUMBLED-VINTAGE-BRICK',    sizeLabel: 'Tumbled Vintage – 79×257×89 mm' },
  { sku: 'CB-WEATHERED-OAK-TUMBLED-VINTAGE-BRICK',  sizeLabel: 'Tumbled Vintage – 79×257×89 mm' },
];

async function main() {
  const confirm = process.argv.includes('--confirm');

  const client = new Client({ connectionString: process.env.DATABASE_URL.replace(/\?.*/, '') });
  await client.connect();

  if (!confirm) {
    console.log(`[DRY RUN] Would update ${PATCHES.length} variants:\n`);
    for (const { sku, sizeLabel } of PATCHES) {
      console.log(`  ${sku.padEnd(55)} -> ${sizeLabel}`);
    }
    console.log('\nRe-run with --confirm to apply.');
    await client.end();
    return;
  }

  let updated = 0;
  for (const { sku, sizeLabel } of PATCHES) {
    const res = await client.query(
      'UPDATE "Variant" SET "sizeLabel"=$1 WHERE sku=$2',
      [sizeLabel, sku]
    );
    if (res.rowCount > 0) {
      updated++;
      console.log(`  updated: ${sku}`);
    } else {
      console.log(`  NOT FOUND: ${sku}`);
    }
  }

  console.log(`\nDone. Updated ${updated}/${PATCHES.length} variants.`);
  await client.end();
}

main().catch(err => { console.error(err); process.exit(1); });
