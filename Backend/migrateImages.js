/**
 * migrateImages.js
 *
 * Downloads all external images from the Variant table and re-uploads
 * them to Supabase Storage, then updates the DB rows with new CDN URLs.
 *
 * Run: node migrateImages.js
 *
 * Safety: Saves backup.json BEFORE touching anything. Use rollback.js to undo.
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import prisma from './config/prisma.js';
import fs from 'fs';
import path from 'path';

// ─── Config ───────────────────────────────────────────────────────────────────
const BUCKET = 'product-images';
const BACKUP_FILE = './backup.json';
const DELAY_MS = 200; // Small delay between requests to avoid rate limiting
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Sleep for ms milliseconds */
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/** Returns true if the URL is already a Supabase Storage URL (already migrated) */
const isSupabaseUrl = (url) =>
  typeof url === 'string' && url.includes('supabase.co/storage');

/** Returns true if URL looks like a real external image link */
const isExternalUrl = (url) =>
  typeof url === 'string' && url.startsWith('http') && !isSupabaseUrl(url);

/** Download an image from a URL and return as a Buffer + content-type */
async function downloadImage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    signal: AbortSignal.timeout(15000), // 15s timeout per image
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type') || 'image/jpeg';
  return { buffer, contentType };
}

/** Upload a buffer to Supabase Storage, return the public CDN URL */
async function uploadToSupabase(buffer, contentType, storagePath) {
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType,
    upsert: true, // overwrite if already exists (safe for reruns)
  });
  if (error) throw new Error(`Supabase upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

/** Migrate a single URL. Returns new CDN URL, or null if skipped/failed */
async function migrateUrl(url, storagePath, label) {
  if (!url || url.trim() === '') {
    console.log(`  ⏭  ${label}: null/empty — skipping`);
    return null;
  }
  if (isSupabaseUrl(url)) {
    console.log(`  ✅ ${label}: already on Supabase — skipping`);
    return url; // already migrated, keep as-is
  }
  if (!isExternalUrl(url)) {
    console.log(`  ⚠️  ${label}: unrecognised URL format — skipping`);
    return url;
  }

  try {
    const { buffer, contentType } = await downloadImage(url);
    const newUrl = await uploadToSupabase(buffer, contentType, storagePath);
    console.log(`  ✅ ${label}: migrated → ${newUrl.slice(0, 80)}...`);
    return newUrl;
  } catch (err) {
    console.error(`  ❌ ${label}: FAILED (${err.message}) — keeping original URL`);
    return url; // keep original so the site doesn't break
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 Image Migration Script Starting...\n');

  // 1. Fetch all variants
  console.log('📦 Fetching all variants from DB...');
  const variants = await prisma.variant.findMany({
    select: { id: true, imageUrl: true, imagesUrl: true },
  });
  console.log(`   Found ${variants.length} variants.\n`);

  // 2. Save backup BEFORE touching anything
  console.log(`💾 Saving backup to ${BACKUP_FILE}...`);
  const backup = variants.map((v) => ({
    id: v.id,
    imageUrl: v.imageUrl ?? null,
    imagesUrl: v.imagesUrl ?? [],
  }));
  fs.writeFileSync(BACKUP_FILE, JSON.stringify(backup, null, 2));
  console.log(`   Backup saved ✅ (${variants.length} records)\n`);

  // 3. Migrate each variant
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    console.log(`\n[${i + 1}/${variants.length}] Variant: ${v.id}`);

    // ── Migrate imageUrl (thumbnail) ──────────────────────────────────────
    const newImageUrl = await migrateUrl(
      v.imageUrl,
      `${v.id}/thumbnail.jpg`,
      'imageUrl'
    );

    // ── Migrate imagesUrl[] (gallery) ────────────────────────────────────
    const gallery = Array.isArray(v.imagesUrl) ? v.imagesUrl : [];
    const newImagesUrl = [];

    for (let j = 0; j < gallery.length; j++) {
      const newUrl = await migrateUrl(
        gallery[j],
        `${v.id}/gallery-${j}.jpg`,
        `imagesUrl[${j}]`
      );
      if (newUrl !== null) newImagesUrl.push(newUrl);
    }

    // ── Update DB row ─────────────────────────────────────────────────────
    try {
      await prisma.variant.update({
        where: { id: v.id },
        data: {
          imageUrl: newImageUrl ?? v.imageUrl, // fallback to original if null
          imagesUrl: newImagesUrl.length > 0 ? newImagesUrl : v.imagesUrl,
        },
      });
      successCount++;
    } catch (err) {
      console.error(`  ❌ DB update failed for ${v.id}: ${err.message}`);
      failCount++;
    }

    // Small delay to avoid hammering external servers
    await sleep(DELAY_MS);
  }

  // 4. Summary
  console.log('\n' + '─'.repeat(60));
  console.log('✅ Migration Complete!');
  console.log(`   Total variants : ${variants.length}`);
  console.log(`   DB updated     : ${successCount}`);
  console.log(`   Skipped        : ${skipCount}`);
  console.log(`   Failed         : ${failCount}`);
  console.log(`\n💾 Backup is saved at: ${path.resolve(BACKUP_FILE)}`);
  console.log('   To undo everything: node rollback.js\n');

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('\n💥 Fatal error:', err.message);
  await prisma.$disconnect();
  process.exit(1);
});
