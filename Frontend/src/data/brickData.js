import bricksRaw from './bricks.json';

// Normalize color values - some have multi-colors like "Cream, Yellow"
function normalizeColorString(color) {
  if (!color) return [];
  return color.split(/[,\/]/).map(c => c.trim()).filter(Boolean);
}

// Merge all color sources
function getAllColors(brick) {
  const colors = new Set();
  // From category page colors
  if (brick.allColors) brick.allColors.forEach(c => normalizeColorString(c).forEach(x => colors.add(x)));
  // From attributes
  if (brick.color) normalizeColorString(brick.color).forEach(c => colors.add(c));
  if (brick.attributes?.Colour) normalizeColorString(brick.attributes.Colour).forEach(c => colors.add(c));
  return [...colors].filter(c => c.length > 0);
}

// Normalize collection/type names
function normalizeCollections(brick) {
  const colls = new Set();
  if (brick.allCollections) brick.allCollections.forEach(c => { if (c) colls.add(c); });
  if (brick.collection) colls.add(brick.collection);
  if (brick.attributes?.Type) colls.add(brick.attributes.Type);
  return [...colls].filter(c => c.length > 0);
}

// Normalize style values
function getStyles(brick) {
  const styles = new Set();
  if (brick.attributes?.Style) {
    brick.attributes.Style.split(',').map(s => s.trim()).filter(Boolean).forEach(s => styles.add(s));
  }
  return [...styles];
}

// Process all bricks
export const bricks = bricksRaw.map((b, i) => {
  const colors = getAllColors(b);
  const collections = normalizeCollections(b);
  const styles = getStyles(b);

  return {
    id: b.id || i + 1,
    name: b.name || 'Unknown',
    url: b.url || '',
    image: b.image || '',
    images: b.images || [],
    manufacturer: b.manufacturer || b.allManufacturers?.[0] || b.attributes?.Brand || b.series || 'Unknown',
    color: colors[0] || 'Other',
    colors: colors.length > 0 ? colors : ['Other'],
    collection: collections[0] || '',
    collections,
    style: b.attributes?.Style || '',
    styles,
    type: b.attributes?.Type || '',
    sizes: b.attributes?.Sizes || '',
    description: b.description || '',
  };
});

// Build clean filter lists — deduplicate and normalize
function buildColorList() {
  const counts = {};
  bricks.forEach(b => b.colors.forEach(c => { counts[c] = (counts[c] || 0) + 1; }));
  // Only include colors that are clean single-word values
  const validColors = ['Black', 'Brown', 'Buff', 'Burgundy', 'Cream', 'Grey', 'Orange', 'Other', 'Pink', 'Red', 'White', 'Yellow', 'Beige', 'Tan'];
  return validColors.filter(c => counts[c] > 0).sort();
}

export const allColors = buildColorList();
export const allManufacturers = [...new Set(bricks.map(b => b.manufacturer))].filter(m => m !== 'Unknown').sort();

// Clean up collection names — normalize similar ones
function normalizeCollectionName(name) {
  if (name.includes('Full-bed')) return 'Full-bed Face Brick';
  if (name === 'Handmade') return 'Handmades';
  return name;
}

export const allCollections = [...new Set(
  bricks.flatMap(b => b.collections.map(normalizeCollectionName)).filter(Boolean)
)].sort();

export const allStyles = [...new Set(bricks.flatMap(b => b.styles).filter(Boolean))].sort();

// Color swatch mapping
export const COLOR_SWATCHES = {
  'Black': '#1a1a1a',
  'Brown': '#6B3A2A',
  'Buff': '#C4A35A',
  'Burgundy': '#800020',
  'Cream': '#F5E6C4',
  'Beige': '#D4B896',
  'Grey': '#808080',
  'Orange': '#CC5500',
  'Red': '#8B2500',
  'Tan': '#C4A069',
  'White': '#EDEDED',
  'Yellow': '#D4AA00',
  'Pink': '#D4798F',
  'Other': '#A0998E',
};
