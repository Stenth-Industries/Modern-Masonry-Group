import React, { useState, useEffect, useCallback } from 'react';
import { Card, Input, Button, Select } from './ui';

export default function Catalogue() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({
    colours: [],
    collections: [],
    styles: [],
    manufacturers: [],
    materials: []
  });

  const [queryParams, setQueryParams] = useState({
    search: '',
    colour: '',
    collection: '',
    style: '',
    manufacturer: '',
    material: '',
    page: 1,
    limit: 20
  });

  const [loading, setLoading] = useState(false);

  // Fetch filters
  useEffect(() => {
    fetch('http://localhost:5000/api/products/filters')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFilters(data.data);
        }
      })
      .catch(err => console.error("Error fetching filters:", err));
  }, []);

// Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const res = await fetch(`http://localhost:5000/api/products?${params.toString()}`);
      const data = await res.json();
      
      if (data.success) {
        setProducts(prev => queryParams.page === 1 ? data.data : [...prev, ...data.data]);
        setMeta(data.meta);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const observer = React.useRef();
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    // We use a large rootMargin (800px) so the next page starts loading LONG before the user reaches the bottom.
    // This accomplishes the "lazy loading second page instantly" feel.
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && meta && meta.page < meta.totalPages) {
        setQueryParams(prev => ({ ...prev, page: prev.page + 1 }));
      }
    }, { rootMargin: '800px' });
    
    if (node) observer.current.observe(node);
  }, [loading, meta]);

  const updateFilter = (key, value) => {
    setQueryParams(prev => {
      if (key === 'page') {
        return { ...prev, page: value };
      }
      return { ...prev, [key]: value, page: 1 };
    });
  };

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
                  placeholder="Search by name, SKU..." 
                  className="w-full"
                  value={queryParams.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Material</label>
                <Select 
                  placeholder="All Materials"
                  value={queryParams.material}
                  onChange={(e) => updateFilter('material', e.target.value)}
                  options={filters.materials.map(m => ({ value: m, label: m }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Colour</label>
                <Select 
                  placeholder="All Colours"
                  value={queryParams.colour}
                  onChange={(e) => updateFilter('colour', e.target.value)}
                  options={filters.colours.map(c => ({ value: c.value, label: c.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Collection</label>
                <Select 
                  placeholder="All Collections"
                  value={queryParams.collection}
                  onChange={(e) => updateFilter('collection', e.target.value)}
                  options={filters.collections.map(c => ({ value: c.value, label: c.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Manufacturer</label>
                <Select 
                  placeholder="All Manufacturers"
                  value={queryParams.manufacturer}
                  onChange={(e) => updateFilter('manufacturer', e.target.value)}
                  options={filters.manufacturers.map(m => ({ value: m.name, label: m.name }))}
                />
              </div>

              <div className="pt-4 border-t border-[var(--text-secondary)]/20 flex justify-between items-center">
                <span className="text-sm text-[var(--text-secondary)]">
                  {meta?.total || 0} Results
                </span>
                <Button 
                  variant="outline" 
                  onClick={() => setQueryParams({
                    search: '', colour: '', collection: '', style: '', manufacturer: '', material: '', page: 1, limit: 20
                  })}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </Card>
        </aside>

        {/* Product Grid */}
        <main className="lg:w-3/4">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product, index) => {
                  const isLastElement = index === products.length - 1;
                  return (
                    <div ref={isLastElement ? lastElementRef : null} key={`${product.id}-${index}`}>
                      <Card className="flex flex-col h-full group">
                        <div className="relative h-48 bg-[var(--bg-primary)] border-b border-[var(--text-secondary)]/20 overflow-hidden flex items-center justify-center">
                          {product.variants?.[0]?.imageUrl ? (
                            <img 
                              src={product.variants[0].imageUrl} 
                              alt={product.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
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
                          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          
                          <div className="mt-auto pt-4 flex flex-wrap gap-2">
                            {product.categories?.filter(c => c.type === 'colour').map(c => (
                              <div key={c.id} className="flex items-center gap-1.5 text-xs bg-[var(--bg-primary)] px-2 py-1 rounded-md border border-[var(--text-secondary)]/10">
                                {c.hexCode && (
                                  <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: c.hexCode }}></span>
                                )}
                                <span className="text-[var(--text-secondary)]">{c.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>

              {/* Infinite Scroll Loader */}
              {loading && queryParams.page > 1 && (
                <div className="py-8 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
                  <span className="ml-3 text-[var(--text-secondary)] font-medium">Loading more styles...</span>
                </div>
              )}
            </>
          ) : loading && queryParams.page === 1 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center h-64 border border-dashed border-[var(--text-secondary)]/30 rounded-xl">
              <svg className="w-16 h-16 text-[var(--text-secondary)]/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-medium text-[var(--text-primary)] mb-2">No products found</h3>
              <p className="text-[var(--text-secondary)] max-w-md">
                Try adjusting your filters or search query to find what you're looking for.
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => setQueryParams({
                  search: '', colour: '', collection: '', style: '', manufacturer: '', material: '', page: 1, limit: 20
                })}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
