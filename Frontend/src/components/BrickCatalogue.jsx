import { useState, useMemo, useEffect, useCallback } from 'react';
import rawBricks from '../data/bricks.json';

// ─── Normalise helpers ────────────────────────────────────────────────────────
function normaliseSize(raw = '') {
  if (!raw) return 'Unknown';
  const s = raw.toLowerCase();
  const out = [];
  if (s.includes('elongated'))                          out.push('Elongated');
  if (s.includes('modular'))                            out.push('Modular');
  if (s.includes('norman'))                             out.push('Norman');
  if (s.includes('jumbo'))                              out.push('Jumbo');
  if (s.includes('prp') || s.includes('premier plus'))  out.push('Premier Plus / PRP');
  return out.length ? out.join(', ') : raw;
}
function normaliseType(raw = '') {
  if (raw.toLowerCase().includes('co2') || raw.toLowerCase().includes('negative')) return 'CO₂ Negative';
  if (raw.toLowerCase().includes('full')) return 'Full-bed Face Brick';
  return raw || 'Unknown';
}

// ─── Process bricks ───────────────────────────────────────────────────────────
const bricks = rawBricks.map((b) => {
  const validImgs = (b.images || []).filter(
    (src) => src && !src.toLowerCase().includes('logo') && !src.toLowerCase().includes('icon')
  );
  return {
    ...b,
    image: b.image && !b.image.toLowerCase().includes('logo') ? b.image : validImgs[0] || '',
    allImages: validImgs.length ? validImgs : b.image ? [b.image] : [],
    colours: b.attributes?.Colour ? b.attributes.Colour.split(',').map((c) => c.trim()).filter(Boolean) : [],
    type: normaliseType(b.attributes?.Type || ''),
    styles: b.attributes?.Style ? b.attributes.Style.split(',').map((s) => s.trim()).filter(Boolean) : [],
    sizeNorm: normaliseSize(b.attributes?.Sizes || ''),
    sizeRaw: b.attributes?.Sizes || '',
    manufacturers: b.manufacturer ? [b.manufacturer] : [],
    collections: b.collection ? [b.collection] : [],
  };
});

// ─── Filter option lists ──────────────────────────────────────────────────────
const ALL_COLOURS       = [...new Set(bricks.flatMap((b) => b.colours))].sort();
const ALL_TYPES         = [...new Set(bricks.map((b) => b.type))].filter(Boolean).sort();
const ALL_STYLES        = [...new Set(bricks.flatMap((b) => b.styles))].filter(Boolean).sort();
const ALL_SIZES         = [...new Set(bricks.flatMap((b) => b.sizeNorm.split(',').map((s) => s.trim())))].filter(Boolean).sort();
const ALL_MANUFACTURERS = [...new Set(bricks.flatMap((b) => b.manufacturers))].filter(Boolean).sort();
const ALL_COLLECTIONS   = [
  'Concrete Brick','Elongated Brick','Extruded','Extruded-Matt & Velour',
  'Extruded-Smooth & Velour','Glass Brick','Handmades','Molded Brick','Thin Brick','Tumbled',
];

const COLOUR_SWATCHES = {
  Grey:'#9ca3af', Black:'#1f2937', Brown:'#92400e', 'Brown/Tan':'#a16207',
  Buff:'#d97706', Burgundy:'#9f1239', Cream:'#fef3c7', Beige:'#d4b896',
  Orange:'#ea580c', Red:'#dc2626', Tan:'#b45309', White:'#e5e7eb', Yellow:'#fbbf24',
};

function toggle(arr, val) {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

// ─── Sidebar filter group ─────────────────────────────────────────────────────
function Group({ title, options, selected, onToggle, swatches, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const n = selected.length;

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-3.5 group"
      >
        <span className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-colors ${open || n > 0 ? 'text-white' : 'text-white/30 group-hover:text-white/55'}`}>
          {title}
        </span>
        <div className="flex items-center gap-2">
          {n > 0 && (
            <span className="text-[8px] font-black bg-[var(--brass)] text-black w-4 h-4 flex items-center justify-center leading-none">
              {n}
            </span>
          )}
          <span className={`text-white/20 text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </div>
      </button>

      {open && (
        <div className="pb-5">
          {swatches ? (
            // Colour: swatch grid
            <div className="grid grid-cols-6 gap-2 pt-1">
              {options.map((opt) => {
                const active = selected.includes(opt);
                return (
                  <button
                    key={opt}
                    title={opt}
                    onClick={() => onToggle(opt)}
                    className={`w-8 h-8 rounded-full relative flex items-center justify-center transition-all duration-150
                      ${active ? 'ring-[1.5px] ring-[var(--brass)] ring-offset-[3px] ring-offset-[#0c0c0c]' : 'opacity-50 hover:opacity-100 hover:scale-110'}`}
                    style={{ background: swatches[opt] || '#d4b896' }}
                  >
                    {active && (
                      <svg className="w-3 h-3 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            // Text list — left-border active indicator
            <div className="pt-1">
              {options.map((opt) => {
                const active = selected.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => onToggle(opt)}
                    className={`w-full flex items-center py-2 pl-3 border-l-2 transition-all duration-150 group/r
                      ${active ? 'border-[var(--brass)]' : 'border-transparent hover:border-white/15'}`}
                  >
                    <span className={`text-[11px] font-medium text-left transition-colors leading-snug
                      ${active ? 'text-white' : 'text-white/35 group-hover/r:text-white/65'}`}>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────
function BrickCard({ brick, onClick }) {
  const [imgError, setImgError] = useState(false);

  // Helper to determine badge text
  const getBadge = () => {
    if (brick.type === 'CO₂ Negative') return 'ECO SERIES';
    if (brick.styles.includes('Tumbled')) return 'HERITAGE';
    if (brick.styles.includes('Smooth')) return 'MODERN';
    if (brick.collections.includes('Thin Brick')) return 'PREMIUM';
    return 'ESTATE';
  };

  // Unique price for each for demo
  const price = (4.25 + (brick.name.length % 5) * 1.5).toFixed(2);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[var(--charcoal)] mb-5 border border-white/5 group-hover:border-[var(--brass)]/30 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-500">
        {brick.image && !imgError ? (
          <img
            src={brick.image}
            alt={brick.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-10">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        )}

        {/* Badge Overlay */}
        <div className="absolute top-5 left-5">
          <span className="bg-white text-black text-[9px] font-black tracking-widest px-3 py-1.5 rounded-md shadow-2xl">
            {getBadge()}
          </span>
        </div>

        {/* Photography Count */}
        {brick.allImages.length > 1 && (
          <div className="absolute bottom-5 right-5 bg-black/40 backdrop-blur-md text-white/50 text-[9px] font-bold px-2 py-1 rounded-lg">
            +{brick.allImages.length - 1} GALLERY
          </div>
        )}
      </div>

      {/* Info Block */}
      <div className="px-1 flex flex-col">
        <div className="flex justify-between items-baseline mb-1.5">
          <h3 className="text-white text-lg font-black tracking-tighter leading-none group-hover:text-[var(--brass)] transition-colors duration-300">
            {brick.name}
          </h3>
          <span className="text-[var(--brass)] text-sm font-black tracking-tighter">
            ${price} <span className="text-[10px] opacity-40 font-bold uppercase tracking-widest ml-0.5">/ sqft</span>
          </span>
        </div>
        <p className="text-[11px] text-white/30 font-bold uppercase tracking-widest leading-loose">
          {brick.style || brick.styles[0] || 'Standard'} • {brick.manufacturer.replace(' Industries', '')}
        </p>
      </div>
    </div>
  );
}

// ─── Detail modal ─────────────────────────────────────────────────────────────
function BrickModal({ brick, onClose, onPrev, onNext }) {
  const [activeImg, setActiveImg] = useState(0);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => { setActiveImg(0); setImgErrors({}); }, [brick?.id]);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, onNext, onPrev]);

  if (!brick) return null;
  const currentSrc = brick.allImages[activeImg];
  const attrRows = Object.entries(brick.attributes || {}).filter(([k]) => k !== 'The Art of the Facade');

  return (
    <div className="fixed inset-0 z-50 flex items-stretch" onClick={onClose}>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      <div
        className="relative m-auto w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#0f0f0f] border border-white/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-7 py-4 border-b border-white/[0.07] flex-shrink-0">
          <div>
            {brick.manufacturer && (
              <p className="text-[9px] text-[var(--brass)] uppercase tracking-[0.3em] font-bold mb-1">{brick.manufacturer}</p>
            )}
            <h2 className="text-base font-black text-white tracking-tight leading-none">{brick.name}</h2>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={onPrev} className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white border border-white/[0.08] hover:border-white/25 transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={onNext} className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white border border-white/[0.08] hover:border-white/25 transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white border border-white/[0.08] hover:border-white/25 transition-all ml-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Image pane — 55% */}
          <div className="w-[55%] flex-shrink-0 bg-black flex flex-col">
            <div className="flex-1 min-h-0 flex items-center justify-center p-6">
              {currentSrc && !imgErrors[activeImg] ? (
                <img
                  src={currentSrc}
                  alt={brick.name}
                  className="max-w-full max-h-full object-contain"
                  onError={() => setImgErrors((p) => ({ ...p, [activeImg]: true }))}
                />
              ) : (
                <svg className="w-16 h-16 text-white/5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="7" width="20" height="14" rx="1" strokeWidth="1" />
                  <rect x="2" y="3" width="9" height="4" rx="1" strokeWidth="1" />
                  <rect x="13" y="3" width="9" height="4" rx="1" strokeWidth="1" />
                </svg>
              )}
            </div>
            {brick.allImages.length > 1 && (
              <div className="flex gap-1.5 p-3 border-t border-white/[0.06] overflow-x-auto flex-shrink-0">
                {brick.allImages.map((src, i) =>
                  !imgErrors[i] && (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`flex-shrink-0 w-11 h-11 overflow-hidden border transition-all ${activeImg === i ? 'border-[var(--brass)]' : 'border-white/10 opacity-40 hover:opacity-80'}`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" onError={() => setImgErrors((p) => ({ ...p, [i]: true }))} />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Detail pane */}
          <div className="flex-1 border-l border-white/[0.06] flex flex-col min-h-0">
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-7 space-y-7">

                {/* Colours */}
                {brick.colours.length > 0 && (
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--brass)] font-bold mb-4">Colour Palette</p>
                    <div className="flex flex-wrap gap-3">
                      {brick.colours.map((c) => (
                        <div key={c} className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border border-white/10" style={{ background: COLOUR_SWATCHES[c] || '#d4b896' }} />
                          <span className="text-xs text-white/45">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specs */}
                {attrRows.length > 0 && (
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--brass)] font-bold mb-4">Specifications</p>
                    <div className="border border-white/[0.07]">
                      {attrRows.map(([key, val], i) => (
                        <div key={key} className={`flex ${i % 2 === 0 ? 'bg-white/[0.025]' : ''}`}>
                          <span className="w-32 flex-shrink-0 px-4 py-3 text-[10px] uppercase tracking-wider text-white/20 font-bold border-r border-white/[0.06]">{key}</span>
                          <span className="px-4 py-3 text-xs text-white/60">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Styles */}
                {brick.styles.length > 0 && (
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--brass)] font-bold mb-3">Style</p>
                    <div className="flex flex-wrap gap-2">
                      {brick.styles.map((s) => (
                        <span key={s} className="border border-white/10 text-white/40 text-[10px] uppercase tracking-wider px-3 py-1">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size */}
                {brick.sizeNorm && brick.sizeNorm !== 'Unknown' && (
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--brass)] font-bold mb-2">Sizes</p>
                    <p className="text-xs text-white/40">{brick.sizeRaw}</p>
                  </div>
                )}

                {/* Eco */}
                {brick.type === 'CO₂ Negative' && (
                  <div className="border-l-2 border-emerald-500 pl-4 py-1">
                    <p className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold mb-1">CO₂ Negative Series</p>
                    <p className="text-[11px] text-white/30 leading-relaxed">Sequesters more carbon than it produces in manufacturing.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky CTA — always visible at bottom */}
            <div className="flex-shrink-0 p-5 border-t border-white/[0.06] bg-[#0f0f0f]">
              <button className="w-full bg-[var(--brass)] text-black text-[10px] font-black uppercase tracking-[0.25em] py-4 hover:bg-[var(--brass-light)] transition-colors">
                Request a Sample
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main catalogue ───────────────────────────────────────────────────────────
export default function BrickCatalogue({ navigate }) {
  const [search, setSearch]           = useState('');
  const [sort, setSort]               = useState('az');
  const [selColours, setSelColours]   = useState([]);
  const [selTypes, setSelTypes]       = useState([]);
  const [selStyles, setSelStyles]     = useState([]);
  const [selSizes, setSelSizes]       = useState([]);
  const [selManufacturers, setSelManufacturers] = useState([]);
  const [selCollections, setSelCollections]     = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalIdx, setModalIdx]       = useState(null);

  const filtered = useMemo(() => {
    let list = bricks;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((b) =>
        b.name.toLowerCase().includes(q) ||
        b.colours.some((c) => c.toLowerCase().includes(q)) ||
        b.styles.some((s) => s.toLowerCase().includes(q)) ||
        b.manufacturers.some((m) => m.toLowerCase().includes(q)) ||
        b.collections.some((c) => c.toLowerCase().includes(q))
      );
    }
    if (selColours.length)       list = list.filter((b) => selColours.some((c) => b.colours.includes(c)));
    if (selTypes.length)         list = list.filter((b) => selTypes.includes(b.type));
    if (selStyles.length)        list = list.filter((b) => selStyles.some((s) => b.styles.includes(s)));
    if (selSizes.length)         list = list.filter((b) => selSizes.some((s) => b.sizeNorm.includes(s)));
    if (selManufacturers.length) list = list.filter((b) => selManufacturers.some((s) => b.manufacturers.includes(s)));
    if (selCollections.length)   list = list.filter((b) => selCollections.some((s) => b.collections.includes(s)));

    return [...list].sort((a, b) =>
      sort === 'az' ? a.name.localeCompare(b.name) :
      sort === 'za' ? b.name.localeCompare(a.name) :
      b.allImages.length - a.allImages.length
    );
  }, [search, sort, selColours, selTypes, selStyles, selSizes, selManufacturers, selCollections]);

  const openModal  = (i) => setModalIdx(i);
  const closeModal = useCallback(() => setModalIdx(null), []);
  const prevModal  = useCallback(() => setModalIdx((i) => (i - 1 + filtered.length) % filtered.length), [filtered.length]);
  const nextModal  = useCallback(() => setModalIdx((i) => (i + 1) % filtered.length), [filtered.length]);

  const totalActive =
    selColours.length + selTypes.length + selStyles.length +
    selSizes.length + selManufacturers.length + selCollections.length;

  const clearAll = () => {
    setSelColours([]); setSelTypes([]); setSelStyles([]);
    setSelSizes([]); setSelManufacturers([]); setSelCollections([]); setSearch('');
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col">

      {/* ── Editorial Header ── */}
      <div className="flex-shrink-0 bg-[#0c0c0c] pt-20 pb-12">
        <div className="max-w-screen-2xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-12">
              <div className="max-w-2xl">
                <h2 className="text-6xl md:text-8xl font-serif leading-none mb-6">
                  Architectural <br/> <span className="text-[var(--brass)] italic">Brick.</span>
                </h2>
                <p className="text-[var(--ash)] text-lg leading-relaxed font-medium italic opacity-70">
                  Curated masonry solutions for the modern facade. From kiln-fired textures to precision-engineered modular units. Engineered for performance in every application.
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-4">
                 <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/20">
                    <span>SORT BY:</span>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="bg-transparent border-none text-white focus:outline-none cursor-pointer hover:text-[var(--brass)] transition-colors"
                    >
                      <option value="az">Featured Designs</option>
                      <option value="za">Z → A</option>
                      <option value="photos">Most Photos</option>
                    </select>
                 </div>
                 <div className="text-right">
                    <span className="text-xl font-black text-[var(--brass)] leading-none">{filtered.length}</span>
                    <span className="text-[10px] text-white/15 uppercase tracking-[0.2em] ml-2 font-black">CURATED SOLUTIONS</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* ── Navigation Strip (Search & Filter Toggle) ── */}
      <header className="border-b border-white/[0.07] flex-shrink-0 sticky top-0 z-20 bg-[#0c0c0c]/80 backdrop-blur-xl">
        <div className="flex items-center h-16 px-6 gap-6 max-w-screen-2xl mx-auto">

          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            title={sidebarOpen ? 'Hide filters' : 'Show filters'}
            className="flex-shrink-0 flex items-center gap-3 text-white/40 hover:text-[var(--brass)] transition-colors group"
          >
            <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[var(--brass)]/50 transition-colors ${totalActive > 0 ? 'bg-[var(--brass)] border-[var(--brass)] text-black' : ''}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h6" />
              </svg>
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase">{sidebarOpen ? 'Hide Explore' : 'Explore'}</span>
          </button>

          <div className="h-6 w-px bg-white/[0.08]" />

          {/* Search */}
          <div className="flex-1 relative max-w-md">
            <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
            </svg>
            <input
              type="text"
              placeholder="SEARCH CATALOGUE..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent pl-8 pr-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder:text-white/10 focus:outline-none focus:text-[var(--brass)] transition-colors"
            />
          </div>
        </div>

        {/* Active filter strip */}
        {totalActive > 0 && (
          <div className="border-t border-white/[0.04] px-6 py-1.5 flex items-center gap-2 flex-wrap max-w-screen-2xl mx-auto">
            {[
              ...selColours.map((v) => ({ v, clear: () => setSelColours((p) => p.filter((x) => x !== v)) })),
              ...selCollections.map((v) => ({ v, clear: () => setSelCollections((p) => p.filter((x) => x !== v)) })),
              ...selManufacturers.map((v) => ({ v, clear: () => setSelManufacturers((p) => p.filter((x) => x !== v)) })),
              ...selTypes.map((v) => ({ v, clear: () => setSelTypes((p) => p.filter((x) => x !== v)) })),
              ...selStyles.map((v) => ({ v, clear: () => setSelStyles((p) => p.filter((x) => x !== v)) })),
              ...selSizes.map((v) => ({ v, clear: () => setSelSizes((p) => p.filter((x) => x !== v)) })),
            ].map(({ v, clear }) => (
              <button
                key={v}
                onClick={clear}
                className="flex items-center gap-1.5 bg-[var(--brass)] text-black text-[9px] font-black uppercase tracking-wider px-2.5 py-1 hover:bg-[var(--brass-light)] transition-colors"
              >
                {v}
                <svg className="w-2.5 h-2.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ))}
            <button onClick={clearAll} className="text-[9px] text-white/15 hover:text-[var(--brass)] uppercase tracking-widest font-bold transition-colors">
              Clear all
            </button>
          </div>
        )}
      </header>

      <div className="flex flex-1 min-h-0 max-w-screen-2xl mx-auto w-full">

        {/* ── Sidebar ── */}
        {sidebarOpen && (
          <aside className="w-52 flex-shrink-0 border-r border-white/[0.05]">
            <div className="sticky top-12 h-[calc(100vh-3rem)] overflow-y-auto py-2 px-5">

              {totalActive > 0 && (
                <div className="py-3 border-b border-white/[0.05] mb-1">
                  <button onClick={clearAll} className="text-[9px] uppercase tracking-[0.2em] text-[var(--brass)]/70 hover:text-[var(--brass)] font-bold transition-colors">
                    Clear all filters ({totalActive})
                  </button>
                </div>
              )}

              <div className="divide-y divide-white/[0.05]">
                <Group title="Colour" options={ALL_COLOURS} selected={selColours}
                  onToggle={(v) => setSelColours((p) => toggle(p, v))} swatches={COLOUR_SWATCHES} defaultOpen={true} />
                <Group title="Collection" options={ALL_COLLECTIONS} selected={selCollections}
                  onToggle={(v) => setSelCollections((p) => toggle(p, v))} defaultOpen={true} />
                {ALL_MANUFACTURERS.length > 0 && (
                  <Group title="Manufacturer" options={ALL_MANUFACTURERS} selected={selManufacturers}
                    onToggle={(v) => setSelManufacturers((p) => toggle(p, v))} />
                )}
                {ALL_TYPES.filter(Boolean).length > 0 && (
                  <Group title="Type" options={ALL_TYPES.filter(Boolean)} selected={selTypes}
                    onToggle={(v) => setSelTypes((p) => toggle(p, v))} />
                )}
                {ALL_STYLES.length > 0 && (
                  <Group title="Style" options={ALL_STYLES} selected={selStyles}
                    onToggle={(v) => setSelStyles((p) => toggle(p, v))} />
                )}
                {ALL_SIZES.length > 0 && (
                  <Group title="Size" options={ALL_SIZES} selected={selSizes}
                    onToggle={(v) => setSelSizes((p) => toggle(p, v))} />
                )}
              </div>
            </div>
          </aside>
        )}

        {/* ── Product grid ── */}
        <main className="flex-1 min-w-0 p-8">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6 text-white/5">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
              </svg>
              <p className="text-sm font-black uppercase tracking-[0.4em]">No Solutions Found</p>
              <button onClick={clearAll} className="text-[10px] font-black uppercase tracking-widest text-[var(--brass)] hover:text-white transition-colors underline underline-offset-8">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-x-8 gap-y-16 ${
              sidebarOpen
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'
            }`}>
              {filtered.map((brick, i) => (
                <BrickCard key={brick.id} brick={brick} onClick={() => navigate('#brick-detail/' + brick.id)} />
              ))}
            </div>
          )}
        </main>
      </div>

      {modalIdx !== null && (
        <BrickModal brick={filtered[modalIdx]} onClose={closeModal} onPrev={prevModal} onNext={nextModal} />
      )}
    </div>
  );
}
