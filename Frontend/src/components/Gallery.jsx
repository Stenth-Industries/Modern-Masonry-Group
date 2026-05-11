import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
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

const wsrv = (src) => src;

export default function Gallery({ navigate }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = activeCategory === 'All'
    ? galleryData
    : galleryData.filter(img => img.category === activeCategory);

  return (
    <div className="min-h-screen relative font-sans text-white flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/bg.png')" }} />
      <div className="fixed inset-0 z-0 bg-black/60" />

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Header */}
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-28 pb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[#c9a449] text-[11px] font-bold tracking-[0.25em] uppercase mb-4 block">
              Our Work
            </span>
            <h1
              className="text-[40px] sm:text-[56px] md:text-[72px] font-serif tracking-tight leading-[0.9] text-[#e3decb] mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              Project Gallery
            </h1>
            <p
              className="text-[18px] text-white/40 max-w-xl mx-auto leading-relaxed italic"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
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
                    ? 'bg-[#c9a449] text-black shadow-[0_0_20px_rgba(201,164,73,0.3)]'
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
          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-5">
            <AnimatePresence>
              {filtered.map((img, i) => (
                <motion.div
                  layout
                  key={img.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="relative group mb-5 break-inside-avoid overflow-hidden rounded-[10px] border border-white/[0.06] hover:border-[#c9a449]/60 cursor-pointer shadow-xl shadow-black/40 transition-all duration-500"
                  onClick={() => setSelected(img)}
                >
                  <img
                    src={wsrv(img.src)}
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
                      <span className="text-[#c9a449] text-[9px] font-bold tracking-[0.2em] uppercase block mb-1">{img.category}</span>
                      <h3 className="text-white text-[15px] font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>{img.title}</h3>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-black/50 border border-[#c9a449]/40 flex items-center justify-center text-[#c9a449]">
                      <ZoomIn size={15} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        <Footer />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/92 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#0d0b09] rounded-[12px] overflow-hidden border border-[#c9a449]/20 shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/60 border border-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <div className="bg-black flex items-center justify-center max-h-[80vh]">
                <img
                  src={wsrv(selected.src, 1400)}
                  alt={selected.title}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>

              <div className="px-6 py-5 border-t border-[#c9a449]/10 flex justify-between items-center">
                <div>
                  <h3 className="text-[#e3decb] text-[20px]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                    {selected.title}
                  </h3>
                  <span className="text-[#c9a449] text-[10px] font-bold tracking-[0.2em] uppercase">{selected.category}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
