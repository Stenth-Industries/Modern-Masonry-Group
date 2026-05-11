import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Search,
  ChevronDown,
  Check,
  Plus,
  SlidersHorizontal,
  Heart,
  Grid3x3,
  Grid,
  X,
  Share2,
} from "lucide-react";

import { BrickWallPattern } from "./BrickWallPattern";
import CompareModal from "./CompareModal";
import Footer from "./Footer";

// ── Configuration ─────────────────────────────────────────────────────────────

const ACCENT = "#c9a449";

const COLOR_MAP = {
  red: "#B4382B",
  "dark red": "#8B1A1A",
  tan: "#C4A57B",
  burgundy: "#5D1E24",
  grey: "#808080",
  gray: "#808080",
  "light grey": "#B0B0B0",
  "dark grey": "#555555",
  brown: "#7A5C40",
  "dark brown": "#4A3728",
  buff: "#D4B483",
  cream: "#EDE0C4",
  white: "#E8E4DC",
  "off white": "#E0D8CC",
  black: "#1A1A1A",
  charcoal: "#4A4A4A",
  silver: "#A8A8A8",
  bronze: "#A0724A",
  gold: "#C9A84C",
  orange: "#C0622A",
  pink: "#D4948A",
  blue: "#4A6FA5",
  green: "#5A7A5A",
  yellow: "#D4C060",
  beige: "#CDB89A",
  ivory: "#E8DFC8",
  slate: "#607080",
  terracotta: "#C06040",
  "light brown": "#A08060",
  "medium brown": "#8B6347",
  "warm grey": "#9A9088",
  "cool grey": "#8090A0",
  purple: "#705080",
  multicolor:
    "linear-gradient(135deg, #B4382B 0%, #C4A57B 33%, #808080 66%, #4A3728 100%)",
  cashmere: "#D4C4A8",
  driftwood: "#B8A888",
  moonstone: "#C8C8C0",
  silverado: "#A0A098",
  infinity: "#686058",
  greige: "#B0A090",
  opal: "#C8C0B8",
  walnut: "#5A4030",
  mahogany: "#6B3A2A",
  onyx: "#1A1A1A",
  amalfi: "#D0C8B0",
  baja: "#C8B890",
  avalanche: "#E0D8D0",
  glacier: "#C8D0D0",
  basalt: "#505850",
  limestone: "#D0C8B0",
  magnolia: "#E0D8C8",
  ironstone: "#706858",
};

const resolveColorHex = (name, apiHex) => {
  if (apiHex && apiHex !== "#808080") return apiHex;
  if (!name) return null;
  return COLOR_MAP[name.toLowerCase().trim()] || null;
};

const DEFAULT_FILTERS = {
  manufacturersWithCollections: [],
  colors: [],
  styles: [],
  series: [],
};

// ── Simple Elegant Checkbox ──────────────────────────────────────────────────

function GlassCheckbox({ checked, label, count, onClick, colorDot }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full py-[7px] group text-left cursor-pointer outline-none"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-[16px] h-[16px] flex items-center justify-center transition-all duration-300 border rounded-[3px] ${checked
            ? "bg-[#c9a449] border-[#c9a449]"
            : "bg-black/20 border-white/15 group-hover:border-white/40"
            }`}
        >
          {checked && (
            <Check size={11} className="text-black" strokeWidth={3.5} />
          )}
        </div>
        <span
          className={`text-[13px] tracking-[0.03em] transition-colors duration-300 ${checked
            ? "text-[#e3decb] font-medium"
            : "text-[#9a9488] group-hover:text-[#e3decb] font-normal"
            }`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {label}
        </span>
        {colorDot && (
          <div
            className="w-[14px] h-[14px] rounded-full border border-white/20 shrink-0"
            style={{ background: colorDot }}
          />
        )}
      </div>
      {count !== undefined && (
        <span className="text-[11px] text-white/20 font-mono tabular-nums">
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
      <div className="flex items-center justify-between w-full pb-4 border-b border-[rgba(255,255,255,0.05)] mb-4">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#c9a449] font-bold">
          {title}
        </span>
        <button onClick={() => setOpen(!open)} className="outline-none ml-2">
          <ChevronDown
            size={13}
            className={`text-white/40 transition-transform duration-500 delay-75 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col gap-1.5">{children}</div>
      </div>
    </div>
  );
}

// ── Premium Stone Card ────────────────────────────────────────────────────────

const PremiumCard = React.memo(function PremiumCard({
  product,
  onSample,
  isFavourite,
  onToggleFavourite,
  isCompared,
  onToggleCompare,
}) {
  const typeLabel = product.collection || "Stone";
  const manufacturer = product.manufacturer || "Arriscraft International";
  const [imgError, setImgError] = useState(false);

  const cardRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [7, -7]), {
    stiffness: 250,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 250,
    damping: 25,
  });

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className={`group w-full h-full border ${isCompared ? "border-[#c9a449]" : "border-[rgba(255,255,255,0.06)]"} hover:border-[#c9a449] hover:shadow-2xl hover:shadow-black/60 shadow-xl shadow-black/40 hover:-translate-y-0.5 transition-all duration-500 rounded-[12px] cursor-pointer`}
      onClick={() => onSample(product)}
    >
      <div className="flex flex-col w-full h-full rounded-[12px] overflow-hidden">
        {/* Upper Picture Area */}
        <div className="relative w-full aspect-[5/4] shrink-0 overflow-hidden border-b border-[rgba(255,255,255,0.02)] bg-[#111]">
          {product.image && !imgError ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover scale-110 transition-transform duration-[2s] ease-out group-hover:scale-125"
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
            />
          ) : (
            <BrickWallPattern colorHex={product.colorHex || "#c9a449"} rows={5} />
          )}

          {/* Top-Right: Favourites & Share buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavourite(product);
              }}
              title={isFavourite ? "Remove from Favourites" : "Add to Favourites"}
              className={`p-1.5 rounded-[4px] bg-black/40 hover:bg-black/60 transition-colors border ${isFavourite ? "border-[#c9a449]" : "border-transparent group-hover:border-white/20"}`}
            >
              <Heart
                size={14}
                fill={isFavourite ? "#c9a449" : "transparent"}
                color={isFavourite ? "#c9a449" : "rgba(255,255,255,0.7)"}
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const url = window.location.origin + '/#stone-detail/' + product.id;
                if (navigator.share) {
                  navigator.share({
                    title: product.name,
                    text: `Check out ${product.name} at Modern Masonry`,
                    url,
                  }).catch(err => console.error('Share failed:', err));
                } else {
                  navigator.clipboard.writeText(url);
                  alert("Link copied to clipboard!");
                }
              }}
              title="Share"
              className="p-1.5 rounded-[4px] bg-black/40 hover:bg-black/60 transition-colors border border-transparent group-hover:border-white/20 opacity-0 group-hover:opacity-100"
            >
              <Share2 size={14} color="rgba(255,255,255,0.7)" />
            </button>
          </div>
        </div>

        {/* Info Area */}
        <div
          className="flex flex-col px-5 pt-5 pb-4 flex-1 bg-black/30"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="mb-3">
            <h3
              className="text-[#e2ded9] text-[17px] mb-1 tracking-[0.02em] leading-[1.3] line-clamp-1"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
            >
              {product.color || product.productTitle || product.name}
            </h3>
            <span
              className="text-[11px] uppercase tracking-[0.15em] text-[#c9a449]/80"
              style={{ fontWeight: 600 }}
            >
              {manufacturer}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {typeLabel && (
              <span
                className="text-[9.5px] tracking-[0.08em] text-white/70 bg-white/[0.05] border border-white/[0.08] px-2 py-1 rounded-[4px] uppercase"
                style={{ fontWeight: 500 }}
              >
                {typeLabel}
              </span>
            )}
            {product.finish && (
              <span
                className="text-[9.5px] tracking-[0.08em] text-[#c9a449] bg-[#c9a449]/10 border border-[#c9a449]/20 px-2 py-1 rounded-[4px] uppercase"
                style={{ fontWeight: 600 }}
              >
                {product.finish}
              </span>
            )}
          </div>

          {product.sizeLabel && (
            <p className="text-[10px] text-white/35 tracking-[0.05em] mb-2 font-mono">
              {product.sizeLabel}
            </p>
          )}

          {/* Card footer buttons */}
          <div className="mt-auto border-t border-white/[0.06] pt-3 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            <button
              onClick={(e) => { e.stopPropagation(); onSample(product); }}
              className="flex-1 relative overflow-hidden py-2.5 text-[10px] uppercase tracking-[0.14em] font-bold text-[#c9a449] hover:text-black hover:bg-[#c9a449] transition-all duration-300 rounded-md border border-[#c9a449]/25 hover:border-[#c9a449] group/btn"
            >
              <span className="relative z-10">Request Sample</span>
              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 skew-x-[-15deg]" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); onToggleCompare(product); }}
              className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md border text-[10px] uppercase tracking-[0.14em] font-bold transition-all duration-300 ${isCompared
                ? 'border-[#c9a449] bg-[#c9a449]/10 text-[#c9a449]'
                : 'border-white/20 text-white/70 hover:text-[#c9a449] hover:border-[#c9a449]/60 hover:bg-[#c9a449]/5'
                }`}
            >
              {isCompared ? (
                <Check size={12} strokeWidth={2.5} />
              ) : (
                <Plus size={12} />
              )}
              <span>{isCompared ? "Added" : "Compare"}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// ── Main UI ──────────────────────────────────────────────────────────────────


export default function StoneCatalogue({ navigate, initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    if (initialQuery !== query) {
      setQuery(initialQuery);
      setDebouncedQuery(initialQuery);
    }
  }, [initialQuery]);

  const [compact, setCompact] = useState(true);
  const [collections, setCollections] = useState([]);
  const [colors, setColors] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);

  const [selected, setSelected] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [compareQueue, setCompareQueue] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showFavourites, setShowFavourites] = useState(false);

  const [products, setProducts] = useState([]);
  const [filtersDB, setFiltersDB] = useState(DEFAULT_FILTERS);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Load filters for stone material only
  useEffect(() => {
    fetch("/api/products/filters?material=Stone")
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) throw new Error(`Status ${res.status}: ${text}`);
        if (!text) return { success: true, data: { manufacturersWithCollections: [], colours: [], styles: [], series: [] } };
        try { return JSON.parse(text); } catch (e) { throw new Error("Invalid filter JSON: " + text.substring(0, 100)); }
      })
      .then((r) => {
        if (r.success && r.data) {
          setFiltersDB({
            manufacturersWithCollections: r.data.manufacturersWithCollections || [],
            colors: r.data.colours
              .map((c) => ({ value: c.value, hex: resolveColorHex(c.value, c.hexCode) }))
              .sort((a, b) => {
                const isOtherA = a.value.toLowerCase() === "other";
                const isOtherB = b.value.toLowerCase() === "other";
                if (isOtherA) return 1;
                if (isOtherB) return -1;
                return 0;
              }),
            styles: r.data.styles.map((s) => s.value),
            series: r.data.series ? r.data.series.map((s) => s.value) : [],
          });
        }
      })
      .catch((e) => console.error("Stone Filter Fetch Error:", e));
  }, []);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch products (always scoped to material=Stone)
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErrorMsg("");
    const params = new URLSearchParams();
    params.append("material", "Stone");
    if (debouncedQuery) params.append("search", debouncedQuery);
    if (collections.length) params.append("collection", collections.join(","));
    if (colors.length) params.append("colour", colors.join(","));
    if (finishes.length) params.append("style", finishes.join(","));
    if (manufacturers.length) params.append("manufacturer", manufacturers.join(","));
    params.append("page", page);
    params.append("limit", 20);

    fetch(`/api/products?${params.toString()}`, { signal: controller.signal })
      .then(async (r) => {
        const text = await r.text();
        if (!r.ok) throw new Error(`Status ${r.status}: ${text}`);
        if (!text) return { success: true, data: [], meta: { total: 0, totalPages: 1 } };
        try { return JSON.parse(text); } catch (e) { throw new Error("Invalid product JSON: " + text.substring(0, 100)); }
      })
      .then((res) => {
        if (res.success && res.data) {
          const mapped = res.data.map((p) => {
            const colorCat = p.categories?.find((c) => c.type === "colour");
            const collCat = p.categories?.find((c) => c.type === "collection");
            const styleCat = p.categories?.find((c) => c.type === "style");
            const variant = p.variants?.[0];

            return {
              id: p.id,
              name: p.name,
              productTitle: p.productTitle || p.name.split(" – ")[0],
              slug: p.slug,
              collection: collCat?.value || "Stone",
              color: p.colorName || colorCat?.value || "Natural",
              colorHex: resolveColorHex(p.colorName || colorCat?.value, colorCat?.hexCode) || "#A09080",
              manufacturer: p.manufacturers?.[0]?.name || "Arriscraft International",
              finish: styleCat?.value || null,
              sizeLabel: variant?.sizeLabel || null,
              code: variant?.sku || p.id.slice(0, 8).toUpperCase(),
              image: variant?.imageUrl || null,
              gallery: variant?.imagesUrl || [],
              description: p.description || "Premium architectural stone unit.",
              inStock: variant?.isActive ?? true,
            };
          });
          setProducts(mapped);
          setTotal(res.meta.total);
          setTotalPages(res.meta.totalPages);
        } else {
          setErrorMsg(res.message || "Unknown error from API");
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("Stone API Error:", err);
        setErrorMsg(err.message || String(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery, collections, colors, finishes, manufacturers, page]);

  // Reset pagination on filter change (do NOT clear products — keep old images visible until new ones load)
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, collections, colors, finishes, manufacturers]);


  const tog = useCallback((val, getter, setter) => {
    setter(getter.includes(val) ? getter.filter((x) => x !== val) : [...getter, val]);
  }, []);

  const handleToggleFavourite = useCallback((prod) => {
    setFavourites((prev) =>
      prev.find((p) => p.id === prod.id) ? prev.filter((p) => p.id !== prod.id) : [...prev, prod]
    );
  }, []);

  const handleToggleCompare = useCallback((prod) => {
    setCompareQueue((prev) =>
      prev.find((p) => p.id === prod.id) ? prev.filter((p) => p.id !== prod.id) : [...prev, prod].slice(-3)
    );
  }, []);

  const handleSample = useCallback((product) => {
    window.location.hash = 'stone-detail/' + product.id;
  }, []);

  const displayedProducts = showFavourites ? favourites : products;

  // Stone series = collections from Arriscraft International
  const stoneSeries = filtersDB.manufacturersWithCollections[0]?.collections || [];

  const getPagination = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (page >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const SidebarContent = () => (
    <>
      {filtersDB.manufacturersWithCollections.length > 0 && (
        <>
          <div className="mb-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#c9a449] font-bold">Manufacturer</span>
          </div>
          {filtersDB.manufacturersWithCollections.map((mfg) => (
            <GlassCheckbox
              key={mfg.name}
              label={mfg.name}
              checked={manufacturers.includes(mfg.name)}
              onClick={() => tog(mfg.name, manufacturers, setManufacturers)}
            />
          ))}
          <div className="h-px bg-white/10 my-4" />
        </>
      )}
      {stoneSeries.length > 0 && (
        <Section title="SERIES">
          {stoneSeries.map((s) => (
            <GlassCheckbox
              key={s}
              label={s}
              checked={collections.includes(s)}
              onClick={() => tog(s, collections, setCollections)}
            />
          ))}
        </Section>
      )}
      <Section title="COLOUR">
        {filtersDB.colors.map(({ value, hex }) => (
          <GlassCheckbox
            key={value}
            label={value}
            colorDot={hex}
            checked={colors.includes(value)}
            onClick={() => tog(value, colors, setColors)}
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
    </>
  );

  return (
    <div className="min-h-screen relative font-sans text-white flex flex-col">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-fixed w-full h-full"
        style={{ backgroundImage: "url('/bg.png')" }}
      />

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Header */}
        <div className="w-full max-w-[1800px] mx-auto flex flex-col items-start pt-24 md:pt-28 pb-10 md:pb-16 px-6 md:px-10 xl:px-14 relative shrink-0">
          <div className="flex flex-col md:flex-row justify-between w-full gap-8">
            <div>
              <div className="flex items-center mb-5">
                <span className="text-[#c9a449] text-m font-bold tracking-widest uppercase">
                  Our Premium Stone Collection
                </span>
              </div>
              <h1 className="text-[32px] sm:text-[44px] md:text-[54px] lg:text-[70px] font-serif tracking-tight leading-[0.9] font-normal text-[#e3decb]">
                Modern Masonry <br /> Stone Catalogue
              </h1>
            </div>
            <div className="md:max-w-md pt-12 md:pt-14">
              <p
                className="text-[24px] md:text-[24px] tracking-[0.02em] leading-relaxed text-white/50 italic"
                style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
              >
                "Discover premium natural stone curated for elegance, durability,
                and projects that stand the test of time — crafted for those who
                build with intention."
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Filter Bar */}
        <div className="w-full bg-black/80 backdrop-blur-xl border-y border-[rgba(255,255,255,0.06)] px-8 xl:px-14 py-5 flex items-center justify-between z-40 sticky top-0 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4 md:gap-8">
            <span className="text-[11px] font-bold tracking-[0.05em] text-[#c9a449] uppercase">
              {showFavourites ? favourites.length : total} products
            </span>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] text-[#9a9488] hover:text-white uppercase transition-colors"
            >
              <SlidersHorizontal size={14} />
              Filters
              {collections.length + colors.length + finishes.length > 0 &&
                ` (${collections.length + colors.length + finishes.length})`}
            </button>
            <button
              onClick={() => setShowFavourites(!showFavourites)}
              className={`flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] uppercase transition-colors ${showFavourites ? "text-[#c9a449]" : "text-[#9a9488] hover:text-white"}`}
            >
              <Heart size={14} className={showFavourites ? "text-[#c9a449] fill-[#c9a449]" : "text-[#9a9488]"} />
              <span className="hidden sm:inline">{showFavourites ? "View All" : "List Favourites"}</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 flex-1 justify-center">
            {[...collections, ...colors, ...finishes].map((v) => (
              <div key={v} className="flex items-center gap-2 bg-[#1a1815] border border-white/5 px-3 py-1.5 rounded-sm">
                <span className="text-[11px] text-[#e3decb] tracking-wide">{v}</span>
                <button
                  onClick={() => {
                    if (collections.includes(v)) setCollections(collections.filter((x) => x !== v));
                    if (colors.includes(v)) setColors(colors.filter((x) => x !== v));
                    if (finishes.includes(v)) setFinishes(finishes.filter((x) => x !== v));
                  }}
                  className="text-[#9a9488] hover:text-white pl-1"
                >
                  ×
                </button>
              </div>
            ))}
            {(collections.length > 0 || colors.length > 0 || finishes.length > 0) && (
              <button
                onClick={() => { setCollections([]); setColors([]); setFinishes([]); }}
                className="text-[10px] font-bold tracking-[0.1em] text-[#9a9488] hover:text-white uppercase transition-colors ml-3"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 md:gap-6 border-l border-white/5 pl-4 md:pl-8">
            <div className="relative group flex items-center">
              <Search size={14} className="absolute left-0 text-[#9a9488] group-focus-within:text-[#c9a449] transition-colors" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="bg-transparent border-none w-[120px] py-1 pl-7 text-[12px] tracking-wide text-[#e3decb] placeholder-[#9a9488] focus:outline-none focus:ring-0"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              />
            </div>
            <div className="flex items-center gap-1 border border-white/10 rounded-md p-1">
              <button
                onClick={() => setCompact(false)}
                title="Comfortable view"
                className={`p-1.5 rounded transition-colors ${!compact ? "bg-[#c9a449] text-black" : "text-[#9a9488] hover:text-white"}`}
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setCompact(true)}
                title="Compact view"
                className={`p-1.5 rounded transition-colors ${compact ? "bg-[#c9a449] text-black" : "text-[#9a9488] hover:text-white"}`}
              >
                <Grid3x3 size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-grow w-full max-w-[1800px] mx-auto min-h-0">
          {/* Desktop Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:flex md:flex-col w-[320px] 2xl:w-[380px] sticky top-[82px] h-[calc(100vh-82px)] overflow-y-auto scrollbar-none border-r border-[rgba(255,255,255,0.06)] bg-black/20 z-20 flex-shrink-0"
          >
            <div className="px-8 xl:px-10 pt-10 pb-32">
              <div className="flex items-center gap-3 mb-8">
                <SlidersHorizontal size={14} className="text-[#c9a449]" />
                <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#e3decb] font-bold">REFINE</h2>
              </div>
              <SidebarContent />
            </div>
          </motion.aside>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {mobileSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="md:hidden fixed inset-0 bg-black/70 z-[60]"
                  onClick={() => setMobileSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 280 }}
                  className="md:hidden fixed inset-y-0 left-0 w-[300px] bg-[#0a0a0a] border-r border-white/10 z-[70] overflow-y-auto"
                >
                  <div className="px-6 pt-8 pb-16">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <SlidersHorizontal size={14} className="text-[#c9a449]" />
                        <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#e3decb] font-bold">REFINE</h2>
                      </div>
                      <button onClick={() => setMobileSidebarOpen(false)} className="text-white/40 hover:text-white">
                        <X size={18} />
                      </button>
                    </div>
                    <SidebarContent />
                    {(collections.length > 0 || colors.length > 0 || finishes.length > 0) && (
                      <button
                        onClick={() => { setCollections([]); setColors([]); setFinishes([]); }}
                        className="mt-4 w-full text-[10px] font-bold tracking-[0.1em] text-[#9a9488] hover:text-white uppercase transition-colors border border-white/10 py-2 rounded"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Grid */}
          <main className="flex-1 px-4 md:px-8 lg:px-12 pt-8 pb-32">
            {errorMsg && !showFavourites ? (
              <div className="w-full p-8 bg-red-900/40 border border-red-500 text-white rounded">
                API Error: {errorMsg}
              </div>
            ) : (
              <motion.div
                key="product-grid"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                className={`grid gap-8 ${compact ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"}`}
              >
                {displayedProducts.map((p) => (
                  <motion.div
                    key={p.id}
                    variants={{
                      hidden: { opacity: 0, y: 28 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    <PremiumCard
                      product={p}
                      onSample={handleSample}
                      isFavourite={favourites.some((fav) => fav.id === p.id)}
                      onToggleFavourite={handleToggleFavourite}
                      isCompared={compareQueue.some((comp) => comp.id === p.id)}
                      onToggleCompare={handleToggleCompare}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {showFavourites ? (
              <div className="w-full flex justify-center mt-20">
                <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-white/30">
                  {favourites.length > 0 ? "All Favourites Displayed" : "No favourites yet"}
                </span>
              </div>
            ) : totalPages > 1 ? (
              <div className="w-full flex justify-center mt-20">
                <div className="flex gap-2 items-center bg-[#1a1815] px-4 py-2 rounded-full border border-white/5">
                  <button
                    disabled={page === 1 || loading}
                    onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="px-3 py-1 text-[11px] font-bold tracking-widest uppercase disabled:opacity-30 text-white/50 hover:text-[#c9a449] transition-colors"
                  >
                    PREV
                  </button>
                  <div className="w-px h-4 bg-white/10 mx-2" />
                  {getPagination().map((p, index) =>
                    p === "..." ? (
                      <span key={`ellipsis-${index}`} className="text-white/40 px-2 font-bold tracking-widest">...</span>
                    ) : (
                      <button
                        key={p}
                        disabled={loading}
                        onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-[11px] font-bold transition-all ${p === page ? "text-black bg-[#c9a449] shadow-[0_0_15px_rgba(201,164,73,0.3)]" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <div className="w-px h-4 bg-white/10 mx-2" />
                  <button
                    disabled={page === totalPages || loading}
                    onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="px-3 py-1 text-[11px] font-bold tracking-widest uppercase disabled:opacity-30 text-white/50 hover:text-[#c9a449] transition-colors"
                  >
                    NEXT
                  </button>
                </div>
              </div>
            ) : (
              products.length > 0 && !loading && (
                <div className="w-full flex justify-center mt-20">
                  <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-white/30">
                    All Collections Displayed
                  </span>
                </div>
              )
            )}
          </main>
        </div>

        <Footer />
      </div>

      {/* Floating Compare Bar */}
      <AnimatePresence>
        {compareQueue.length > 0 && !showCompare && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#12100e]/95 backdrop-blur-xl border-t border-[#c9a449]/20 shadow-[0_-8px_40px_rgba(0,0,0,0.6)]"
          >
            <div className="max-w-[1800px] mx-auto px-8 xl:px-14 py-4 flex items-center gap-6">
              <div className="flex items-center gap-3 flex-1">
                {compareQueue.map((p) => (
                  <div key={p.id} className="flex items-center gap-2.5 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2">
                    <div className="w-10 h-10 rounded-md border border-[#c9a449]/30 overflow-hidden bg-[#1a1815] shrink-0">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#3a2e1e]" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] text-white/80 font-medium truncate max-w-[120px]">{p.name}</span>
                      <span className="text-[9px] text-[#c9a449]/60 uppercase tracking-wider truncate">{p.manufacturer}</span>
                    </div>
                    <button onClick={() => handleToggleCompare(p)} className="ml-1 text-white/20 hover:text-white/60 transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {compareQueue.length < 3 && (
                  <div className="flex items-center gap-2 border border-dashed border-white/10 rounded-lg px-3 py-2 text-white/15">
                    <div className="w-10 h-10 rounded-md border border-dashed border-white/10 flex items-center justify-center text-lg">+</div>
                    <span className="text-[10px] uppercase tracking-wider">Add product</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[11px] uppercase tracking-widest text-white/40">
                  <span className="text-[#c9a449] font-bold">{compareQueue.length}</span>/3 selected
                </span>
                <div className="w-px h-5 bg-white/10" />
                <button
                  onClick={() => setCompareQueue([])}
                  className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors font-medium"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowCompare(true)}
                  className="bg-[#c9a449] hover:bg-[#ddb95a] text-black text-[10px] font-bold uppercase tracking-[0.18em] px-6 py-2.5 rounded-md transition-colors"
                >
                  Compare Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CompareModal
        open={showCompare}
        products={compareQueue}
        onClose={() => setShowCompare(false)}
        onRemove={handleToggleCompare}
      />
    </div>
  );
}
