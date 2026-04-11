import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ChevronDown,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ArrowUpDown,
  Filter,
  Sparkles,
} from "lucide-react";
import { BrickWallPattern } from "./BrickWallPattern";
import { BrickDetailPanel } from "./BrickDetailPanel";

const colorDots = {
  Tan: "#C4A57B",
  Red: "#A0563B",
  Gray: "#9E9284",
  Blue: "#5B7C8D",
  Cream: "#E8DCC8",
  Charcoal: "#545454",
  Brown: "#7A5C40",
  White: "#E8E4DC",
};

// Mapper from Backend product format to UI format
const mapProduct = (p) => {
  const collection = p.categories?.find(c => c.type === 'collection')?.value || p.material || 'General';
  const colorCat = p.categories?.find(c => c.type === 'colour');
  const manufacturer = p.manufacturers?.[0]?.name || 'Generic';
  const variant = p.variants?.[0];
  
  return {
    id: p.id,
    name: p.name,
    collection,
    color: colorCat?.value || 'Gray',
    colorHex: colorCat?.hexCode || colorDots[colorCat?.value] || '#888',
    manufacturer,
    finish: p.categories?.find(c => c.type === 'style')?.value || 'Standard',
    code: variant?.sku || (p.id.substring(0,8).toUpperCase()),
    inStock: true, // Defaulting to true for demo
    isNew: false, 
    image: variant?.imageUrl || null,
    // Add missing details for the panel:
    description: p.description || 'Premium architectural masonry unit engineered for high performance applications.',
    applications: ["Residential API", "Commercial API", "Feature Walls"],
    size: 'Standard 230×76×110mm',
    weight: '3.0 kg',
    compressiveStrength: '25 MPa',
    waterAbsorption: '8%',
    frostResistance: 'F2'
  };
};

function FilterSection({
  title,
  isOpen,
  onToggle,
  children,
}) {
  return (
    <div className="border-b border-white/5">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-4 text-left group"
      >
        <span className="text-sm text-gray-300 group-hover:text-[var(--brass)] transition-colors font-medium">
          {title}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-500 group-hover:text-[var(--brass)] transition-all ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActiveFilterBadge({ label, onRemove }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-1.5 px-3 mb-2 py-1 rounded-full bg-[var(--brass)]/15 border border-[var(--brass)]/30 text-[var(--brass)] text-xs font-semibold"
    >
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:text-white transition-colors focus:outline-none"
      >
        <X size={10} />
      </button>
    </motion.span>
  );
}

function BrickCard({
  product,
  index,
  viewMode,
  onClick,
}) {
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3 }}
        onClick={onClick}
        className="group flex items-center gap-6 p-4 rounded-xl bg-[var(--charcoal)] border border-white/5 hover:border-[var(--brass)]/50 hover:shadow-[0_0_20px_rgba(212,175,99,0.1)] cursor-pointer transition-all duration-300"
      >
        {/* Brick swatch */}
        <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 relative bg-black">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <BrickWallPattern colorHex={product.colorHex} rows={3} />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-bold group-hover:text-[var(--brass)] transition-colors truncate">
              {product.name}
            </h3>
            {product.isNew && (
              <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-[var(--brass)]/15 text-[var(--brass)] text-[10px] uppercase font-bold tracking-widest border border-[var(--brass)]/25">
                New
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 font-medium">
            {product.collection} · {product.manufacturer} · {product.finish}
          </p>
        </div>

        {/* Color + code */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div
            className="w-4 h-4 rounded-full border border-white/10 shadow-sm"
            style={{ background: product.colorHex }}
          />
          <span className="text-xs font-mono text-gray-500">{product.code}</span>
        </div>

        {/* Status */}
        <div className="flex-shrink-0">
          <span
            className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${
              product.inStock
                ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20"
                : "text-red-400 bg-red-400/10 border border-red-400/20"
            }`}
          >
            {product.inStock ? "In Stock" : "Enquire"}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
      onClick={onClick}
      className="group cursor-pointer aspect-auto"
    >
      <div className="relative bg-[var(--charcoal)] rounded-2xl overflow-hidden border border-white/5 transition-all duration-400 group-hover:border-[var(--brass)]/50 group-hover:shadow-[0_12px_40px_rgba(212,175,99,0.15)] flex flex-col h-full">
        {/* Brick Pattern or Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-black flex-shrink-0">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
          ) : (
            <BrickWallPattern colorHex={product.colorHex} rows={5} />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end pb-5 gap-2">
            <motion.span className="px-5 py-2.5 bg-[var(--brass)] text-black font-bold uppercase text-[10px] tracking-widest rounded-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 shadow-lg">
              View Details
            </motion.span>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="px-2.5 py-1 rounded-md bg-black/80 border border-[var(--brass)]/40 text-[var(--brass)] text-[9px] uppercase font-bold tracking-widest backdrop-blur-sm shadow-sm">
                New
              </span>
            )}
            {!product.inStock && (
              <span className="px-2.5 py-1 rounded-md bg-black/80 border border-red-500/30 text-red-400 text-[9px] uppercase font-bold tracking-widest backdrop-blur-sm shadow-sm">
                Enquire
              </span>
            )}
          </div>

          {/* Color dot */}
          <div
            className="absolute bottom-3 right-3 w-5 h-5 rounded-full border-2 border-white/20 shadow-lg"
            style={{ background: product.colorHex }}
            title={product.color}
          />
        </div>

        {/* Info */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-white font-bold text-lg group-hover:text-[var(--brass)] transition-colors leading-tight line-clamp-1">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-4">
            <span className="px-2 py-0.5 rounded bg-white/5 text-gray-400">
              {product.collection}
            </span>
            <span className="text-gray-700">·</span>
            <span className="truncate">{product.manufacturer}</span>
          </div>
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
            <span className="text-xs font-mono text-gray-500">{product.code}</span>
            <span className="text-xs text-gray-400 font-medium truncate ml-2">{product.finish}</span>
          </div>
        </div>

        {/* Gold bottom line on hover */}
        <div className="h-[2px] w-0 bg-gradient-to-r from-transparent via-[var(--brass)] to-transparent group-hover:w-full transition-all duration-500" />
      </div>
    </motion.div>
  );
}

export default function BrickCatalogue({ navigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState([]);
  
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [openSections, setOpenSections] = useState({
    collections: true,
    colors: true,
    manufacturers: true,
  });
  const [selectedBrick, setSelectedBrick] = useState(null);

  // Backend Data State
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [filterOptions, setFilterOptions] = useState({
    collections: [], colors: [], manufacturers: []
  });

  // Fetch filter options once
  useEffect(() => {
    fetch('/api/products/filters')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          const d = res.data;
          setFilterOptions({
            colors: (d.colours || []).map(c => c.value),
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
    if (searchQuery) params.append('search', searchQuery);
    if (selectedCollections.length) params.append('collection', selectedCollections.join(','));
    if (selectedColors.length) params.append('colour', selectedColors.join(','));
    if (selectedManufacturers.length) params.append('manufacturer', selectedManufacturers.join(','));
    params.append('page', page);
    params.append('limit', 20);

    fetch(`/api/products?${params.toString()}`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          const mapped = res.data.map(mapProduct);
          if (page === 1) {
            setProducts(mapped);
          } else {
            setProducts(prev => [...prev, ...mapped]);
          }
          setTotalItems(res.meta.total);
          setHasMore(page < res.meta.totalPages);
        }
      })
      .catch(err => console.error('Failed to load products', err))
      .finally(() => setLoading(false));
  }, [searchQuery, selectedCollections, selectedColors, selectedManufacturers, page]);

  // Reset pagination on filter change
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
    setProducts([]);
  }, [searchQuery, selectedCollections, selectedColors, selectedManufacturers]);

  // Infinite scroll
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

  const toggleSection = (key) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleFilter = useCallback(
    (value, current, setter) => {
      setter(current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
    },
    []
  );

  const clearAllFilters = () => {
    setSelectedCollections([]);
    setSelectedColors([]);
    setSelectedManufacturers([]);
    setSearchQuery("");
  };

  const totalActiveFilters = selectedCollections.length + selectedColors.length + selectedManufacturers.length;

  // Render individual filter sections separately to allow injection outside
  const FilterContent = () => (
    <div className="space-y-0">
      {/* Collections */}
      <FilterSection title="Collections" isOpen={openSections.collections} onToggle={() => toggleSection("collections")}>
        <div className="space-y-1 pr-2">
          {filterOptions.collections.map((col) => {
            const active = selectedCollections.includes(col);
            return (
              <button
                key={col}
                onClick={() => toggleFilter(col, selectedCollections, setSelectedCollections)}
                className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all font-medium ${
                  active ? "bg-[var(--brass)]/15 text-[var(--brass)] border border-[var(--brass)]/25" : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <span className="truncate mr-2">{col}</span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Colours */}
      <FilterSection title="Colours" isOpen={openSections.colors} onToggle={() => toggleSection("colors")}>
        <div className="space-y-1.5 mt-1 pr-2">
          {filterOptions.colors.map((color) => {
            const active = selectedColors.includes(color);
            return (
              <button
                key={color}
                onClick={() => toggleFilter(color, selectedColors, setSelectedColors)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all font-medium ${
                  active ? "bg-[var(--brass)]/15 text-[var(--brass)] border border-[var(--brass)]/25" : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex-shrink-0 shadow-sm border ${active ? "border-[var(--brass)]/70" : "border-white/10"}`}
                  style={{ background: colorDots[color] ?? "#888" }}
                />
                <span className="truncate">{color}</span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Manufacturers */}
      <FilterSection title="Manufacturers" isOpen={openSections.manufacturers} onToggle={() => toggleSection("manufacturers")}>
        <div className="space-y-1 pr-2">
          {filterOptions.manufacturers.map((mfr) => {
            const active = selectedManufacturers.includes(mfr);
            return (
              <button
                key={mfr}
                onClick={() => toggleFilter(mfr, selectedManufacturers, setSelectedManufacturers)}
                className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all font-medium ${
                  active ? "bg-[var(--brass)]/15 text-[var(--brass)] border border-[var(--brass)]/25" : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <span className="truncate">{mfr}</span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Clear all */}
      {totalActiveFilters > 0 && (
        <div className="pt-5 pr-4 lg:pr-0 pb-12">
          <button
            onClick={clearAllFilters}
            className="w-full py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      <div className="flex flex-1 w-full bg-black">
        {/* Mobile Filter Overlay */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] lg:hidden"
                onClick={() => setShowMobileFilters(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 35 }}
                className="fixed top-0 left-0 h-full w-80 bg-black border-r border-white/5 z-[100] flex flex-col lg:hidden shadow-[10px_0_40px_rgba(0,0,0,0.5)]"
              >
                {/* Mobile Static Header */}
                <div className="p-6 pb-4 border-b border-white/10 shrink-0">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-[var(--brass)] uppercase font-bold tracking-widest text-xs">
                      <Filter size={16} />
                      <span>Filters</span>
                    </div>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="text-gray-500 hover:text-white bg-white/5 p-2 rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {/* Search Bar Mobile */}
                  <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base placeholder:text-gray-500 focus:outline-none focus:border-[var(--brass)]/50 focus:bg-white/10 transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Mobile Filter Lists */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  <FilterContent />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-80 flex-shrink-0 border-r border-white/5 bg-black h-screen pt-24">
          
          {/* Locked Sidebar Header */}
          <div className="px-6 pb-6 shrink-0 z-10 bg-black">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <SlidersHorizontal size={18} className="text-[var(--brass)]" />
              <span className="text-sm font-bold tracking-[0.2em] uppercase text-[var(--brass)]">
                Refine Search
              </span>
              {totalActiveFilters > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-6 h-6 rounded-full bg-[var(--brass)] text-black text-xs font-bold flex items-center justify-center shadow-lg shadow-[var(--brass)]/20"
                >
                  {totalActiveFilters}
                </motion.span>
              )}
            </div>
            
            {/* Locked Search Bar */}
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-11 pr-11 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-base placeholder:text-gray-500 focus:outline-none focus:border-[var(--brass)]/50 focus:bg-white/10 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
          
          {/* Scrollable Filters */}
          <div className="flex-1 overflow-y-auto px-6 pb-24 custom-scrollbar">
             <FilterContent />
          </div>

        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 min-w-0 flex flex-col h-screen pt-24 bg-black">
          
          {/* Locked Main Pane Header */}
          <div className="px-6 lg:px-8 pb-4 shrink-0 bg-black z-10">
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--charcoal)] border border-white/10 text-xs font-bold uppercase tracking-wider text-gray-300 hover:border-[var(--brass)]/40 transition-colors"
              >
                <Filter size={14} />
                <span>Filter</span>
                {totalActiveFilters > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[var(--brass)] text-black flex items-center justify-center -ml-1">
                    {totalActiveFilters}
                  </span>
                )}
              </button>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mr-auto">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  <span className="text-[var(--brass)] font-black text-base">{totalItems}</span>{" "}
                  {totalItems === 1 ? "Product" : "Products"} Found
                </p>
              </motion.div>

              <div className="flex rounded-xl overflow-hidden border border-white/10 bg-[var(--charcoal)] shadow-lg shadow-black">
                <button onClick={() => setViewMode("grid")} className={`p-3 transition-colors ${viewMode === "grid" ? "bg-[var(--brass)] text-black" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}>
                  <LayoutGrid size={18} />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-3 transition-colors ${viewMode === "list" ? "bg-[var(--brass)] text-black" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}>
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Active Filter Badges */}
            <AnimatePresence>
              {(totalActiveFilters > 0 || searchQuery) && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap gap-2 pb-2">
                  <AnimatePresence>
                    {searchQuery && <ActiveFilterBadge label={`"${searchQuery}"`} onRemove={() => setSearchQuery("")} />}
                    {selectedCollections.map(c => <ActiveFilterBadge key={c} label={c} onRemove={() => setSelectedCollections(p => p.filter(x => x !== c))} />)}
                    {selectedColors.map(c => <ActiveFilterBadge key={c} label={c} onRemove={() => setSelectedColors(p => p.filter(x => x !== c))} />)}
                    {selectedManufacturers.map(m => <ActiveFilterBadge key={m} label={m} onRemove={() => setSelectedManufacturers(p => p.filter(x => x !== m))} />)}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scrollable Product Grid */}
          <div className="flex-1 overflow-y-auto px-6 lg:px-8 pb-24 custom-scrollbar relative border-t border-white/5 lg:border-transparent pt-4">
            <AnimatePresence>
              {products.length > 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="results" className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6" : "space-y-4"}>
                  {products.map((product, index) => (
                    <BrickCard key={`${product.id}-${index}`} product={product} index={index % 20} viewMode={viewMode} onClick={() => setSelectedBrick(product)} />
                  ))}
                </motion.div>
              ) : (
                !loading && (
                  <motion.div key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="w-24 h-16 rounded-xl overflow-hidden mb-6 opacity-30">
                      <BrickWallPattern colorHex="#333" rows={3} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                    <p className="text-sm text-gray-400 mb-8 max-w-sm leading-relaxed">
                      Try adjusting your filters or search query to explore more of our api catalogue.
                    </p>
                    <button onClick={clearAllFilters} className="px-8 py-3.5 rounded-xl bg-[var(--brass)] text-black font-bold uppercase tracking-wider text-xs hover:bg-[var(--brass-light)] transition-all">
                      Clear All Filters
                    </button>
                  </motion.div>
                )
              )}
              
              {hasMore && (
                <div ref={sentinelRef} className="flex justify-center py-10 mt-8">
                  <div className="w-8 h-8 rounded-full border-2 border-[var(--brass)] border-t-transparent animate-spin" />
                </div>
              )}
            </AnimatePresence>
          </div>

        </main>
      </div>

      <BrickDetailPanel brick={selectedBrick} onClose={() => setSelectedBrick(null)} />
    </div>
  );
}
