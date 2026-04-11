import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import rawBricks from '../data/bricks.json';
import { Card, Input, Button, Select } from './ui';

// ─── Adapt local bricks.json to the shape the UI expects ─────────────────────
function adaptBrick(b) {
  const validImages = (b.images || []).filter(
    src => src && src.startsWith('http') && !src.toLowerCase().includes('logo') && !src.toLowerCase().includes('icon')
  );
  if (b.image && b.image.startsWith('http') && !b.image.toLowerCase().includes('logo') && !validImages.includes(b.image)) {
    validImages.unshift(b.image);
  }
  const colours = (b.allColors || []).filter(Boolean);
  return {
    id: b.id,
    name: b.name,
    material: b.attributes?.Type || '',
    description: b.description || '',
    manufacturers: (b.allManufacturers || (b.manufacturer ? [b.manufacturer] : [])).map((name, i) => ({ id: i, name })),
    variants: validImages.map((imageUrl, i) => ({ id: i, imageUrl })),
    categories: colours.map((value, i) => ({ id: `colour-${i}`, type: 'colour', value, hexCode: null })),
    collection: b.collection || '',
    allCollections: b.allCollections || [],
  };
}

const adapted = rawBricks.map(adaptBrick);

// ─── Build filter option lists once ──────────────────────────────────────────
const ALL_MATERIALS     = [...new Set(adapted.map(b => b.material).filter(Boolean))].sort();
const ALL_COLOURS       = [...new Set(adapted.flatMap(b => b.categories.map(c => c.value)))].sort();
const ALL_COLLECTIONS   = [...new Set(adapted.flatMap(b => b.allCollections).filter(Boolean))].sort();
const ALL_MANUFACTURERS = [...new Set(adapted.flatMap(b => b.manufacturers.map(m => m.name)).filter(Boolean))].sort();

const PAGE_SIZE = 20;

export default function Catalogue({ navigate }) {
  const [search, setSearch]             = useState('');
  const [material, setMaterial]         = useState('');
  const [colour, setColour]             = useState('');
  const [collection, setCollection]     = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [page, setPage]                 = useState(1);

  // Reset to page 1 whenever any filter changes
  useEffect(() => { setPage(1); }, [search, material, colour, collection, manufacturer]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return adapted.filter(b => {
      if (q && !b.name.toLowerCase().includes(q) && !b.material.toLowerCase().includes(q)) return false;
      if (material && b.material !== material) return false;
      if (colour && !b.categories.some(c => c.value === colour)) return false;
      if (collection && !b.allCollections.includes(collection)) return false;
      if (manufacturer && !b.manufacturers.some(m => m.name === manufacturer)) return false;
      return true;
    });
  }, [search, material, colour, collection, manufacturer]);

  const visible = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
  const hasMore = visible.length < filtered.length;

  // Infinite scroll sentinel
  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!hasMore) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setPage(p => p + 1);
    }, { rootMargin: '800px' });
    if (sentinelRef.current) obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasMore, visible.length]);

  const clearAll = useCallback(() => {
    setSearch(''); setMaterial(''); setColour(''); setCollection(''); setManufacturer('');
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--accent)] mb-4 tracking-tight">
          Modern Masonry Catalogue
        </h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
          Explore our premium collection of bricks and masonry materials. Engineered for durability, designed for elegance.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-1/4 flex flex-col gap-6">
          <Card className="p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6 border-b border-[var(--text-secondary)]/20 pb-2">
              Refine Search
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Search</label>
                <Input
                  type="text"
                  placeholder="Search by name..."
                  className="w-full"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Material</label>
                <Select
                  placeholder="All Materials"
                  value={material}
                  onChange={e => setMaterial(e.target.value)}
                  options={ALL_MATERIALS.map(m => ({ value: m, label: m }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Colour</label>
                <Select
                  placeholder="All Colours"
                  value={colour}
                  onChange={e => setColour(e.target.value)}
                  options={ALL_COLOURS.map(c => ({ value: c, label: c }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Collection</label>
                <Select
                  placeholder="All Collections"
                  value={collection}
                  onChange={e => setCollection(e.target.value)}
                  options={ALL_COLLECTIONS.map(c => ({ value: c, label: c }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Manufacturer</label>
                <Select
                  placeholder="All Manufacturers"
                  value={manufacturer}
                  onChange={e => setManufacturer(e.target.value)}
                  options={ALL_MANUFACTURERS.map(m => ({ value: m, label: m }))}
                />
              </div>
              <div className="pt-4 border-t border-[var(--text-secondary)]/20 flex justify-between items-center">
                <span className="text-sm text-[var(--text-secondary)]">{filtered.length} Results</span>
                <Button variant="outline" onClick={clearAll}>Clear All</Button>
              </div>
            </div>
          </Card>
        </aside>

        {/* Product Grid */}
        <main className="lg:w-3/4">
          {visible.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {visible.map(product => (
                  <div
                    key={product.id}
                    className="cursor-pointer"
                    onClick={() => navigate && navigate(`#brick-detail/${product.id}`)}
                  >
                    <Card className="flex flex-col h-full group">
                      <div className="relative h-48 bg-[var(--bg-primary)] border-b border-[var(--text-secondary)]/20 overflow-hidden flex items-center justify-center">
                        {product.variants[0]?.imageUrl ? (
                          <img
                            src={product.variants[0].imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] flex items-center justify-center">
                            <span className="text-[var(--text-secondary)] opacity-50 font-medium">No Image</span>
                          </div>
                        )}
                        {product.material && (
                          <div className="absolute top-3 right-3 bg-[var(--bg-secondary)]/90 backdrop-blur text-xs px-2 py-1 rounded text-[var(--text-primary)] border border-[var(--text-secondary)]/30">
                            {product.material}
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="mb-2">
                          {product.manufacturers.map(m => (
                            <span key={m.id} className="text-xs uppercase tracking-wider text-[var(--accent)] font-semibold">
                              {m.name}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 line-clamp-2">{product.name}</h3>
                        <div className="mt-auto pt-4 flex flex-wrap gap-2">
                          {product.categories.filter(c => c.type === 'colour').map(c => (
                            <div key={c.id} className="flex items-center gap-1.5 text-xs bg-[var(--bg-primary)] px-2 py-1 rounded-md border border-[var(--text-secondary)]/10">
                              <span className="text-[var(--text-secondary)]">{c.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>

              {hasMore && (
                <div ref={sentinelRef} className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]" />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center h-64 border border-dashed border-[var(--text-secondary)]/30 rounded-xl">
              <h3 className="text-xl font-medium text-[var(--text-primary)] mb-2">No products found</h3>
              <p className="text-[var(--text-secondary)] max-w-md">Try adjusting your filters or search query.</p>
              <Button variant="outline" className="mt-6" onClick={clearAll}>Clear all filters</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
