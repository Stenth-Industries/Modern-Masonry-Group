import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, AnimatePresence, useInView } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown, Search, MapPin, Phone, Menu, X, Plus, Minus, ChevronRight } from 'lucide-react';
import BrickCatalogue from './BrickCatalogue';
import { InfiniteSlider } from './ui/infinite-slider';
import { ProgressiveBlur } from './ui/progressive-blur';
import { Sparkles } from './ui/sparkles';

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const BRANDS = ['Brampton Brick', 'Unilock', 'Techo-Bloc', 'Permacon', 'Rinox', 'General Shale', 'Shouldice', 'Cambridge Pavingstones', 'Oldcastle', 'Belgard'];

const BRAND_LOGOS = [
  { name: 'Brampton Brick',        src: 'https://modernmasonrygroup.ca/wp-content/uploads/2025/05/Logo-01png.png',          href: 'https://bramptonbrick.com/en/masonry-products-search' },
  { name: 'Canada Brick',          src: 'https://modernmasonrygroup.ca/wp-content/uploads/2025/05/Logo-03.png',              href: 'https://canadabrick.com/brick/' },
  { name: 'All Things Stone',      src: 'https://modernmasonrygroup.ca/wp-content/uploads/2025/05/Logo-04.png',              href: 'https://www.allthingsstone.com/ca-en/products/' },
  { name: 'Arriscraft',            src: 'https://modernmasonrygroup.ca/wp-content/uploads/2025/05/Logo-05.png',              href: 'https://arriscraft.com/library-1/' },
  { name: 'Permacon',              src: 'https://modernmasonrygroup.ca/wp-content/uploads/2025/05/Logo-06.png',              href: 'https://permacon.ca/en/catalogs/' },
  { name: 'Ontario Stone Veneers', src: 'https://modernmasonrygroup.ca/wp-content/uploads/2025/05/Logo-07.png',              href: 'https://www.ontariostoneveneers.com/products/' },
  { name: 'Rinox',                 src: 'https://modernmasonrygroup.ca/wp-content/uploads/2025/05/Logo-08.png',              href: 'https://www.rinox.com/en/collections/masonry/' },
  { name: 'Stonerox',              src: 'https://modernmasonrygroup.ca/wp-content/uploads/2025/05/Logo-09.png',              href: 'https://www.stonerox.ca/' },
  { name: 'Rialux',                src: 'https://modernmasonrygroup.ca/wp-content/uploads/2025/05/Logo-10.png',              href: 'https://www.rialux.com/en/collections/' },
  { name: 'Stonearch',             src: 'https://modernmasonrygroup.ca/wp-content/uploads/2025/05/Untitled-1.png',           href: 'https://www.stonearch.ca/catalogue' },
  { name: 'Santerra',              src: 'https://modernmasonrygroup.ca/wp-content/uploads/2025/05/Santerra_black-lettering-gold-star-with-white-background.png', href: 'https://santerrastonecraft.com/resources/catalogues-guides' },
  { name: 'Stonepark',             src: 'https://modernmasonrygroup.ca/wp-content/uploads/2025/05/200x55-1.png',             href: 'https://www.stonepark.ca/products.html' },
];

const TESTIMONIALS = [
  { name: 'Carla S.', role: 'Lead Architect', company: 'Bousfields Inc.', rating: 5, quote: 'Working with Modern Masonry Group has been seamless from day one. Their brick selection is unmatched in Ontario.' },
  { name: 'Mike D.', role: 'Owner', company: 'Diamond Build Corp', rating: 5, quote: 'Fast delivery, competitive trade pricing, and knowledgeable staff. MMG is our go-to for every residential project.' },
  { name: 'James R.', role: 'Project Manager', company: 'Windmill Developments', rating: 5, quote: 'We spec\u2019d Techo-Bloc for a lakeside estate and MMG had everything in stock same week. Exceptional service.' },
  { name: 'Priya M.', role: 'Interior Designer', company: 'Studio North', rating: 5, quote: 'The online catalogue saved us hours during the spec phase. Exactly what modern contractors need.' },
  { name: 'Tom H.', role: 'Heritage Contractor', company: 'Stoneworks Heritage Co.', rating: 5, quote: 'MMG helped us source heritage limestone for a restoration project. Could not have done it without their expertise.' },
  { name: 'Sandra K.', role: 'Builder', company: 'Oakwood Homes', rating: 5, quote: 'Trade pricing is excellent and they actually know their product. That kind of knowledge is rare in this industry.' },
  { name: 'Carlos V.', role: 'Project Lead', company: 'Apex Masonry', rating: 5, quote: 'Sample delivery was next day. We closed the homeowner in the same meeting. That is the MMG advantage.' },
  { name: 'Paul N.', role: 'General Contractor', company: 'Skyline Contractors', rating: 5, quote: 'Five stars across the board \u2014 quality, service, and selection. MMG sets the standard for masonry supply.' },
];

const SERVICES = [
  { icon: '\u25A6', tag: '10,000+ SKUs', title: 'Premium Product Supply', desc: 'Access one of the Ontario’s most refined collections of brick, natural stone, and architectural masonry products selected for durability, performance, and timeless appeal.' },
  { icon: '\u25C8', tag: 'Design & Technical Guidance', title: 'Expert Consultation', desc: 'Work alongside masonry specialists who collaborate with architects, builders, and designers to specify the right materials, finishes, and systems for your vision.' },
  { icon: '../public/express.png', tag: '2\u20135 Business Days', title: 'Project-Ready Delivery', desc: 'Seamless, on-time delivery directly to your site ensuring your project stays on schedule with zero compromise on handling or quality.' },
  { icon: '\u25C6', tag: 'Exclusive Trade Access', title: 'Trade Partnerships', desc: 'Unlock preferred pricing, dedicated support, and long-term value with our contractor-focused trade accounts.' },
];

const PILLARS = [
  { number: '01', title: 'In-Stock Inventory', desc: 'The largest masonry inventory in Ontario. No waiting, no back-orders on core products.' },
  { number: '02', title: 'Trade Expertise', desc: '30+ years of masonry knowledge. We speak architect, contractor, and builder fluently.' },
  { number: '03', title: 'Competitive Pricing', desc: 'Direct supplier relationships. We match or beat any verified Ontario quote.' },
  { number: '04', title: 'Fleet Delivery', desc: 'Province-wide delivery to your job site. Guaranteed 2\u20135 business day lead times.' },
];

const MILESTONES = [
  { year: '1994', event: 'Founded in Brampton, ON with a single showroom' },
  { year: '2002', event: 'Expanded to full warehouse distribution across GTA' },
  { year: '2010', event: 'Added natural stone and hardscaping division' },
  { year: '2018', event: 'Launched trade account portal for contractors' },
  { year: '2024', event: '10,000+ products and 500+ active trade accounts' },
];

const FAQS = [
  { q: 'Do you sell to homeowners or only the trade?', a: 'We welcome both homeowners and trade professionals. Registered contractors and architects receive preferred pricing, net terms, and a dedicated account representative.' },
  { q: 'What is your minimum order quantity?', a: 'There is no minimum for in-store or curbside pickup. Delivery orders have product-specific minimums contact our team for details.' },
  { q: 'What areas of Ontario do you deliver to?', a: 'We deliver across Ontario, including the GTA, Ottawa, Hamilton, Kitchener-Waterloo, London, and surrounding regions.' },
  { q: 'Can I request product samples before ordering?', a: 'Absolutely. Samples are available for most brick, stone, and veneer products. Visit our showroom or request next-day sample shipping.' },
  { q: 'What are typical lead times on orders?', a: 'In-stock products typically ship within 2\u20135 business days. Special-order items may require 1\u20133 weeks.' },
  { q: 'Do your products come with warranties?', a: 'Yes. Manufacturer warranties apply to all products. Our team can provide full warranty documentation for any product.' },
  { q: 'Can I see products in person at your showroom?', a: 'Yes our Toronto showroom is open Monday through Saturday, 8am to 5pm. Walk-ins welcome.' },
  { q: 'Do you work with landscape architects and interior designers?', a: 'Yes. We regularly work with landscape architects, interior designers, developers, and institutional clients.' },
];

/* ── Lightweight magnetic link ── */
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

/* ── Animated counter (only 4 instances) ── */
const AnimatedStat = ({ value, prefix = '', suffix = '', label }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = Date.now(), dur = 1800;
    const t = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 4)) * value));
      if (p >= 1) { setCount(value); clearInterval(t); }
    }, 16);
    return () => clearInterval(t);
  }, [inView, value]);
  return (
    <div ref={ref} className="pl-8 first:pl-0 flex flex-col justify-center">
      <div className="text-4xl lg:text-5xl font-black mb-2 tracking-tight">{prefix}{count}{suffix}</div>
      <div className="text-sm font-medium text-[var(--ash)] uppercase tracking-widest">{label}</div>
    </div>
  );
};

/* ── Mobile menu ── */
const MobileMenu = ({ open, onClose, navItems, navigate }) => (
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
            {navItems.map((item, i) => (
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

/* ── Floating CTA ── */
const FloatingCTA = ({ scrollY }) => {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const u = scrollY.on('change', v => setVis(v > window.innerHeight * 0.8));
    return () => u();
  }, [scrollY]);
  return (
    <AnimatePresence>
      {vis && (
        <motion.a href="#quote" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-[var(--brass)] text-black px-5 py-3 rounded-full font-bold text-sm uppercase tracking-wider shadow-2xl hover:bg-[var(--brass-light)] transition-colors">
          Free Estimate <ArrowUpRight size={14} />
        </motion.a>
      )}
    </AnimatePresence>
  );
};

/* ── FAQ ── */
const FAQSection = () => {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="py-24 px-8 md:px-20 bg-black">
      <div className="max-w-3xl mx-auto">
        <div className="mb-14 text-center">
          <p className="text-[var(--brass)] text-lg font-bold tracking-widest mb-4 uppercase">FAQ</p>
          <h2 className="text-4xl font-bold tracking-tight">Common Questions</h2>
        </div>
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-white/5 transition-colors">
                <span className="text-white font-medium pr-4 text-sm">{f.q}</span>
                <span className="text-[var(--brass)] shrink-0">{open === i ? <Minus size={15} /> : <Plus size={15} />}</span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    transition={{ duration: 0.25 }} className="overflow-hidden">
                    <p className="px-6 pb-5 pt-4 text-[var(--ash)] text-sm leading-relaxed border-t border-white/5">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══ MAIN ══════════════════════════════════════════════════ */
export default function Homepage({ navigate }) {
  const introVideoRef = useRef(null);
  const mainVideoRef = useRef(null);
  const [isVideo1Ended, setIsVideo1Ended] = useState(false);
  const [introFading, setIntroFading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress, scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const navScale = useTransform(scrollY, [0, 100], [1, 0.96]);
  const navY = useTransform(scrollY, [0, 100], [0, -6]);
  const navBgOp = useTransform(scrollY, [0, 80], [0, 1]);
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const u = scrollY.on('change', v => setIsScrolled(v > 50));
    return () => u();
  }, [scrollY]);

  useEffect(() => {
    if (introVideoRef.current) introVideoRef.current.playbackRate = 1.5;
  }, []);


  const navItems = [
    { label: 'Home', href: '#home' }, { label: 'Products', href: '#products', hasMega: true },
    { label: 'Services', href: '#services' }, { label: 'About Us', href: '#about' },
    { label: 'Gallery', href: '#gallery' }, 
    // { label: 'Testimonials', href: '#testimonials' },
    // { label: 'FAQ', href: '#faq' }, { label: 'Get a Quote', href: '#quote' },
  ];

  return (
    <div className="min-h-screen relative text-[var(--limestone)] font-sans selection:bg-[var(--brass)] selection:text-black">
      <div
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-fixed w-full h-full pointer-events-none opacity-60"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <FloatingCTA scrollY={scrollY} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} navItems={navItems} navigate={navigate} />

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
      <div className="fixed top-8 left-0 w-full z-50 flex justify-center pointer-events-none px-6">
        <motion.nav style={{ scale: navScale, y: navY }}
          className={`pointer-events-auto relative flex items-center gap-4 md:gap-8 px-5 md:px-8 py-4 rounded-full border transition-all duration-500 ${isScrolled
            ? 'border-white/10 backdrop-blur-md bg-[var(--obsidian)]/60 shadow-[0_8px_40px_rgba(0,0,0,0.6)]'
            : 'border-white/10 bg-[var(--charcoal)]/80 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.4)]'}`}>
          <motion.div style={{ opacity: navBgOp }} className="absolute inset-0 z-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-full" />
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="relative z-10 flex items-center pr-3 md:pr-5 border-r border-white/10 shrink-0 cursor-pointer"
            onClick={() => navigate('#home')}>
            <img src="/Logo-MM.png" alt="MMG" className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300" />
          </motion.div>
          <div className="hidden md:flex items-center relative z-10">
            {navItems.map(item => item.hasMega ? (
              <div key={item.label} className="relative group">
                <MagneticLink href={item.href}>{item.label} <ChevronDown size={12} className="inline opacity-50" /></MagneticLink>
                <div className="absolute top-[calc(100%+12px)] -left-4 w-52 bg-[var(--charcoal)] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-3 border border-white/10 rounded-2xl overflow-hidden">
                  {['Brick', 'Stone', 'Landscaping', 'Accessories', 'Rialux Siding'].map(p => (
                    <a key={p} href={`#${p.toLowerCase()}`}
                      onClick={e => { e.preventDefault(); navigate(`#${p.toLowerCase()}`); }}
                      className="px-6 py-3 hover:bg-white/5 transition-colors text-sm font-medium border-b last:border-0 border-white/5 flex justify-between items-center">
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

      {/* HERO */}
      <section id="home" className="relative h-screen bg-black overflow-hidden">
        {/* LOGO IN VIDEO */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="absolute top-6 right-8 z-40 cursor-pointer" onClick={() => navigate('#home')}>
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            <img src="/Logo-MM (1).png" alt="MMG" className="w-56 h-56 object-contain drop-shadow-[0_4px_16px_rgba(212,175,99,0.2)]" />
          </motion.div>
        </motion.div>
        {/* Layer 0: Video 2 (main loop) — preloaded, fades in as Video 1 fades out */}
        <video
          ref={mainVideoRef}
          src="/video2-optim.mp4"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{
            opacity: introFading ? 0.6 : 0,
            transition: 'opacity 1.8s ease-in-out',
            willChange: 'opacity',
            transform: 'translateZ(0)',
          }}
          muted
          loop
          playsInline
          preload="auto"
        />

        {/* Layer 1: Decorative grid lines */}
        <div className="absolute inset-0 z-[1] opacity-20 pointer-events-none">
          <div className="absolute top-0 right-[20%] w-px h-full bg-white/30" />
          <div className="absolute top-[30%] left-0 w-full h-px bg-white/30" />
        </div>

        {/* Layer 2: Hero text content */}
        <div className="px-8 md:px-20 z-10 relative w-full max-w-7xl pt-[18vh]">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6 text-white uppercase drop-shadow-2xl">
            <div className="flex gap-[0.25em] flex-wrap">
              {['Where', 'Architecture'].map((w, i) => (
                <div key={i} className="overflow-hidden pb-2">
                  <motion.span initial={{ y: '110%' }} animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }} className="block">{w}</motion.span>
                </div>
              ))}
            </div>
            <div className="overflow-hidden pb-2">
              <motion.div initial={{ y: '110%' }} animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brass)] to-[var(--brass-light)]">
                Meets Masonry.
              </motion.div>
            </div>
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }}
            className="text-xl font-bold md:text-2xl text-[var(--limestone)] font-light max-w-2xl mb-10 leading-relaxed">
            Premium brick, stone & masonry products for homeowners, architects, contractors & builders across Ontario.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1 }}
            className="flex flex-wrap gap-4">
            <button className="bg-[var(--brass)] text-black px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[var(--brass-light)] transition-colors flex items-center gap-2">
              Explore Products <ArrowRight size={16} />
            </button>
            <button className="bg-black/40 backdrop-blur-sm border border-white/30 text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">
              Request a Quote
            </button>
          </motion.div>
        </div>

        {/* Layer 3: Intro video (Video 1) — crossfades into Video 2 */}
        {!isVideo1Ended && (
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              opacity: introFading ? 0 : 1,
              transition: 'opacity 1.8s ease-in-out',
              willChange: 'opacity',
              transform: 'translateZ(0)',
            }}
            onTransitionEnd={() => { if (introFading) setIsVideo1Ended(true); }}
          >
            <video
              ref={introVideoRef}
              src="/video1-optim.mp4"
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              preload="auto"
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration && v.currentTime >= v.duration - 1.8 && !introFading) {
                  setIntroFading(true);
                  if (mainVideoRef.current) mainVideoRef.current.play().catch(console.error);
                }
              }}
              onEnded={() => {
                if (!introFading) {
                  setIntroFading(true);
                  if (mainVideoRef.current) mainVideoRef.current.play().catch(console.error);
                }
              }}
            />
            {/* Soft dark vignette to frame the hero */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
          </div>
        )}
      </section>

      {/* STAT BAR */}
      {/* <section className="bg-white text-black py-16 px-8 md:px-20 border-y border-[var(--slate-mist)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[var(--slate-mist)]">
          <AnimatedStat value={30} suffix="+" label="Years in Business" />
          <AnimatedStat value={10} suffix="k+" label="Premium Products" />
          <AnimatedStat value={1} prefix="#" label="Ontario Supplier" />
          <AnimatedStat value={500} suffix="+" label="Trusted Builders" />
        </div>
      </section> */}

      {/* WHY MMG */}
      <section className="py-20 px-8 md:px-20 bg-black/40 backdrop-blur-sm border-b border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-white/10">
          {PILLARS.map((p, i) => (
            <div key={i} className="lg:px-8 first:pl-0 last:pr-0 group">
              <div className="text-[var(--brass)]/20 text-6xl font-black mb-5 group-hover:text-[var(--brass)]/40 transition-colors duration-500">{p.number}</div>
              <h3 className="text-white font-bold text-lg mb-3">{p.title}</h3>
              <p className="text-[var(--ash)] text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

        {/* ABOUT */}
      <section id="about" className="py-32 px-8 md:px-20 bg-black text-white">
        <div className="max-w-7xl mx-auto mb-16 text-center">
          <p className="text-[var(--brass)] text-xs font-bold tracking-widest mb-4 uppercase">A Story of Craft</p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none">30 Years of Masonry Excellence</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          <div className="flex flex-col justify-center">
            <p className="text-gray-400 text-xl leading-relaxed mb-6 font-light">Modern Masonry Group was founded in 1994 with a single mission: bring world-class masonry materials to Ontario's architects, builders, and contractors at trade pricing.</p>
            <p className="text-gray-400 text-xl leading-relaxed mb-10 font-light">Today we're Ontario's premier masonry supplier — stocking over 10,000 products from the industry's most trusted brands, with fleet delivery across the province.</p>
            <a href="#contact" className="inline-flex items-center self-start gap-2 bg-[var(--brass)] text-black px-8 py-4 text-sm rounded-full font-bold uppercase tracking-wider hover:bg-[var(--brass-light)] transition-colors">
              About Us<ArrowRight size={16} />
            </a>
          </div>
          <div className="flex flex-col justify-center pl-0 lg:pl-12">
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-[var(--brass)] mt-1.5 shrink-0 shadow-[0_0_10px_rgba(212,175,99,0.5)]" />
                  {i < MILESTONES.length - 1 && <div className="w-px bg-white/10 flex-1 my-2" />}
                </div>
                <div className={i < MILESTONES.length - 1 ? 'pb-10' : 'pb-0'}>
                  <p className="text-xs font-bold text-[var(--brass)] uppercase tracking-widest mb-2">{m.year}</p>
                  <p className="text-gray-300 font-medium text-lg">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section id="products" className="py-24 px-8 md:px-20 bg-[var(--charcoal)]/60 backdrop-blur-sm">
        <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <p className="text-[var(--brass)] text-m font-bold tracking-widest mb-2 uppercase">New Arrivals</p>
            <h2 className="text-4xl font-bold tracking-tight">Featured Products</h2>
          </div>
          <a href="#" className="hidden md:flex items-center gap-2 hover:text-[var(--brass)] transition-colors text-m font-medium uppercase tracking-wider">
            View All <ArrowRight size={16} />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[{ name: 'Obsidian Brick', cat: 'Face Brick' }, { name: 'Limestone Slab', cat: 'Natural Stone' }, { name: 'Aged Ross Stone', cat: 'Veneer' }, { name: 'Charcoal Block', cat: 'Architectural Block' }].map((p, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[4/5] bg-[var(--charcoal)] mb-4 relative overflow-hidden border border-white/5 hover:border-[var(--brass)]/30 transition-colors duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-[var(--brass)] flex items-center gap-2 text-sm font-bold">View Product <ArrowRight size={14} /></span>
                </div>
              </div>
              <p className="text-xs text-[var(--ash)] uppercase tracking-widest mb-1">{p.cat}</p>
              <h3 className="text-lg font-bold group-hover:text-[var(--brass)] transition-colors duration-200">{p.name}</h3>
            </div>
          ))}
        </div>
      </section>

         {/* BRAND MARQUEE */}
      <section className="py-12 bg-[var(--charcoal)] border-y border-white/5 overflow-hidden">
        <p className="text-center text-[10px] text-[var(--ash)] uppercase tracking-[0.35em] mb-7">Proudly Stocking Canada's Leading Masonry Brands</p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[var(--charcoal)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[var(--charcoal)] to-transparent z-10 pointer-events-none" />
          <div className="flex animate-scroll-left whitespace-nowrap" style={{ willChange: 'transform' }}>
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={i} className="inline-flex items-center mx-8 shrink-0">
                <span className="w-1 h-1 bg-[var(--brass)] rounded-full mr-8" />
                <span className="text-white/30 hover:text-white/60 transition-colors font-bold text-xs uppercase tracking-[0.25em]">{b}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-8 md:px-20 bg-black/40 backdrop-blur-sm">
        <div className="mb-14">
          <p className="text-[var(--brass)] text-m font-bold tracking-widest mb-2 uppercase">What Defines Us</p>
          <h2 className="text-4xl font-bold tracking-tight">Our Core Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {SERVICES.map((s, i) => (
            <div key={i} className="bg-black p-8 group hover:bg-[var(--charcoal)] transition-colors duration-300 cursor-default">
              <div className="text-[var(--brass)] text-3xl mb-5">{s.icon}</div>
              <p className="text-[10px] text-[var(--brass)] uppercase tracking-[0.25em] mb-3 font-bold">{s.tag}</p>
              <h3 className="text-lg font-bold mb-3 text-white">{s.title}</h3>
              <p className="text-[var(--ash)] text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATALOGUE
      <section id="brick-catalogue" className="py-12 px-8 md:px-20 bg-[var(--obsidian)]">
        <p className="text-[var(--brass)] text-xs font-bold tracking-widest mb-8 uppercase text-center">-- Product Catalogue</p>
        <BrickCatalogue />
      </section> */}

      {/* SHOP BY SPACE */}
      <section className="py-24 px-8 md:px-20 bg-[var(--charcoal)] text-white">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-[var(--brass)] text-xs font-bold tracking-widest mb-4 uppercase">Browse by Project Type</p>
          <h2 className="text-5xl font-black tracking-tight mb-6">What Are You Building Today?</h2>
          <p className="text-gray-400 text-lg">Discover materials that transform ideas into refined, lasting spaces.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{ title: 'Exterior Cladding', span: 1 }, { title: 'Driveways', span: 1 }, { title: 'Patios & Walkways', span: 1 }, { title: 'Retaining Walls', span: 1 }, { title: 'Pool Decks', span: 1 }, { title: 'Steps & Caps', span: 1 }].map((s, i) => (
            <div key={i} className={`group relative overflow-hidden bg-gray-100 cursor-pointer ${s.span === 2 ? 'md:row-span-2' : ''} aspect-square`}>
              <div className="absolute inset-0 bg-gray-900/30 group-hover:bg-gray-900/10 transition-colors duration-300 z-10" />
              <div className="absolute bottom-0 left-0 p-8 z-20">
                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{s.title}</h3>
                <span className="text-white/80 flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24 px-8 md:px-20 bg-black">
        <div className="mb-12">
          <p className="text-[var(--brass)] text-s font-bold tracking-widest mb-2 uppercase">Project Gallery</p>
          <h2 className="text-4xl font-bold tracking-tight">Built to Last. Designed to Impress.</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 aspect-square lg:aspect-auto bg-[var(--charcoal)] relative group overflow-hidden border border-white/5 min-h-64">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-80 z-10" />
            <div className="absolute bottom-0 left-0 z-20 p-10">
              <span className="text-[var(--brass)] text-xs font-bold tracking-widest uppercase mb-2 block">Featured Project</span>
              <h3 className="text-3xl font-bold text-white">The Muskoka Residence</h3>
              <p className="text-white/70 mt-2 max-w-md">Extensive use of raw limestone and deep black brick for a modern lakeside home.</p>
            </div>
          </div>
          <div className="lg:col-span-2 grid grid-rows-2 gap-4">
            {['Urban Commercial Plaza', 'Heritage Restoration'].map((t, i) => (
              <div key={i} className="bg-[var(--charcoal)] border border-white/5 relative group cursor-pointer overflow-hidden text-white flex items-end p-6 min-h-32">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-200" />
                <h4 className="relative z-10 font-bold">{t}</h4>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center">
          <button className="border border-white/20 text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white/5 transition-colors">View All Projects</button>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 bg-[var(--charcoal)]/60 backdrop-blur-sm overflow-hidden">
        <div className="px-8 md:px-20 mb-14">
          <p className="text-[var(--brass)] text-s font-bold tracking-widest mb-2 uppercase">Client Testimonials</p>
          <h2 className="text-4xl font-bold tracking-tight">Stories Behind the Work</h2>
        </div>
        <div className="space-y-5">
          {[0, 1].map(row => (
            <div key={row} className={`flex ${row === 0 ? 'animate-scroll-left' : 'animate-scroll-right'} whitespace-nowrap`} style={{ willChange: 'transform' }}>
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div key={i} className="shrink-0 w-80 mx-3 bg-white/5 border border-white/10 rounded-2xl p-6 whitespace-normal inline-block">
                  <div className="flex mb-3">{[...Array(t.rating)].map((_, j) => <span key={j} className="text-[var(--brass)] text-sm">{'\u2605'}</span>)}</div>
                  <p className="text-white/75 text-sm leading-relaxed mb-4">"{t.quote}"</p>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-[var(--ash)] text-xs mt-0.5">{t.role}, {t.company}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <section id="quote" className="py-32 px-8 text-center bg-[var(--obsidian)]/80 backdrop-blur-sm text-[var(--limestone)] relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMiIgZmlsbD0iIzAwMCI+PC9jaXJjbGU+Cjwvc3ZnPg==')] mix-blend-color-dodge" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase leading-none text-white">Ready to Start Your Project?</h2>
          <p className="text-xl md:text-2xl font-medium mb-10 max-w-2xl mx-auto opacity-80">Our masonry experts are here to help you select, estimate, and supply the perfect materials.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-black rounded-full text-white px-10 py-5 text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors shadow-2xl">Request a Quote Today</button>
            <button className="bg-transparent rounded-full border-2 border-black text-black px-10 py-5 text-sm font-bold uppercase tracking-wider hover:bg-black/5 transition-colors">Consult with an Expert</button>
          </div>
        </div>
      </section>

    {/* FOOTER */}
<footer className="bg-[var(--charcoal)] pt-24 pb-12 px-8 md:px-20 border-t border-white/5">

  {/* TOP SECTION */}
  <div className="flex flex-col lg:flex-row gap-12 mb-20 border-b border-white/5 pb-20">

    {/* COLUMN 1 */}
    <div className="flex-1 flex flex-col justify-between mr-40">
      <div>
        <div className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
          <img src="../public/Logo-MM (1).png" alt="" />
        </div>
        <p className="text-[var(--ash)] text-sm leading-relaxed mb-2">
          Redefining masonry supply in Ontario through curated materials, expert insight, and a commitment to architectural excellence. Built for those who demand precision, performance, and lasting impact.
        </p>
        <div className="text-[var(--brass)] font-bold text-sm leading-relaxed mb-4">MODERN MASONRY GROUP</div>
      </div>

      <div className="flex gap-4">
        {['Instagram', 'Facebook', 'LinkedIn'].map(s => (
          <a
            key={s}
            href="#"
            className="text-[var(--ash)] hover:text-white transition-colors text-xs font-bold tracking-widest uppercase"
          >
            {s}
          </a>
        ))}
      </div>
    </div>

    {/* COLUMN 2 */}
    <div className="flex-1 flex flex-col">
      <h4 className="text-white font-bold pt-6 mb-6 text-sm uppercase tracking-widest">
        Products
      </h4>
      <ul className="space-y-4 text-sm text-[var(--ash)]">
        {['Brick', 'Stone', 'Landscaping', 'Accessories', 'Rialux Siding'].map(p => (
          <li key={p}>
            <a href="#" className="hover:text-[var(--brass)] transition-colors">
              {p}
            </a>
          </li>
        ))}
      </ul>
    </div>

    {/* COLUMN 3 */}
    <div className="flex-1 flex flex-col">
      <h4 className="text-white font-bold pt-6 mb-6 text-sm uppercase tracking-widest">
        Overview
      </h4>
      <ul className="space-y-4 text-sm text-[var(--ash)]">
        {['About Us', 'Project Gallery', 'Trade Resources', 'Contact'].map(p => (
          <li key={p}>
            <a href="#" className="hover:text-[var(--brass)] transition-colors">
              {p}
            </a>
          </li>
        ))}
      </ul>
    </div>

    {/* COLUMN 4 */}
    <div className="flex-1 flex flex-col">
      <h4 className="text-white font-bold pt-6 mb-6 text-sm uppercase tracking-widest">
        Stay in the Loop
      </h4>
      <p className="text-sm text-[var(--ash)] mb-4">
        Subscribe for product updates and masonry inspiration.
      </p>

      <div className="flex border border-white/10 focus-within:border-[var(--brass)] transition-colors">
        <input
          type="email"
          placeholder="Email Address"
          className="bg-transparent text-white px-4 py-3 text-sm w-full outline-none"
        />
        <button className="bg-[var(--brass)] text-black px-6 font-bold uppercase text-xs tracking-wider shrink-0">
          Join
        </button>
      </div>
    </div>

  </div>

  {/* BOTTOM SECTION */}
  <div className="flex flex-col md:flex-row justify-between items-center text-xs text-[var(--ash)]">
    <p>
      &copy; {new Date().getFullYear()} Modern Masonry Group. All rights reserved.
    </p>

    <div className="flex gap-6 mt-4 md:mt-0 mr-38">
      <a href="#" className="hover:text-white transition-colors">
        Privacy Policy
      </a>
      <a href="#" className="hover:text-white transition-colors">
        Terms of Service
      </a>
    </div>
  </div>

</footer>
    </div>
  );
}