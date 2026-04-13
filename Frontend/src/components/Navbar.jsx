import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown, Search, MapPin, Phone, Menu, X, ChevronRight } from 'lucide-react';

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products', hasMega: true },
  { label: 'Services', href: '#services' },
  { label: 'About Us', href: '#about' },
  { label: 'Gallery', href: '#gallery' },
];

/* ── Magnetic link ── */
const MagneticLink = ({ children, href, className = '', onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { damping: 15, stiffness: 150 });
  const sy = useSpring(y, { damping: 15, stiffness: 150 });
  return (
    <motion.a ref={ref} href={href} onClick={onClick}
      onMouseMove={e => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - (r.left + r.width / 2)) * .4); y.set((e.clientY - (r.top + r.height / 2)) * .4); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: sx, y: sy }}
      className={`relative px-4 py-2 text-xs uppercase tracking-[0.2em] font-medium text-white/60 hover:text-white transition-colors duration-300 block ${className}`}>
      {children}
    </motion.a>
  );
};

/* ── Mobile menu ── */
const MobileMenu = ({ open, onClose, navigate }) => (
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
            <button onClick={onClose} className="text-white/50 hover:text-white"><X size={20} /></button>
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
            <a href="#contact" className="flex items-center justify-center gap-2 bg-[var(--brass)] text-black px-6 py-4 font-bold text-sm uppercase tracking-wider w-full rounded-full">
              Get a Quote <ArrowUpRight size={14} />
            </a>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ══ NAVBAR ══════════════════════════════════════════════════ */
export default function Navbar({ navigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);
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
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} navigate={navigate} />

      {/* UTILITY BAR */}
      <div className="bg-[#111111] border-b border-white/10 text-xs py-2 px-6 flex justify-between items-center text-[var(--ash)] z-[60] relative">
        <div className="flex gap-6">
          <span className="text-white flex items-center gap-2 hover:cursor-pointer transition-colors font-bold"><MapPin size={12} /> 7195 Highway 9, Schomberg, ON</span>
          <span className="text-white hidden sm:flex items-center gap-2 hover:cursor-pointer transition-colors font-bold"><Phone size={12} /> +1 905-939-0695</span>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="text-white hover:cursor-pointer transition-colors flex items-center gap-2 font-bold">Are you a builder / Architect ? <ArrowRight size={12} /></div>
        </div>
      </div>

      {/* NAVBAR */}
      <div className="fixed top-8 left-0 w-full z-50 flex justify-center pointer-events-none px-6"
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
                <div className="absolute top-[calc(100%+24px)] -left-4 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-3 border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-md bg-[var(--charcoal)]/90">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/[0.03] to-transparent pointer-events-none" />
                  <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: NOISE_SVG }} />
                  {['Brick', 'Stone', 'Landscaping', 'Accessories', 'Rialux Siding'].map(p => (
                    <a key={p} href={`#${p.toLowerCase()}`}
                      onClick={e => { e.preventDefault(); navigate(`#${p.toLowerCase()}`); }}
                      className="relative z-10 px-6 py-3 hover:bg-white/5 transition-colors text-xs uppercase tracking-[0.15em] font-medium text-white/60 hover:text-white border-b last:border-0 border-white/5 flex justify-between items-center">
                      {p} <ChevronDown size={12} className="opacity-30 -rotate-90" />
                    </a>
                  ))}
                </div>
              </div>
            ) : <MagneticLink key={item.label} href={item.href}>{item.label}</MagneticLink>)}
          </div>
          <div className="hidden md:flex relative z-10 items-center pl-2 border-l border-white/10">
            <button className="p-2 text-white/50 hover:text-white transition-colors"><Search size={15} /></button>
          </div>
          <motion.a href="#contact" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
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
