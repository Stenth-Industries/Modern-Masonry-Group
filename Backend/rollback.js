/**
 * rollback.js
 *
 * Restores all original imageUrl / imagesUrl values from backup.json
 * back into the database — exactly as they were before migration.
 *
 * Run: node rollback.js
 */

import 'dotenv/config';
import prisma from './config/prisma.js';
import fs from 'fs';

const BACKUP_FILE = './backup.json';

async function main() {
  console.log('\n⏪ Rollback Script Starting...\n');

  // 1. Load backup file
  if (!fs.existsSync(BACKUP_FILE)) {
    console.error(`❌ backup.json not found at ${BACKUP_FILE}`);
    console.error('   Cannot rollback without a backup. Aborting.');
    process.exit(1);
  }

  const backup = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'));
  console.log(`📂 Loaded backup.json — ${backup.length} records found.\n`);

  // 2. Confirm before proceeding
  console.log('⚠️  This will OVERWRITE all current imageUrl and imagesUrl values in the DB.');
  console.log('   Press Ctrl+C within 5 seconds to cancel...\n');
  await new Promise((res) => setTimeout(res, 5000));

  // 3. Restore each variant
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < backup.length; i++) {
    const record = backup[i];
    process.stdout.write(`[${i + 1}/${backup.length}] Restoring ${record.id}... `);

    try {
      await prisma.variant.update({
        where: { id: record.id },
        data: {
          imageUrl:  record.imageUrl  ?? null,
          imagesUrl: Array.isArray(record.imagesUrl) ? record.imagesUrl : [],
        },
      });
      process.stdout.write('✅\n');
      successCount++;
    } catch (err) {
      process.stdout.write(`❌ FAILED: ${err.message}\n`);
      failCount++;
    }
  }

  // 4. Summary
  console.log('\n' + '─'.repeat(60));
  console.log('✅ Rollback Complete!');
  console.log(`   Restored : ${successCount}`);
  console.log(`   Failed   : ${failCount}`);
  if (failCount === 0) {
    console.log('\n🎉 Database is back to its original state.\n');
  } else {
    console.log('\n⚠️  Some records failed. Check errors above.\n');
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('\n💥 Fatal error:', err.message);
  await prisma.$disconnect();
  process.exit(1);
});
