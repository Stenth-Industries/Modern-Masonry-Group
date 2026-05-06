/**
 * Scrape Arriscraft stone product pages via Firecrawl CLI
 * Reads .firecrawl/stone-urls-final.txt and saves each page as
 *   .firecrawl/s-{slug}.md
 *
 * Rate-limit safe: 10s gap between requests (≤ 6/min).
 * Safe to re-run — skips already-scraped files.
 *
 * Run from repo root:
 *   node scraper/scrape-arriscraft-stone.cjs
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const urlsFile = path.join(__dirname, '..', '.firecrawl', 'stone-urls-final.txt');
const outDir   = path.join(__dirname, '..', '.firecrawl');

const urls = fs.readFileSync(urlsFile, 'utf8').split('\n').map(l => l.trim()).filter(Boolean);
console.log(`\nScraping ${urls.length} Arriscraft stone pages...\n`);

let done = 0, skipped = 0, failed = 0;

for (const url of urls) {
  const slug = url.replace('https://arriscraft.com/products/', '').replace(/\/$/, '');
  const outFile = path.join(outDir, `s-${slug}.md`);

  if (fs.existsSync(outFile)) {
    console.log(`  ⏭  skip  ${slug}`);
    skipped++;
    continue;
  }

  try {
    execSync(`firecrawl scrape "${url}" -o "${outFile}"`, { stdio: 'pipe' });
    const size = fs.existsSync(outFile) ? fs.statSync(outFile).size : 0;
    console.log(`  ✓ ${slug.padEnd(50)} (${size} bytes)`);
    done++;
  } catch (err) {
    console.error(`  ✗ FAILED: ${slug} — ${err.message.slice(0, 80)}`);
    failed++;
  }

  // 10s gap to stay within 6 req/min
  if (done + failed < urls.length - skipped) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10_000);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Done: ${done} scraped, ${skipped} skipped, ${failed} failed`);
