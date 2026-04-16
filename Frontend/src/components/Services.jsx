import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Truck,
  Users,
  Building2,
  Layers,
  BookOpen,
  CheckCircle,
  ChevronDown,
  Home,
  HardHat,
  Compass,
} from "lucide-react";
import Footer from "./Footer";

/* ─────────────────────────────────────────────────────────────────────────────
   Animation primitives
───────────────────────────────────────────────────────────────────────────── */

// Fade + slight scale up
const FadeUp = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: inView ? "auto" : "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Slide in from left or right
const SlideIn = ({ children, delay = 0, className = "", from = "left" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const x = from === "left" ? -60 : 60;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: inView ? "auto" : "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Word-by-word heading reveal
const SplitHeading = ({ text, className = "", delay = 0, Tag = "h2" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <Tag ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: inView ? "auto" : "transform, opacity" }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

// Gold line that grows horizontally or vertically
const GrowLine = ({ delay = 0, horizontal = false }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={horizontal ? { scaleX: 0 } : { scaleY: 0 }}
      animate={inView ? (horizontal ? { scaleX: 1 } : { scaleY: 1 }) : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: horizontal ? "left" : "top" }}
      className={horizontal
        ? "h-px bg-gradient-to-r from-[var(--brass)]/60 to-[var(--brass)]/10 w-full"
        : "w-px bg-gradient-to-b from-[var(--brass)]/50 to-transparent flex-1 my-2"}
    />
  );
};

// Count-up number animation
function CountUp({ target, suffix = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const isDecimal = target.includes(".");
    const num = parseFloat(target.replace(/[^0-9.]/g, ""));
    const prefix = target.match(/^[^0-9]*/)?.[0] || "";
    const dur = 1400;
    const start = Date.now() + delay * 1000;
    const tick = () => {
      const now = Date.now();
      if (now < start) { requestAnimationFrame(tick); return; }
      const progress = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = isDecimal
        ? (ease * num).toFixed(1)
        : Math.round(ease * num).toString();
      setDisplay(prefix + current + suffix);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, suffix, delay]);

  return <span ref={ref}>{display}</span>;
}

// Magnetic button wrapper
function MagBtn({ children, className = "", onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 25 });
  const sy = useSpring(y, { stiffness: 300, damping: 25 });

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────────────────────── */

const SERVICES = [
  {
    number: "01",
    icon: <Layers size={22} />,
    tag: "10,000+ SKUs",
    title: "Premium Material Supply",
    headline: "Ontario's Most Refined Masonry Selection",
    description:
      "Access an unmatched inventory of architectural brick, natural stone, hardscaping, and accessories — all sourced from the world's most respected manufacturers. Every product in our catalogue is curated for durability, performance, and lasting aesthetic appeal.",
    bullets: [
      "Extruded, wire-cut, and handmade brick",
      "Natural limestone, granite & quartzite",
      "Techo-Bloc, Rialux Siding & landscaping systems",
      "Accessories: mortar, lintels, ties & profiles",
    ],
    img: "/services/supply.png",
    cta: "Browse Catalogue",
    ctaHash: "#brick",
  },
  {
    number: "02",
    icon: <BookOpen size={22} />,
    tag: "Design & Technical Guidance",
    title: "Expert Consultation",
    headline: "Specialists Who Speak Your Language",
    description:
      "Our team has 30+ years of combined masonry knowledge. Whether you're an architect specifying a heritage restoration, a builder pricing a residential subdivision, or a homeowner choosing a front facade — we collaborate at every stage to make sure the right materials meet your vision.",
    bullets: [
      "Material specification for architectural drawings",
      "Colour, texture & finish pairing guidance",
      "Code-compliant product recommendations",
      "On-site or virtual consultation available",
    ],
    img: "/services/consultation.png",
    cta: "Book a Consultation",
    ctaHash: "#contact",
  },
  {
    number: "03",
    icon: <Truck size={22} />,
    tag: "2–5 Business Days",
    title: "Project-Ready Delivery",
    headline: "Province-Wide. On Time. Every Time.",
    description:
      "Our fleet delivers directly to your job site across all of Ontario — from the GTA to Ottawa, Hamilton to Sudbury. Orders are palletised, protected, and tracked. We coordinate with your site supervisor so materials arrive exactly when you need them.",
    bullets: [
      "Guaranteed 2–5 business day lead times",
      "Pallet delivery with crane off-load available",
      "Real-time order tracking",
      "Express delivery for urgent projects",
    ],
    img: "/services/delivery.png",
    cta: "Get a Delivery Quote",
    ctaHash: "#contact",
  },
  {
    number: "04",
    icon: <Users size={22} />,
    tag: "Exclusive Trade Access",
    title: "Trade Partnerships",
    headline: "Built for Those Who Build",
    description:
      "Contractors, builders, and architects who register for a trade account unlock a different level of service — preferred pricing, net-30 terms, a dedicated account rep, and early access to new product lines. Over 500 active trade accounts trust MMG as their primary supplier.",
    bullets: [
      "Preferred pricing on all catalogue lines",
      "Net-30 payment terms available",
      "Dedicated trade account representative",
      "Tender & volume pricing on request",
    ],
    img: "/services/trade.png",
    cta: "Apply for Trade Account",
    ctaHash: "#contact",
  },
  {
    number: "05",
    icon: <Building2 size={22} />,
    tag: "Schomberg Showroom",
    title: "Showroom Experience",
    headline: "See It. Touch It. Choose with Confidence.",
    description:
      "Our Schomberg showroom at 7195 Highway 9 is the region's most comprehensive masonry display space. Walk through curated vignettes, compare materials side by side, and speak directly with a product specialist. Bring your drawings — we'll help you spec with confidence.",
    bullets: [
      "Full-size display vignettes for every product line",
      "Side-by-side colour & texture comparisons",
      "Product specialists available Mon–Sat",
      "Sample library for architects & designers",
    ],
    img: "/services/showroom.png",
    cta: "Get Directions",
    ctaHash: "#contact",
  },
  {
    number: "06",
    icon: <MapPin size={22} />,
    tag: "Before You Order",
    title: "Sample Service",
    headline: "Order Samples. Close with Certainty.",
    description:
      "Never commit to a product you haven't held in your hands. Request physical samples from any line in our catalogue — delivered to your door or ready for in-store pickup. Perfect for client presentations, material boards, and design approvals.",
    bullets: [
      "Free samples on most product lines",
      "Next-day dispatch from our warehouse",
      "Up to 5 samples per order",
      "Bulk sample packs for trade professionals",
    ],
    img: "/services/samples.png",
    cta: "Request Samples",
    ctaHash: "#brick",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discover",
    desc: "Browse our catalogue online or visit the showroom to explore 10,000+ products across brick, stone, and landscaping.",
  },
  {
    step: "02",
    title: "Consult",
    desc: "Speak with a specialist. Share your drawings, timeline, and budget — we'll spec the right products and provide accurate quantities.",
  },
  {
    step: "03",
    title: "Order",
    desc: "Place your order online, by phone, or in-store. Trade accounts get net terms and dedicated rep support from day one.",
  },
  {
    step: "04",
    title: "Deliver",
    desc: "Your materials arrive palletised, on schedule, and exactly as specified — directly to your job site across Ontario.",
  },
];

const WHO_WE_SERVE = [
  {
    icon: <Home size={28} />,
    title: "Homeowners",
    desc: "Transforming your home's exterior, patio, or garden? Our showroom team will guide you from inspiration to final selection — no trade knowledge required.",
    points: ["Free consultation", "Sample service", "In-store design support"],
  },
  {
    icon: <HardHat size={28} />,
    title: "Contractors & Builders",
    desc: "Reliable supply, competitive trade pricing, and on-time delivery across Ontario. MMG keeps your projects moving and your margins healthy.",
    points: ["Net-30 trade accounts", "Volume pricing", "Dedicated account rep"],
  },
  {
    icon: <Compass size={28} />,
    title: "Architects & Designers",
    desc: "Spec with confidence. We stock the most specified architectural masonry lines in Ontario and offer technical support for heritage, commercial, and bespoke projects.",
    points: ["Sample library", "Material boards", "Specification assistance"],
  },
];

const STATS = [
  { value: "30+", raw: "30", suffix: "+", label: "Years in Business" },
  { value: "10k+", raw: "10", suffix: "k+", label: "Products in Stock" },
  { value: "500+", raw: "500", suffix: "+", label: "Active Trade Accounts" },
  { value: "2–5", raw: "2", suffix: "–5", label: "Business Day Delivery" },
];

const DELIVERY_REGIONS = [
  "Greater Toronto Area",
  "Ottawa & Eastern Ontario",
  "Hamilton & Niagara",
  "Kitchener-Waterloo",
  "London & Southwest Ontario",
  "Barrie & Simcoe County",
  "Sudbury & Northern Ontario",
  "Peterborough & Kawarthas",
];

/* ─────────────────────────────────────────────────────────────────────────────
   Service Card — slides in from opposite sides, staggered bullets
───────────────────────────────────────────────────────────────────────────── */

const bulletVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const bulletItem = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

function ServiceCard({ service, index, navigate }) {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50, y: 20 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} border border-white/[0.07] rounded-2xl overflow-hidden group hover:border-[var(--brass)]/40 transition-all duration-500 hover:shadow-[0_0_60px_rgba(204,171,123,0.06)]`}
    >
      {/* Image panel */}
      <div className="relative lg:w-[42%] aspect-[4/3] lg:aspect-auto shrink-0 overflow-hidden bg-black/50 group-hover:bg-black/40 transition-colors duration-700">
        <img
          src={service.img}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-65 group-hover:scale-[1.04] transition-all duration-700 ease-out mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Animated brass border trace on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={false}
        >
          <motion.div
            className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[var(--brass)] to-transparent"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        {/* Tag chip */}
        <motion.div
          className="absolute top-5 left-5"
          initial={{ opacity: 0, y: -8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--brass)] bg-black/60 backdrop-blur-sm border border-[var(--brass)]/30 px-3 py-1.5 rounded-full">
            {service.tag}
          </span>
        </motion.div>
      </div>

      {/* Content panel */}
      <div className="flex flex-col justify-between p-8 lg:p-12 flex-1 bg-gradient-to-br from-white/[0.025] to-transparent">
        <div>
          {/* Icon + line */}
          <motion.div
            className="flex items-center gap-3 mb-5"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="text-[var(--brass)]"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
            >
              {service.icon}
            </motion.div>
            <motion.div
              className="h-px flex-1 bg-gradient-to-r from-[var(--brass)]/40 to-transparent"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "left" }}
            />
          </motion.div>

          <motion.h3
            className="text-3xl lg:text-4xl font-normal text-[#e3decb] mb-2 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.25 }}
          >
            {service.headline}
          </motion.h3>

          <motion.p
            className="text-[11px] uppercase tracking-[0.2em] text-[var(--brass)] font-bold mb-5"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            {service.title}
          </motion.p>

          <motion.p
            className="text-white/50 text-[15px] leading-relaxed mb-7 max-w-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {service.description}
          </motion.p>

          {/* Staggered bullets */}
          <motion.ul
            className="space-y-2.5 mb-8"
            variants={bulletVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {service.bullets.map((b, i) => (
              <motion.li
                key={i}
                variants={bulletItem}
                className="flex items-start gap-3 text-[13px] text-white/60"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 + index * 0.2 }}
                >
                  <CheckCircle size={14} className="text-[var(--brass)] shrink-0 mt-0.5" />
                </motion.div>
                {b}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.65 }}
        >
          <button
            onClick={() => navigate(service.ctaHash)}
            className="group/cta inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-bold text-[var(--brass)] hover:text-white transition-colors duration-300 relative"
          >
            <motion.span
              className="absolute -bottom-0.5 left-0 h-px bg-[var(--brass)]"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              style={{ transformOrigin: "left", width: "100%" }}
              transition={{ duration: 0.3 }}
            />
            {service.cta}
            <ArrowUpRight size={14} className="group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────────────────────── */

export default function Services({ navigate }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.5], [1, 0]);
  const springProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="min-h-screen text-white font-sans relative">

      {/* ── SCROLL PROGRESS BAR ────────────────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--brass)] to-[var(--brass-light)] z-[100] origin-left"
        style={{ scaleX: springProgress }}
      />

      {/* ── GLOBAL BACKGROUND ──────────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0 bg-cover bg-center w-full h-full" style={{ backgroundImage: "url('/bg.png')" }} />
      <div className="fixed inset-0 z-0 bg-black/60" />

      <div className="relative z-10">

        {/* ── HERO ─────────────────────────────────────────────────────────────── */}
        <section ref={heroRef} className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">

          {/* Parallax gradient */}
          <motion.div style={{ y: heroY }} className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </motion.div>

          {/* Animated brass corner accents — draw in */}
          {[
            { pos: "top-28 right-12", border: "border-t-2 border-r-2", size: "w-24 h-24" },
            { pos: "bottom-16 left-12", border: "border-b-2 border-l-2", size: "w-16 h-16" },
          ].map((acc, i) => (
            <motion.div
              key={i}
              className={`absolute ${acc.pos} ${acc.size} ${acc.border} border-[var(--brass)]/30 pointer-events-none z-[2]`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}

          {/* Floating ambient dots */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[var(--brass)]/20 pointer-events-none"
              style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 22}%` }}
              animate={{ y: [0, -12, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            />
          ))}

          {/* Decorative grid lines */}
          <div className="absolute inset-0 z-[1] pointer-events-none opacity-10">
            <motion.div
              className="absolute top-0 left-[30%] w-px h-full bg-white/30"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              style={{ transformOrigin: "top" }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
            <motion.div
              className="absolute top-[40%] left-0 w-full h-px bg-white/30"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              style={{ transformOrigin: "left" }}
              transition={{ duration: 1.2, delay: 0.7 }}
            />
          </div>

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 px-8 md:px-20 max-w-7xl w-full">
            {/* Tag line */}
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.span
                //assName="h-px bg-[var(--brass)]"
                initial={{ width: 0 }}
                animate={{ width: 32 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
              <span className="text-[var(--brass)] text-[18px] font-bold tracking-[0.3em] uppercase">
                What We Offer
              </span>
            </motion.div>

            {/* Main heading */}
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-normal text-[#e3decb] leading-[0.95] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {["Premium", "Masonry Services", "Across Ontario."].map((line, i) => (
                <div key={i} className="overflow-hidden pb-2">
                  <motion.span
                    initial={{ y: "110%", skewY: 3 }}
                    animate={{ y: 0, skewY: 0 }}
                    transition={{ duration: 0.85, delay: 0.3 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                    className={`block ${i === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-[var(--brass)] to-[var(--brass-light)]" : ""}`}
                  >
                    {line}
                  </motion.span>
                </div>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.78 }}
              className="text-white/50 text-lg max-w-xl leading-relaxed mb-10"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              From material specification to site delivery — Modern Masonry Group delivers end-to-end support for homeowners, contractors, and architects.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.92 }}
              className="flex flex-wrap gap-4"
            >
              <MagBtn
                onClick={() => navigate("#contact")}
                className="flex items-center gap-2 bg-[var(--brass)] text-black px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-full hover:bg-[var(--brass-light)] transition-colors overflow-hidden relative group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get a Quote <ArrowRight size={14} />
                </span>
                <motion.span
                  animate={{ x: ["100%", "-100%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
                />
              </MagBtn>
              <MagBtn
                onClick={() => navigate("#brick")}
                className="flex items-center gap-2 border border-white/20 text-white px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-full hover:border-white/50 hover:bg-white/5 transition-all"
              >
                Browse Catalogue
              </MagBtn>
            </motion.div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          >
            <motion.span
              className="text-[9px] uppercase tracking-[0.25em] text-white/30"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Scroll
            </motion.span>
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={16} className="text-white/30" />
            </motion.div>
          </motion.div>
        </section>

        {/* ── STATS BAR ────────────────────────────────────────────────────────── */}
        <section className="border-y border-white/[0.07] bg-black/50 backdrop-blur-md py-12 px-8 md:px-20">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 divide-x divide-white/[0.07]">
            {STATS.map((s, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: i * 0.12 }}
                  className={`flex flex-col items-center text-center ${i > 0 ? "pl-10" : ""}`}
                >
                  <span
                    className="text-5xl lg:text-6xl font-black text-[var(--brass)] mb-2 tabular-nums"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    <CountUp target={s.raw} suffix={s.suffix} delay={i * 0.12} />
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold">{s.label}</span>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── SERVICES ─────────────────────────────────────────────────────────── */}
        <section className="py-24 px-8 md:px-16 lg:px-20 max-w-[1400px] mx-auto">
          <FadeUp className="mb-16 max-w-2xl">
            <p className="text-[var(--brass)] text-[11px] font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
              <motion.span
                className="h-px bg-[var(--brass)]"
                initial={{ width: 0 }}
                whileInView={{ width: 24 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              />
              What We Do
            </p>
            <SplitHeading
              text="Everything Your Project Needs"
              className="text-4xl lg:text-5xl font-normal text-[#e3decb] leading-tight mb-4"
            />
            <motion.p
              className="text-white/40 text-[15px] leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Six integrated services built around the way architects, contractors, and homeowners actually work.
            </motion.p>
          </FadeUp>

          <div className="flex flex-col gap-6">
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.number} service={s} index={i} navigate={navigate} />
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
        <section className="py-24 px-8 md:px-20 bg-black/30 border-y border-white/[0.05]">
          <div className="max-w-6xl mx-auto">
            <FadeUp className="text-center mb-20">
              <p className="text-[var(--brass)] text-[11px] font-bold tracking-[0.3em] uppercase mb-4">The Process</p>
              <SplitHeading text="How Working With MMG Works" className="text-4xl lg:text-5xl font-normal text-[#e3decb]" />
            </FadeUp>

            {/* Desktop */}
            <div className="hidden md:grid grid-cols-4 gap-0 relative">
              {PROCESS_STEPS.map((step, i) => {
                const ref = useRef(null);
                const inView = useInView(ref, { once: true });
                return (
                  <motion.div
                    key={i}
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    className="flex flex-col items-center text-center px-6"
                  >
                    {/* Node + connectors */}
                    <div className="relative mb-8 flex items-center w-full justify-center">
                      {i > 0 && (
                        <div className="absolute right-1/2 top-1/2 -translate-y-1/2 w-1/2 pr-3">
                          <GrowLine horizontal delay={i * 0.15} />
                        </div>
                      )}
                      {/* Pulsing ring */}
                      <div className="relative z-10">
                        <motion.div
                          className="absolute inset-0 rounded-full border border-[var(--brass)]/30"
                          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
                        />
                        <motion.div
                          className="w-12 h-12 rounded-full border-2 border-[var(--brass)] bg-black/60 backdrop-blur-sm flex items-center justify-center"
                          whileHover={{ scale: 1.15, borderColor: "var(--brass-light)" }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="text-[11px] font-black text-[var(--brass)] tracking-wider">{step.step}</span>
                        </motion.div>
                      </div>
                      {i < PROCESS_STEPS.length - 1 && (
                        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-1/2 pl-3">
                          <GrowLine horizontal delay={i * 0.15 + 0.1} />
                        </div>
                      )}
                    </div>
                    <h3 className="text-[14px] font-bold text-[#e3decb] mb-3 uppercase tracking-[0.12em]">{step.title}</h3>
                    <p className="text-white/40 text-[13px] leading-relaxed">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile */}
            <div className="flex flex-col gap-0 md:hidden">
              {PROCESS_STEPS.map((step, i) => (
                <FadeUp key={i} delay={i * 0.1} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <motion.div
                        className="absolute inset-0 rounded-full border border-[var(--brass)]/30"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
                      />
                      <div className="w-10 h-10 rounded-full border-2 border-[var(--brass)] bg-black/60 flex items-center justify-center z-10 relative">
                        <span className="text-[10px] font-black text-[var(--brass)]">{step.step}</span>
                      </div>
                    </div>
                    {i < PROCESS_STEPS.length - 1 && <GrowLine delay={i * 0.1} />}
                  </div>
                  <div className="pb-10 pt-1">
                    <h3 className="text-[14px] font-bold text-[#e3decb] mb-2 uppercase tracking-widest">{step.title}</h3>
                    <p className="text-white/40 text-[13px] leading-relaxed">{step.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHO WE SERVE ─────────────────────────────────────────────────────── */}
        <section className="py-24 px-8 md:px-20">
          <div className="max-w-6xl mx-auto">
            <SlideIn className="mb-14">
              <p className="text-[var(--brass)] text-[11px] font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
                <motion.span className="h-px bg-[var(--brass)]" initial={{ width: 0 }} whileInView={{ width: 24 }} viewport={{ once: true }} transition={{ duration: 0.5 }} />
                Who We Serve
              </p>
              <SplitHeading text="Built for Every Builder" className="text-4xl lg:text-5xl font-normal text-[#e3decb] max-w-lg" />
            </SlideIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {WHO_WE_SERVE.map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="relative p-8 rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.03] to-transparent hover:border-[var(--brass)]/30 transition-colors duration-400 group cursor-default overflow-hidden"
                >
                  {/* Shimmer sweep on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--brass)]/[0.04] to-transparent skew-x-12 pointer-events-none"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.7 }}
                  />
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-[var(--brass)]/20 rounded-tr-2xl pointer-events-none" />

                  <motion.div
                    className="text-[var(--brass)] mb-5"
                    animate={{ rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
                  >
                    {w.icon}
                  </motion.div>
                  <h3 className="text-xl font-normal text-[#e3decb] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{w.title}</h3>
                  <p className="text-white/45 text-[13px] leading-relaxed mb-6">{w.desc}</p>
                  <ul className="space-y-2">
                    {w.points.map((pt, j) => (
                      <motion.li
                        key={j}
                        className="flex items-center gap-2.5 text-[12px] text-white/55"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.15 + j * 0.07 }}
                      >
                        <motion.div
                          className="w-1 h-1 rounded-full bg-[var(--brass)] shrink-0"
                          animate={{ scale: [1, 1.8, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: j * 0.3 + i * 0.5 }}
                        />
                        {pt}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DELIVERY COVERAGE ────────────────────────────────────────────────── */}
        <section className="py-24 px-8 md:px-20 bg-black/30 border-y border-white/[0.05]">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
            <SlideIn from="left" className="lg:w-1/2">
              <p className="text-[var(--brass)] text-[11px] font-bold tracking-[0.3em] uppercase mb-5 flex items-center gap-3">
                <motion.span className="h-px bg-[var(--brass)]" initial={{ width: 0 }} whileInView={{ width: 24 }} viewport={{ once: true }} transition={{ duration: 0.5 }} />
                Delivery Coverage
              </p>
              <SplitHeading text="We Deliver Across All of Ontario" className="text-4xl lg:text-5xl font-normal text-[#e3decb] leading-tight mb-6" />
              <p className="text-white/45 text-[15px] leading-relaxed mb-8">
                Our dedicated fleet handles deliveries province-wide with guaranteed 2–5 business day lead times. Palletised, tracked, and coordinated directly with your site.
              </p>
              <MagBtn
                onClick={() => navigate("#contact")}
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-bold text-[var(--brass)] hover:text-white transition-colors group/arrow"
              >
                Get a Delivery Quote
                <ArrowRight size={14} className="group-hover/arrow:translate-x-1 transition-transform" />
              </MagBtn>
            </SlideIn>

            <SlideIn from="right" delay={0.15} className="lg:w-1/2">
              <div className="flex flex-wrap gap-3">
                {DELIVERY_REGIONS.map((region, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.05, borderColor: "rgba(204,171,123,0.4)" }}
                    className="flex items-center gap-2 border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 rounded-full text-[12px] text-white/60 hover:text-white/90 transition-colors cursor-default"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
                    >
                      <MapPin size={11} className="text-[var(--brass)]" />
                    </motion.div>
                    {region}
                  </motion.div>
                ))}
              </div>
              <p className="mt-5 text-[11px] text-white/25 uppercase tracking-[0.15em]">+ surrounding regions on request</p>
            </SlideIn>
          </div>
        </section>

        {/* ── TRADE CTA ────────────────────────────────────────────────────────── */}
        <section className="py-28 px-8 md:px-20 relative overflow-hidden">
          {/* Animated rings */}
          {[100, 200, 300].map((size, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 right-24 -translate-y-1/2 rounded-full border border-[var(--brass)]/10 pointer-events-none"
              style={{ width: size, height: size }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            />
          ))}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--brass)]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--brass)]/20 to-transparent" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <FadeUp>
              <motion.p
                className="text-[var(--brass)] text-[11px] font-bold tracking-[0.3em] uppercase mb-6"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                Trade Professionals
              </motion.p>
              <h2
                className="text-5xl lg:text-6xl font-normal text-[#e3decb] leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Join 500+ Contractors<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brass)] to-[var(--brass-light)]">
                  Who Trust MMG
                </span>
              </h2>
              <p className="text-white/45 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
                Register for a trade account and unlock preferred pricing, net-30 terms, a dedicated account rep, and early access to new product lines.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <MagBtn
                  onClick={() => navigate("#contact")}
                  className="relative flex items-center gap-2 bg-[var(--brass)] text-black px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full overflow-hidden hover:shadow-[0_0_40px_rgba(204,171,123,0.5)] transition-shadow"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Apply for Trade Account <ArrowUpRight size={14} />
                  </span>
                  <motion.div
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 pointer-events-none"
                  />
                </MagBtn>
                <MagBtn
                  onClick={() => navigate("#brick")}
                  className="flex items-center gap-2 border border-white/20 text-white/70 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full hover:border-white/50 hover:text-white transition-all"
                >
                  Browse Full Catalogue
                </MagBtn>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
        <Footer />
      </div>{/* end z-10 wrapper */}
    </div>
  );
}
