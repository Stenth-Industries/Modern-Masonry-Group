import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const galleryData = [
  { id: 1, src: '/gallery/IMG_3416-scaled.jpeg', title: 'Modern Estate Facade', category: 'Estate', height: 'h-96' },
  { id: 2, src: '/gallery/IMG_3475-scaled.jpeg', title: 'Industrial Brick Details', category: 'Industrial', height: 'h-64' },
  { id: 3, src: '/gallery/IMG_6924-scaled.jpeg', title: 'Commercial Office Front', category: 'Commercial', height: 'h-80' },
  { id: 4, src: '/gallery/be2da3cf-5b5e-4d65-8275-773e91bf6070.jpeg', title: 'Residential Custom Chimney', category: 'Residential', height: 'h-64' },
  { id: 5, src: '/gallery/image001-1.jpg', title: 'Luxury Estate Entrance', category: 'Estate', height: 'h-96' },
  { id: 6, src: '/gallery/image001-2-scaled.jpg', title: 'Suburban Residential Wall', category: 'Residential', height: 'h-72' },
  { id: 7, src: '/gallery/image002-1.jpg', title: 'Commercial Retail Brickwork', category: 'Commercial', height: 'h-64' },
  { id: 8, src: '/gallery/image002-2.jpg', title: 'Industrial Warehouse', category: 'Industrial', height: 'h-96' },
  { id: 9, src: '/gallery/image002-scaled.jpg', title: 'Estate Archways', category: 'Estate', height: 'h-80' },
  { id: 10, src: '/gallery/image003.jpg', title: 'Residential Retaining Wall', category: 'Residential', height: 'h-72' },
  { id: 11, src: '/gallery/image004-1.jpg', title: 'Commercial Facade Renovation', category: 'Commercial', height: 'h-64' },
  { id: 12, src: '/gallery/image004.jpg', title: 'Estate Stone Pillars', category: 'Estate', height: 'h-96' },
  { id: 13, src: '/gallery/image006.jpg', title: 'Industrial Masonry Repair', category: 'Industrial', height: 'h-80' },
  { id: 14, src: '/gallery/image007-scaled.jpg', title: 'Custom Residential Walkway', category: 'Residential', height: 'h-72' },
  { id: 15, src: '/gallery/image008-scaled.jpg', title: 'Commercial Lobby Stone', category: 'Commercial', height: 'h-96' },
  { id: 16, src: '/gallery/image009-scaled.jpg', title: 'Estate Poolside Masonry', category: 'Estate', height: 'h-64' },
  { id: 17, src: '/gallery/image012-scaled.jpg', title: 'Industrial Exterior Wall', category: 'Industrial', height: 'h-80' },
];

const categories = ['All', 'Residential', 'Commercial', 'Estate', 'Industrial'];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = activeCategory === 'All' 
    ? galleryData 
    : galleryData.filter(img => img.category === activeCategory);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[var(--bg-primary)]">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-display text-[var(--text-primary)] mb-6 tracking-wide"
        >
          Our <span className="text-[var(--accent)] italic">Portfolio</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg md:text-xl font-light"
        >
          Explore a curated collection of our finest masonry projects, showcasing exceptional craftsmanship across residential, commercial, and industrial sectors.
        </motion.p>
      </div>

      {/* Filter Bar */}
      <div className="flex justify-center mb-12 px-4">
        <div className="surface-elevated inline-flex flex-wrap justify-center gap-2 p-2 rounded-full border border-[var(--accent-muted)]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
                activeCategory === cat 
                  ? 'bg-[var(--accent)] text-black shadow-[var(--glow-brass-sm)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-light)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {filteredImages.map((img) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                key={img.id}
                className="relative group overflow-hidden rounded-lg break-inside-avoid shadow-[var(--shadow-md)] border border-[rgba(201,164,73,0.1)] cursor-pointer"
                onClick={() => setSelectedImage(img)}
              >
                <div className={`relative w-full ${img.height} overflow-hidden`}>
                  <img 
                    src={img.src} 
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Subtle overlay for the image to make text readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Brass border glow effect on hover */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-[var(--accent)] transition-colors duration-500 opacity-50 z-10" />
                  
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20 flex justify-between items-end">
                    <div>
                      <p className="text-[var(--accent)] text-xs font-semibold tracking-wider uppercase mb-1">{img.category}</p>
                      <h3 className="text-white font-display text-xl">{img.title}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full surface flex items-center justify-center text-[var(--accent)]">
                      <ZoomIn size={18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full surface-elevated rounded-xl overflow-hidden border border-[var(--accent-muted)] shadow-[var(--shadow-xl)]"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full surface text-[var(--text-secondary)] hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="relative aspect-auto max-h-[80vh] flex items-center justify-center bg-black">
                <img 
                  src={selectedImage.src} 
                  alt={selectedImage.title}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>
              
              <div className="p-6 border-t border-[var(--accent-muted)] bg-[var(--bg-tertiary)] flex justify-between items-center">
                <div>
                  <h3 className="font-display text-2xl text-[var(--text-primary)]">{selectedImage.title}</h3>
                  <p className="text-[var(--accent)] mt-1 tracking-wider uppercase text-sm font-medium">{selectedImage.category}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
