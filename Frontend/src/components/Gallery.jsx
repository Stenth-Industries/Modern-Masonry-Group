import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from './Footer';

const galleryData = [
  { id: 1,  src: '/gallery/IMG_3416-scaled.jpeg',                         title: 'Modern Estate Facade',         category: 'Residential' },
  { id: 2,  src: '/gallery/IMG_3475-scaled.jpeg',                         title: 'Brick Detail Work',            category: 'Residential' },
  { id: 3,  src: '/gallery/IMG_6924-scaled.jpeg',                         title: 'Commercial Exterior',          category: 'Commercial'  },
  { id: 4,  src: '/gallery/be2da3cf-5b5e-4d65-8275-773e91bf6070.jpeg',   title: 'Custom Chimney',               category: 'Residential' },
  { id: 5,  src: '/gallery/image001-1.jpg',                               title: 'Estate Entrance',              category: 'Residential' },
  { id: 6,  src: '/gallery/image001-2-scaled.jpg',                        title: 'Suburban Feature Wall',        category: 'Residential' },
  { id: 7,  src: '/gallery/image002-1.jpg',                               title: 'Retail Brickwork',             category: 'Commercial'  },
  { id: 8,  src: '/gallery/image002-2.jpg',                               title: 'Industrial Facade',            category: 'Commercial'  },
  { id: 9,  src: '/gallery/image002-scaled.jpg',                          title: 'Archway Detail',               category: 'Residential' },
  { id: 10, src: '/gallery/image003.jpg',                                 title: 'Retaining Wall',               category: 'Residential' },
  { id: 11, src: '/gallery/image004-1.jpg',                               title: 'Facade Renovation',            category: 'Commercial'  },
  { id: 12, src: '/gallery/image004.jpg',                                 title: 'Stone Pillars',                category: 'Residential' },
  { id: 13, src: '/gallery/image006.jpg',                                 title: 'Exterior Masonry',             category: 'Commercial'  },
  { id: 14, src: '/gallery/image007-scaled.jpg',                          title: 'Residential Walkway',          category: 'Residential' },
  { id: 15, src: '/gallery/image008-scaled.jpg',                          title: 'Lobby Stone Finish',           category: 'Commercial'  },
  { id: 16, src: '/gallery/image009-scaled.jpg',                          title: 'Poolside Masonry',             category: 'Residential' },
  { id: 17, src: '/gallery/image012-scaled.jpg',                          title: 'Industrial Exterior',          category: 'Commercial'  },
];

const CATEGORIES = ['All', 'Residential', 'Commercial'];

export default function Gallery({ navigate }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [imgKey, setImgKey] = useState(0);

  const filtered = activeCategory === 'All'
    ? galleryData
    : galleryData.filter(img => img.category === activeCategory);

  const selected = selectedIdx !== null ? filtered[selectedIdx] : null;

  const goNext = useCallback((e) => {
    e?.stopPropagation();
    setSelectedIdx(i => (i + 1) % filtered.length);
    setImgKey(k => k + 1);
  }, [filtered.length]);

  const goPrev = useCallback((e) => {
    e?.stopPropagation();
    setSelectedIdx(i => (i - 1 + filtered.length) % filtered.length);
    setImgKey(k => k + 1);
  }, [filtered.length]);

  const close = useCallback(() => setSelectedIdx(null), []);

  useEffect(() => {
    if (selectedIdx === null) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedIdx, goNext, goPrev, close]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = selectedIdx !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedIdx]);

  return (
    <div className="min-h-screen relative font-sans text-white flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/bg.png')" }} />
      <div className="fixed inset-0 z-0 bg-black/60" />

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Header */}
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-36 pb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[var(--brass)] text-[13px] font-bold tracking-[0.25em] uppercase mb-4 block">
              Our Work
            </span>
            <h1
              className="text-[40px] sm:text-[56px] md:text-[72px] font-black tracking-tight leading-[0.9] text-[var(--limestone)] mb-6"
            >
              Project Gallery
            </h1>
            <p className="text-[18px] text-white/40 max-w-xl mx-auto leading-relaxed font-light">
              A curated collection of our finest masonry installations across residential and commercial projects.
            </p>
          </motion.div>
        </div>

        {/* Filter bar */}
        <div className="flex justify-center mb-12 px-4">
          <div className="flex gap-1 p-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-[11px] font-bold tracking-[0.12em] uppercase transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[var(--brass)] text-black shadow-[0_0_20px_rgba(201,164,73,0.3)]'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry grid */}
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
              className="columns-1 sm:columns-2 lg:columns-3 gap-5"
            >
              {filtered.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.045, ease: [0.22, 1, 0.36, 1] } }}
                  className="relative group mb-5 break-inside-avoid overflow-hidden rounded-[10px] border border-white/[0.06] hover:border-[var(--brass)]/60 cursor-pointer shadow-xl shadow-black/40 transition-colors duration-300"
                  onClick={() => setSelectedIdx(i)}
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Info on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex justify-between items-end">
                    <div>
                      <span className="text-[var(--brass)] text-[9px] font-bold tracking-[0.2em] uppercase block mb-1">{img.category}</span>
                      <h3 className="text-white text-[15px] font-semibold tracking-tight">{img.title}</h3>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-black/50 border border-[var(--brass)]/40 flex items-center justify-center text-[var(--brass)]">
                      <ZoomIn size={15} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <Footer />
      </div>

      {/* Full-screen lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
            onClick={close}
          >
            {/* Counter */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
              <span className="text-white/30 text-[12px] font-mono tracking-widest">
                {selectedIdx + 1} / {filtered.length}
              </span>
            </div>

            {/* Close */}
            <button
              onClick={close}
              className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <X size={18} />
            </button>

            {/* Image */}
            <motion.div
              className="flex-1 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) goNext();
                else if (info.offset.x > 60) goPrev();
              }}
              onClick={close}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgKey}
                  src={selected.src}
                  alt={selected.title}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-full max-h-full object-contain select-none pointer-events-none"
                  draggable={false}
                />
              </AnimatePresence>
            </motion.div>

            {/* Left arrow */}
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/80 hover:border-[var(--brass)]/40 transition-all duration-200"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Right arrow */}
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/80 hover:border-[var(--brass)]/40 transition-all duration-200"
            >
              <ChevronRight size={22} />
            </button>

            {/* Bottom info bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="w-full px-8 py-6 flex items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <span className="text-[var(--brass)] text-[10px] font-bold tracking-[0.25em] uppercase block mb-1">
                  {selected.category}
                </span>
                <h3 className="text-[var(--limestone)] text-[22px] leading-tight font-bold tracking-tight">
                  {selected.title}
                </h3>
              </div>

              {/* Dot strip */}
              <div className="hidden sm:flex gap-1.5 items-center">
                {filtered.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedIdx(i); setImgKey(k => k + 1); }}
                    className={`rounded-full transition-all duration-300 ${
                      i === selectedIdx
                        ? 'w-5 h-1.5 bg-[var(--brass)]'
                        : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
