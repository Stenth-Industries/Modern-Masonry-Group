import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Check,
  SlidersHorizontal,
  ArrowRight,
  Heart,
  Grid3x3,
  Grid,
  Download,
  Share2,
  X
} from "lucide-react";
import { brickProducts } from "./catalogue-data";
import { BrickWallPattern } from "./BrickWallPattern";
import { BrickDetailPanel } from "./BrickDetailPanel";

// ── Configuration ─────────────────────────────────────────────────────────────

const ACCENT = "#ccab7b";

// Dynamic database filters will overwrite this structure on mount
const DEFAULT_FILTERS = {
  collections: [],
  colors: [],
  styles: [],
  manufacturers: [],
};

// ── Simple Elegant Checkbox ──────────────────────────────────────────────────

function GlassCheckbox({ checked, label, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full py-[7px] group text-left cursor-pointer outline-none"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-[14px] h-[14px] flex items-center justify-center transition-all duration-300 border rounded-[3px] ${checked
              ? "bg-[#ccab7b] border-[#ccab7b]"
              : "bg-black/20 border-white/15 group-hover:border-white/40"
            }`}
        >
          {checked && (
            <Check size={9} className="text-black" strokeWidth={3.5} />
          )}
        </div>
        <span
          className={`text-[11px] tracking-[0.04em] transition-colors duration-300 ${checked
              ? "text-[#e3decb] font-medium"
              : "text-[#9a9488] group-hover:text-[#e3decb] font-normal"
            }`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-[9px] text-white/20 font-mono tabular-nums">
          {count}
        </span>
      )}
    </button>
  );
}

// ── Dropdown Section ─────────────────────────────────────────────────────────

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full pb-3 border-b border-[rgba(255,255,255,0.05)] mb-3 group outline-none"
      >
        <span className="text-[9.5px] uppercase tracking-[0.25em] text-[#e3decb] group-hover:text-white transition-colors font-bold">
          {title}
        </span>
        <ChevronDown
          size={11}
          className={`text-white/40 transition-transform duration-500 delay-75 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col gap-1.5">{children}</div>
      </div>
    </div>
  );
}

// ── Recreated Screenshot Dribbble Card ───────────────────────────────────────

function PremiumCard({ product, onSample, isFavourite, onToggleFavourite, isCompared, onToggleCompare }) {
  const typeLabel = product.collection || product.type || "MOULDED";
  const manufacturer = product.manufacturer || "GLEN GERY";

  return (
    <div
      className="group flex flex-col w-full bg-transparent border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] hover:shadow-2xl hover:shadow-black/60 shadow-xl shadow-black/40 hover:-translate-y-0.5 transition-all duration-500 rounded-[12px] overflow-hidden cursor-pointer"
      onClick={() => onSample(product)}
    >
      {/* Upper Picture Area */}
      <div className="relative w-full aspect-[4/3] overflow-hidden border-b border-[rgba(255,255,255,0.02)]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <BrickWallPattern colorHex={product.colorHex || "#7A5C40"} rows={5} />
        )}

        {/* Top-Right Heart Checkbox */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavourite(product); }}
          className={`absolute top-3 right-3 p-1.5 rounded-[4px] bg-black/40 hover:bg-black/60 transition-colors border ${isFavourite ? 'border-[#ccab7b]' : 'border-transparent group-hover:border-white/20'}`}
        >
          <Heart size={14} fill={isFavourite ? "#ccab7b" : "transparent"} color={isFavourite ? "#ccab7b" : "rgba(255,255,255,0.7)"} />
        </button>
      </div>

      {/* Info Area - Slightly darkened while keeping transparency */}
      <div className="flex flex-col p-4 md:p-5 flex-1 bg-black/30">
        <div className="mb-3">
          <h3
            className="text-[#e2ded9] text-[20px] mb-2 tracking-[0.03em] truncate leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5">
            <span
              className="text-[11px] uppercase tracking-[0.15em] text-white/50"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              {manufacturer}
            </span>
          </div>
        </div>

        <div
          className="flex flex-wrap items-center gap-2 mb-6"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {typeLabel && (
            <span
              className="text-[10px] tracking-[0.1em] text-white/60 bg-white/[0.04] border border-white/[0.08] px-2 py-1 rounded-[4px] uppercase shadow-sm"
              style={{ fontWeight: 500 }}
            >
              {typeLabel}
            </span>
          )}
          <span
            className="text-[10px] tracking-[0.1em] text-[#ccab7b] bg-[#ccab7b]/10 border border-[#ccab7b]/20 px-2 py-1 rounded-[4px] uppercase shadow-sm"
            style={{ fontWeight: 600 }}
          >
            {product.finish}
          </span>
        </div>

        <div
          className="flex items-center justify-between mt-auto"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <button
            className="px-5 py-2 border border-[#4a3d2c] bg-transparent hover:bg-[#ccab7b] transition-all text-[#ccab7b] hover:text-black text-[10px] sm:text-[11px] uppercase tracking-[0.15em] rounded-md"
            style={{ fontWeight: 600 }}
          >
            Request Sample
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCompare(product); }}
            className={`flex items-center gap-2 transition-colors text-[10px] sm:text-[11px] tracking-[0.1em] uppercase bg-transparent ${isCompared ? 'text-white' : 'text-[#9a9488] hover:text-white'}`}
            style={{ fontWeight: 500 }}
          >
            <div className={`w-4 h-4 border rounded-[2px] flex items-center justify-center bg-transparent transition-colors ${isCompared ? 'border-white bg-[#ccab7b]/20' : 'border-white/20'}`}>
               {isCompared && <Check size={10} className="text-white" strokeWidth={3} />}
            </div>
            {isCompared ? 'Added' : 'Compare'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main UI ──────────────────────────────────────────────────────────────────

export default function BrickCatalogue() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [types, setTypes] = useState([]);
  const [colors, setColors] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [selected, setSelected] = useState(null);

  const [favourites, setFavourites] = useState([]);
  const [compareQueue, setCompareQueue] = useState([]);
  const [showFavourites, setShowFavourites] = useState(false);

  const [products, setProducts] = useState([]);
  const [filtersDB, setFiltersDB] = useState(DEFAULT_FILTERS);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load database filters once on mount
  useEffect(() => {
    fetch("/api/products/filters")
      .then((res) => res.json())
      .then((r) => {
        if (r.success && r.data) {
          setFiltersDB({
            collections: r.data.collections.map((c) => c.value),
            colors: r.data.colours.map((c) => c.value),
            styles: r.data.styles.map((s) => s.value),
            manufacturers: r.data.manufacturers.map((m) => m.name),
          });
        }
      })
      .catch((e) => console.error("Filter Fetch Error:", e));
  }, []);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 350);
    return () => clearTimeout(handler);
  }, [query]);

  // Reconnect Real Database
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErrorMsg("");
    const params = new URLSearchParams();
    if (debouncedQuery) params.append("search", debouncedQuery);
    if (types.length) params.append("collection", types.join(","));
    if (colors.length) params.append("colour", colors.join(","));
    if (finishes.length) params.append("style", finishes.join(","));
    if (manufacturers.length)
      params.append("manufacturer", manufacturers.join(","));
    params.append("page", page);
    params.append("limit", 20);

    fetch(`/api/products?${params.toString()}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          const mapped = res.data.map((p) => {
            const colorCat = p.categories?.find((c) => c.type === "colour");
            const collCat = p.categories?.find((c) => c.type === "collection");
            const styleCat = p.categories?.find((c) => c.type === "style");
            const variant = p.variants?.[0];
            const sizeLabel = variant?.sizeLabel || null;
            const sizeDims = variant
              ? `${variant.widthMm} × ${variant.heightMm} × ${variant.depthMm}mm`
              : "230 × 63 × 100mm";

            return {
              id: p.id,
              name: p.name,
              slug: p.slug,
              collection: collCat?.value || "Extruded",
              color: colorCat?.value || "Brown",
              colorHex: colorCat?.hexCode || "#7A5C40",
              manufacturer: p.manufacturers?.[0]?.name || "Stenth Group",
              finish: styleCat?.value || sizeLabel || "Matt",
              code: variant?.sku || p.id.slice(0, 8).toUpperCase(),
              size: sizeDims,
              image: variant?.imageUrl || null,
              description:
                p.description || "Premium architectural masonry unit.",
              // Fields needed by BrickDetailPanel
              applications: ["Residential", "Commercial", "Feature Walls"],
              weight: "3.2 kg",
              compressiveStrength: "≥ 25 MPa",
              waterAbsorption: "≤ 12%",
              frostResistance: "F2 – Exposure Grade",
              inStock: variant?.isActive ?? true,
              isNew: false,
            };
          });
          setProducts((prev) => (page === 1 ? mapped : [...prev, ...mapped]));
          setTotal(res.meta.total);
          setHasMore(page < res.meta.totalPages);
        } else {
          setErrorMsg(res.message || "Unknown error from API");
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error("API Error:", err);
        setErrorMsg(err.message || String(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
      
    return () => controller.abort();
  }, [debouncedQuery, types, colors, finishes, manufacturers, page]);

  // Reset pagination on filter change
  useEffect(() => {
    setPage(1);
    setProducts([]);
  }, [debouncedQuery, types, colors, finishes, manufacturers]);

  const tog = useCallback((val, getter, setter) => {
    setter(
      getter.includes(val) ? getter.filter((x) => x !== val) : [...getter, val],
    );
  }, []);

  const handleToggleFavourite = useCallback((prod) => {
    setFavourites(prev => 
      prev.find(p => p.id === prod.id) 
        ? prev.filter(p => p.id !== prod.id)
        : [...prev, prod]
    );
  }, []);

  const handleToggleCompare = useCallback((prod) => {
    setCompareQueue(prev => 
      prev.find(p => p.id === prod.id)
        ? prev.filter(p => p.id !== prod.id)
        : [...prev, prod]
    );
  }, []);

  const displayedProducts = showFavourites ? favourites : products;

  return (
    <div className="min-h-screen relative font-sans text-white bg-[#0e0c0a]">
      {/* EXACT Background bg.png - Restored to pure 100% unaltered state */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-fixed w-full h-full"
        style={{ backgroundImage: "url('/bg.png')" }}
      />

      {/* Wrapper to hold UI on top of background — fills entire viewport */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Header perfectly centered */}
        <div className="w-full flex flex-col items-center justify-center pt-24 pb-12 px-10 relative">
          <div className="w-10 border-t border-[#ccab7b] mb-10"></div>
          <h1 className="text-[110px] md:text-[140px] font-serif tracking-normal leading-none font-normal text-[#e3decb] mb-6" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}>
            Brick Range
          </h1>
          <p className="text-[22px] md:text-[26px] tracking-[0.05em] text-[#ccab7b] italic" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}>
            Explore colour, finish, and material specifications
          </p>
          <div className="w-10 border-t border-[#ccab7b] mt-10 mb-14"></div>
        </div>

        {/* FULL WIDTH HORIZONTAL FILTER BAR */}
        <div className="w-full bg-[#0e0c0a] border-y border-[rgba(255,255,255,0.04)] px-8 xl:px-12 py-3 flex items-center justify-between z-40 sticky top-0 shadow-2xl">
          {/* Left side */}
          <div className="flex items-center gap-8">
            <span className="text-[11px] font-bold tracking-[0.05em] text-[#ccab7b] uppercase">{showFavourites ? favourites.length : total} products</span>
            <button 
              onClick={() => setShowFavourites(!showFavourites)}
              className={`flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] uppercase transition-colors ${showFavourites ? 'text-[#ccab7b]' : 'text-[#9a9488] hover:text-white'}`}
            >
               <Heart size={14} className={showFavourites ? "text-[#ccab7b] fill-[#ccab7b]" : "text-[#9a9488]"} /> {showFavourites ? 'View All' : 'List Favourites'}
            </button>
          </div>

          {/* Middle Active Filters */}
          <div className="flex items-center gap-3 flex-1 justify-center">
            {[...types, ...colors, ...finishes, ...manufacturers].map(v => (
              <div key={v} className="flex items-center gap-2 bg-[#1a1815] border border-white/5 px-3 py-1.5 rounded-sm">
                <span className="text-[11px] text-[#e3decb] tracking-wide">{v}</span>
                <button onClick={() => {
                  if (types.includes(v)) setTypes(types.filter(x => x !== v));
                  if (colors.includes(v)) setColors(colors.filter(x => x !== v));
                  if (finishes.includes(v)) setFinishes(finishes.filter(x => x !== v));
                  if (manufacturers.includes(v)) setManufacturers(manufacturers.filter(x => x !== v));
                }} className="text-[#9a9488] hover:text-white pl-1">×</button>
              </div>
            ))}
            {(types.length > 0 || colors.length > 0 || finishes.length > 0 || manufacturers.length > 0) && (
              <button onClick={() => { setTypes([]); setColors([]); setFinishes([]); setManufacturers([]); }} className="text-[10px] font-bold tracking-[0.1em] text-[#9a9488] hover:text-white uppercase transition-colors ml-3">
                Clear All
              </button>
            )}
          </div>

          {/* Right Side Tools */}
          <div className="flex items-center gap-6 border-l border-white/5 pl-8">
            <div className="relative group flex items-center">
              <Search size={14} className="absolute left-0 text-[#9a9488] group-focus-within:text-[#ccab7b] transition-colors" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                className="bg-transparent border-none w-[120px] py-1 pl-7 text-[12px] tracking-wide text-[#e3decb] placeholder-[#9a9488] focus:outline-none focus:ring-0"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              />
            </div>
            <div className="flex items-center gap-4">
              <Grid size={16} className="text-[#9a9488] hover:text-white cursor-pointer" />
              <Grid3x3 size={16} className="text-[#9a9488] hover:text-white cursor-pointer" />
            </div>
            <div className="flex items-center gap-5 ml-4 text-[#9a9488]">
              <Download size={15} className="hover:text-white cursor-pointer" />
              <Share2 size={15} className="hover:text-white cursor-pointer" />
              <SlidersHorizontal size={15} className="hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="flex flex-1 w-full">
          {/* Sidebar matches exact layout: below title */}
          <aside className="w-[280px] xl:w-[300px] sticky top-0 h-[calc(100vh-160px)] overflow-y-auto scrollbar-none border-r border-[rgba(255,255,255,0.06)] bg-black/30 z-20 flex-shrink-0">
            <div className="px-6 pt-6 pb-24">
              <div className="flex items-center gap-3 mb-8">
                <SlidersHorizontal size={14} className="text-[#ccab7b]" />
                <h2
                  className="text-[11px] uppercase tracking-[0.2em] text-[#e3decb]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
                >
                  REFINE
                </h2>
              </div>



              {/* Dynamically populated filter sections */}
              <Section title="COLLECTION">
                {filtersDB.collections.map((t) => (
                  <GlassCheckbox
                    key={t}
                    label={t}
                    checked={types.includes(t)}
                    onClick={() => tog(t, types, setTypes)}
                  />
                ))}
              </Section>

              <Section title="COLOUR">
                {filtersDB.colors.map((c) => (
                  <GlassCheckbox
                    key={c}
                    label={c}
                    checked={colors.includes(c)}
                    onClick={() => tog(c, colors, setColors)}
                  />
                ))}
              </Section>

              <Section title="FINISH">
                {filtersDB.styles.map((s) => (
                  <GlassCheckbox
                    key={s}
                    label={s}
                    checked={finishes.includes(s)}
                    onClick={() => tog(s, finishes, setFinishes)}
                  />
                ))}
              </Section>

              <Section title="MANUFACTURER">
                {filtersDB.manufacturers.map((m) => (
                  <GlassCheckbox
                    key={m}
                    label={m}
                    checked={manufacturers.includes(m)}
                    onClick={() => tog(m, manufacturers, setManufacturers)}
                  />
                ))}
              </Section>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 px-8 lg:px-12 pt-8 pb-32">


            {/* Grid perfectly matches 5 cols exactly as drawn in the image/request */}
            {errorMsg && !showFavourites ? (
              <div className="w-full p-8 bg-red-900/40 border border-red-500 text-white rounded">
                API Error: {errorMsg}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 xl:gap-5">
                {displayedProducts.map((p) => (
                  <PremiumCard
                    key={p.id}
                    product={p}
                    onSample={(p) => setSelected(p)}
                    isFavourite={favourites.some(fav => fav.id === p.id)}
                    onToggleFavourite={handleToggleFavourite}
                    isCompared={compareQueue.some(comp => comp.id === p.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            )}

            <div className="w-full flex justify-center mt-20">
              {showFavourites ? (
                <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-white/30">
                  {favourites.length > 0 ? "All Favourites Displayed" : "No favourites yet"}
                </span>
              ) : hasMore ? (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading}
                  className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#ccab7b] hover:text-[#dfba88] transition-colors border-b border-transparent hover:border-current pb-0.5"
                >
                  {loading ? "Loading..." : "LOAD MORE PRODUCTS"}
                </button>
              ) : (
                products.length > 0 && (
                  <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-white/30">
                    All Collections Displayed
                  </span>
                )
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Elegant Details Overlay */}
      {selected && (
        <BrickDetailPanel
          brick={selected}
          initialTab="overview"
          onClose={() => setSelected(null)}
        />
      )}

      {/* Floating Compare Bar */}
      {compareQueue.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#1a1815] border border-[#ccab7b]/30 shadow-2xl rounded-full px-6 py-3 flex items-center gap-4 animate-fade-in-up">
          <span className="text-[11px] uppercase tracking-widest text-white/80 font-medium">
            <span className="text-[#ccab7b] font-bold">{compareQueue.length}</span> items to compare
          </span>
          <div className="w-px h-4 bg-white/10"></div>
          <button onClick={() => alert("Full Compare View Coming Soon in next update!")} className="text-[10px] uppercase tracking-widest text-[#ccab7b] font-bold hover:text-white transition-colors">
            Compare Now
          </button>
          <button onClick={() => setCompareQueue([])} className="text-white/40 hover:text-white ml-2">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
