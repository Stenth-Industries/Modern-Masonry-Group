const fs = require('fs');
const path = require('path');

function inferSeries(slug) {
  if (slug.includes('rough-hewn'))
    return { series: 'Architectural Linear Series Brick', variant: 'Georgia Rough Hewn', region: 'USA' };
  if (slug.includes('washed') && !slug.includes('georgia'))
    return { series: 'Architectural Linear Series Brick', variant: 'Washed', region: 'USA' };
  if (slug.includes('georgia-architectural-linear'))
    return { series: 'Architectural Linear Series Brick', variant: 'Georgia Standard', region: 'USA' };
  if (slug.includes('architectural-linear'))
    return { series: 'Architectural Linear Series Brick', variant: 'Canadian Standard', region: 'Canada' };
  if (slug.includes('avanti'))
    return { series: 'Avanti', variant: null, region: 'Canada' };
  if (slug.includes('contemporary-brick'))
    return { series: 'Contemporary Brick', variant: null, region: 'Canada' };
  if (slug.includes('tumbled-georgia'))
    return { series: 'Tumbled Georgia Brick', variant: null, region: 'USA' };
  if (slug.includes('tumbled-vintage'))
    return { series: 'Tumbled Vintage Brick', variant: null, region: 'Canada' };
  return { series: 'Unknown', variant: null, region: 'Unknown' };
}

function extractImages(content) {
  const imgRegex = /https:\/\/arriscraft\.com\/wp-content\/uploads\/[^\s)"'\]\\]+/g;
  const skipWords = ['logo', 'wienerberger', 'usgbc', 'sustainability', 'gs-logo', 'arp-pia', 'revisit', 'warranty', 'tc-us', 'final'];
  const imgExts = /\.(jpg|jpeg|png|webp|gif)(\?[^\s"']*)?$/i;
  const seen = new Set();
  const imgs = [];
  let m;
  while ((m = imgRegex.exec(content)) !== null) {
    let url = m[0].replace(/[\\).\s]+$/, '');
    // Strip query strings for dedup
    const base = url.split('?')[0];
    if (seen.has(base)) continue;
    seen.add(base);
    if (!imgExts.test(base)) continue; // images only, no PDFs/ZIPs
    if (skipWords.some(s => url.toLowerCase().includes(s))) continue;
    imgs.push(url);
  }
  return imgs;
}

function extractDescription(content) {
  const lines = content.split('\n');
  const skipWords = ['cookie', 'privacy', 'Arriscraft-Logo', 'Where To Buy',
    'Quick Menu', 'COLOUR SELECTION', 'Product Information', 'Installation', 'SIGN UP',
    'SEE WHAT', 'COPYRIGHT', 'WARRANTY', 'TERMS', 'CADD', 'Linkedin', 'Pinterest',
    'Are you looking', 'Previous image', 'Next image', 'visitor-type', 'Want the latest',
    'Revisit', 'Powered by', 'Customise', 'NecessaryAlways'];
  let inMain = false;
  const desc = [];
  for (const line of lines) {
    const l = line.trim();
    if (!l) { if (desc.length > 0) break; continue; }
    if (skipWords.some(s => l.includes(s))) continue;
    if (l.startsWith('#') && l.length > 3) { inMain = true; continue; }
    if (inMain && l.length > 50 && !l.startsWith('!') && !l.startsWith('[') &&
        !l.startsWith('|') && !l.startsWith('*') && !l.startsWith('-') && !l.startsWith('(')) {
      desc.push(l);
      if (desc.length >= 2) break;
    }
  }
  return desc.join(' ').trim() || null;
}

function extractDimensions(content) {
  const m = content.match(/(\d+\s*[xX]\s*\d+\s*[xX]\s*\d+\s*(?:mm|MM)?)/);
  return m ? m[1].trim() : null;
}

function extractFinish(slug, content) {
  if (slug.includes('rough-hewn')) return 'Rough Hewn';
  if (slug.includes('washed')) return 'Washed';
  if (slug.includes('tumbled')) return 'Tumbled';
  if (/smooth/i.test(content)) return 'Smooth';
  if (/split.faced/i.test(content)) return 'Split Faced';
  if (slug.includes('contemporary')) return 'Smooth';
  return 'Standard';
}

function extractColor(slug) {
  const patterns = [
    '-georgia-alsb-rough-hewn',
    '-georgia-architectural-linear-series-brick-washed',
    '-georgia-architectural-linear-series-brick',
    '-architectural-linear-series-brick-washed',
    '-architectural-linear-series-brick',
    '-avanti',
    '-contemporary-brick',
    '-tumbled-georgia-brick',
    '-tumbled-vintage-brick',
  ];
  let color = slug;
  for (const p of patterns) {
    if (color.endsWith(p)) { color = color.slice(0, -p.length); break; }
  }
  return color.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function extractSpecialNote(content) {
  const soMatch = content.match(/special order/i);
  return soMatch ? 'Special Order' : null;
}

const dir = path.join(__dirname, '..', '.firecrawl');
const files = fs.readdirSync(dir).filter(f => f.startsWith('p-') && f.endsWith('.md')).sort();
console.log(`Processing ${files.length} product files...\n`);

const products = [];

for (const fname of files) {
  const slug = fname.slice(2, -3);
  const content = fs.readFileSync(path.join(dir, fname), 'utf8');

  const nameMatch = content.match(/^#{1,2}\s+(.+)$/m);
  let rawName = nameMatch ? nameMatch[1].replace(/\[|\]|\([^)]*\)/g, '').trim() : slug;

  const { series, variant, region } = inferSeries(slug);
  const color = extractColor(slug);
  const images = extractImages(content);
  const description = extractDescription(content);
  const dimensions = extractDimensions(content);
  const finish = extractFinish(slug, content);
  const specialNote = extractSpecialNote(content);

  // Build clean product name: "Color – Series"
  const cleanName = variant
    ? `${color} – ${series} (${variant})`
    : `${color} – ${series}`;

  products.push({
    slug,
    name: cleanName,
    color,
    series,
    seriesVariant: variant,
    finish,
    specialNote,
    description,
    material: 'Brick',
    manufacturer: 'Arriscraft',
    region,
    dimensions,
    imageUrls: images,
    detailPageUrl: `https://arriscraft.com/products/${slug}/`
  });

  console.log(`  ✓ ${color.padEnd(22)} | ${(series + (variant ? ` / ${variant}` : '')).padEnd(46)} | ${images.length} imgs`);
}

// Summary by series
const byS = {};
for (const p of products) {
  const key = p.series;
  if (!byS[key]) byS[key] = [];
  byS[key].push(p);
}

fs.writeFileSync(
  path.join(__dirname, 'arriscraft-bricks.json'),
  JSON.stringify(products, null, 2)
);

console.log('\n' + '='.repeat(70));
console.log(`Total products: ${products.length}`);
console.log('\nBreakdown by series:');
for (const [s, ps] of Object.entries(byS).sort()) {
  const variants = [...new Set(ps.map(p => p.seriesVariant || 'Standard'))];
  console.log(`\n  ${s} (${ps.length} products)`);
  for (const v of variants) {
    const vps = ps.filter(p => (p.seriesVariant || 'Standard') === v);
    console.log(`    ${v}: ${vps.map(p => p.color).join(', ')}`);
  }
}
console.log('\nSaved: scraper/arriscraft-bricks.json');
