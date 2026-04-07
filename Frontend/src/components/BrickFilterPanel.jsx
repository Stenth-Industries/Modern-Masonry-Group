import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { bricks, allColors, allManufacturers, allCollections, allStyles, COLOR_SWATCHES } from '../data/brickData';

/* ─── Helpers ─── */
function toggle(arr, val) {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
}

/* ─── Icons ─── */
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const ListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    style={{ transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const ExternalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

/* ─── Filter Section ─── */
function FilterSection({ title, options, selected, onToggle, swatches, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const activeCount = selected.length;

  return (
    <div style={{ marginBottom: '4px' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
          padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-primary)', fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'inherit'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {title}
          {activeCount > 0 && (
            <span style={{
              background: 'var(--accent)', color: '#000', fontSize: '10px', fontWeight: 700,
              padding: '1px 7px', borderRadius: '10px', lineHeight: '16px'
            }}>{activeCount}</span>
          )}
        </span>
        <ChevronIcon open={isOpen} />
      </button>
      <div style={{
        overflow: 'hidden', transition: 'max-height 0.35s ease, opacity 0.25s ease',
        maxHeight: isOpen ? '400px' : '0', opacity: isOpen ? 1 : 0,
        paddingBottom: isOpen ? '12px' : '0'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {options.map(opt => {
            const active = selected.includes(opt);
            const swatch = swatches?.[opt];
            return (
              <button key={opt} onClick={() => onToggle(opt)} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: swatch ? '5px 12px 5px 8px' : '5px 12px',
                borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border-medium)'}`,
                background: active ? 'var(--accent-glow)' : 'transparent',
                color: active ? 'var(--accent-light)' : 'var(--text-secondary)',
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => { if (!active) { e.target.style.borderColor = 'var(--text-muted)'; e.target.style.color = 'var(--text-primary)'; }}}
              onMouseLeave={e => { if (!active) { e.target.style.borderColor = 'var(--border-medium)'; e.target.style.color = 'var(--text-secondary)'; }}}
              >
                {swatch && (
                  <span style={{
                    width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0,
                    background: swatch, border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: active ? `0 0 6px ${swatch}40` : 'none'
                  }} />
                )}
                {opt}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ height: '1px', background: 'var(--border-subtle)' }} />
    </div>
  );
}

/* ─── Product Card ─── */
function BrickCard({ brick, index, viewMode }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (viewMode === 'list') {
    return (
      <a href={brick.url} target="_blank" rel="noopener noreferrer"
        className="animate-fade-in-up"
        style={{
          animationDelay: `${Math.min(index * 30, 300)}ms`,
          display: 'flex', alignItems: 'center', gap: '20px',
          padding: '16px 20px', borderRadius: '12px',
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          textDecoration: 'none', color: 'inherit',
          transition: 'all 0.3s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
      >
        <div style={{
          width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0,
          background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <img src={brick.image} alt={brick.name} loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{brick.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{brick.manufacturer}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '11px', color: 'var(--text-muted)'
          }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: COLOR_SWATCHES[brick.color] || '#888',
              border: '1px solid rgba(255,255,255,0.1)'
            }} />
            {brick.color}
          </span>
          {brick.styles[0] && (
            <span style={{
              fontSize: '10px', padding: '3px 8px', borderRadius: '4px',
              background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)',
              fontWeight: 500
            }}>{brick.styles[0]}</span>
          )}
          <ExternalIcon />
        </div>
      </a>
    );
  }

  return (
    <a href={brick.url} target="_blank" rel="noopener noreferrer"
      className="animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms`, textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        borderRadius: '16px', overflow: 'hidden',
        background: 'var(--bg-card)',
        border: `1px solid ${isHovered ? 'var(--border-medium)' : 'var(--border-subtle)'}`,
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.2)',
      }}>
        {/* Image */}
        <div style={{
          position: 'relative', paddingTop: '100%', overflow: 'hidden',
          background: '#111'
        }}>
          {!imgLoaded && <div className="shimmer-bg" style={{ position: 'absolute', inset: 0 }} />}
          <img
            src={brick.image} alt={brick.name} loading="lazy"
            onLoad={() => setImgLoaded(true)}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'contain', padding: '16px',
              transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              opacity: imgLoaded ? 1 : 0,
            }}
          />
          {/* Brand badge */}
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            padding: '4px 10px', borderRadius: '6px',
            fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em',
            color: 'var(--accent-light)', textTransform: 'uppercase',
          }}>{brick.manufacturer}</div>
          {/* Color dot */}
          <div style={{
            position: 'absolute', top: '12px', right: '12px',
            width: '20px', height: '20px', borderRadius: '50%',
            background: COLOR_SWATCHES[brick.color] || '#888',
            border: '2px solid rgba(255,255,255,0.15)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }} />
          {/* External link icon on hover */}
          <div style={{
            position: 'absolute', bottom: '12px', right: '12px',
            background: 'var(--accent)', borderRadius: '50%',
            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: isHovered ? 1 : 0, transform: isHovered ? 'scale(1)' : 'scale(0.8)',
            transition: 'all 0.3s', color: '#000'
          }}>
            <ExternalIcon />
          </div>
        </div>
        {/* Info */}
        <div style={{ padding: '16px 18px 18px' }}>
          <div style={{
            fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginBottom: '6px'
          }}>{brick.color} • {brick.styles[0] || brick.type}</div>
          <div style={{
            fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)',
            lineHeight: 1.3, marginBottom: '8px'
          }}>{brick.name}</div>
          {brick.sizes && (
            <div style={{
              fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>Size: {brick.sizes}</div>
          )}
        </div>
      </div>
    </a>
  );
}

/* ─── Active Filter Pills ─── */
function ActiveFilters({ selColors, selBrands, selCollections, selStyles, setSelColors, setSelBrands, setSelCollections, setSelStyles, clearAll }) {
  const all = [
    ...selColors.map(c => ({ label: c, type: 'color' })),
    ...selBrands.map(b => ({ label: b, type: 'brand' })),
    ...selCollections.map(c => ({ label: c, type: 'collection' })),
    ...selStyles.map(s => ({ label: s, type: 'style' })),
  ];
  if (all.length === 0) return null;

  const remove = (item) => {
    if (item.type === 'color') setSelColors(p => p.filter(x => x !== item.label));
    if (item.type === 'brand') setSelBrands(p => p.filter(x => x !== item.label));
    if (item.type === 'collection') setSelCollections(p => p.filter(x => x !== item.label));
    if (item.type === 'style') setSelStyles(p => p.filter(x => x !== item.label));
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
      {all.map(item => (
        <button key={item.type + item.label} onClick={() => remove(item)} style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 500,
          background: 'var(--accent-glow)', border: '1px solid var(--accent)',
          color: 'var(--accent-light)', cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all 0.2s'
        }}>
          {item.label} <XIcon />
        </button>
      ))}
      <button onClick={clearAll} style={{
        padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 500,
        background: 'none', border: '1px solid var(--border-medium)',
        color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'inherit',
        transition: 'all 0.2s'
      }}>Clear All</button>
    </div>
  );
}

/* ─── Main Component ─── */
export default function BrickFilterPanel() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('az');
  const [selColors, setSelColors] = useState([]);
  const [selBrands, setSelBrands] = useState([]);
  const [selCollections, setSelCollections] = useState([]);
  const [selStyles, setSelStyles] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchRef = useRef(null);

  // Keyboard shortcut: Cmd/Ctrl + K for search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filtered = useMemo(() => {
    let list = bricks;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.manufacturer.toLowerCase().includes(q) ||
        b.color.toLowerCase().includes(q) ||
        b.style.toLowerCase().includes(q) ||
        b.type.toLowerCase().includes(q) ||
        b.collection.toLowerCase().includes(q)
      );
    }
    if (selColors.length) list = list.filter(b => selColors.some(c => b.colors.includes(c)));
    if (selBrands.length) list = list.filter(b => selBrands.includes(b.manufacturer));
    if (selCollections.length) list = list.filter(b => selCollections.some(c => b.collections.includes(c)));
    if (selStyles.length) list = list.filter(b => selStyles.some(s => b.styles.includes(s)));

    return [...list].sort((a, b) => {
      if (sort === 'az') return a.name.localeCompare(b.name);
      if (sort === 'za') return b.name.localeCompare(a.name);
      if (sort === 'brand') return a.manufacturer.localeCompare(b.manufacturer);
      if (sort === 'color') return a.color.localeCompare(b.color);
      return 0;
    });
  }, [search, sort, selColors, selBrands, selCollections, selStyles]);

  const clearAll = useCallback(() => {
    setSelColors([]); setSelBrands([]); setSelCollections([]); setSelStyles([]); setSearch('');
  }, []);

  const hasFilters = selColors.length > 0 || selBrands.length > 0 || selCollections.length > 0 || selStyles.length > 0;

  const sidebarContent = (
    <>
      <FilterSection
        title="Colour" options={allColors}
        selected={selColors} onToggle={v => setSelColors(p => toggle(p, v))}
        swatches={COLOR_SWATCHES} defaultOpen={true}
      />
      <FilterSection
        title="Manufacturer" options={allManufacturers}
        selected={selBrands} onToggle={v => setSelBrands(p => toggle(p, v))}
        defaultOpen={true}
      />
      <FilterSection
        title="Collection" options={allCollections}
        selected={selCollections} onToggle={v => setSelCollections(p => toggle(p, v))}
        defaultOpen={false}
      />
      <FilterSection
        title="Style" options={allStyles}
        selected={selStyles} onToggle={v => setSelStyles(p => toggle(p, v))}
        defaultOpen={false}
      />
    </>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* ─── Header ─── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          maxWidth: '1440px', margin: '0 auto', padding: '16px 24px',
          display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
        }}>
          {/* Logo / Title */}
          <div style={{ marginRight: 'auto' }}>
            <h1 style={{
              margin: 0, fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em',
              fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)'
            }}>
              <span style={{ color: 'var(--accent)' }}>King</span> Masonry
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              PREMIUM BRICK CATALOGUE
            </p>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
            <div style={{
              position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none'
            }}><SearchIcon /></div>
            <input
              ref={searchRef}
              type="text" placeholder="Search bricks..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px 10px 38px', fontSize: '13px',
                borderRadius: '10px', border: '1px solid var(--border-medium)',
                background: 'var(--bg-surface)', color: 'var(--text-primary)',
                fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-medium)'}
            />
            <span style={{
              position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
              fontSize: '10px', color: 'var(--text-muted)', padding: '2px 6px',
              background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid var(--border-subtle)',
            }}>⌘K</span>
          </div>

          {/* Sort */}
          <select value={sort} onChange={e => setSort(e.target.value)} style={{
            padding: '10px 14px', fontSize: '12px', borderRadius: '10px',
            border: '1px solid var(--border-medium)', background: 'var(--bg-surface)',
            color: 'var(--text-secondary)', fontFamily: 'inherit', cursor: 'pointer',
            outline: 'none', appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
            paddingRight: '32px'
          }}>
            <option value="az">Name A → Z</option>
            <option value="za">Name Z → A</option>
            <option value="brand">By Manufacturer</option>
            <option value="color">By Colour</option>
          </select>

          {/* View Toggle */}
          <div style={{ display: 'flex', border: '1px solid var(--border-medium)', borderRadius: '10px', overflow: 'hidden' }}>
            {[{ mode: 'grid', icon: <GridIcon /> }, { mode: 'list', icon: <ListIcon /> }].map(({ mode, icon }) => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{
                padding: '9px 12px', background: viewMode === mode ? 'var(--bg-surface)' : 'transparent',
                border: 'none', color: viewMode === mode ? 'var(--accent-light)' : 'var(--text-muted)',
                cursor: 'pointer', display: 'flex', transition: 'all 0.2s'
              }}>{icon}</button>
            ))}
          </div>

          {/* Mobile filter toggle */}
          <button onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)} style={{
            display: 'none', padding: '9px 14px', borderRadius: '10px', fontSize: '12px',
            border: '1px solid var(--border-medium)', background: hasFilters ? 'var(--accent-glow)' : 'var(--bg-surface)',
            color: hasFilters ? 'var(--accent-light)' : 'var(--text-secondary)',
            cursor: 'pointer', fontFamily: 'inherit', alignItems: 'center', gap: '6px',
          }} className="mobile-filter-btn">
            <FilterIcon /> Filters {hasFilters && `(${selColors.length + selBrands.length + selStyles.length})`}
          </button>
        </div>
      </header>

      {/* ─── Main Layout ─── */}
      <div style={{
        maxWidth: '1440px', margin: '0 auto', padding: '24px',
        display: 'flex', gap: '24px',
      }}>
        {/* Sidebar */}
        <aside style={{
          width: sidebarOpen ? '280px' : '0px', flexShrink: 0,
          transition: 'width 0.3s ease',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'sticky', top: '90px',
            background: 'var(--bg-card)', borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '20px', maxHeight: 'calc(100vh - 110px)',
            overflowY: 'auto',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <span style={{
                fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <FilterIcon /> Filters
              </span>
              {hasFilters && (
                <button onClick={clearAll} style={{
                  fontSize: '11px', color: 'var(--accent)', background: 'none',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontWeight: 500, transition: 'color 0.2s'
                }}>Reset</button>
              )}
            </div>
            {sidebarContent}
          </div>
        </aside>

        {/* Content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Stats bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '16px', flexWrap: 'wrap', gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{filtered.length}</strong> of {bricks.length} products
              </span>
              <ActiveFilters {...{ selColors, selBrands, selCollections, selStyles, setSelColors, setSelBrands, setSelCollections, setSelStyles, clearAll }} />
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
              fontSize: '11px', color: 'var(--text-muted)', background: 'none',
              border: '1px solid var(--border-subtle)', padding: '5px 12px',
              borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}>{sidebarOpen ? 'Hide Filters' : 'Show Filters'}</button>
          </div>

          {/* Product Grid / List */}
          {filtered.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '80px 20px', background: 'var(--bg-card)', borderRadius: '20px',
              border: '1px solid var(--border-subtle)', textAlign: 'center'
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%', marginBottom: '20px',
                background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)'
              }}>
                <SearchIcon />
              </div>
              <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-secondary)', margin: '0 0 8px' }}>
                No bricks match your search
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px' }}>
                Try adjusting your filters or search terms
              </p>
              <button onClick={clearAll} style={{
                padding: '10px 24px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                background: 'var(--accent)', color: '#000', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              }}>Clear All Filters</button>
            </div>
          ) : viewMode === 'list' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filtered.map((brick, i) => (
                <BrickCard key={brick.id + '-' + brick.url} brick={brick} index={i} viewMode="list" />
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fill, minmax(${sidebarOpen ? '220px' : '240px'}, 1fr))`,
              gap: '16px'
            }}>
              {filtered.map((brick, i) => (
                <BrickCard key={brick.id + '-' + brick.url} brick={brick} index={i} viewMode="grid" />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile filter overlay */}
      {mobileFiltersOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)'
          }} onClick={() => setMobileFiltersOpen(false)} />
          <div style={{
            position: 'relative', marginTop: 'auto', background: 'var(--bg-card)',
            borderRadius: '20px 20px 0 0', padding: '24px', maxHeight: '80vh',
            overflowY: 'auto', borderTop: '1px solid var(--border-medium)'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'
            }}>
              <span style={{ fontSize: '16px', fontWeight: 600 }}>Filters</span>
              <button onClick={() => setMobileFiltersOpen(false)} style={{
                background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
                padding: '8px'
              }}><XIcon /></button>
            </div>
            {sidebarContent}
            <button onClick={() => setMobileFiltersOpen(false)} style={{
              width: '100%', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
              background: 'var(--accent)', color: '#000', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', marginTop: '16px'
            }}>
              Show {filtered.length} Results
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          aside { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
