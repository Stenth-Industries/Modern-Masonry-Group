import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Share2, Plus, CheckCircle,
  Ruler, Package, Mountain, Droplets, Thermometer, Building2, Send, ChevronRight
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SKU_SUFFIX_LABELS = {
  'SAWN': 'Sawn',
  '218': '2-1/8"', '218SAWN': '2-1/8" Sawn',
  '358': '3-5/8"', '358SAWN': '3-5/8" Sawn',
  '578': '5-7/8"', '578SAWN': '5-7/8" Sawn',
};

function getVariantLabel(variant, allVariants) {
  const skus = allVariants.map(v => v.sku);
  let prefix = skus[0];
  for (const sku of skus.slice(1)) {
    while (prefix.length > 0 && !sku.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  const suffix = variant.sku.slice(prefix.length).replace(/^-/, '');
  if (!suffix) return 'Natural';
  return SKU_SUFFIX_LABELS[suffix] ?? suffix;
}

const COLOR_MAP = {
  grey: '#808080', gray: '#808080', white: '#E8E4DC', black: '#1A1A1A',
  charcoal: '#4A4A4A', brown: '#7A5C40', tan: '#C4A57B', beige: '#CDB89A',
  ivory: '#E8DFC8', slate: '#607080', silver: '#A8A8A8', gold: '#C9A84C',
  cashmere: '#D4C4A8', driftwood: '#B8A888', moonstone: '#C8C8C0',
  silverado: '#A0A098', opal: '#C8C0B8', walnut: '#5A4030', mahogany: '#6B3A2A',
  onyx: '#1A1A1A', amalfi: '#D0C8B0', baja: '#C8B890', avalanche: '#E0D8D0',
  glacier: '#C8D0D0', basalt: '#505850', limestone: '#D0C8B0', ironstone: '#706858',
};

const resolveColor = (name, hex) => {
  if (!name && !hex) return '#A09080';
  if (hex && hex !== '#808080') return hex;
  return COLOR_MAP[name?.toLowerCase().trim()] || hex || '#A09080';
};

function SpecRow({ icon, label, value, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center justify-between py-6 border-b border-white/[0.04] group hover:border-[#c9a449]/20 transition-colors"
    >
      <div className="flex items-center gap-4 text-[#9a9488]">
        <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-[#c9a449] group-hover:bg-[#c9a449]/10 transition-colors">
          {React.cloneElement(icon, { size: 14 })}
        </div>
        <span className="text-[12px] tracking-widest uppercase font-medium font-sans">{label}</span>
      </div>
      <span className="text-[13px] text-[#e3decb] font-medium tracking-wide font-sans text-right max-w-[60%] flex flex-wrap justify-end gap-2">
        {value}
      </span>
    </motion.div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ images, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex((prev) => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setIndex((prev) => (prev - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [images.length, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] cursor-zoom-out"
      onClick={onClose}
    >
      <div className="absolute top-8 left-8 text-[#c9a449] text-[9px] uppercase tracking-[0.3em] font-bold">
        Material Viewer // {index + 1} of {images.length}
      </div>
      <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
      <motion.img
        key={index}
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        src={images[index]}
        onClick={(e) => e.stopPropagation()}
        className="max-w-[85vw] max-h-[85vh] object-contain relative z-10"
      />
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50">
          {images.map((_, i) => (
            <div key={i} className={`h-1 transition-all duration-300 rounded-full ${i === index ? 'w-8 bg-[#c9a449]' : 'w-2 bg-white/20'}`} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StoneDetail({ stoneId, navigate }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [submitState, setSubmitState] = useState('idle');
  const [formData, setFormData] = useState({ fullName: '', company: '', quantity: '', details: '' });
  const [activeVariantId, setActiveVariantId] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${stoneId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setProduct(data.data);
          // Default to the variant that was clicked, or first variant
          const initial = data.data.variants?.find(v => v.id === stoneId) || data.data.variants?.[0];
          setActiveVariantId(initial?.id || null);
        } else {
          setError(data.message || 'Product not found');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load product');
      })
      .finally(() => setLoading(false));
  }, [stoneId]);

  const selectedVariant = useMemo(() => {
    if (!product) return null;
    return product.variants?.find(v => v.id === activeVariantId) || product.variants?.[0] || null;
  }, [product, activeVariantId]);

  // Reset image index when color changes
  useEffect(() => { setSelectedImageIdx(0); }, [activeVariantId]);

  const images = useMemo(() => {
    if (!product) return [];
    const v = selectedVariant;
    if (!v) return [];
    // Detail page uses imagesUrl only — imageUrl is the card thumbnail, not shown here.
    // Fall back to imageUrl only if there are no gallery images at all.
    const gallery = Array.isArray(v.imagesUrl) ? v.imagesUrl.filter(u => u?.startsWith('http')) : [];
    if (gallery.length > 0) return gallery;
    return v.imageUrl?.startsWith('http') ? [v.imageUrl] : [];
  }, [product, selectedVariant]);

  const catsByType = useMemo(() => {
    if (!product) return {};
    return (product.categories || []).reduce((acc, cat) => {
      if (!acc[cat.type]) acc[cat.type] = [];
      acc[cat.type].push(cat);
      return acc;
    }, {});
  }, [product]);

  const getCat = (type) => catsByType[type]?.[0]?.value || '';

  const handleShare = () => {
    const url = window.location.origin + '/#stone-detail/' + stoneId;
    if (navigator.share) {
      navigator.share({ title: product.name, text: `Check out ${product.name} at Modern Masonry`, url }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitState('submitting');
    setTimeout(() => {
      setSubmitState('success');
      setFormData({ fullName: '', company: '', quantity: '', details: '' });
      setTimeout(() => setSubmitState('idle'), 5000);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <div className="w-[1px] h-12 bg-white/10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[30%] bg-[#c9a449] animate-[slideDown_1.5s_infinite_ease-in-out]" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
        <p className="text-white/40 text-[9px] tracking-[0.2em] uppercase">{error || 'Record Not Found'}</p>
        <button onClick={() => window.history.back()} className="text-white text-[10px] tracking-[0.2em] uppercase hover:text-[#c9a449] transition-colors pb-1 border-b border-[#c9a449]/30">
          Return to Stone Catalogue
        </button>
      </div>
    );
  }

  const series    = getCat('collection') || 'Natural Stone';
  const finish    = getCat('style') || null;
  const region    = getCat('region') || null;
  const manufacturer = product.manufacturers?.[0]?.name || 'Arriscraft International';

  // Are variants differentiated by size/finish (all same colour) or by colour?
  const allSameColor = product.variants?.length > 1 &&
    product.variants.every(v => v.colourName === product.variants[0].colourName);
  const isMultiVariant = product.variants?.length > 1;

  // Only show sizeLabel in the dimensions row when it looks like a size (contains a quote/inch mark)
  const variantSizeLabel = selectedVariant?.sizeLabel;
  const showAsDimension  = variantSizeLabel && (/["']/.test(variantSizeLabel) || variantSizeLabel.includes('×'));

  const stoneDetails = {
    size:         showAsDimension ? variantSizeLabel : null,
    series,
    finish,
    region,
    manufacturer,
    applications: ['Exterior Cladding', 'Feature Walls', 'Landscape & Hardscape', 'Interior Accents'],
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#c9a449] selection:text-black flex flex-col lg:flex-row relative">

      {/* BG texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.25] bg-[url('/bg.png')] mix-blend-overlay z-0" />

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox images={images} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
        )}
      </AnimatePresence>

      {/* ─── LEFT COLUMN: IMAGE CANVAS (Sticky) ─── */}
      <div className="lg:w-[50%] relative h-[60vh] lg:h-screen lg:sticky lg:top-0 border-b lg:border-b-0 lg:border-r border-white/[0.05] bg-[#020202] flex flex-col z-10">

        {/* Top bar */}
        <div className="absolute top-0 left-0 w-full p-5 sm:p-8 md:p-12 flex justify-between items-center z-20 pointer-events-none">
          <button onClick={() => window.history.back()} className="pointer-events-auto flex items-center gap-3 text-white/50 hover:text-[#c9a449] transition-colors">
            <ArrowLeft size={16} strokeWidth={1.5} />
            <span className="text-[9px] tracking-[0.2em] uppercase font-bold mt-[2px]">Stone Catalogue</span>
          </button>
          <button onClick={handleShare} className="pointer-events-auto flex items-center gap-3 text-white/50 hover:text-[#c9a449] transition-colors">
            <span className="text-[9px] tracking-[0.2em] uppercase font-bold mt-[2px]">Share</span>
            <Share2 size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Main image */}
        <div
          className="flex-1 w-full h-full flex items-center justify-center p-8 md:p-24 relative group cursor-crosshair"
          onClick={() => images.length > 0 && setLightboxIndex(selectedImageIdx)}
        >
          <AnimatePresence mode="wait">
            {images[selectedImageIdx] ? (
              <motion.img
                key={selectedImageIdx}
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                src={images[selectedImageIdx]}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10"
              />
            ) : (
              <div className="text-white/20 text-[9px] tracking-[0.2em] uppercase z-10">No Visual Data</div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-8 right-8 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="text-[#c9a449] text-[9px] tracking-[0.2em] uppercase">Inspect</span>
            <Plus size={14} className="text-[#c9a449]" strokeWidth={1} />
          </div>
        </div>

        {/* Color selector + image dots */}
        <div className="absolute bottom-0 left-0 w-full px-4 sm:px-10 pb-6 z-20 flex flex-col gap-3">
          {/* Variant switcher — size/finish labels or colour swatches */}
          {isMultiVariant && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[8px] uppercase tracking-[0.25em] text-white/30 font-bold mr-1 shrink-0">
                {allSameColor ? 'Option' : 'Colour'}
              </span>
              {product.variants.map((v) => {
                const isActive = v.id === selectedVariant?.id;
                if (allSameColor) {
                  const label = getVariantLabel(v, product.variants);
                  // Size/finish pill buttons
                  return (
                    <button
                      key={v.id}
                      title={label}
                      onClick={() => setActiveVariantId(v.id)}
                      className={`px-3 py-1 rounded text-[9px] font-bold uppercase tracking-[0.15em] border transition-all duration-300 ${
                        isActive
                          ? 'border-[#c9a449] bg-[#c9a449]/10 text-[#c9a449]'
                          : 'border-white/15 text-white/40 hover:border-white/40 hover:text-white/70'
                      }`}
                    >
                      {label}
                    </button>
                  );
                }
                // Colour swatch circles
                const hex = resolveColor(v.colourName, v.hexCode);
                return (
                  <button
                    key={v.id}
                    title={v.colourName || v.sku}
                    onClick={() => setActiveVariantId(v.id)}
                    className={`relative w-7 h-7 rounded-full border-2 transition-all duration-300 shrink-0 ${
                      isActive ? 'border-[#c9a449] scale-110 shadow-[0_0_10px_rgba(201,164,73,0.5)]' : 'border-white/20 hover:border-white/50 hover:scale-105'
                    }`}
                    style={{ background: hex }}
                  >
                    {isActive && (
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] text-[#c9a449] whitespace-nowrap font-bold tracking-wide">
                        {v.colourName}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Image position dots */}
          {images.length > 1 && (
            <div className="flex items-center gap-4 mt-3">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className="group flex flex-col items-center gap-2 py-1"
                >
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${selectedImageIdx === idx ? 'bg-[#c9a449] scale-150' : 'bg-white/20 group-hover:bg-white/50'}`} />
                </button>
              ))}
              <div className="ml-auto text-[9px] tracking-[0.3em] font-bold text-white/30 uppercase">
                {String(selectedImageIdx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── RIGHT COLUMN: SPECIFICATION (Scrolling) ─── */}
      <div className="lg:w-[50%] bg-[#050505] z-10">
        <div className="max-w-[800px] px-5 sm:px-8 md:px-16 lg:px-24 py-14 md:py-32 flex flex-col min-h-screen">

          {/* Header */}
          <div className="mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[9px] tracking-[0.3em] font-bold text-[#c9a449] uppercase">
                {product.material || 'Stone'}
              </span>
              <span className="w-8 h-[1px] bg-white/10" />
              <span className="text-[9px] tracking-[0.2em] font-bold text-white/40 uppercase">
                {manufacturer}
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#e3decb] tracking-[0.01em] leading-[1.05] mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {selectedVariant?.colourName || product.name}
            </h1>
            <p className="text-[12px] tracking-[0.2em] uppercase text-white/40 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
              {series}
            </p>

            {/* Variant switcher — right column */}
            {isMultiVariant && (
              <div className="flex items-center gap-3 flex-wrap mb-8">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#c9a449] font-bold shrink-0">
                  {allSameColor ? 'Option' : 'Colour'}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.variants.map((v) => {
                    const isActive = v.id === selectedVariant?.id;
                    if (allSameColor) {
                      const label = getVariantLabel(v, product.variants);
                      return (
                        <button
                          key={v.id}
                          onClick={() => setActiveVariantId(v.id)}
                          className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-[0.12em] border transition-all duration-300 ${
                            isActive
                              ? 'border-[#c9a449] bg-[#c9a449]/10 text-[#c9a449]'
                              : 'border-white/15 text-white/40 hover:border-white/40 hover:text-white/70'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    }
                    const hex = resolveColor(v.colourName, v.hexCode);
                    return (
                      <button
                        key={v.id}
                        title={v.colourName || v.sku}
                        onClick={() => setActiveVariantId(v.id)}
                        className={`group relative w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                          isActive ? 'border-[#c9a449] scale-110' : 'border-white/15 hover:border-white/50'
                        }`}
                        style={{ background: hex }}
                      />
                    );
                  })}
                </div>
                {!allSameColor && (
                  <span className="text-[11px] text-white/50 ml-1">{selectedVariant?.colourName}</span>
                )}
              </div>
            )}

            <p className="text-[16px] text-white/50 leading-relaxed font-light max-w-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
              {product.description || 'A premium natural stone unit delivering enduring beauty and structural integrity — crafted for architectural cladding, feature walls, and refined landscape applications.'}
            </p>

            <div className="flex flex-wrap items-center gap-6 sm:gap-12 mt-10">
              <div>
                <span className="block text-[10px] text-[#c9a449] uppercase tracking-[0.2em] font-bold mb-2">Manufacturer</span>
                <span className="text-[14px] text-[#e3decb] tracking-wider">{manufacturer}</span>
              </div>
              {series && (
                <>
                  <div className="h-8 w-px bg-white/10 hidden sm:block" />
                  <div>
                    <span className="block text-[10px] text-[#c9a449] uppercase tracking-[0.2em] font-bold mb-2">Series</span>
                    <span className="text-[14px] text-[#e3decb] tracking-wider">{series}</span>
                  </div>
                </>
              )}
              {stoneDetails.size && (
                <>
                  <div className="h-8 w-px bg-white/10 hidden sm:block" />
                  <div>
                    <span className="block text-[10px] text-[#c9a449] uppercase tracking-[0.2em] font-bold mb-2">Standard Dimensions</span>
                    <span className="text-[14px] text-[#e3decb] tracking-wider whitespace-pre-line">{stoneDetails.size}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-white/[0.08] mb-12 flex items-center gap-10 overflow-x-auto scrollbar-hide">
            {['overview', 'specs', 'quote'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-4 text-[12px] uppercase tracking-[0.15em] transition-colors whitespace-nowrap ${
                  activeTab === tab ? 'text-[#c9a449] font-bold' : 'text-[#8c857b] font-medium hover:text-[#e3decb]'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {tab === 'quote' ? 'Request Quote' : tab === 'specs' ? 'Full Specifications' : 'Product Features'}
                {activeTab === tab && (
                  <motion.div layoutId="stone-active-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c9a449]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="flex-1 relative">
            <AnimatePresence mode="wait">

              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-2xl"
                >
                  <div className="mb-12">
                    <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#c9a449] mb-6">Suitable Applications</h4>
                    <div className="flex flex-wrap gap-3">
                      {stoneDetails.applications.map((app) => (
                        <div key={app} className="px-5 py-2.5 rounded-[4px] bg-white/[0.03] border border-white/[0.06] text-[12px] text-[#e3decb] tracking-wide flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a449]" />
                          {app}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-12">
                    <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#c9a449] mb-6">Natural Character & Sourcing</h4>
                    <p className="text-[#a8a195] leading-[1.8] text-[14px] font-light">
                      Quarried and precision-crafted at Arriscraft's facilities in{' '}
                      {region === 'USA' ? 'Fort Valley, Georgia' : 'Cambridge, Ontario'},
                      {' '}<span className="text-[#e3decb]">{product.name}</span> is a calcium silicate masonry unit renowned for its consistent colour, exceptional durability, and low maintenance — engineered for the demands of modern architecture.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <button
                      onClick={() => setActiveTab('quote')}
                      className="px-8 py-4 bg-transparent border border-[#c9a449] text-[#c9a449] font-bold uppercase tracking-[0.15em] text-[12px] hover:bg-[#c9a449] hover:text-black transition-all duration-500 flex items-center justify-center gap-3 group rounded"
                    >
                      <Send size={16} />
                      <span>Build A Quote Request</span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* SPECS */}
              {activeTab === 'specs' && (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-3xl"
                >
                  <div className="border-t border-white/[0.04]">
                    <SpecRow icon={<Building2 />} label="Manufacturer" value={manufacturer} delay={0.05} />
                    <SpecRow icon={<Mountain />} label="Series" value={series} delay={0.1} />
                    <SpecRow icon={<Droplets />} label="Material" value={product.material || 'Calcium Silicate Stone'} delay={0.15} />
                    {finish && <SpecRow icon={<Thermometer />} label="Surface Finish" value={finish} delay={0.2} />}
                    {region && <SpecRow icon={<Building2 />} label="Manufacturing Region" value={region === 'USA' ? 'USA — Fort Valley, Georgia' : 'Canada — Cambridge, Ontario'} delay={0.25} />}
                    {stoneDetails.size && <SpecRow icon={<Ruler />} label="Unit Dimensions" value={stoneDetails.size} delay={0.3} />}

                    {product.variants?.length > 0 && (
                      <SpecRow
                        icon={<Package />}
                        label={allSameColor ? 'Available Options' : 'Available Colours'}
                        delay={0.35}
                        value={product.variants.map(v => (
                          <span key={v.id} className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded text-[11px] text-[#e3decb]">
                            {allSameColor ? (
                              <span className="w-2 h-2 rounded-sm bg-[#c9a449]/50" />
                            ) : (
                              <span className="w-2 h-2 rounded-full border border-white/20" style={{ background: resolveColor(v.colourName, v.hexCode) }} />
                            )}
                            {allSameColor ? getVariantLabel(v, product.variants) : (v.colourName || v.sku)}
                          </span>
                        ))}
                      />
                    )}
                  </div>

                  <div className="mt-12 p-6 rounded-[8px] bg-[#c9a449]/5 border-l-[3px] border-[#c9a449]">
                    <h4 className="text-[12px] uppercase tracking-[0.1em] text-[#c9a449] font-bold mb-2">Natural Stone Note</h4>
                    <p className="text-[13px] text-[#e3decb]/80 leading-relaxed font-light">
                      Subtle variations in colour, tone, and texture are inherent characteristics of natural calcium silicate stone. We recommend reviewing multiple samples under varied lighting conditions and blending units from different batches during installation for the most authentic result.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* QUOTE */}
              {activeTab === 'quote' && (
                <motion.div
                  key="quote"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-2xl"
                >
                  <div className="bg-white/[0.01] border border-white/5 rounded-[8px] p-8 md:p-10">
                    <h3 className="text-[24px] text-[#e3decb] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Commission a Quote</h3>
                    <p className="text-[13px] text-[#8c857b] mb-8 font-light leading-relaxed">
                      Connect with our team for detailed pricing and availability on <strong className="text-white">{product.name}</strong>.
                    </p>

                    {submitState === 'success' ? (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-[#c9a449]/10 text-[#c9a449] flex items-center justify-center mx-auto mb-6">
                          <CheckCircle size={32} />
                        </div>
                        <h4 className="text-[18px] text-[#e3decb] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Inquiry Received</h4>
                        <p className="text-[13px] text-[#8c857b]">An estimation specialist will contact you within 24 hours.</p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-[0.15em] text-[#8c857b] font-bold">Full Name</label>
                            <input
                              required type="text" value={formData.fullName}
                              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                              className="bg-black/20 border border-white/10 rounded-[4px] px-4 py-3 text-[13px] text-white focus:border-[#c9a449] focus:outline-none transition-colors"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-[0.15em] text-[#8c857b] font-bold">Company Name</label>
                            <input
                              required type="text" value={formData.company}
                              onChange={e => setFormData({ ...formData, company: e.target.value })}
                              className="bg-black/20 border border-white/10 rounded-[4px] px-4 py-3 text-[13px] text-white focus:border-[#c9a449] focus:outline-none transition-colors"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-[0.15em] text-[#8c857b] font-bold">Estimated Area (Sq Ft)</label>
                          <input
                            required type="text" value={formData.quantity}
                            onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                            className="bg-black/20 border border-white/10 rounded-[4px] px-4 py-3 text-[13px] text-white focus:border-[#c9a449] focus:outline-none transition-colors"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-[0.15em] text-[#8c857b] font-bold">Project Details & Timeline</label>
                          <textarea
                            required rows={3} value={formData.details}
                            onChange={e => setFormData({ ...formData, details: e.target.value })}
                            className="bg-black/20 border border-white/10 rounded-[4px] px-4 py-3 text-[13px] text-white focus:border-[#c9a449] focus:outline-none transition-colors resize-none"
                          />
                        </div>

                        <button
                          disabled={submitState === 'submitting'}
                          type="submit"
                          className="mt-4 w-full bg-[#c9a449] hover:bg-[#d8b75e] text-black font-bold text-[11px] tracking-[0.2em] uppercase py-4 rounded-[4px] flex items-center justify-center gap-3 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {submitState === 'submitting' ? 'Processing...' : 'Submit Request'}
                          {submitState !== 'submitting' && <Send size={14} />}
                        </button>
                      </form>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
