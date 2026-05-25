import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence, useMotionValue } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown, Search, MapPin, Phone, Menu, X, ChevronRight } from 'lucide-react';

export function UtilityBar() {
  return (
    <div className="bg-[#111111] border-b border-white/10 text-xs py-2 px-3 sm:px-6 flex justify-between items-center text-[var(--ash)] z-[60] relative">
      <div className="flex gap-3 sm:gap-6 min-w-0">
        <span className="text-white flex items-center gap-1.5 sm:gap-2 hover:cursor-pointer transition-colors font-bold"><MapPin size={12} className="shrink-0" /> <span className="hidden sm:inline">7195 Highway 9, Schomberg, ON</span><span className="sm:hidden">Schomberg, ON</span></span>
        <span className="text-white hidden sm:flex items-center gap-2 hover:cursor-pointer transition-colors font-bold shrink-0"><Phone size={12} /> +1 905-939-0695</span>
      </div>
      <div className="hidden md:flex gap-4">
        <div className="text-white hover:cursor-pointer transition-colors flex items-center gap-2 font-bold">Are you a builder / Architect ? <ArrowRight size={12} /></div>
      </div>
    </div>
  );
}

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products', hasMega: true },
  { label: 'Services', href: '#services-page' },
  { label: 'About Us', href: '#about' },
  { label: 'Gallery', href: '#gallery' },
];

/* ── Nav link with brass underline draw ── */
const MagneticLink = ({ children, href, className = '', onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={href}
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`relative px-4 py-2 text-xs uppercase tracking-[0.2em] font-medium text-white/60 hover:text-white transition-colors duration-200 block ${className}`}>
      {children}
      {/* Brass underline that draws left-to-right on hover */}
      <motion.span
        className="absolute bottom-0.5 left-4 right-4 h-px bg-[var(--brass)] origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.a>
  );
};

/* ── Mobile menu ── */
const MobileMenu = ({ open, onClose, navigate, onOpenSearch }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-[70]" onClick={onClose} />
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          className="fixed right-0 top-0 bottom-0 w-72 bg-[var(--obsidian)] z-[80] flex flex-col p-8 border-l border-white/10">
          <div className="flex justify-between items-center mb-10">
            <img src="/Logo-MM.png" alt="MMG" className="h-10 w-auto" />
            <div className="flex items-center gap-4">
               <button onClick={() => { onClose(); onOpenSearch(); }} className="text-[var(--brass)] hover:text-white transition-colors"><Search size={20} /></button>
               <button onClick={onClose} className="text-white/50 hover:text-white"><X size={22} /></button>
            </div>
          </div>
          <nav className="flex flex-col">
            {NAV_ITEMS.map((item, i) => (
              <motion.a key={item.label} href={item.href}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex justify-between items-center text-white/60 hover:text-white py-4 border-b border-white/5 text-xs uppercase tracking-[0.2em] font-medium"
                onClick={() => { navigate(item.href); onClose(); }}>
                {item.label} <ChevronRight size={13} className="opacity-30" />
              </motion.a>
            ))}
          </nav>
          <div className="mt-auto pt-8">
            <a href="#contact" onClick={(e) => { e.preventDefault(); navigate('#contact'); onClose(); }} className="flex items-center justify-center gap-2 bg-[var(--brass)] text-black px-6 py-4 font-bold text-sm uppercase tracking-wider w-full rounded-full">
              Get a Quote <ArrowUpRight size={14} />
            </a>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ── Search Modal Full Screen ── */
const SearchModal = ({ open, onClose, navigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        window.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    } else {
      setQuery('');
      setResults([]);
    }
  }, [open, onClose]);

  // Debounced live search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim().length < 2) { setResults([]); setLoading(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}&limit=8`);
        const data = await res.json();
        setResults(data.data || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const goToProduct = (product) => {
    const isBrick = product.material?.toLowerCase() === 'brick';
    navigate(isBrick ? `#brick-detail/${product.id}` : `#stone-detail/${product.id}`);
    setQuery('');
    setResults([]);
    onClose();
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;
    // Page routing keywords
    if (q.includes("service") || q.includes("build")) navigate("#services-page");
    else if (q.includes("home")) navigate("#home");
    else if (q.includes("about") || q.includes("who")) navigate("#about");
    else if (q.includes("contact") || q.includes("quote") || q.includes("email")) navigate("#contact");
    else if (q.includes("gallery") || q.includes("photo") || q.includes("image")) navigate("#gallery");
    else {
      // Use live results if already loaded, otherwise fire an immediate fetch to avoid race condition
      let resolved = results;
      if (resolved.length === 0) {
        try {
          const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}&limit=8`);
          const data = await res.json();
          resolved = data.data || [];
        } catch { resolved = []; }
      }
      const hasStone = resolved.some(r => r.material?.toLowerCase() === 'stone');
      const hasBrick = resolved.some(r => r.material?.toLowerCase() === 'brick');
      if (hasStone && !hasBrick) navigate('#stone?search=' + encodeURIComponent(query.trim()));
      else navigate('#brick?search=' + encodeURIComponent(query.trim()));
    }
    setQuery('');
    setResults([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Deep Glass Overlay */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-[var(--obsidian)]/80 z-[100]"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 w-full h-full z-[101] flex flex-col pt-[20vh] items-center pointer-events-none px-6"
          >
            <div className="w-full max-w-4xl pointer-events-auto">
              <div className="flex justify-between items-center mb-12 px-2">
                <span className="text-[var(--brass)] uppercase tracking-[0.4em] text-xs font-bold drop-shadow-[0_0_10px_#d4af37]">Catalogue Search</span>
                <button onClick={onClose} className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-[10px] uppercase tracking-widest"><X size={16}/> Esc to close</button>
              </div>

              <form onSubmit={handleSearch} className="relative w-full group">
                <Search size={36} className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[var(--brass)] transition-colors" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search premium materials..."
                  className="w-full bg-transparent border-b-2 border-white/10 text-4xl md:text-6xl font-light text-white pl-16 pb-6 focus:outline-none focus:border-[var(--brass)] transition-colors placeholder:text-white/10 placeholder:font-serif placeholder:italic tracking-tight"
                />
              </form>

              {/* Live Results */}
              <AnimatePresence mode="wait">
                {query.trim().length >= 2 ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6"
                  >
                    {loading ? (
                      <p className="text-white/30 text-xs uppercase tracking-[0.3em] px-2 py-4">Searching...</p>
                    ) : results.length > 0 ? (
                      <>
                        <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-medium mb-3 px-2">{results.length} result{results.length !== 1 ? 's' : ''}</p>
                        <div className="flex flex-col divide-y divide-white/5 border border-white/10 rounded-2xl overflow-hidden bg-[var(--charcoal)]/80 backdrop-blur-md">
                          {results.map((product) => {
                            const isBrick = product.material?.toLowerCase() === 'brick';
                            const variant = product.variants?.[0];
                            return (
                              <button
                                key={product.id}
                                type="button"
                                onClick={() => goToProduct(product)}
                                className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors text-left group/item"
                              >
                                {/* Thumbnail */}
                                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white/5">
                                  {variant?.imageUrl
                                    ? <img src={variant.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full bg-white/10" />}
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm font-medium truncate group-hover/item:text-[var(--brass)] transition-colors">{product.name}</p>
                                  <p className="text-white/40 text-xs truncate">{product.manufacturer} {variant?.colourName ? `· ${variant.colourName}` : ''}</p>
                                </div>
                                {/* Material badge */}
                                <span className={`shrink-0 text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-full border ${isBrick ? 'border-[var(--brass)]/30 text-[var(--brass)]' : 'border-blue-400/30 text-blue-300'}`}>
                                  {product.material}
                                </span>
                                <ChevronRight size={14} className="shrink-0 text-white/20 group-hover/item:text-white/60 transition-colors" />
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] mt-3 px-2">Press Enter to see all results in catalogue</p>
                      </>
                    ) : (
                      <p className="text-white/30 text-xs uppercase tracking-[0.3em] px-2 py-4">No products found for "{query}"</p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="suggestions"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="mt-16"
                  >
                    <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-medium mb-6 px-2">Popular Categories</p>
                    <div className="flex flex-wrap gap-4 px-2">
                      {['Architectural Brick', 'Aged Natural Stone', 'Commercial Supply', 'Heritage Restoration'].map(tag => (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="px-6 py-3 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-[var(--brass)] hover:bg-[var(--brass)]/10 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ══ NAVBAR ══════════════════════════════════════════════════ */
export default function Navbar({ navigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { scrollYProgress, scrollY } = useScroll();
  const navScale = useTransform(scrollY, [0, 100], [1, 0.96]);
  const navY = useTransform(scrollY, [0, 100], [0, -6]);
  const navBgOp = useTransform(scrollY, [0, 80], [0, 1]);
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const u = scrollY.on('change', v => {
      setIsScrolled(v > 50);
      // Hide on scroll down, show on scroll up
      if (v < 80) {
        setNavVisible(true);
      } else if (v > lastScrollY.current + 8) {
        setNavVisible(false);
      } else if (v < lastScrollY.current - 8) {
        setNavVisible(true);
      }
      lastScrollY.current = v;
    });
    return () => u();
  }, [scrollY]);

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} navigate={navigate} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} navigate={navigate} onOpenSearch={() => setSearchOpen(true)} />

      {/* NAVBAR */}
      <div className="fixed top-14 left-0 w-full z-50 flex justify-center pointer-events-none px-6"
        style={{ transform: navVisible ? 'translateY(0)' : 'translateY(-120px)', transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
        <motion.nav style={{ scale: navScale, y: navY }}
          className={`pointer-events-auto relative flex items-center gap-4 md:gap-8 px-5 md:px-8 py-4 rounded-full border transition-all duration-500 ${isScrolled
            ? 'border-white/10 backdrop-blur-md bg-[var(--charcoal)]/90 shadow-[0_8px_40px_rgba(0,0,0,0.6)]'
            : 'border-white/10 bg-[var(--charcoal)]/80 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.4)]'}`}>
          <motion.div style={{ opacity: navBgOp }} className="absolute inset-0 z-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-full" />
          <div className="absolute inset-0 z-0 rounded-full overflow-hidden opacity-[0.08]"
            style={{ backgroundImage: "url('/bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="relative z-10 flex items-center pr-3 md:pr-5 border-r border-white/10 shrink-0 cursor-pointer"
            onClick={() => navigate('#home')}>
            <img src="/Logo-MM.png" alt="MMG" className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300" />
          </motion.div>
          <div className="hidden md:flex items-center relative z-10">
            {NAV_ITEMS.map(item => item.hasMega ? (
              <div key={item.label} className="relative group">
                <MagneticLink href={item.href}>{item.label} <ChevronDown size={12} className="inline opacity-50" /></MagneticLink>
                <div className="absolute top-[calc(100%+24px)] -left-4 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-3 border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-md bg-[var(--charcoal)]">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/[0.03] to-transparent pointer-events-none" />
                  <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: NOISE_SVG }} />
                  {['Brick', 'Stone', 'Landscaping', 'Accessories', 'Rialux Siding'].map(p => {
                    const UC = ['Landscaping', 'Accessories', 'Rialux Siding'];
                    const href = UC.includes(p) ? '#under-construction' : `#${p.toLowerCase()}`;
                    return (
                    <a key={p} href={href}
                      onClick={e => { e.preventDefault(); navigate(href); }}
                      className="relative z-10 px-6 py-3 hover:bg-white/5 transition-colors text-xs uppercase tracking-[0.15em] font-medium text-white/60 hover:text-white border-b last:border-0 border-white/5 flex justify-between items-center">
                      {p} <ChevronDown size={12} className="opacity-30 -rotate-90" />
                    </a>
                  );
                  })}
                </div>
              </div>
            ) : <MagneticLink key={item.label} href={item.href}>{item.label}</MagneticLink>)}
          </div>
          <div className="hidden md:flex relative z-10 items-center pl-2 border-l border-white/10">
            <button onClick={() => setSearchOpen(true)} className="p-2 text-white/50 hover:text-[var(--brass)] transition-colors"><Search size={15} /></button>
          </div>
          <motion.a href="#contact" onClick={(e) => { e.preventDefault(); navigate('#contact'); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="relative z-10 group hidden md:flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-bold bg-[var(--brass)] text-black px-5 py-2 rounded-full overflow-hidden hover:shadow-[0_0_20px_rgba(212,175,99,0.4)] transition-shadow shrink-0">
            <span className="relative z-10">Get a Quote</span>
            <ArrowUpRight size={13} className="relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            <motion.div animate={{ x: ['100%', '-100%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
          </motion.a>
          <button onClick={() => setMobileOpen(true)} className="md:hidden relative z-10 p-2 text-white/60 hover:text-white transition-colors">
            <Menu size={20} />
          </button>
          <motion.div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[var(--brass)] origin-left z-20 rounded-full" style={{ scaleX }} />
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-10 rounded-full" style={{ backgroundImage: NOISE_SVG }} />
        </motion.nav>
      </div>
    </>
  );
}
