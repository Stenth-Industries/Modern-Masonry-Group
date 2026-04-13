import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  Check,
  SlidersHorizontal,
  ArrowRight,
  Heart,
  Grid3x3,
  Grid,
  X,
  Ruler,
  Package,
  Droplets,
  Thermometer,
  Zap,
  Building2,
} from "lucide-react";
import { brickProducts } from "./catalogue-data";
import { BrickWallPattern } from "./BrickWallPattern";

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
import { BrickDetailPanel } from "./BrickDetailPanel";
import Footer from "./Footer";

// ── Configuration ─────────────────────────────────────────────────────────────

const ACCENT = "#ccab7b";

const COLOR_MAP = {
  red: '#B4382B',
  'dark red': '#8B1A1A',
  tan: '#C4A57B',
  grey: '#808080',
  gray: '#808080',
  'light grey': '#B0B0B0',
  'dark grey': '#555555',
  brown: '#7A5C40',
  'dark brown': '#4A3728',
  buff: '#D4B483',
  cream: '#EDE0C4',
  white: '#E8E4DC',
  'off white': '#E0D8CC',
  black: '#1A1A1A',
  charcoal: '#4A4A4A',
  silver: '#A8A8A8',
  bronze: '#A0724A',
  gold: '#C9A84C',
  orange: '#C0622A',
  pink: '#D4948A',
  blue: '#4A6FA5',
  green: '#5A7A5A',
  yellow: '#D4C060',
  beige: '#CDB89A',
  ivory: '#E8DFC8',
  slate: '#607080',
  terracotta: '#C06040',
  'light brown': '#A08060',
  'medium brown': '#8B6347',
  'warm grey': '#9A9088',
  'cool grey': '#8090A0',
  purple: '#705080',
  multicolor: 'linear-gradient(135deg, #B4382B 0%, #C4A57B 33%, #808080 66%, #4A3728 100%)',
};

const resolveColorHex = (name, apiHex) => {
  // Ignore #808080 — it's the database default placeholder, not a real color
  if (apiHex && apiHex !== '#808080') return apiHex;
  if (!name) return null;
  return COLOR_MAP[name.toLowerCase().trim()] || null;
};

// Dynamic database filters will overwrite this structure on mount
const DEFAULT_FILTERS = {
  collections: [],
  colors: [],
  styles: [],
  manufacturers: [],
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
            ? "bg-[#ccab7b] border-[#ccab7b]"
            : "bg-black/20 border-white/15 group-hover:border-white/40"
            }`}
        >
          {checked && (
            <Check size={11} className="text-black" strokeWidth={3.5} />
          )}
        </div>
        {colorDot && (
          <div
            className="w-[14px] h-[14px] rounded-full border border-white/20 shrink-0"
            style={{ background: colorDot }}
          />
        )}
        <span
          className={`text-[13px] tracking-[0.03em] transition-colors duration-300 ${checked
            ? "text-[#e3decb] font-medium"
            : "text-[#9a9488] group-hover:text-[#e3decb] font-normal"
            }`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {label}
        </span>
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
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full pb-4 border-b border-[rgba(255,255,255,0.05)] mb-4 group outline-none"
      >
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#e3decb] group-hover:text-white transition-colors font-bold">
          {title}
        </span>
        <ChevronDown
          size={13}
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
      className="group flex flex-col w-full h-full bg-transparent border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] hover:shadow-2xl hover:shadow-black/60 shadow-xl shadow-black/40 hover:-translate-y-0.5 transition-all duration-500 rounded-[12px] overflow-hidden cursor-pointer"
      onClick={() => onSample(product)}
    >
      {/* Upper Picture Area */}
      <div className="relative w-full aspect-[5/4] shrink-0 overflow-hidden border-b border-[rgba(255,255,255,0.02)] bg-[#111]">
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

      {/* Info Area  */}
      <div className="flex flex-col p-5 md:p-6 flex-1 bg-black/30 justify-between">
        <div className="mb-2 shrink-0">
          <h3
            className="text-[#e2ded9] text-[18px] mb-1.5 tracking-[0.02em] leading-[1.3] line-clamp-2"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className="text-[11px] uppercase tracking-[0.15em] text-[#ccab7b]/80"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
            >
              {manufacturer}
            </span>
          </div>
        </div>

        <div
          className="flex flex-wrap items-center gap-2 mb-3 shrink-0"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {typeLabel && (
            <span
              className="text-[9.5px] tracking-[0.08em] text-white/70 bg-white/[0.05] border border-white/[0.08] px-2 py-1 rounded-[4px] uppercase"
              style={{ fontWeight: 500 }}
            >
              {typeLabel}
            </span>
          )}
          <span
            className="text-[9.5px] tracking-[0.08em] text-[#ccab7b] bg-[#ccab7b]/10 border border-[#ccab7b]/20 px-2 py-1 rounded-[4px] uppercase"
            style={{ fontWeight: 600 }}
          >
            {product.finish}
          </span>
        </div>

        <div
          className="flex items-center justify-between mt-auto gap-3"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <button
            className="px-5 py-2.5 border border-[#4a3d2c] bg-transparent hover:bg-[#ccab7b] transition-all text-[#ccab7b] hover:text-black text-[10px] sm:text-[11px] uppercase tracking-[0.15em] rounded-md"
            style={{ fontWeight: 600 }}
          >
            Request Sample
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCompare(product); }}
            className={`flex items-center justify-center min-w-[36px] h-[36px] rounded-[4px] transition-colors bg-transparent border ${isCompared ? 'border-[#ccab7b] bg-[#ccab7b]/10' : 'border-white/10 hover:border-white/30'}`}
          >
            {isCompared ? <Check size={16} className="text-[#ccab7b]" strokeWidth={2.5} /> : <div className="text-white/40 font-bold font-mono text-[16px] hover:text-white">+</div>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Compare Panel ────────────────────────────────────────────────────────────

const SPEC_GROUPS = [
  {
    label: 'Identity',
    specs: [
      { label: 'Manufacturer', key: 'manufacturer' },
      { label: 'Collection',   key: 'collection' },
      { label: 'Colour',       key: 'color', isColor: true },
      { label: 'Finish',       key: 'finish' },
    ],
  },
  {
    label: 'Dimensions',
    specs: [
      { label: 'Size',   key: 'size' },
      { label: 'Weight', key: 'weight' },
    ],
  },
  {
    label: 'Technical',
    specs: [
      { label: 'Compressive Strength', key: 'compressiveStrength' },
      { label: 'Water Absorption',     key: 'waterAbsorption' },
      { label: 'Frost Resistance',     key: 'frostResistance' },
    ],
  },
  {
    label: 'Availability',
    specs: [
      { label: 'SKU',      key: 'code' },
      { label: 'In Stock', key: 'inStock', isBool: true },
    ],
  },
];

function isDifferent(items, key) {
  const vals = items.map(p => String(p[key] ?? ''));
  return new Set(vals).size > 1;
}

function ComparePanel({ items, onRemove, onClose, open }) {
  const slots = [...items, ...Array.from({ length: 3 - items.length }, () => null)];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-0 z-[90] overflow-y-auto"
        >
          {/* ── Background — matches catalogue ── */}
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/bg.png')" }} />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-full max-w-[1380px] mx-auto px-8 md:px-14 py-12 flex flex-col"
          >

            {/* ── Masthead ── */}
            <div className="flex items-start justify-between mb-14">
              <div>
                {/* Ornamental rule */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-[1px] w-8" style={{ background: 'linear-gradient(90deg, transparent, #ccab7b)' }} />
                  <span className="text-[9px] uppercase tracking-[0.4em] text-[#ccab7b] font-bold">Material Comparison</span>
                  <div className="h-[1px] w-8" style={{ background: 'linear-gradient(90deg, #ccab7b, transparent)' }} />
                </div>
                <h2 className="text-[40px] md:text-[56px] text-[#e8e2d4] leading-[1] tracking-tight"
                  style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", fontWeight: 300 }}>
                  Side by Side
                </h2>
                <p className="mt-2 text-[13px] text-white/25 tracking-[0.08em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {items.length} of 3 products selected
                </p>
              </div>
              <button onClick={onClose}
                className="group mt-2 flex items-center gap-2.5 text-[10px] uppercase tracking-[0.25em] text-white/30 hover:text-[#ccab7b] transition-colors duration-300">
                <span>Close</span>
                <span className="w-7 h-7 border border-white/10 group-hover:border-[#ccab7b]/40 rounded-full flex items-center justify-center transition-colors">
                  <X size={11} />
                </span>
              </button>
            </div>

            {/* ── Product Cards Row ── */}
            <div className="grid gap-px mb-0" style={{ gridTemplateColumns: '200px repeat(3, 1fr)' }}>
              {/* Corner label */}
              <div className="flex items-end pb-8 pr-8">
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/15" style={{ fontFamily: "'Inter', sans-serif" }}>Product</span>
              </div>

              {slots.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="px-4 pb-8"
                >
                  {p ? (
                    <div className="flex flex-col">
                      {/* Index number */}
                      <span className="text-[10px] font-mono text-[#ccab7b]/40 mb-3 tracking-widest">0{i + 1}</span>

                      {/* Image */}
                      <div className="relative w-full aspect-[3/2] overflow-hidden rounded-sm mb-5 group">
                        {p.image
                          ? <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          : <BrickWallPattern colorHex={p.colorHex || '#7A5C40'} rows={5} />
                        }
                        {/* Gradient overlay on image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {/* Stock badge */}
                        <span className={`absolute bottom-3 left-3 text-[8px] uppercase tracking-[0.2em] font-bold px-2 py-1 rounded-sm ${
                          p.inStock ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50' : 'bg-red-950/80 text-red-400 border border-red-800/50'
                        }`}>
                          {p.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {/* Remove */}
                        <button onClick={() => onRemove(p)}
                          className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 bg-black/80 rounded-full flex items-center justify-center text-white/60 hover:text-white">
                          <X size={10} />
                        </button>
                      </div>

                      {/* Name */}
                      <h3 className="text-[#e2ded4] text-[17px] leading-snug mb-1 line-clamp-2"
                        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                        {p.name}
                      </h3>
                      <p className="text-[9px] uppercase tracking-[0.22em] text-[#ccab7b]/60 font-semibold mb-5">{p.manufacturer}</p>

                      {/* CTA */}
                      <button className="w-full py-3 text-[9px] uppercase tracking-[0.2em] font-bold text-[#ccab7b] border border-[#ccab7b]/25 hover:border-[#ccab7b] hover:bg-[#ccab7b]/10 transition-all duration-300 rounded-sm">
                        Request Sample
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-white/10 mb-3 tracking-widest">0{i + 1}</span>
                      <div className="aspect-[3/2] border border-dashed border-white/[0.08] rounded-sm flex flex-col items-center justify-center gap-3 text-white/15">
                        <div className="w-8 h-8 rounded-full border border-dashed border-white/10 flex items-center justify-center text-base">+</div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-center leading-relaxed">Go back &amp;<br />add a product</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* ── Full-width gold divider ── */}
            <div className="w-full h-[1px] mb-0" style={{ background: 'linear-gradient(90deg, transparent, #ccab7b30, #ccab7b60, #ccab7b30, transparent)' }} />

            {/* ── Spec Table ── */}
            {SPEC_GROUPS.map((group, gi) => (
              <div key={group.label}>
                {/* Group header row */}
                <div className="grid" style={{ gridTemplateColumns: '200px repeat(3, 1fr)' }}>
                  <div className="py-6 pr-8 flex items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-[1px] flex-1 w-4" style={{ background: 'linear-gradient(90deg, transparent, #ccab7b40)' }} />
                      <span className="text-[8.5px] uppercase tracking-[0.35em] text-[#ccab7b] font-bold whitespace-nowrap">{group.label}</span>
                    </div>
                  </div>
                  {slots.map((_, i) => (
                    <div key={i} className="py-6 px-4 border-l border-white/[0.04]" />
                  ))}
                </div>

                {/* Spec rows */}
                {group.specs.map(({ label, key, isColor, isBool }, si) => {
                  const diff = items.length > 1 && isDifferent(items, key);
                  const isLast = si === group.specs.length - 1;
                  return (
                    <div key={key}
                      className={`grid transition-colors duration-300 ${diff ? 'bg-[#ccab7b]/[0.03]' : ''} ${isLast ? 'mb-2' : ''}`}
                      style={{ gridTemplateColumns: '200px repeat(3, 1fr)' }}>

                      {/* Label */}
                      <div className={`flex items-center py-4 pr-8 border-t ${diff ? 'border-[#ccab7b]/15' : 'border-white/[0.04]'}`}>
                        <div className="flex items-center gap-2 w-full">
                          {diff && <div className="w-[2px] h-3 bg-[#ccab7b] rounded-full shrink-0" />}
                          <span className={`text-[10px] uppercase tracking-[0.18em] font-medium transition-colors ${diff ? 'text-[#ccab7b]/80' : 'text-white/25'}`}
                            style={{ fontFamily: "'Inter', sans-serif" }}>
                            {label}
                          </span>
                        </div>
                      </div>

                      {/* Values */}
                      {slots.map((p, i) => (
                        <div key={i} className={`flex items-center py-4 px-4 border-t border-l ${diff ? 'border-[#ccab7b]/15' : 'border-white/[0.04]'}`}>
                          {p ? (
                            isBool ? (
                              <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${p[key] ? 'text-emerald-400' : 'text-red-400/70'}`}>
                                {p[key] ? <Check size={11} strokeWidth={2.5} /> : <X size={11} />}
                                {p[key] ? 'In Stock' : 'Out of Stock'}
                              </span>
                            ) : isColor ? (
                              <span className="flex items-center gap-2.5">
                                {p.colorHex && (
                                  <span className="w-3.5 h-3.5 rounded-full border border-white/15 shrink-0" style={{ background: p.colorHex }} />
                                )}
                                <span className={`text-[12px] tracking-wide transition-colors ${diff ? 'text-[#e3decb] font-medium' : 'text-white/35'}`}>
                                  {p[key] ?? '—'}
                                </span>
                              </span>
                            ) : (
                              <span className={`text-[12px] tracking-wide leading-snug transition-colors ${diff ? 'text-[#e3decb] font-medium' : 'text-white/35'}`}>
                                {p[key] ?? '—'}
                              </span>
                            )
                          ) : (
                            <span className="text-white/10 text-[12px]">—</span>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}

                {/* Section divider */}
                {gi < SPEC_GROUPS.length - 1 && (
                  <div className="w-full h-[1px] my-2" style={{ background: 'linear-gradient(90deg, transparent, #ffffff08, transparent)' }} />
                )}
              </div>
            ))}

            {/* ── Bottom gold rule ── */}
            <div className="mt-12 w-full h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #ccab7b30, transparent)' }} />
            <p className="mt-6 text-center text-[9px] uppercase tracking-[0.3em] text-white/15">Modern Masonry Group — Premium Material Selection</p>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main UI ──────────────────────────────────────────────────────────────────

export default function BrickCatalogue() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [compact, setCompact] = useState(true);
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
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const gridRef = React.useRef(null);

  // Load database filters once on mount
  useEffect(() => {
    fetch("/api/products/filters")
      .then((res) => res.json())
      .then((r) => {
        if (r.success && r.data) {
          setFiltersDB({
            collections: r.data.collections.map((c) => c.value),
            colors: r.data.colours.map((c) => ({ value: c.value, hex: resolveColorHex(c.value, c.hexCode) })),
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
          setProducts(mapped);
          setTotal(res.meta.total);
          setTotalPages(res.meta.totalPages);
          gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Reset to page 1 on filter change
  useEffect(() => {
    setPage(1);
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

  const [showCompare, setShowCompare] = useState(false);

  const handleToggleCompare = useCallback((prod) => {
    setCompareQueue(prev => {
      if (prev.find(p => p.id === prod.id)) return prev.filter(p => p.id !== prod.id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, prod];
    });
  }, []);

  const displayedProducts = showFavourites ? favourites : products;

  return (
    <div className="min-h-screen relative font-sans text-white">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-fixed w-full h-full"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      {/* Wrapper to hold UI on top of background — fills entire viewport */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Header structured & refined */}
        <div className="w-full max-w-[1800px] mx-auto flex flex-col items-start pt-28 pb-16 px-10 xl:px-14 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-8">
            <div>
              <div className="flex items-center mb-5">
                <span className="text-[#ccab7b] text-m font-bold tracking-widest uppercase">
                  Our Premium Brick Collection
                </span>
              </div>
              <h1 className="text-[20px] md:text-[70px] font-serif tracking-tight leading-[0.9] font-normal text-[#e3decb]">
                Modern Masonry <br />   Brick   Catalogue
              </h1>
            </div>
            <div className="md:max-w-md pb-10">
              <p className="text-[18px] md:text-[20px] tracking-[0.02em] leading-relaxed text-white/50 italic" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}>
                "Precision curated masonry materials, offering specialist guidance and province-wide delivery—built for those who build with intention."
              </p>
            </div>
          </div>
        </div>

        {/* FULL WIDTH HORIZONTAL FILTER BAR */}
        <div className="w-full bg-black/80 backdrop-blur-xl border-y border-[rgba(255,255,255,0.06)] px-8 xl:px-14 py-5 flex items-center justify-between z-40 sticky top-0 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
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
            <div className="flex items-center gap-1 border border-white/10 rounded-md p-1">
              <button onClick={() => setCompact(false)} title="Comfortable view"
                className={`p-1.5 rounded transition-colors ${!compact ? 'bg-[#ccab7b] text-black' : 'text-[#9a9488] hover:text-white'}`}>
                <Grid size={14} />
              </button>
              <button onClick={() => setCompact(true)} title="Compact view"
                className={`p-1.5 rounded transition-colors ${compact ? 'bg-[#ccab7b] text-black' : 'text-[#9a9488] hover:text-white'}`}>
                <Grid3x3 size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 w-full max-w-[1800px] mx-auto">
          {/* Sidebar */}
          <aside className="w-[320px] 2xl:w-[380px] sticky top-[82px] h-[calc(100vh-82px)] overflow-y-auto scrollbar-none border-r border-[rgba(255,255,255,0.06)] bg-black/20 z-20 flex-shrink-0">
            <div className="px-8 xl:px-10 pt-10 pb-32">
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
          <main ref={gridRef} className="flex-1 px-8 lg:px-12 pt-8 pb-32">


            {/* Grid perfectly matches 5 cols exactly as drawn in the image/request */}
            {errorMsg && !showFavourites ? (
              <div className="w-full p-8 bg-red-900/40 border border-red-500 text-white rounded">
                API Error: {errorMsg}
              </div>
            ) : (
              <div className={`grid gap-8 ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'}`}>
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
              ) : totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  {/* Prev */}
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                    className="px-3 py-2 text-[11px] uppercase tracking-[0.15em] font-bold text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    ←
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                    .reduce((acc, n, idx, arr) => {
                      if (idx > 0 && n - arr[idx - 1] > 1) acc.push('…');
                      acc.push(n);
                      return acc;
                    }, [])
                    .map((n, i) =>
                      n === '…' ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-white/20 text-[11px]">…</span>
                      ) : (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          disabled={loading}
                          className={`w-9 h-9 text-[11px] font-bold tracking-[0.1em] rounded-sm transition-all duration-200 ${
                            page === n
                              ? 'bg-[#ccab7b] text-black'
                              : 'text-white/40 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {n}
                        </button>
                      )
                    )
                  }

                  {/* Next */}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || loading}
                    className="px-3 py-2 text-[11px] uppercase tracking-[0.15em] font-bold text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    →
                  </button>
                </div>
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

      {/* Footer */}
      <Footer />

      {/* Floating Compare Bar */}
      <AnimatePresence>
        {compareQueue.length > 0 && !showCompare && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#1a1815] border border-[#ccab7b]/30 shadow-2xl rounded-full px-6 py-3 flex items-center gap-4"
          >
            {/* Thumbnails */}
            <div className="flex items-center gap-2">
              {compareQueue.map(p => (
                <div key={p.id} className="w-8 h-8 rounded-full border border-[#ccab7b]/40 overflow-hidden bg-[#111] shrink-0">
                  {p.image
                    ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-[#3a2e1e]" />
                  }
                </div>
              ))}
              {compareQueue.length < 3 && (
                <div className="w-8 h-8 rounded-full border border-dashed border-white/15 flex items-center justify-center text-white/20 text-sm">+</div>
              )}
            </div>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-[11px] uppercase tracking-widest text-white/60 font-medium">
              <span className="text-[#ccab7b] font-bold">{compareQueue.length}</span>/3 selected
            </span>
            <div className="w-px h-4 bg-white/10" />
            <button
              onClick={() => setShowCompare(true)}
              className="text-[10px] uppercase tracking-widest text-[#ccab7b] font-bold hover:text-white transition-colors"
            >
              Compare Now
            </button>
            <button onClick={() => setCompareQueue([])} className="text-white/40 hover:text-white ml-1">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Panel */}
      <ComparePanel
        open={showCompare}
        items={compareQueue}
        onRemove={handleToggleCompare}
        onClose={() => setShowCompare(false)}
      />
    </div>
  );
}
