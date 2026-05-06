const fs   = require('fs');
const path = require('path');

// ── Series / finish inference from slug ───────────────────────────────────────
const SERIES_PATTERNS = [
  { match: 'shadow-stone',                series: 'Shadow Stone',                  finish: 'Rocked' },
  { match: 'urban-ledgestone',            series: 'Urban Ledgestone',              finish: 'Natural' },
  { match: 'highfalls-ledgestone',        series: 'Highfalls Ledgestone',          finish: 'Natural' },
  { match: '-fresco',                     series: 'Fresco',                        finish: 'Tumbled' },
  { match: 'laurier',                     series: 'Laurier',                       finish: 'Rocked' },
  { match: 'coastal-sawn',               series: 'Coastal',                       finish: 'Sawn' },
  { match: '-coastal',                    series: 'Coastal',                       finish: 'Natural' },
  { match: 'edge-rock',                   series: 'Edge Rock',                     finish: 'Natural' },
  { match: 'stack-sawn',                  series: 'Stack',                         finish: 'Sawn' },
  { match: '-stack',                      series: 'Stack',                         finish: 'Natural' },
  { match: 'midtown',                     series: 'Midtown',                       finish: null },
  { match: 'old-country',                 series: 'Old Country',                   finish: 'Natural' },
  { match: 'georgia-citadel',             series: 'Georgia Citadel',               finish: 'Natural' },
  { match: 'georgia-renaissance',         series: 'Georgia Renaissance',           finish: 'Natural' },
  { match: 'cambridge-renaissance',       series: 'Cambridge Renaissance',         finish: 'Natural' },
  { match: 'matterhorn',                  series: 'Matterhorn',                    finish: 'Natural' },
  { match: 'evolution',                   series: 'Evolution',                     finish: 'Natural' },
  { match: 'washed-elevation-thin-brick', series: 'Elevation Thin Brick',          finish: 'Washed' },
  { match: 'elevation-thin-brick',        series: 'Elevation Thin Brick',          finish: 'Standard' },
  { match: 'arris-tile',                  series: 'Arris Tile',                    finish: 'Natural' },
  { match: 'arris-clip',                  series: 'Arris Clip',                    finish: 'Natural' },
  { match: 'adair-masonry-units',         series: 'Adair Masonry Units',           finish: 'Standard' },
  { match: 'adair-anchored-dimension-stone', series: 'Adair Anchored Dimension Stone', finish: 'Standard' },
  { match: 'adair-limestone',             series: 'Adair Limestone',               finish: 'Standard' },
  { match: 'adair-parliament',            series: 'Adair Parliament',              finish: 'Standard' },
  { match: 'georgia-sill',               series: 'Georgia Sill',                  finish: 'Rocked' },
  { match: 'cast-stone',                  series: 'Cast Stone',                    finish: 'Standard' },
];

function inferSeries(slug) {
  for (const p of SERIES_PATTERNS) {
    if (slug.includes(p.match)) return { series: p.series, finish: p.finish };
  }
  return { series: 'Building Stone', finish: null };
}

function extractColor(slug, seriesName) {
  // Strip the series suffix from the slug to isolate the color portion
  const suffixMap = {
    'Shadow Stone':                   '-shadow-stone',
    'Urban Ledgestone':               '-urban-ledgestone',
    'Highfalls Ledgestone':           '-highfalls-ledgestone',
    'Fresco':                         '-fresco',
    'Laurier':                        '-laurier',
    'Coastal':                        '-coastal-sawn',
    'Edge Rock':                      '-edge-rock',
    'Stack':                          '-stack-sawn',
    'Midtown':                        '', // handled below
    'Old Country':                    '-old-country',
    'Georgia Citadel':                '-georgia-citadel',
    'Georgia Renaissance':            '-georgia-renaissance',
    'Cambridge Renaissance':          '-cambridge-renaissance',
    'Matterhorn':                     '-matterhorn',
    'Evolution':                      '-evolution',
    'Elevation Thin Brick':           '-washed-elevation-thin-brick',
    'Arris Tile':                     '-arris-tile',
    'Arris Clip':                     '-arris-clip',
    'Adair Masonry Units':            '-adair-masonry-units',
    'Adair Anchored Dimension Stone': '-adair-anchored-dimension-stone',
    'Adair Limestone':                '-adair-limestone',
    'Adair Parliament':               '-adair-parliament',
    'Georgia Sill':                   '-rocked-georgia-sill',
    'Cast Stone':                     '-cast-stone',
  };

  let colorSlug = slug;

  // Midtown slugs include size, e.g. lombard-midtown-5-7-8-sawn → "Lombard"
  if (seriesName === 'Midtown') {
    colorSlug = slug.replace(/-midtown.*$/, '');
  } else if (seriesName === 'Stack') {
    colorSlug = slug.replace(/-stack.*$/, '');
  } else if (seriesName === 'Coastal') {
    colorSlug = slug.replace(/-coastal.*$/, '');
  } else if (seriesName === 'Elevation Thin Brick') {
    colorSlug = slug.replace(/-(washed-)?elevation-thin-brick$/, '');
  } else {
    const suffix = suffixMap[seriesName];
    if (suffix && colorSlug.endsWith(suffix)) {
      colorSlug = colorSlug.slice(0, -suffix.length);
    } else {
      // Try stripping the series slug manually
      for (const p of SERIES_PATTERNS) {
        if (slug.includes(p.match)) {
          colorSlug = slug.replace('-' + p.match, '').replace(p.match, '');
          break;
        }
      }
    }
  }

  return colorSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function extractImages(content) {
  const imgRegex = /https:\/\/arriscraft\.com\/wp-content\/uploads\/[^\s)"'\]\\]+/g;
  const skipWords = ['logo', 'wienerberger', 'usgbc', 'sustainability', 'gs-logo',
                     'arp-pia', 'revisit', 'warranty', 'tc-us', 'final', 'cookieyes',
                     'Arriscraft-Logo', 'calculator'];
  const imgExts   = /\.(jpg|jpeg|png|webp)(\?[^\s"']*)?$/i;
  const seen = new Set();
  const imgs = [];
  let m;
  while ((m = imgRegex.exec(content)) !== null) {
    let url  = m[0].replace(/[\\).\s]+$/, '');
    const base = url.split('?')[0];
    if (seen.has(base)) continue;
    seen.add(base);
    if (!imgExts.test(base)) continue;
    if (skipWords.some(s => url.toLowerCase().includes(s.toLowerCase()))) continue;
    imgs.push(url);
  }
  return imgs;
}

function extractDescription(content) {
  // Find the # PRODUCT heading, then grab the next non-boilerplate paragraph
  const headingIdx = content.search(/^# [A-Z]/m);
  if (headingIdx === -1) return null;
  const after = content.slice(headingIdx);
  const lines  = after.split('\n');
  const skip   = ['cookie', 'privacy', 'Where To Buy', 'Quick Menu', 'SIGN UP',
                  'COPYRIGHT', 'WARRANTY', 'TERMS', 'CADD', 'Linkedin', 'Pinterest',
                  'Revisit', 'Powered by', 'NecessaryAlways', 'Download:', 'COLOR DISCLAIMER',
                  'Manufactured In', 'Manufactured By', 'Available Sizes', 'Collections',
                  'Interested in this product'];
  for (const line of lines) {
    const l = line.trim();
    if (!l || l.startsWith('#') || l.startsWith('!') || l.startsWith('[') ||
        l.startsWith('|') || l.startsWith('*') || l.startsWith('-') ||
        l.startsWith('•') || l.startsWith('_') || l.length < 40) continue;
    if (skip.some(s => l.includes(s))) continue;
    return l;
  }
  return null;
}

function extractRegion(content) {
  const mfgIdx = content.indexOf('## Manufactured In:');
  if (mfgIdx === -1) return 'Canada';
  const section = content.slice(mfgIdx, mfgIdx + 300);
  const lines   = section.split('\n').map(l => l.replace(/^-\s*/, '').trim()).filter(Boolean);
  // Lines after the heading until the next blank-or-heading
  const parts = [];
  let inSection = false;
  for (const l of lines) {
    if (l.includes('Manufactured In')) { inSection = true; continue; }
    if (inSection) {
      if (l.startsWith('#') || l.startsWith('With') || l.length === 0) break;
      parts.push(l);
    }
  }
  // "Cambridge\nOntario" → "Canada (Ontario)" ; "Fort Valley\nGeorgia" → "USA (Georgia)"
  const text = parts.join(' ').toLowerCase();
  if (text.includes('georgia') || text.includes('fort valley')) return 'USA';
  return 'Canada';
}

function extractSizeLabel(content) {
  const idx = content.indexOf('## Available Sizes');
  if (idx === -1) return null;
  const section = content.slice(idx, idx + 600);
  const lines   = section.split('\n').filter(l => l.trim().startsWith('•') || l.trim().match(/^Size \d/));
  if (!lines.length) return null;
  // Return the first size line, cleaned up
  return lines[0].replace(/^[•\s]*Size \d+:\s*/, '').trim() || null;
}

// Normalize collection names from the page to clean series names
const SERIES_NORMALIZE = {
  'ARRIS-clip':                          'Arris Clip',
  'ARRIS-tile':                          'Arris Tile',
  'ARRIS-cast':                          'Arris Cast',
  'Stack Thin Building Stone':           'Stack',
  'Georgia Renaissance Masonry Units':   'Georgia Renaissance',
  'Cambridge Renaissance Masonry Units': 'Cambridge Renaissance',
  'Evolution Masonry Units':             'Evolution',
  'Elevation Thin Brick Washed':         'Elevation Thin Brick',
  'Adair Georgian Blend':                'Adair Limestone',
  'Adair Landscape':                     'Adair Limestone',
};

function extractCollectionFromPage(content) {
  const idx = content.indexOf('## Collections');
  if (idx === -1) return null;
  const section = content.slice(idx, idx + 300);
  const m       = section.match(/\[([^\]]+)\]\(https:\/\/arriscraft\.com\/product_collections\//);
  if (!m) return null;
  const raw = m[1];
  return SERIES_NORMALIZE[raw] || raw;
}

// ── Discover extra product URLs in "More From This Collection" sections ───────
function discoverExtraUrls(content) {
  const idx = content.indexOf('## More From This Collection');
  if (idx === -1) return [];
  const section = content.slice(idx, idx + 3000);
  const regex   = /https:\/\/arriscraft\.com\/products\/([a-z0-9-]+)\/?/g;
  const found   = [];
  let m;
  while ((m = regex.exec(section)) !== null) {
    found.push(m[1]);
  }
  return [...new Set(found)];
}

// Extract color and series from the # HEADING line in the page
function extractFromHeading(content) {
  const m = content.match(/^# ([A-Z][^\n]+)$/m);
  if (!m) return { color: null, headingSeries: null };
  const heading = m[1].trim(); // e.g. "IVORY WHITE – LAURIER"
  const dashIdx = heading.indexOf(' – ');
  const toTitle = s => s.split(/[\s-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  if (dashIdx === -1) {
    // No dash — use slug-based color extraction (heading is too ambiguous)
    return { color: null, headingSeries: null };
  }
  const colorPart  = heading.slice(0, dashIdx);
  const seriesPart = heading.slice(dashIdx + 3);
  return { color: toTitle(colorPart), headingSeries: toTitle(seriesPart) };
}

// ── Main ─────────────────────────────────────────────────────────────────────
const dir   = path.join(__dirname, '..', '.firecrawl');
const files = fs.readdirSync(dir).filter(f => f.startsWith('s-') && f.endsWith('.md')).sort();
console.log(`Processing ${files.length} stone files...\n`);

const products   = [];
const extraUrls  = new Set();
const brickKeys  = ['architectural-linear','contemporary-brick','tumbled-georgia',
                    'tumbled-vintage','avanti','-alsb-'];

for (const fname of files) {
  const slug    = fname.slice(2, -3); // strip "s-" prefix and ".md"
  const content = fs.readFileSync(path.join(dir, fname), 'utf8');

  const { series: slugSeries, finish: inferredFinish } = inferSeries(slug);
  const { color, headingSeries }  = extractFromHeading(content);
  const pageCollection = extractCollectionFromPage(content);
  const finalSeries = pageCollection || headingSeries || slugSeries;
  const rawColor    = color || extractColor(slug, slugSeries);
  const finalColor  = (rawColor && rawColor.trim()) ? rawColor : finalSeries;
  const images      = extractImages(content);
  const description = extractDescription(content);
  const region      = extractRegion(content);
  const sizeLabel   = extractSizeLabel(content);

  // Collect extra URLs we haven't scraped yet
  for (const u of discoverExtraUrls(content)) {
    if (!brickKeys.some(k => u.includes(k))) extraUrls.add(u);
  }

  products.push({
    slug,
    name:        `${finalColor} – ${finalSeries}`,
    color:       finalColor,
    series:      finalSeries,
    finish:      inferredFinish,
    description,
    material:    'Stone',
    manufacturer:'Arriscraft',
    region,
    sizeLabel,
    imageUrls:   images,
    detailPageUrl: `https://arriscraft.com/products/${slug}/`,
  });

  console.log(`  ✓ ${finalColor.padEnd(25)} | ${finalSeries.padEnd(35)} | ${images.length} imgs`);
}

// Report extra URLs not yet scraped
const scrapedSlugs = new Set(files.map(f => f.slice(2,-3)));
const missing = [...extraUrls].filter(u => !scrapedSlugs.has(u) && !brickKeys.some(k => u.includes(k)));
if (missing.length) {
  console.log('\n⚠  Extra URLs found in "More From This Collection" sections (not yet scraped):');
  missing.forEach(u => console.log('   ' + u));
  fs.writeFileSync(path.join(__dirname, '..', '.firecrawl', 'stone-missing.txt'), missing.join('\n'));
  console.log('\n   Saved to .firecrawl/stone-missing.txt');
}

// Summary by series
const byS = {};
for (const p of products) {
  if (!byS[p.series]) byS[p.series] = [];
  byS[p.series].push(p.color);
}

fs.writeFileSync(
  path.join(__dirname, 'arriscraft-stone.json'),
  JSON.stringify(products, null, 2)
);

console.log('\n' + '='.repeat(70));
console.log(`Total stone products: ${products.length}`);
console.log('\nBreakdown by series:');
for (const [s, colors] of Object.entries(byS).sort()) {
  console.log(`\n  ${s} (${colors.length}): ${colors.join(', ')}`);
}
console.log('\nSaved: scraper/arriscraft-stone.json');
