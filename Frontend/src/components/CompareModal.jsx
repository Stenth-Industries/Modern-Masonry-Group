import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { BrickWallPattern } from './BrickWallPattern';

/* ─── Spec groups for the comparison table ─────────────────────────────────── */
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

/* ─── Main Compare Panel ────────────────────────────────────────────────────── */
export default function CompareModal({ open, products, onClose, onRemove }) {
  const slots = [...products, ...Array.from({ length: 3 - products.length }, () => null)];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-0 z-[90] w-full h-[100dvh] overflow-y-auto scrollbar-none bg-[#0a0806]"
        >
          {/* Background texture */}
          <div
            className="fixed inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: "url('/bg.png')", backgroundSize: 'cover', backgroundAttachment: 'fixed' }}
          />

          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 min-h-full max-w-[1380px] mx-auto px-8 md:px-14 py-12 flex flex-col"
          >

            {/* ── Masthead ── */}
            <div className="flex w-full items-start justify-between mb-10 overflow-hidden">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-[1px] w-8" style={{ background: 'linear-gradient(90deg, transparent, #ccab7b)' }} />
                  <span className="text-[9px] uppercase tracking-[0.4em] text-[#ccab7b] font-bold">Material Comparison</span>
                  <div className="h-[1px] w-8" style={{ background: 'linear-gradient(90deg, #ccab7b, transparent)' }} />
                </div>
                <h2
                  className="text-[40px] md:text-[56px] text-[#e8e2d4] leading-[1] tracking-tight"
                  style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", fontWeight: 300 }}
                >
                  Side by Side
                </h2>
                <p className="mt-2 text-[13px] text-white/25 tracking-[0.08em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {products.length} of 3 products selected
                </p>
              </div>
              <button
                onClick={onClose}
                className="group mt-2 flex shrink-0 items-center gap-2.5 text-[10px] uppercase tracking-[0.25em] text-white/30 hover:text-[#ccab7b] transition-colors duration-300"
              >
                <span>Close</span>
                <span className="w-7 h-7 border border-white/10 group-hover:border-[#ccab7b]/40 rounded-full flex items-center justify-center transition-colors">
                  <X size={11} />
                </span>
              </button>
            </div>

            {/* ── Scrollable Comparison Area ── */}
            <div className="w-full overflow-x-auto scrollbar-none pb-12 -mx-4 px-4 md:-mx-8 md:px-8">
              <div className="min-w-[800px]">

                {/* ── Product Cards Row ── */}
                <div className="grid gap-px mb-0" style={{ gridTemplateColumns: '220px repeat(3, minmax(200px, 1fr))' }}>
                  {/* Corner label */}
                  <div className="flex items-end pb-8 pl-6 pr-4">
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
                          <span className="text-[10px] font-mono text-[#ccab7b]/40 mb-3 tracking-widest">0{i + 1}</span>

                          {/* Image */}
                          <div className="relative w-full aspect-[3/2] overflow-hidden rounded-sm mb-5 group">
                            {p.image
                              ? <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                              : <BrickWallPattern colorHex={p.colorHex || '#7A5C40'} rows={5} />
                            }
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <span className={`absolute bottom-3 left-3 text-[8px] uppercase tracking-[0.2em] font-bold px-2 py-1 rounded-sm ${
                              p.inStock ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50' : 'bg-red-950/80 text-red-400 border border-red-800/50'
                            }`}>
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                            <button
                              onClick={() => onRemove(p)}
                              className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 bg-black/80 rounded-full flex items-center justify-center text-white/60 hover:text-white"
                            >
                              <X size={10} />
                            </button>
                          </div>

                          {/* Name */}
                          <h3
                            className="text-[#e2ded4] text-[17px] leading-snug mb-1 line-clamp-2"
                            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", fontWeight: 500 }}
                          >
                            {p.name}
                          </h3>
                          <p className="text-[9px] uppercase tracking-[0.22em] text-[#ccab7b]/60 font-semibold mb-5">{p.manufacturer}</p>

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
                    <div className="grid" style={{ gridTemplateColumns: '220px repeat(3, minmax(200px, 1fr))' }}>
                      <div className="py-6 pl-6 pr-4 flex items-center">
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
                      const diff = products.length > 1 && isDifferent(products, key);
                      const isLast = si === group.specs.length - 1;
                      return (
                        <div
                          key={key}
                          className={`grid transition-colors duration-300 ${diff ? 'bg-[#ccab7b]/[0.03]' : ''} ${isLast ? 'mb-2' : ''}`}
                          style={{ gridTemplateColumns: '220px repeat(3, minmax(200px, 1fr))' }}
                        >
                          {/* Label */}
                          <div className={`flex items-center py-4 pl-6 pr-4 border-t ${diff ? 'border-[#ccab7b]/15' : 'border-white/[0.04]'}`}>
                            <div className="flex items-center gap-2 w-full">
                              {diff && <div className="w-[2px] h-3 bg-[#ccab7b] rounded-full shrink-0" />}
                              <span
                                className={`text-[10px] uppercase tracking-[0.18em] font-medium transition-colors break-words ${diff ? 'text-[#ccab7b]/80' : 'text-white/25'}`}
                                style={{ fontFamily: "'Inter', sans-serif" }}
                              >
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

              </div>
            </div>

            {/* ── Bottom rule ── */}
            <div className="mt-12 w-full h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #ccab7b30, transparent)' }} />
            <p className="mt-6 text-center text-[9px] uppercase tracking-[0.3em] text-white/15">Modern Masonry Group — Premium Material Selection</p>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
