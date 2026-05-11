/**
 * verifyMigration.js
 *
 * After running migrateImages.js, run this script to verify that:
 *  - All imageUrl values in the DB are reachable (return HTTP 200)
 *  - All imagesUrl[] values in the DB are reachable
 *  - No variant is left with a broken or null URL unexpectedly
 *
 * Run: node verifyMigration.js
 */

import 'dotenv/config';
import prisma from './config/prisma.js';
import fs from 'fs';

const REPORT_FILE = './migration-report.json';
const DELAY_MS = 100;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/** Check if a URL returns a successful HTTP response */
async function checkUrl(url) {
  if (!url || url.trim() === '') return { ok: false, reason: 'null or empty' };
  try {
    const res = await fetch(url, {
      method: 'HEAD', // just check headers, no need to download full image
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(10000),
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
}

async function main() {
  console.log('\n🔍 Verification Script Starting...\n');

  const variants = await prisma.variant.findMany({
    select: { id: true, imageUrl: true, imagesUrl: true },
  });
  console.log(`📦 Checking ${variants.length} variants...\n`);

  const report = {
    total: variants.length,
    passed: 0,
    warnings: 0,
    failed: 0,
    details: [],
  };

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    process.stdout.write(`[${i + 1}/${variants.length}] ${v.id} — `);

    const variantReport = { id: v.id, imageUrl: null, imagesUrl: [] };
    let hasIssue = false;

    // ── Check imageUrl ────────────────────────────────────────────────────
    if (!v.imageUrl) {
      variantReport.imageUrl = { url: null, ok: true, reason: 'null (expected)' };
    } else {
      const result = await checkUrl(v.imageUrl);
      variantReport.imageUrl = { url: v.imageUrl, ...result };
      if (!result.ok) hasIssue = true;
    }

    // ── Check imagesUrl[] ─────────────────────────────────────────────────
    const gallery = Array.isArray(v.imagesUrl) ? v.imagesUrl : [];
    for (let j = 0; j < gallery.length; j++) {
      const result = await checkUrl(gallery[j]);
      variantReport.imagesUrl.push({ url: gallery[j], index: j, ...result });
      if (!result.ok) hasIssue = true;
    }

    if (hasIssue) {
      process.stdout.write('⚠️  issues found\n');
      report.warnings++;
    } else {
      process.stdout.write('✅\n');
      report.passed++;
    }

    report.details.push(variantReport);
    await sleep(DELAY_MS);
  }

  // ── Save full report ──────────────────────────────────────────────────────
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  // ── Print summary ─────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(60));
  console.log('📊 Verification Summary');
  console.log(`   Total checked   : ${report.total}`);
  console.log(`   ✅ All good     : ${report.passed}`);
  console.log(`   ⚠️  Has issues  : ${report.warnings}`);
  console.log(`   ❌ Failed       : ${report.failed}`);
  console.log(`\n📄 Full report saved to: migration-report.json`);

  if (report.warnings > 0) {
    console.log('\n⚠️  Some URLs have issues. Options:');
    console.log('   1. Re-run migrateImages.js (it skips already-migrated URLs)');
    console.log('   2. Or run rollback.js to fully restore original URLs\n');
  } else {
    console.log('\n🎉 All images verified successfully! Migration is complete.\n');
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('\n💥 Fatal error:', err.message);
  await prisma.$disconnect();
  process.exit(1);
});
