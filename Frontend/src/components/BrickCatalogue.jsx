import { useState, useMemo, useEffect, useCallback } from 'react';
import rawBricks from '../data/bricks.json';

// ─── Normalise helpers ────────────────────────────────────────────────────────
function normaliseSize(raw = '') {
  if (!raw) return 'Unknown';
  const s = raw.toLowerCase();
  const out = [];
  if (s.includes('elongated'))                         out.push('Elongated');
  if (s.includes('modular'))                           out.push('Modular');
  if (s.includes('norman'))                            out.push('Norman');
  if (s.includes('jumbo'))                             out.push('Jumbo');
  if (s.includes('prp') || s.includes('premier plus')) out.push('Premier Plus / PRP');
  return out.length ? out.join(', ') : raw;
}

function normaliseType(raw = '') {
  if (raw.toLowerCase().includes('co2') || raw.toLowerCase().includes('negative')) return 'CO₂ Negative';
  if (raw.toLowerCase().includes('full')) return 'Full-bed Face Brick';
  return raw || 'Unknown';
}

// ─── Process bricks once ─────────────────────────────────────────────────────
const bricks = rawBricks.map((b) => {
  const validImgs = (b.images || []).filter(
    (src) => src && !src.toLowerCase().includes('logo') && !src.toLowerCase().includes('icon')
  );
  return {
    ...b,
    image: b.image && !b.image.toLowerCase().includes('logo') ? b.image : validImgs[0] || '',
    allImages: validImgs.length ? validImgs : b.image ? [b.image] : [],
    colours: b.attributes?.Colour
      ? b.attributes.Colour.split(',').map((c) => c.trim()).filter(Boolean)
      : [],
    type: normaliseType(b.attributes?.Type || ''),
    styles: b.attributes?.Style
      ? b.attributes.Style.split(',').map((s) => s.trim()).filter(Boolean)
      : [],
    sizeNorm: normaliseSize(b.attributes?.Sizes || ''),
    sizeRaw: b.attributes?.Sizes || '',
  };
});

// ─── Filter options ───────────────────────────────────────────────────────────
const ALL_COLOURS = [...new Set(bricks.flatMap((b) => b.colours))].sort();
const ALL_TYPES   = [...new Set(bricks.map((b) => b.type))].sort();
const ALL_STYLES  = [...new Set(bricks.flatMap((b) => b.styles))].sort();
const ALL_SIZES   = [...new Set(bricks.flatMap((b) =>
  b.sizeNorm.split(',').map((s) => s.trim())
))].filter(Boolean).sort();

const COLOUR_SWATCHES = {
  Grey: '#9ca3af', Black: '#1f2937', Brown: '#92400e', 'Brown/Tan': '#a16207',
  Buff: '#d97706', Burgundy: '#9f1239', Cream: '#fef3c7', Beige: '#d4b896',
  Orange: '#ea580c', Red: '#dc2626', Tan: '#b45309', White: '#e5e7eb', Yellow: '#fbbf24',
};

function toggle(arr, val) {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

// ─── Filter Section ───────────────────────────────────────────────────────────
function FilterSection({ title, options, selected, onToggle, swatches }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt);
          const swatch = swatches?.[opt];
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                ${active
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
            >
              {swatch && (
                <span
                  className="w-3 h-3 rounded-full border border-stone-300 flex-shrink-0"
                  style={{ background: swatch }}
                />
              )}
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Brick Card ───────────────────────────────────────────────────────────────
function BrickCard({ brick, onClick }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        {brick.image && !imgError ? (
          <img
            src={brick.image}
            alt={brick.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="1.5" />
              <rect x="2" y="3" width="9" height="4" rx="1" strokeWidth="1.5" />
              <rect x="13" y="3" width="9" height="4" rx="1" strokeWidth="1.5" />
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-stone-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow">
            View Details
          </span>
        </div>

        {brick.type === 'CO₂ Negative' && (
          <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Eco
          </span>
        )}
        {brick.allImages.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-md">
            +{brick.allImages.length - 1} photos
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-stone-800 text-sm leading-tight mb-2">{brick.name}</h3>
        <div className="space-y-1">
          {brick.colours.length > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1">
                {brick.colours.slice(0, 4).map((c) => (
                  <span
                    key={c}
                    className="w-3 h-3 rounded-full border border-stone-200 flex-shrink-0"
                    style={{ background: COLOUR_SWATCHES[c] || '#d4b896' }}
                    title={c}
                  />
                ))}
              </div>
              <span className="text-xs text-stone-400">{brick.colours.join(', ')}</span>
            </div>
          )}
          {brick.sizeNorm && brick.sizeNorm !== 'Unknown' && (
            <p className="text-xs text-stone-400 truncate">{brick.sizeNorm}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function BrickModal({ brick, onClose, onPrev, onNext }) {
  const [activeImg, setActiveImg] = useState(0);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    setActiveImg(0);
    setImgErrors({});
  }, [brick?.id]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!brick) return null;

  const validImgs = brick.allImages.filter((_, i) => !imgErrors[i]);
  const currentSrc = brick.allImages[activeImg];

  const attrRows = Object.entries(brick.attributes || {}).filter(
    ([k]) => !['The Art of the Facade'].includes(k)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Prev / Next */}
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row overflow-hidden flex-1 min-h-0">
          {/* ── Left: Images ── */}
          <div className="md:w-1/2 bg-stone-100 flex flex-col">
            {/* Main image */}
            <div className="flex-1 min-h-0 flex items-center justify-center p-4">
              {currentSrc && !imgErrors[activeImg] ? (
                <img
                  src={currentSrc}
                  alt={`${brick.name} ${activeImg + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onError={() => setImgErrors((p) => ({ ...p, [activeImg]: true }))}
                />
              ) : (
                <div className="flex flex-col items-center text-stone-300 gap-2">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="1.5" />
                    <rect x="2" y="3" width="9" height="4" rx="1" strokeWidth="1.5" />
                    <rect x="13" y="3" width="9" height="4" rx="1" strokeWidth="1.5" />
                  </svg>
                  <span className="text-sm">No image</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {brick.allImages.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto flex-shrink-0">
                {brick.allImages.map((src, i) => (
                  !imgErrors[i] && (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all
                        ${activeImg === i ? 'border-stone-800' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img
                        src={src}
                        alt={`thumb ${i}`}
                        className="w-full h-full object-cover"
                        onError={() => setImgErrors((p) => ({ ...p, [i]: true }))}
                      />
                    </button>
                  )
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Details ── */}
          <div className="md:w-1/2 flex flex-col overflow-y-auto">
            <div className="p-6 flex-1">
              {/* Name + badges */}
              <div className="mb-4">
                <div className="flex items-start gap-2 flex-wrap mb-1">
                  <h2 className="text-2xl font-bold text-stone-900">{brick.name}</h2>
                  {brick.type === 'CO₂ Negative' && (
                    <span className="mt-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      CO₂ Negative
                    </span>
                  )}
                </div>
                <p className="text-sm text-stone-400">Brampton Brick Series</p>
              </div>

              {/* Colour swatches */}
              {brick.colours.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Colour</p>
                  <div className="flex flex-wrap gap-2">
                    {brick.colours.map((c) => (
                      <div key={c} className="flex items-center gap-1.5">
                        <span
                          className="w-4 h-4 rounded-full border border-stone-200"
                          style={{ background: COLOUR_SWATCHES[c] || '#d4b896' }}
                        />
                        <span className="text-sm text-stone-600">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attributes table */}
              {attrRows.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Details</p>
                  <div className="rounded-xl border border-stone-100 overflow-hidden">
                    {attrRows.map(([key, val], i) => (
                      <div
                        key={key}
                        className={`flex text-sm ${i % 2 === 0 ? 'bg-stone-50' : 'bg-white'}`}
                      >
                        <span className="w-28 flex-shrink-0 px-4 py-2.5 font-medium text-stone-500">{key}</span>
                        <span className="px-4 py-2.5 text-stone-700">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Styles */}
              {brick.styles.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Style</p>
                  <div className="flex flex-wrap gap-2">
                    {brick.styles.map((s) => (
                      <span key={s} className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Size */}
              {brick.sizeNorm && brick.sizeNorm !== 'Unknown' && (
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Available Sizes</p>
                  <p className="text-sm text-stone-600">{brick.sizeRaw}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BrickCatalogue() {
  const [search, setSearch]           = useState('');
  const [sort, setSort]               = useState('az');
  const [selColours, setSelColours]   = useState([]);
  const [selTypes, setSelTypes]       = useState([]);
  const [selStyles, setSelStyles]     = useState([]);
  const [selSizes, setSelSizes]       = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalIdx, setModalIdx]       = useState(null); // index into `filtered`

  const filtered = useMemo(() => {
    let list = bricks;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.colours.some((c) => c.toLowerCase().includes(q)) ||
          b.styles.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (selColours.length) list = list.filter((b) => selColours.some((c) => b.colours.includes(c)));
    if (selTypes.length)   list = list.filter((b) => selTypes.includes(b.type));
    if (selStyles.length)  list = list.filter((b) => selStyles.some((s) => b.styles.includes(s)));
    if (selSizes.length)   list = list.filter((b) => selSizes.some((s) => b.sizeNorm.includes(s)));

    return [...list].sort((a, b) =>
      sort === 'az' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [search, sort, selColours, selTypes, selStyles, selSizes]);

  const openModal  = (i) => setModalIdx(i);
  const closeModal = useCallback(() => setModalIdx(null), []);
  const prevModal  = useCallback(() => setModalIdx((i) => (i - 1 + filtered.length) % filtered.length), [filtered.length]);
  const nextModal  = useCallback(() => setModalIdx((i) => (i + 1) % filtered.length), [filtered.length]);

  const activeFilters = [
    ...selColours.map((v) => ({ group: 'Colour', val: v, clear: () => setSelColours((p) => p.filter((x) => x !== v)) })),
    ...selTypes.map((v)   => ({ group: 'Type',   val: v, clear: () => setSelTypes((p)   => p.filter((x) => x !== v)) })),
    ...selStyles.map((v)  => ({ group: 'Style',  val: v, clear: () => setSelStyles((p)  => p.filter((x) => x !== v)) })),
    ...selSizes.map((v)   => ({ group: 'Size',   val: v, clear: () => setSelSizes((p)   => p.filter((x) => x !== v)) })),
  ];
  const clearAll = () => { setSelColours([]); setSelTypes([]); setSelStyles([]); setSelSizes([]); setSearch(''); };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Header ── */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-20">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Filters
          </button>

          <h1 className="flex-1 text-lg font-bold text-stone-900">Brampton Brick Series</h1>

          <div className="relative w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search bricks…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-400 cursor-pointer"
          >
            <option value="az">Name A → Z</option>
            <option value="za">Name Z → A</option>
          </select>

          <span className="text-sm text-stone-400 whitespace-nowrap">{filtered.length} bricks</span>
        </div>

        {activeFilters.length > 0 && (
          <div className="max-w-screen-2xl mx-auto px-6 pb-3 flex items-center gap-2 flex-wrap">
            {activeFilters.map((f) => (
              <button
                key={f.group + f.val}
                onClick={f.clear}
                className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 text-white text-xs rounded-full hover:bg-stone-600 transition-colors"
              >
                <span className="opacity-60 text-[10px]">{f.group}:</span> {f.val}
                <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ))}
            <button onClick={clearAll} className="text-xs text-stone-400 hover:text-stone-700 underline">
              Clear all
            </button>
          </div>
        )}
      </header>

      <div className="max-w-screen-2xl mx-auto px-6 py-6 flex gap-6">
        {/* ── Sidebar ── */}
        {sidebarOpen && (
          <aside className="w-60 flex-shrink-0">
            <div className="bg-white rounded-xl border border-stone-100 p-5 sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <FilterSection title="Colour" options={ALL_COLOURS} selected={selColours} onToggle={(v) => setSelColours((p) => toggle(p, v))} swatches={COLOUR_SWATCHES} />
              <FilterSection title="Type"   options={ALL_TYPES}   selected={selTypes}   onToggle={(v) => setSelTypes((p)   => toggle(p, v))} />
              <FilterSection title="Style"  options={ALL_STYLES}  selected={selStyles}  onToggle={(v) => setSelStyles((p)  => toggle(p, v))} />
              <FilterSection title="Size"   options={ALL_SIZES}   selected={selSizes}   onToggle={(v) => setSelSizes((p)   => toggle(p, v))} />
            </div>
          </aside>
        )}

        {/* ── Grid ── */}
        <main className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-stone-400">
              <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">No bricks match your filters.</p>
              <button onClick={clearAll} className="mt-2 text-sm underline hover:text-stone-700">Clear all filters</button>
            </div>
          ) : (
            <div className={`grid gap-4 ${sidebarOpen
              ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'
            }`}>
              {filtered.map((brick, i) => (
                <BrickCard key={brick.id} brick={brick} onClick={() => openModal(i)} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Modal ── */}
      {modalIdx !== null && (
        <BrickModal
          brick={filtered[modalIdx]}
          onClose={closeModal}
          onPrev={prevModal}
          onNext={nextModal}
        />
      )}
    </div>
  );
}
