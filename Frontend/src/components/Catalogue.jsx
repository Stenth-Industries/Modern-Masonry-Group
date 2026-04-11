import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, Input, Button, Select } from './ui';

export default function Catalogue({ navigate }) {
  const [search, setSearch]             = useState('');
  const [material, setMaterial]         = useState('');
  const [colour, setColour]             = useState('');
  const [collection, setCollection]     = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [page, setPage]                 = useState(1);

  const [products, setProducts]         = useState([]);
  const [totalItems, setTotalItems]     = useState(0);
  const [loading, setLoading]           = useState(false);
  const [hasMore, setHasMore]           = useState(false);

  const [filterOptions, setFilterOptions] = useState({
    materials: [], colours: [], collections: [], manufacturers: []
  });

  // Fetch filter options once
  useEffect(() => {
    fetch('/api/products/filters')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          const d = res.data;
          setFilterOptions({
            materials: d.materials || [],
            colours: (d.colours || []).map(c => c.value),
            collections: (d.collections || []).map(c => c.value),
            manufacturers: (d.manufacturers || []).map(m => m.name),
          });
        }
      })
      .catch(err => console.error('Failed to load filter options', err));
  }, []);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (material) params.append('material', material);
    if (colour) params.append('colour', colour);
    if (collection) params.append('collection', collection);
    if (manufacturer) params.append('manufacturer', manufacturer);
    params.append('page', page);
    params.append('limit', 20);

    fetch(`/api/products?${params.toString()}`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          if (page === 1) {
            setProducts(res.data);
          } else {
            setProducts(prev => [...prev, ...res.data]);
          }
          setTotalItems(res.meta.total);
          setHasMore(page < res.meta.totalPages);
        }
      })
      .catch(err => console.error('Failed to load products', err))
      .finally(() => setLoading(false));
  }, [search, material, colour, collection, manufacturer, page]);

  // Reset to page 1 whenever any filter changes (except on first mount where page=1 anyway)
  // We use a separate effect that runs when filters change to reset the page.
  // We don't clear explicitly here because we want the existing products visible while loading new ones, or maybe clear them.
  // Actually, clearing them gives better UX so old items from old query aren't shown.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
    setProducts([]);
  }, [search, material, colour, collection, manufacturer]);

  // Infinite scroll sentinel
  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!hasMore || loading) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(p => p + 1);
      }
    }, { rootMargin: '800px' });
    if (sentinelRef.current) obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasMore, loading]);

  const clearAll = useCallback(() => {
    setSearch(''); setMaterial(''); setColour(''); setCollection(''); setManufacturer('');
    setPage(1);
    setProducts([]);
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
                  options={filterOptions.materials.map(m => ({ value: m, label: m }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Colour</label>
                <Select
                  placeholder="All Colours"
                  value={colour}
                  onChange={e => setColour(e.target.value)}
                  options={filterOptions.colours.map(c => ({ value: c, label: c }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Collection</label>
                <Select
                  placeholder="All Collections"
                  value={collection}
                  onChange={e => setCollection(e.target.value)}
                  options={filterOptions.collections.map(c => ({ value: c, label: c }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Manufacturer</label>
                <Select
                  placeholder="All Manufacturers"
                  value={manufacturer}
                  onChange={e => setManufacturer(e.target.value)}
                  options={filterOptions.manufacturers.map(m => ({ value: m, label: m }))}
                />
              </div>
              <div className="pt-4 border-t border-[var(--text-secondary)]/20 flex justify-between items-center">
                <span className="text-sm text-[var(--text-secondary)]">{totalItems} Results</span>
                <Button variant="outline" onClick={clearAll}>Clear All</Button>
              </div>
            </div>
          </Card>
        </aside>

        {/* Product Grid */}
        <main className="lg:w-3/4">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => (
                  <div
                    key={product.id}
                    className="cursor-pointer"
                    onClick={() => navigate && navigate(`#brick-detail/${product.slug || product.id}`)}
                  >
                    <Card className="flex flex-col h-full group">
                      <div className="relative h-48 bg-[var(--bg-primary)] border-b border-[var(--text-secondary)]/20 overflow-hidden flex items-center justify-center">
                        {product.variants?.[0]?.imageUrl ? (
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
                          {product.manufacturers?.map(m => (
                            <span key={m.id} className="text-xs uppercase tracking-wider text-[var(--accent)] font-semibold">
                              {m.name}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 line-clamp-2">{product.name}</h3>
                        <div className="mt-auto pt-4 flex flex-wrap gap-2">
                          {product.categories?.filter(c => c.type === 'colour').map(c => (
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
            <>
              {!loading && (
                <div className="flex flex-col items-center justify-center p-12 text-center h-64 border border-dashed border-[var(--text-secondary)]/30 rounded-xl">
                  <h3 className="text-xl font-medium text-[var(--text-primary)] mb-2">No products found</h3>
                  <p className="text-[var(--text-secondary)] max-w-md">Try adjusting your filters or search query.</p>
                  <Button variant="outline" className="mt-6" onClick={clearAll}>Clear all filters</Button>
                </div>
              )}
              {loading && products.length === 0 && (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]" />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
