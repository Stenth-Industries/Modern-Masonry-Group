import React, { useState, useMemo, useCallback } from 'react';
import rawBricks from '../data/bricks.json';

// ─── Adapt local bricks.json shape to what this component expects ─────────────
function adaptBrick(b) {
  const validImages = (b.images || []).filter(
    src => src && src.startsWith('http') && !src.toLowerCase().includes('logo') && !src.toLowerCase().includes('icon')
  );
  if (b.image && b.image.startsWith('http') && !b.image.toLowerCase().includes('logo') && !validImages.includes(b.image)) {
    validImages.unshift(b.image);
  }
  const variants = validImages.map((imageUrl, i) => ({ id: i, imageUrl, colourName: null, hexCode: null, sku: null }));
  const categories = [];
  if (b.attributes?.Colour) {
    b.attributes.Colour.split(',').forEach((c, i) => categories.push({ id: `colour-${i}`, type: 'colour', value: c.trim(), hexCode: null }));
  }
  if (b.attributes?.Style) {
    b.attributes.Style.split(',').forEach((s, i) => categories.push({ id: `style-${i}`, type: 'style', value: s.trim(), hexCode: null }));
  }
  if (b.attributes?.Sizes) {
    categories.push({ id: 'size-0', type: 'size', value: b.attributes.Sizes, hexCode: null });
  }
  if (b.collection) {
    categories.push({ id: 'collection-0', type: 'collection', value: b.collection, hexCode: null });
  }
  return {
    ...b,
    material: b.attributes?.Type || 'Brick',
    manufacturers: b.manufacturer ? [{ id: 1, name: b.manufacturer }] : [],
    variants,
    categories,
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────
const THUMB_VISIBLE = 4; // show 4 thumbs, last slot = "+N more"

const COLOR_MAP = {
  red: '#B4382B',
  tan: '#D2B48C',
  grey: '#808080',
  gray: '#808080',
  brown: '#5D4037',
  buff: '#F0DC82',
  cream: '#FFFDD0',
  white: '#FFFFFF',
  black: '#111111',
  charcoal: '#36454F',
  charcole: '#36454F',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
  gold: '#FFD700',
  orange: '#E67E22',
  pink: '#FADADD',
};

const resolveColor = (name, hex) => {
  if (!name && !hex) return '#808080';
  if (!name) return hex;
  const key = name.toLowerCase().trim();
  // Return mapped color if name is recognized, otherwise fallback to hex or grey
  return COLOR_MAP[key] || hex || '#808080';
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const ArrowLeft = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const ArrowRight = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const ArrowUpRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M7 7h10v10" />
  </svg>
);
const ShieldCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const Leaf = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const Loader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ animation: 'spin 1s linear infinite' }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// ─── Lightbox Modal ───────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);

  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prev, next, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div style={lbStyles.overlay} onClick={onClose}>
      <style>{`
        @keyframes lbFadeIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        .lb-nav-btn { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 50%; width:48px; height:48px; display:flex; align-items:center; justify-content:center; color:#fff; cursor:pointer; transition: background 0.2s, transform 0.15s; backdrop-filter: blur(8px); }
        .lb-nav-btn:hover { background: rgba(201,164,73,0.25); transform: scale(1.1); }
        .lb-thumb-strip { display:flex; gap:8px; overflow-x:auto; padding:0 4px; scrollbar-width:thin; scrollbar-color: var(--accent) transparent; }
        .lb-thumb-strip::-webkit-scrollbar { height:4px; }
        .lb-thumb-strip::-webkit-scrollbar-thumb { background: var(--accent); border-radius:2px; }
        .lb-thumb-item { flex-shrink:0; width:64px; height:64px; border-radius:8px; overflow:hidden; cursor:pointer; border:2px solid transparent; transition: border-color 0.2s, transform 0.15s; }
        .lb-thumb-item:hover { transform:scale(1.05); }
        .lb-thumb-item.active { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(201,164,73,0.3); }
        .lb-close-btn { background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:50%; width:44px; height:44px; display:flex; align-items:center; justify-content:center; color:#fff; cursor:pointer; transition:background 0.2s; backdrop-filter:blur(8px); }
        .lb-close-btn:hover { background:rgba(220,50,50,0.35); }
      `}</style>

      {/* Backdrop click to close */}
      <div style={lbStyles.backdrop} />

      {/* Content */}
      <div style={lbStyles.content} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={lbStyles.header}>
          <span style={lbStyles.counter}>{idx + 1} / {images.length}</span>
          <button className="lb-close-btn" onClick={onClose}><XIcon /></button>
        </div>

        {/* Main image area */}
        <div style={lbStyles.mainArea}>
          <button className="lb-nav-btn" onClick={prev} style={{ marginRight: '16px' }}>
            <ArrowLeft size={20} />
          </button>

          <div style={lbStyles.imgWrap}>
            <img
              key={idx}
              src={images[idx]}
              alt={`Image ${idx + 1}`}
              style={lbStyles.mainImg}
              referrerPolicy="no-referrer"
            />
          </div>

          <button className="lb-nav-btn" onClick={next} style={{ marginLeft: '16px' }}>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Thumbnail strip */}
        <div style={lbStyles.thumbStrip}>
          <div className="lb-thumb-strip">
            {images.map((img, i) => (
              <div
                key={i}
                className={`lb-thumb-item${i === idx ? ' active' : ''}`}
                onClick={() => setIdx(i)}
              >
                <img
                  src={img}
                  alt={`Thumb ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const lbStyles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute', inset: 0,
    background: 'rgba(10,10,15,0.92)',
    backdropFilter: 'blur(12px)',
  },
  content: {
    position: 'relative', zIndex: 1,
    display: 'flex', flexDirection: 'column',
    width: '90vw', maxWidth: '1000px',
    maxHeight: '90vh',
    animation: 'lbFadeIn 0.25s ease',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '16px',
  },
  counter: {
    fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)',
    letterSpacing: '0.05em',
  },
  mainArea: {
    display: 'flex', alignItems: 'center', flex: 1,
    minHeight: 0,
  },
  imgWrap: {
    flex: 1, aspectRatio: '4/3', borderRadius: '12px', overflow: 'hidden',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  mainImg: {
    width: '100%', height: '100%', objectFit: 'contain',
    animation: 'lbFadeIn 0.2s ease',
  },
  thumbStrip: {
    marginTop: '16px',
    padding: '8px 0',
  },
};

// ─── Thumbnail strip with "+N MORE" last cell ─────────────────────────────────
function ThumbStrip({ images, currentImage, onSelect, onOpenLightbox }) {
  if (images.length <= 1) return null;

  const showMore = images.length > THUMB_VISIBLE + 1;
  // Slots: first THUMB_VISIBLE images shown; if more exist, the 4th slot becomes "+N MORE"
  const visibleImgs = showMore ? images.slice(0, THUMB_VISIBLE) : images;
  const extraCount = images.length - THUMB_VISIBLE;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${THUMB_VISIBLE + 1}, 1fr)`, gap: '10px' }}>
      {visibleImgs.map((img, i) => (
        <div
          key={i}
          className={`bd-img-thumb${currentImage === img ? ' selected' : ''}`}
          onClick={() => onSelect(img)}
          style={{ aspectRatio: '1', overflow: 'hidden', position: 'relative' }}
        >
          <img
            src={img} alt={`View ${i + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            referrerPolicy="no-referrer"
          />
        </div>
      ))}

      {/* "+N MORE" slot */}
      {showMore && (
        <div
          className="bd-img-thumb"
          onClick={() => onOpenLightbox(THUMB_VISIBLE)}
          style={{ aspectRatio: '1', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
        >
          {/* Background: last hidden image blurred */}
          <img
            src={images[THUMB_VISIBLE]}
            alt="more"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'blur(2px) brightness(0.45)' }}
            referrerPolicy="no-referrer"
          />
          {/* Overlay label */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(201,164,73,0.15)',
          }}>
            <span style={{ color: 'var(--accent)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', lineHeight: 1.2 }}>
              = +{extraCount} MORE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BrickDetail({ brickId, navigate }) {
  const raw = rawBricks.find(b => String(b.id) === String(brickId));
  const product = raw ? adaptBrick(raw) : null;
  const loading = false;
  const error = !product ? 'Product not found' : null;
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', company: '', quantity: '', details: '' });
  const [submitted, setSubmitted] = useState(false);

  const images = useMemo(() => {
    if (!product) return [];
    const imgs = new Set();
    (product.variants || []).forEach(v => {
      // Main variant image
      if (v.imageUrl && v.imageUrl.startsWith('http')) {
        imgs.add(v.imageUrl);
      }
      // Additional variant images
      if (Array.isArray(v.imagesUrl)) {
        v.imagesUrl.forEach(url => {
          if (url && url.startsWith('http')) {
            imgs.add(url);
          }
        });
      }
    });
    return Array.from(imgs);
  }, [product]);

  const currentImage = selectedImage || images[0] || null;

  const catsByType = useMemo(() => {
    if (!product) return {};
    return (product.categories || []).reduce((acc, cat) => {
      if (!acc[cat.type]) acc[cat.type] = [];
      acc[cat.type].push(cat);
      return acc;
    }, {});
  }, [product]);

  const openLightbox = useCallback((index) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  // ── Loading ──
  if (loading) return (
    <div style={styles.centerScreen}>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      <div style={{ color: 'var(--accent)', marginBottom: '12px' }}><Loader /></div>
      <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Loading Material Details…</p>
    </div>
  );

  // ── Error ──
  if (error || !product) return (
    <div style={styles.centerScreen}>
      <p style={{ color: '#ef4444', fontWeight: 700, marginBottom: '12px' }}>{error || 'Product not found'}</p>
      <a href="#brick" style={styles.backLink}><ArrowLeft /> Back to Catalogue</a>
    </div>
  );

  // ── Main ──
  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .bd-img-thumb { transition:all 0.2s ease; cursor:pointer; border:2px solid transparent; border-radius:10px; overflow:hidden; }
        .bd-img-thumb:hover { border-color:var(--accent); opacity:0.88; }
        .bd-img-thumb.selected { border-color:var(--accent); box-shadow:0 0 12px var(--accent-glow); }
        .bd-input { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:12px 16px; color:var(--text-primary); font-size:14px; width:100%; box-sizing:border-box; outline:none; transition:border-color 0.2s,box-shadow 0.2s; font-family:inherit; }
        .bd-input::placeholder { color:var(--text-secondary); }
        .bd-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); }
        .bd-btn { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:14px; border-radius:8px; background:var(--accent); color:#111; font-weight:700; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; border:none; cursor:pointer; transition:background 0.2s,box-shadow 0.2s,transform 0.1s; font-family:inherit; }
        .bd-btn:hover { background:var(--accent-light); box-shadow:0 0 20px var(--accent-glow); }
        .bd-btn:active { transform:scale(0.98); }
        .bd-back-link { display:inline-flex; align-items:center; gap:8px; color:var(--text-secondary); font-size:11px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; text-decoration:none; transition:color 0.2s; }
        .bd-back-link:hover { color:var(--accent); }
        .bd-breadcrumb-link { color:var(--text-secondary); text-decoration:none; font-size:10px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; transition:color 0.2s; }
        .bd-breadcrumb-link:hover { color:var(--accent); }
        .bd-spec-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
        .bd-spec-row:last-child { border-bottom:none; }
        .bd-guarantee-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:16px; display:flex; align-items:center; gap:12px; }
        .bd-tag { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:6px; padding:4px 10px; font-size:12px; color:var(--text-secondary); }
        .bd-main-img { width:100%; height:100%; object-fit:cover; animation:fadeIn 0.35s ease; }
        /* "View all" button on main image */
        .bd-view-all { position:absolute; bottom:16px; right:16px; background:rgba(17,17,17,0.8); backdrop-filter:blur(8px); border:1px solid rgba(201,164,73,0.3); color:var(--accent); font-size:10px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; padding:6px 14px; border-radius:100px; cursor:pointer; transition:background 0.2s, border-color 0.2s; display:flex; align-items:center; gap:6px; }
        .bd-view-all:hover { background:rgba(201,164,73,0.15); border-color:rgba(201,164,73,0.6); }
      `}</style>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox images={images} startIndex={lightboxIndex} onClose={closeLightbox} />
      )}

      <div style={styles.container}>
        <div style={styles.twoCol}>

          {/* ── LEFT COLUMN ─────────────────────────────────────── */}
          <div style={styles.leftCol}>

            {/* Main image */}
            <div style={{ marginBottom: '16px' }}>
              <div style={styles.mainImageWrap}>
                {currentImage ? (
                  <img
                    key={currentImage}
                    src={currentImage}
                    alt={product.name}
                    className="bd-main-img"
                    referrerPolicy="no-referrer"
                    onClick={() => openLightbox(images.indexOf(currentImage))}
                    style={{ cursor: 'zoom-in' }}
                  />
                ) : (
                  <div style={styles.noImage}>
                    <span style={{ color: 'var(--text-secondary)', opacity: 0.4, fontSize: 14 }}>No Image Available</span>
                  </div>
                )}

                {/* Material badge */}
                <div style={styles.materialBadge}>{product.material || 'MASONRY'}</div>

                {/* View all button (only when there are multiple images) */}
                {images.length > 1 && (
                  <button
                    className="bd-view-all"
                    onClick={() => openLightbox(images.indexOf(currentImage))}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    View All {images.length} Photos
                  </button>
                )}
              </div>
            </div>

            {/* Thumbnail strip with "+N MORE" */}
            <div style={{ marginBottom: '32px' }}>
              <ThumbStrip
                images={images}
                currentImage={currentImage}
                onSelect={setSelectedImage}
                onOpenLightbox={openLightbox}
              />
            </div>

            {/* Material Profile */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={styles.sectionLabel}>Material Profile</h3>
              <p style={styles.profileText}>
                <strong style={{ color: 'var(--text-primary)' }}>{product.name}</strong> is a premium{' '}
                {product.material?.toLowerCase() || 'masonry'} solution
                {product.manufacturers?.length > 0 ? ` by ${product.manufacturers.map(m => m.name).join(', ')}` : ''}.
                {product.description ? ` ${product.description}` : ''}
              </p>
            </div>

            {/* Technical Specifications */}
            <div style={styles.specsBox}>
              <h3 style={{ ...styles.sectionLabel, color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Technical Specifications
              </h3>

              {(product.variants || []).length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <span style={styles.specKey}>Colour Variants</span>
                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {product.variants.map(v => (
                      <span key={v.id} className="bd-tag">
                        <span style={{ 
                          width: '10px', 
                          height: '10px', 
                          borderRadius: '50%', 
                          background: resolveColor(v.colourName, v.hexCode), 
                          border: '1px solid rgba(255,255,255,0.2)', 
                          display: 'inline-block' 
                        }} />
                        {v.colourName || v.sku}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {Object.entries(catsByType).map(([type, cats]) => (
                <div key={type} className="bd-spec-row">
                  <span style={styles.specKey}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end' }}>
                    {cats.map(cat => (
                      <span key={cat.id} className="bd-tag">
                        <span style={{ 
                          width: '10px', 
                          height: '10px', 
                          borderRadius: '50%', 
                          background: resolveColor(cat.value, cat.hexCode), 
                          border: '1px solid rgba(255,255,255,0.2)', 
                          display: 'inline-block' 
                        }} />
                        {cat.value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {product.material && (
                <div className="bd-spec-row">
                  <span style={styles.specKey}>Material</span>
                  <span style={styles.specValue}>{product.material}</span>
                </div>
              )}

              {product.manufacturers?.length > 0 && (
                <div className="bd-spec-row">
                  <span style={styles.specKey}>Manufacturer</span>
                  <span style={styles.specValue}>{product.manufacturers.map(m => m.name).join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN (sticky) ────────────────────────────── */}
          <div style={styles.rightCol}>
            <div style={styles.stickyWrap}>

              {/* Breadcrumb + Title */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <a href="#brick" className="bd-breadcrumb-link">Catalogue</a>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 10 }}>›</span>
                  <span style={{ color: 'var(--accent)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    {product.name}
                  </span>
                </div>

                <h1 style={styles.productTitle}>{product.name}</h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={styles.accentBadge}>{product.material || 'Standard Series'}</span>
                  {product.manufacturers?.map(m => (
                    <span key={m.id} style={styles.mfgLabel}>{m.name}</span>
                  ))}
                </div>
              </div>

              {/* Quote Form */}
              <div style={styles.formCard}>
                <h3 style={styles.formTitle}>Specification &amp; Quote</h3>

                {submitted ? (
                  <div style={styles.successBanner}>
                    ✓ Request received! Our team will respond within 24 business hours.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={styles.formRow}>
                      <div>
                        <label style={styles.formLabel}>Full Name</label>
                        <input type="text" placeholder="John Doe" className="bd-input"
                          value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                      </div>
                      <div>
                        <label style={styles.formLabel}>Company</label>
                        <input type="text" placeholder="Architectural Firm" className="bd-input"
                          value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                      </div>
                    </div>

                    <div>
                      <label style={styles.formLabel}>Estimated Quantity (Sq Ft)</label>
                      <input type="text" placeholder="1,000" className="bd-input"
                        value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                    </div>

                    <div>
                      <label style={styles.formLabel}>Project Details</label>
                      <textarea rows={4} placeholder={`Interested in ${product.name} for a new project…`}
                        className="bd-input" style={{ resize: 'none' }}
                        value={formData.details} onChange={e => setFormData({ ...formData, details: e.target.value })} />
                    </div>

                    <button type="submit" className="bd-btn">
                      Request Firm Quote <ArrowUpRight />
                    </button>
                    <p style={styles.formHint}>
                      Our engineering team will respond with a detailed specification sheet and pricing within 24 business hours.
                    </p>
                  </form>
                )}
              </div>

              {/* Guarantee Cards */}
              <div style={styles.guaranteeGrid}>
                <div className="bd-guarantee-card">
                  <div style={styles.iconCircle}><ShieldCheck /></div>
                  <div>
                    <div style={styles.guaranteeLabel}>Guarantee</div>
                    <div style={styles.guaranteeValue}>25 Year Warranty</div>
                  </div>
                </div>
                <div className="bd-guarantee-card">
                  <div style={styles.iconCircle}><Leaf /></div>
                  <div>
                    <div style={styles.guaranteeLabel}>Impact</div>
                    <div style={styles.guaranteeValue}>Low Carbon Path</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div style={{ marginTop: '48px' }}>
          <a href="#brick" className="bd-back-link">
            <ArrowLeft /> Back to Collection
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: { minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '80px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' },
  container: { maxWidth: '1280px', margin: '0 auto' },
  twoCol: { display: 'flex', flexDirection: 'row', gap: '64px', flexWrap: 'wrap' },
  leftCol: { flex: '7', minWidth: '300px' },
  rightCol: { flex: '5', minWidth: '280px' },
  stickyWrap: { position: 'sticky', top: '100px' },
  mainImageWrap: {
    position: 'relative', width: '100%', aspectRatio: '4/3',
    borderRadius: '16px', overflow: 'hidden',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
  },
  noImage: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  materialBadge: {
    position: 'absolute', top: '16px', left: '16px',
    background: 'rgba(17,17,17,0.85)', backdropFilter: 'blur(8px)',
    padding: '6px 14px', borderRadius: '100px',
    fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
    color: 'var(--accent)', border: '1px solid rgba(201,164,73,0.3)',
  },
  sectionLabel: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px', display: 'block' },
  profileText: { color: 'rgba(240,235,225,0.75)', lineHeight: 1.7, fontSize: '16px', margin: 0 },
  specsBox: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '28px' },
  specKey: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' },
  specValue: { fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right', marginLeft: '16px' },
  productTitle: { fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '0 0 16px 0', lineHeight: 1.1 },
  accentBadge: { padding: '4px 12px', background: 'rgba(201,164,73,0.12)', color: 'var(--accent)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', borderRadius: '4px', border: '1px solid rgba(201,164,73,0.25)' },
  mfgLabel: { fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' },
  formCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '20px', padding: '28px', marginBottom: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' },
  formTitle: { fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0', letterSpacing: '-0.01em' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  formLabel: { display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' },
  formHint: { textAlign: 'center', fontSize: '10px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0', padding: '0 12px' },
  successBanner: { background: 'rgba(201,164,73,0.12)', border: '1px solid rgba(201,164,73,0.3)', borderRadius: '10px', padding: '16px', color: 'var(--accent)', fontSize: '14px', fontWeight: 500, textAlign: 'center' },
  guaranteeGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  iconCircle: { width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(201,164,73,0.12)', border: '1px solid rgba(201,164,73,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 },
  guaranteeLabel: { fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '2px' },
  guaranteeValue: { fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' },
  centerScreen: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '12px' },
  backLink: { display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 },
};
