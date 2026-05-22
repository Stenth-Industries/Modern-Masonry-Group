/**
 * Scrape Canada Brick product pages (bricks) without Firecrawl.
 * Collects all 124 brick products across 7 listing pages.
 *
 * Extracts per product:
 *   name, url, sku, collection, color, brickSizes (with mm dims), imageUrl, description
 *
 * Output: Backend/data/scrape_cni-canada/canadabrick-bricks.json
 *
 * Safe to re-run — already-scraped URLs are skipped.
 * Run from repo root: node scraper/scrape-canadabrick.cjs
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const OUT_FILE   = path.join(__dirname, '..', 'Backend', 'data', 'scrape_cni-canada', 'canadabrick-bricks.json');
const LISTING    = 'https://canadabrick.com/brick/?pg=';
const TOTAL_PAGES = 7;
const DELAY_MS   = 1500;

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'text/html,application/xhtml+xml',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

/** Extract all unique product URLs from a listing page */
function extractProductUrls(html) {
  const matches = [...html.matchAll(/href="(https:\/\/canadabrick\.com\/products\/[^"]+)"/g)];
  return [...new Set(matches.map(m => m[1]))];
}

/**
 * Parse a brick_size CSS class into a structured object.
 * Format: brick_size-{name-parts}-{3-letter-code}-{H}-x-{L}-x-{D}-mm-{imperial}-in
 * Example: brick_size-engineer-norman-enn-70-x-290-x-90-mm-2-3-4-x-11-1-2-x-3-1-2-in
 */
function parseBrickSizeClass(cls) {
  const raw = cls.replace('brick_size-', '');
  const mmIdx = raw.indexOf('-mm-');
  if (mmIdx === -1) return null;

  const metricStr  = raw.slice(0, mmIdx);       // e.g. "engineer-norman-enn-70-x-290-x-90"
  const imperialStr = raw.slice(mmIdx + 4);      // e.g. "2-3-4-x-11-1-2-x-3-1-2-in"

  const metricParts = metricStr.split('-x-');    // ["engineer-norman-enn-70", "290", "90"]
  if (metricParts.length < 3) return null;

  const firstTokens = metricParts[0].split('-'); // ["engineer", "norman", "enn", "70"]
  const heightMm = parseInt(firstTokens[firstTokens.length - 1]);
  const code     = firstTokens[firstTokens.length - 2].toUpperCase(); // "ENN"
  const nameParts = firstTokens.slice(0, -2);   // ["engineer", "norman"]

  const name = nameParts.length > 0
    ? nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
    : code;

  const lengthMm = parseInt(metricParts[1]);
  const depthMm  = parseInt(metricParts[2]);

  // Convert imperial slug back to readable label: "2-3-4-x-11-1-2-x-3-1-2" is just kept raw
  // Will be formatted in seed step
  const inchLabel = imperialStr.replace(/-in$/, '').replace(/-x-/g, ' × ').replace(/-/g, ' ');

  return { code, name, heightMm, lengthMm, depthMm, inchLabel };
}

/** Decode common HTML entities */
function decodeEntities(str) {
  return str
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, '');
}

/** Extract all product data from a single product page HTML */
function parsePage(html, url) {
  // ── Name ────────────────────────────────────────────────────────────────────
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const name = decodeEntities(
    h1Match
      ? h1Match[1].replace(/<[^>]+>/g, '').trim()
      : (html.match(/<meta property="og:title" content="([^"]+)"/) || [])[1] || ''
  );

  // ── SKU — derived from URL slug, deterministic ───────────────────────────
  const slug = url.replace('https://canadabrick.com/products/', '').replace(/\/$/, '');
  const sku  = 'CB-' + slug.toUpperCase();

  // ── CSS classes (first element with brick_size data) ────────────────────
  const classMatch = html.match(/class="([^"]*brick_size[^"]*)"/);
  const classes = classMatch ? classMatch[1].split(' ') : [];

  const color = (classes.find(c => c.startsWith('product_color-')) || '')
    .replace('product_color-', '');

  const collectionRaw = (classes.find(c => c.startsWith('product_collections-')) || '')
    .replace('product_collections-', '');
  const collection = collectionRaw
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const brickSizes = classes
    .filter(c => c.startsWith('brick_size-') && !c.includes('max-dimensions'))
    .map(parseBrickSizeClass)
    .filter(Boolean);

  // ── Main image (og:image is always the product-specific thumbnail) ───────
  const ogImgMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
  const imageUrl = ogImgMatch ? ogImgMatch[1] : '';

  // ── Description ─────────────────────────────────────────────────────────
  // Text sits between "Manufactured In:" and "Download:" or "COLOR DISCLAIMER"
  const bodyText = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');

  let description = '';
  const mfgIdx  = bodyText.indexOf('Manufactured In:');
  const endMarkers = ['Download:', 'COLOR DISCLAIMER', 'Send us a message'];
  if (mfgIdx !== -1) {
    // Skip past "Manufactured In: Ontario Canada " by finding where "Canada" ends
    const canadaIdx = bodyText.indexOf('Canada', mfgIdx + 16);
    const descStart = canadaIdx !== -1 ? canadaIdx + 6 : mfgIdx + 33;
    let descEnd = bodyText.length;
    for (const marker of endMarkers) {
      const idx = bodyText.indexOf(marker, descStart);
      if (idx !== -1 && idx < descEnd) descEnd = idx;
    }
    description = bodyText.slice(descStart, descEnd).trim();
  }

  return { name, url, sku, collection, color, brickSizes, imageUrl, description };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Load existing output so we can skip already-scraped URLs
  let existing = [];
  if (fs.existsSync(OUT_FILE)) {
    existing = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'));
    console.log(`\nLoaded ${existing.length} already-scraped products — will skip these.\n`);
  }
  const done = new Set(existing.map(p => p.url));

  // Phase 1: collect all product URLs from listing pages
  console.log('Phase 1 — Collecting product URLs...\n');
  const allUrls = [];
  for (let pg = 1; pg <= TOTAL_PAGES; pg++) {
    const html  = await fetchHtml(LISTING + pg);
    const links = extractProductUrls(html);
    allUrls.push(...links);
    console.log(`  Page ${pg}: ${links.length} links`);
    if (pg < TOTAL_PAGES) sleep(DELAY_MS);
  }
  const uniqueUrls = [...new Set(allUrls)];
  const toScrape   = uniqueUrls.filter(u => !done.has(u));
  console.log(`\nTotal unique: ${uniqueUrls.length} | Already done: ${done.size} | To scrape: ${toScrape.length}\n`);

  if (toScrape.length === 0) {
    console.log('Nothing to scrape — all products already in output file.');
    return;
  }

  // Phase 2: scrape each product page
  console.log('Phase 2 — Scraping product pages...\n');
  const results = [...existing];
  let scraped = 0, failed = 0;

  for (let i = 0; i < toScrape.length; i++) {
    const url  = toScrape[i];
    const slug = url.replace('https://canadabrick.com/products/', '').replace(/\/$/, '');
    process.stdout.write(`  [${i + 1}/${toScrape.length}] ${slug.padEnd(45)}`);

    try {
      const html    = await fetchHtml(url);
      const product = parsePage(html, url);
      results.push(product);
      scraped++;
      console.log(`✓  ${product.collection || '—'}  |  ${product.brickSizes.length} sizes  |  img: ${product.imageUrl ? 'yes' : 'NO'}`);
    } catch (err) {
      failed++;
      console.log(`✗  FAILED: ${err.message.slice(0, 60)}`);
    }

    // Save after every product so progress isn't lost on crash
    fs.writeFileSync(OUT_FILE, JSON.stringify(results, null, 2));

    if (i < toScrape.length - 1) sleep(DELAY_MS);
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log(`Done.  Scraped: ${scraped}  |  Failed: ${failed}  |  Total in file: ${results.length}`);
  console.log(`Output: ${OUT_FILE}\n`);
}

main().catch(err => {
  console.error('\nFatal:', err.message);
  process.exit(1);
});
