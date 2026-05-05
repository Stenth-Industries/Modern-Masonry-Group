import { useRef, useState, useEffect } from "react";
import {
  motion, useInView, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence,
} from "framer-motion";
import {
  ArrowRight, ArrowUpRight, MapPin, Truck, Users, Building2, Layers, BookOpen,
  CheckCircle, Home, HardHat, Compass,
} from "lucide-react";
import Footer from "./Footer";

/* ── Animation Primitives ──────────────────────────────────────────────────── */

const FadeUp = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div ref={ref}
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

const SlideIn = ({ children, delay = 0, className = "", from = "left" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const x = from === "left" ? -60 : 60;
  return (
    <motion.div ref={ref}
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

const SplitHeading = ({ text, className = "", delay = 0, Tag = "h2", style }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <Tag ref={ref} className={className} style={style}>
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
      const current = isDecimal ? (ease * num).toFixed(1) : Math.round(ease * num).toString();
      setDisplay(prefix + current + suffix);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, suffix, delay]);
  return <span ref={ref}>{display}</span>;
}

function MagBtn({ children, className = "", onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 25 });
  const sy = useSpring(y, { stiffness: 300, damping: 25 });
  return (
    <motion.button ref={ref} style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - r.left - r.width / 2) * 0.3);
        y.set((e.clientY - r.top - r.height / 2) * 0.3);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick} whileTap={{ scale: 0.96 }} className={className}
    >
      {children}
    </motion.button>
  );
}

/* ── WipeReveal — brass overlay sweeps away to reveal content ─────────────── */

function WipeReveal({ children, className = "" }) {
  return (
    <div className={`relative overflow-hidden inline-block ${className}`}>
      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.2 }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{ hidden: { left: 0 }, visible: { left: "100%" } }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeIn" }}
        className="absolute top-0 bottom-0 left-0 right-0 bg-[var(--brass)] z-20 pointer-events-none"
      />
    </div>
  );
}

/* ── BrassMarquee — infinite scrolling credential strip ───────────────────── */

const MARQUEE_ITEMS = [
  { label: "Commercial Masonry", sub: "Industrial & Institutional" },
  { label: "Heritage Restoration", sub: "Authentic Tuckpointing" },
  { label: "Custom Home Facades", sub: "Luxury Residential" },
  { label: "Chimney Rebuilds", sub: "Structural & Weathertight" },
  { label: "Brick Replacement", sub: "Seamless Mortar Matching" },
  { label: "Licensed & Insured", sub: "WSIB Compliant" },
  { label: "30 Years", sub: "In the Craft" },
  { label: "Free Site Estimates", sub: "No Obligation" },
];

function BrassMarquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div
      className="relative overflow-hidden py-[18px] border-y border-white/[0.055]"
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
      }}
    >
      <motion.div
        className="flex whitespace-nowrap items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center shrink-0">
            {/* Item */}
            <div className="flex items-baseline gap-2.5 px-9">
              <span
                className="text-[15px] font-medium tracking-wide text-[var(--brass)]/80"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
              >
                {item.label}
              </span>
              <span className="text-[9px] uppercase tracking-[0.18em] text-white/28 font-semibold">
                {item.sub}
              </span>
            </div>
            {/* Separator */}
            <span className="text-[var(--brass)]/22 text-[7px] shrink-0">◆</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ── EditorialStat ─────────────────────────────────────────────────────────── */

function EditorialStat({ s, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.1 + i * 0.11, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col"
    >
      <span
        className="text-[2.8rem] lg:text-[3.4rem] font-medium leading-none mb-2 tabular-nums text-[var(--brass)]"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        <CountUp target={s.raw} suffix={s.suffix} delay={0.1 + i * 0.11} />
      </span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/38 font-semibold leading-snug max-w-[14ch]">
        {s.label}
      </span>
    </motion.div>
  );
}

/* ── Data ──────────────────────────────────────────────────────────────────── */

const SERVICES = [
  {
    number: "01", icon: <Layers size={20} />, tag: "Structural Integrity",
    title: "Commercial Masonry",
    headline: "The Backbone of Commercial Infrastructure",
    description: "Delivering uncompromising structural integrity for commercial, industrial, and institutional builds. From load-bearing concrete block to complex elevator shafts, our commercial division operates with a 'Safety First' protocol, minimizing downtime.",
    bullets: ["Load-bearing CMU block construction", "Elevator shafts and firewalls", "Helical pier installation & foundation support", "Rigorous commercial safety compliance"],
    cta: "View Commercial Work", ctaHash: "#gallery",
    image: "/service_commercial_v2_1777628509240.png"
  },
  {
    number: "02", icon: <Home size={20} />, tag: "Luxury Residential",
    title: "Custom Home Masonry",
    headline: "Architectural Grandeur for Custom Builds",
    description: "Specializing in high-end residential estates, we bring precision and heritage craftsmanship to every facade. We strictly adhere to the '8-Inch Grade Rule' to prevent brick spalling and ensure long-term structural integrity against harsh Ontario winters.",
    bullets: ["Bespoke natural stone and brick facades", "Intricate archways and custom masonry details", "Strict adherence to the 8-Inch Grade Rule", "Collaborative design with top architects"],
    cta: "View Custom Homes", ctaHash: "#gallery",
    image: "/iphone_custom_home_1777629296215.png"
  },
  {
    number: "03", icon: <Building2 size={20} />, tag: "Volume Execution",
    title: "Residential Masonry Work",
    headline: "High-Volume Execution for Suburban Developments",
    description: "Built for scale, our residential division is structured to handle massive suburban developments. We provide consistent quality, rigorous safety standards, and reliable supply chains to keep large-scale projects on schedule.",
    bullets: ["Volume-focused masonry deployment", "Consistent aesthetic matching across phases", "Dedicated on-site project management", "Optimized for rapid subdivision scaling"],
    cta: "Discuss Volume Projects", ctaHash: "#contact",
    image: "/service_subdivision_v2_1777628495742.png"
  },
  {
    number: "04", icon: <Compass size={20} />, tag: "Vertical Structures",
    title: "Chimney Repair & Restoration",
    headline: "Engineered Chimney Solutions",
    description: "Expert repair and complete rebuilding of residential and commercial chimneys. We ensure structural integrity, proper drafting, and weather-tight sealing to protect your property from water damage and structural failure.",
    bullets: ["Complete chimney rebuilds", "Flue liner replacement", "Crown repair and waterproofing", "Drafting optimization"],
    cta: "Request Chimney Inspection", ctaHash: "#contact",
    image: "/iphone_chimney_1777629333800.png"
  },
  {
    number: "05", icon: <CheckCircle size={20} />, tag: "Seamless Integration",
    title: "Brick Replacement & Repair",
    headline: "Precision Brick Matching and Replacement",
    description: "Seamlessly replacing damaged or spalled bricks to match the existing facade perfectly. Our extensive inventory and tinting techniques ensure that repaired sections blend flawlessly into the original structure.",
    bullets: ["Spalled brick removal", "Custom mortar matching", "Structural brick replacement", "Weatherproofing treatments"],
    cta: "Get a Repair Quote", ctaHash: "#contact",
    image: "/iphone_brick_replacement_1777629347653.png"
  },
  {
    number: "06", icon: <HardHat size={20} />, tag: "Comprehensive Care",
    title: "General Masonry Repairs",
    headline: "Maintaining Structural and Aesthetic Integrity",
    description: "From fixing cracked mortar joints to repairing damaged stone pathways, our general repair services cover all aspects of masonry maintenance. We address small issues before they become major structural problems.",
    bullets: ["Mortar joint repointing", "Stone pathway repairs", "Step and porch rebuilding", "Foundation parging"],
    cta: "Schedule Maintenance", ctaHash: "#contact",
    image: "/iphone_general_repairs_1777629360789.png"
  },
  {
    number: "07", icon: <Compass size={20} />, tag: "Authentic Preservation",
    title: "Masonry Restoration Services",
    headline: "Preserving History and Architectural Heritage",
    description: "Expert restoration services dedicated to maintaining the architectural integrity of historical structures. We employ meticulous mortar matching and traditional tuckpointing techniques to seamlessly repair and revitalize authentic masonry.",
    bullets: ["Precision mortar matching & tinting", "Traditional tuckpointing techniques", "Non-destructive masonry cleaning", "Authentic historic brick repair"],
    cta: "Request Restoration Assessment", ctaHash: "#contact",
    image: "/iphone_restoration_1777629380946.png"
  },
];

const CATEGORIES = [
  "Brick", "Natural Stone", "CMU Block", "Architectural Masonry", "Mortar & Adhesives",
  "Waterproofing", "Pavers & Hardscape", "Restoration Materials", "Lintels & Anchors",
  "Prefabricated Products", "Thin Veneer", "Retaining Wall Systems",
];

const JOURNEY = [
  {
    num: "01", phase: "Select", subhead: "Online or In-Person",
    headline: "If it's masonry, we carry it.",
    body: "Browse Ontario's most complete collection — over 10,000 products across brick, natural stone, CMU block, and architectural masonry. Can't decide from a screen? Walk our showroom, hold the material, and know before you commit.",
    options: [
      { label: "Online Catalogue", note: "10,000+ SKUs filterable by material, colour, and application" },
      { label: "In-House Showroom", note: "See and compare in person — experts on the floor for every question" },
    ],
  },
  {
    num: "02", phase: "Consult", subhead: "Online & Offline Expert",
    headline: "One rep. Every call, every spec, every order.",
    body: "A masonry expert is assigned to you from day one. They know your project, your budget, and your timeline — and they work directly with your architects and builders so nothing gets lost.",
    points: ["Dedicated rep for every project", "Architect & builder collaboration", "Technical spec & compatibility checks", "Available online and on-site"],
  },
  {
    num: "03", phase: "Deliver", subhead: "Free · 2–5 Business Days",
    headline: "Your materials, on-site when you need them.",
    body: "Every order ships directly to your project site — handled carefully, delivered complete. No damaged material, no short deliveries, no schedule disruptions. Your timeline stays yours.",
    points: ["Free project-site delivery", "2–5 business day lead time", "Full-order fulfilment — no shorts", "Careful handling on every run"],
  },
  {
    num: "04", phase: "Build", subhead: "Installation · Maintenance · Repairs",
    headline: "Need it installed? We handle that too.",
    body: "One partner, every phase. Professional installation, preventive maintenance, and repair services complete the picture — from material selection through the life of your build.",
    points: ["Professional masonry installation", "Preventive maintenance programs", "Repair & restoration services", "End-to-end project support"],
  },
];

const WHO_WE_SERVE = [
  {
    icon: <Home size={28} />, title: "Homeowners",
    desc: "Whether it's a chimney rebuild, brick replacement, or a new stone feature — we bring 30 years of hands-on masonry experience to your home with transparent pricing and a workmanship warranty.",
    points: ["Free on-site consultation", "Fixed written quotes", "Workmanship warranty"],
  },
  {
    icon: <HardHat size={28} />, title: "Contractors & Builders",
    desc: "A reliable masonry subcontractor who shows up, works to spec, and keeps pace with your schedule. We handle residential and commercial masonry scopes of any volume across Ontario.",
    points: ["Volume project capacity", "On-schedule execution", "Trade-friendly coordination"],
  },
  {
    icon: <Compass size={28} />, title: "Architects & Designers",
    desc: "We execute complex masonry details with precision — bespoke stonework, heritage restoration, intricate archways, and material matching that holds up to your specifications.",
    points: ["Complex detail execution", "Heritage restoration expertise", "Specification support"],
  },
];

const STATS = [
  { value: "30+", raw: "30", suffix: "+", label: "Years of Experience" },
  { value: "1k+", raw: "1", suffix: "k+", label: "Projects Completed" },
  { value: "8", raw: "8", suffix: "", label: "Ontario Regions Served" },
  { value: "2yr", raw: "2", suffix: "yr", label: "Workmanship Warranty" },
];

const DELIVERY_REGIONS = [
  "Greater Toronto Area", "Ottawa & Eastern Ontario", "Hamilton & Niagara", "Kitchener-Waterloo",
  "London & Southwest Ontario", "Barrie & Simcoe County", "Sudbury & Northern Ontario", "Peterborough & Kawarthas",
];

const TESTIMONIALS = [
  {
    quote: "MMG rebuilt our chimney after two other contractors failed to stop the leak. Clean work, honest pricing, and they left the site spotless. Two winters later — not a drop.",
    author: "Patricia V.", role: "Homeowner", firm: "Oakville, ON",
  },
  {
    quote: "We used MMG as our masonry subcontractor across a 60-unit townhome development in Brampton. Consistent quality, no schedule delays, and a professional crew on site every day.",
    author: "Marco T.", role: "Project Manager", firm: "Lakeside Build Corp",
  },
  {
    quote: "The stone and brick detailing on our custom home project was executed exactly to spec. They understand architectural drawings and deliver without hand-holding.",
    author: "Elaine S.", role: "Principal Architect", firm: "Saunders + Reid Architecture",
  },
];

const FAQS = [
  {
    question: "Do you provide free estimates?",
    answer: "Yes. We offer free on-site consultations and written quotes for all residential and commercial masonry projects. There's no obligation — we'll walk you through exactly what the work involves before any commitment is made.",
  },
  {
    question: "What areas of Ontario do you serve?",
    answer: "We operate across the Greater Toronto Area and surrounding Ontario regions including Hamilton, Niagara, Kitchener-Waterloo, Barrie, Ottawa, Peterborough, and more. Contact us to confirm coverage for your specific location.",
  },
  {
    question: "Are you licensed and insured?",
    answer: "Yes. MMG is fully licensed for masonry work in Ontario and carries comprehensive liability insurance and WSIB coverage. Certificates of insurance are available on request for contractors and developers.",
  },
  {
    question: "How long does a typical project take?",
    answer: "It depends on scope. A chimney rebuild typically takes 1–2 days. Brick replacement or repointing on a full facade may take 1–2 weeks. Commercial masonry scopes are scheduled in phases with milestone timelines included in your quote.",
  },
];


/* ── Category Row ──────────────────────────────────────────────────────────── */

function CategoryRow({ cat, index }) {
  return (
    <motion.div
      className="group relative flex items-center py-[11px] border-b border-white/[0.05] cursor-default overflow-hidden"
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.36, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 bg-[var(--brass)]/[0.07] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-200 ease-out" />
      <span className="relative z-10 text-[8px] font-bold text-[var(--brass)]/20 tracking-widest w-7 shrink-0 group-hover:text-[var(--brass)]/50 transition-colors">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative z-10 flex-1 h-px bg-white/[0.04] group-hover:bg-[var(--brass)]/18 transition-colors mx-4" />
      <span className="relative z-10 text-[13.5px] font-medium text-white/45 group-hover:text-[var(--brass)] transition-colors shrink-0 tracking-wide">
        {cat}
      </span>
    </motion.div>
  );
}

/* ── Journey Step ──────────────────────────────────────────────────────────── */

function JourneyStep({ step, index, navigate }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const badge = (
    <motion.div className="flex items-center gap-3 mb-7"
      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.4, delay: 0.1 }}>
      <span className="text-[8.5px] font-bold tracking-[0.32em] text-[var(--brass)]/30">{step.num}</span>
      <span className="h-px w-8 bg-[var(--brass)]/18" />
      <span className="text-[8.5px] font-bold tracking-[0.32em] text-[var(--brass)] uppercase">{step.phase}</span>
      <span className="text-[8.5px] tracking-[0.18em] text-white/18 uppercase">{step.subhead}</span>
    </motion.div>
  );

  const hed = (
    <motion.h3
      className="text-4xl lg:text-5xl xl:text-[3.5rem] font-black tracking-tight leading-[0.96] mb-6"
      initial={{ opacity: 0, y: 22 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}>
      {step.headline}
    </motion.h3>
  );

  const bod = (
    <motion.p className="text-white/46 text-[15px] leading-[1.9]"
      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.26 }}>
      {step.body}
    </motion.p>
  );

  return (
    <div ref={ref} className="relative overflow-hidden border-b border-white/[0.05] last:border-b-0 py-24 lg:py-32">

      {/* Giant watermark number — alternates sides */}
      <span className="absolute top-1/2 -translate-y-1/2 select-none pointer-events-none leading-none font-medium"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(160px, 22vw, 300px)",
          color: "transparent",
          WebkitTextStroke: "1px rgba(201,164,73,0.05)",
          ...(index % 2 === 0 ? { right: "-0.03em" } : { left: "-0.03em" }),
        }}>
        {step.num}
      </span>

      <div className="max-w-7xl mx-auto px-8 md:px-20 lg:px-24 xl:px-32 relative z-10">

        {/* ── 01 SELECT: text left, two tall option cards right ── */}
        {index === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-14 xl:gap-20 items-center">
            <div>{badge}{hed}{bod}</div>
            <div className="flex flex-col gap-4">
              {step.options.map((opt, i) => (
                <motion.button key={i}
                  onClick={() => navigate(i === 0 ? "#brick" : "#contact")}
                  initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.28 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -3 }}
                  className="group relative text-left p-8 lg:p-9 border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.02] hover:border-[var(--brass)]/35 transition-all duration-300 shadow-[0_4px_40px_rgba(0,0,0,0.25)]">
                  <motion.div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--brass)]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <span className="text-[8.5px] font-bold tracking-[0.3em] text-[var(--brass)]/30 uppercase">Option 0{i + 1}</span>
                    <ArrowUpRight size={14} className="text-[var(--brass)]/28 group-hover:text-[var(--brass)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-200" />
                  </div>
                  <h4 className="text-[1.3rem] font-bold mb-3 tracking-tight relative z-10 text-[#ede6d6] group-hover:text-white transition-colors">{opt.label}</h4>
                  <p className="text-[12.5px] text-white/33 leading-relaxed relative z-10 group-hover:text-white/52 transition-colors">{opt.note}</p>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* ── 02 CONSULT: text left, rep card right ── */}
        {index === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-center">
            <div>{badge}{hed}{bod}</div>
            <motion.div
              initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="border border-white/[0.08] rounded-2xl p-7 lg:p-9 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brass)] opacity-55" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brass)]" />
                </div>
                <span className="text-[8.5px] font-bold tracking-[0.25em] text-[var(--brass)]/58 uppercase">Dedicated Rep · Assigned to You</span>
              </div>
              <p className="leading-snug mb-8 text-white/72"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.25rem" }}>
                "From the first call to the final delivery — one person, one number."
              </p>
              <ul className="space-y-4 mb-8">
                {step.points.map((pt, i) => (
                  <motion.li key={i} className="flex items-center gap-3 text-[13.5px] text-white/52"
                    initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.35, delay: 0.46 + i * 0.08 }}>
                    <CheckCircle size={12} className="text-[var(--brass)] shrink-0" />
                    {pt}
                  </motion.li>
                ))}
              </ul>
              <motion.button onClick={() => navigate("#contact")}
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.76 }}
                className="w-full py-4 border border-[var(--brass)]/25 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--brass)] hover:bg-[var(--brass)]/[0.08] hover:border-[var(--brass)]/50 transition-all duration-300 rounded-xl">
                Request a Consultation
              </motion.button>
            </motion.div>
          </div>
        )}

        {/* ── 03 DELIVER: text + bullets left, giant "2–5" right ── */}
        {index === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-center">
            <div>
              {badge}{hed}{bod}
              <motion.ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-8"
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.38 }}>
                {step.points.map((pt, i) => (
                  <li key={i} className="flex items-center gap-3 text-[13px] text-white/50">
                    <span className="w-1 h-1 rounded-full bg-[var(--brass)] shrink-0" />
                    {pt}
                  </li>
                ))}
              </motion.ul>
            </div>
            <motion.div className="flex flex-col items-center lg:items-end"
              initial={{ opacity: 0, scale: 0.88 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
              <span className="font-medium leading-none text-transparent tabular-nums"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(72px, 13vw, 160px)",
                  WebkitTextStroke: "1.5px rgba(201,164,73,0.55)",
                }}>
                2–5
              </span>
              <div className="text-right mt-3">
                <p className="text-[10.5px] uppercase tracking-[0.22em] text-white/30 font-semibold">Business days</p>
                <p className="text-[10.5px] uppercase tracking-[0.22em] text-[var(--brass)]/55 font-bold mt-0.5">Free · to your site</p>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── 04 BUILD: text left, animated checklist right ── */}
        {index === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-center">
            <div>{badge}{hed}{bod}</div>
            <div>
              <div className="space-y-0">
                {step.points.map((pt, i) => (
                  <motion.div key={i}
                    className="flex items-center gap-5 py-5 border-b border-white/[0.06] last:border-b-0"
                    initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.26 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}>
                    <motion.div
                      className="w-8 h-8 rounded-full border border-[var(--brass)]/32 flex items-center justify-center shrink-0 bg-[var(--brass)]/[0.04]"
                      initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
                      transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.32 + i * 0.1 }}>
                      <CheckCircle size={13} className="text-[var(--brass)]" />
                    </motion.div>
                    <span className="text-[15px] font-medium text-white/65">{pt}</span>
                  </motion.div>
                ))}
              </div>
              <motion.button onClick={() => navigate("#contact")}
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.78 }}
                className="group mt-9 inline-flex items-center gap-2.5 bg-[var(--brass)] text-black px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] hover:shadow-[0_0_30px_rgba(201,164,73,0.35)] transition-shadow">
                Start Your Project <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ── Who We Serve Card ─────────────────────────────────────────────────────── */

function WhoWeServeCard({ w, i }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springCfg = { stiffness: 300, damping: 30 };
  const mxS = useSpring(x, springCfg);
  const myS = useSpring(y, springCfg);
  const rotateX = useTransform(myS, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mxS, [-0.5, 0.5], ["-6deg", "6deg"]);
  const glare = useTransform(() =>
    `radial-gradient(circle at ${(x.get() + 0.5) * 100}% ${(y.get() + 0.5) * 100}%, rgba(204,171,123,0.15), transparent 60%)`
  );

  return (
    <motion.div ref={ref} style={{ perspective: 1200 }}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 w-full h-full"
    >
      <motion.div
        onMouseMove={(e) => {
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          x.set((e.clientX - r.left) / r.width - 0.5);
          y.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative p-8 rounded-2xl border border-white/[0.07] bg-black/40 backdrop-blur-md hover:border-[var(--brass)]/40 transition-colors duration-400 group cursor-default shadow-xl h-full flex flex-col overflow-hidden"
      >
        <motion.div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen"
          style={{ background: glare }} />
        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--brass)]/[0.04] to-transparent skew-x-12 pointer-events-none overflow-hidden rounded-2xl"
          initial={{ x: "-100%" }} whileHover={{ x: "200%" }} transition={{ duration: 0.8 }} />
        <div style={{ transform: "translateZ(45px)", transformStyle: "preserve-3d" }} className="flex-1 flex flex-col pointer-events-none">
          <div className="absolute top-[-8px] right-[-8px] w-12 h-12 border-t-[1.5px] border-r-[1.5px] border-[var(--brass)]/30 rounded-tr-xl pointer-events-none" />
          <motion.div className="text-[var(--brass)] mb-6 mt-2"
            animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}>
            {w.icon}
          </motion.div>
          <h3 className="text-2xl font-bold mb-4">{w.title}</h3>
          <p className="text-[14px] text-white/65 leading-relaxed mb-8 flex-1">{w.desc}</p>
          <ul className="space-y-3">
            {w.points.map((pt, j) => (
              <li key={j} className="flex items-center gap-3 text-[13px] text-white/70">
                <motion.div className="w-1.5 h-1.5 rounded-full shrink-0"
                  animate={{ scale: [1, 1.5, 1], backgroundColor: ["rgba(204,171,123,0.4)", "rgba(204,171,123,1)", "rgba(204,171,123,0.4)"] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: j * 0.4 + i * 0.6 }} />
                {pt}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── FAQ Item ──────────────────────────────────────────────────────────────── */

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border-b border-white/[0.08]"
    >
      <button onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left focus:outline-none group">
        <span className={`text-[16px] font-bold transition-colors duration-300 ${isOpen ? "text-[var(--brass)]" : "text-[#ede6d6] group-hover:text-white"}`}>
          {faq.question}
        </span>
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:bg-[var(--brass)]/10 transition-colors">
          <span className="text-[var(--brass)] text-[20px] font-light leading-none">+</span>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="overflow-hidden">
            <p className="pb-6 text-white/68 text-[15px] leading-relaxed pr-10">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── CTA Section ───────────────────────────────────────────────────────────── */

const PROJECT_TYPES = [
  { num: "01", title: "Residential", desc: "Homeowners & custom home builders" },
  { num: "02", title: "Commercial", desc: "Contractors, developers & GC's" },
  { num: "03", title: "Heritage", desc: "Restoration & conservation projects" },
];

function CTASection({ navigate }) {
  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useSpring(mouseX, { damping: 20, stiffness: 80 });
  const spotY = useSpring(mouseY, { damping: 20, stiffness: 80 });
  const spotBg = useTransform(
    [spotX, spotY],
    ([x, y]) => `radial-gradient(680px circle at ${x}px ${y}px, rgba(201,164,73,0.09), transparent 65%)`
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const handle = (e) => {
      const r = el.getBoundingClientRect();
      mouseX.set(e.clientX - r.left);
      mouseY.set(e.clientY - r.top);
    };
    el.addEventListener("mousemove", handle);
    return () => el.removeEventListener("mousemove", handle);
  }, [mouseX, mouseY]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-t border-white/[0.055]">

      {/* Mouse-tracked spotlight */}
      <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ background: spotBg }} />

      {/* Ambient fixed glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_15%_50%,rgba(201,164,73,0.055),transparent)] pointer-events-none" />

      {/* Corner markers */}
      {[["top-7 left-8", "top-7 right-8"], ["bottom-7 left-8", "bottom-7 right-8"]].flat().map((pos, i) => (
        <span key={i} className={`absolute ${pos} text-[var(--brass)]/18 text-xl font-extralight pointer-events-none select-none leading-none`}>+</span>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-20 lg:px-24 xl:px-32 py-28 lg:py-36
                      grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-28 items-center">

        {/* ── Left: headline + buttons ── */}
        <div>
          {/* Live status dot */}
          <div className="flex items-center gap-3 mb-9">
            <div className="relative flex h-2 w-2 shrink-0">


            </div>
            <span className="text-[9px] uppercase tracking-[0.28em] font-bold text-[var(--brass)]/60">
              Accepting New Projects — Ontario &amp; GTA
            </span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl lg:text-[4.5rem] font-medium leading-[0.93] tracking-tight mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
          >
            Start with a<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brass)] to-[var(--brass-light)] not-italic">
              conversation.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="text-white/50 text-[15px] leading-[1.85] mb-10 max-w-[400px]"
          >
            We come to your site, assess the scope, and give you a clear written quote.
            No pressure, no obligation — just straight answers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <MagBtn onClick={() => navigate("#contact")}
              className="relative flex items-center gap-2 bg-[var(--brass)] text-black px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] overflow-hidden hover:shadow-[0_0_40px_rgba(204,171,123,0.4)] transition-shadow">
              <span className="relative z-10 flex items-center gap-2">Get a Free Quote <ArrowUpRight size={12} /></span>
              <motion.div animate={{ x: ["100%", "-100%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/28 to-transparent skew-x-12 pointer-events-none" />
            </MagBtn>
            <MagBtn onClick={() => navigate("#gallery")}
              className="group flex items-center gap-2 border border-white/18 text-white/55 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] hover:border-[var(--brass)]/40 hover:text-[var(--brass)] transition-all duration-300">
              View Our Work
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </MagBtn>
          </motion.div>
        </div>

        {/* ── Right: project-type tiles ── */}
        <div>
          <p className="text-[9px] uppercase tracking-[0.25em] text-white/28 font-semibold mb-5">
            What kind of project?
          </p>

          <div className="flex flex-col">
            {PROJECT_TYPES.map((pt, i) => (
              <motion.button
                key={i}
                onClick={() => navigate("#contact")}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.11, ease: [0.22, 1, 0.36, 1] }}
                className="group flex items-center justify-between py-6 border-b border-white/[0.06] last:border-b-0 text-left hover:border-[var(--brass)]/25 transition-colors duration-300 w-full"
              >
                <div className="flex items-start gap-5">
                  <span
                    className="text-[10px] font-bold text-[var(--brass)]/30 tracking-widest mt-0.5 shrink-0 group-hover:text-[var(--brass)]/60 transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {pt.num}
                  </span>
                  <div>
                    <p className="text-[17px] font-bold text-[#ede6d6]/80 group-hover:text-white transition-colors mb-0.5 tracking-tight">
                      {pt.title}
                    </p>
                    <p className="text-[12px] text-white/32 group-hover:text-white/50 transition-colors">
                      {pt.desc}
                    </p>
                  </div>
                </div>
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="text-[var(--brass)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-6"
                >
                  <ArrowUpRight size={15} />
                </motion.span>
              </motion.button>
            ))}
          </div>

          <p className="text-[9.5px] text-white/22 uppercase tracking-[0.16em] mt-6">
            Free on-site consultation · No obligation
          </p>
        </div>

      </div>
    </section>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────────────── */

export default function Services({ navigate }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const globalBgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const springProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="min-h-screen text-white font-sans relative">

      {/* Scroll progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--brass)] to-[var(--brass-light)] z-[100] origin-left"
        style={{ scaleX: springProgress }} />

      {/* Global background */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-[var(--obsidian)]">
        <motion.div className="absolute inset-0 bg-cover bg-center h-[115%] w-full pointer-events-none mix-blend-luminosity opacity-40"
          style={{ backgroundImage: "url('/bg.png')", y: globalBgY }} />
      </div>
      <div className="fixed inset-0 z-0 bg-black/40 pointer-events-none" />

      <div className="relative z-10">

        {/* ── HERO ────────────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen w-full overflow-hidden">
          {/* Hero image — slow ken-burns zoom on mount */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/service_hero.png')" }}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Layered overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/65 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_60%,rgba(201,164,73,0.16),transparent_42%)] pointer-events-none"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Ambient floating orb */}
          <motion.div
            className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(201,164,73,0.05) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div style={{ willChange: "transform, opacity" }} className="px-8 md:px-20 z-10 relative w-full max-w-7xl pt-[18vh]">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6 text-white uppercase drop-shadow-2xl">
              <div className="flex gap-[0.25em] flex-wrap">
                {["Masonry", "Services"].map((w, i) => (
                  <div key={i} className="overflow-hidden pb-2">
                    <motion.span
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                      className="block"
                    >
                      {w}
                    </motion.span>
                  </div>
                ))}
              </div>
              <div className="overflow-hidden pb-2">
                <motion.div
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brass)] to-[var(--brass-light)]"
                >
                  Built Right.
                </motion.div>
              </div>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="text-sm sm:text-base md:text-xl lg:text-2xl text-[var(--limestone)] font-light max-w-2xl mb-8 md:mb-10 leading-relaxed"
            >
              One of Ontario’s most complete masonry suppliers — offering 10,000+ products, expert material guidance, and reliable fleet delivery directly to your site. We support contractors and homeowners from product selection through to project completion, ensuring the right materials are chosen and delivered on time. Everything you need under one roof.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1 }}
              className="flex flex-wrap gap-4"
            >
              <MagBtn onClick={() => navigate("#contact")}
                className="bg-[var(--brass)] text-black px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[var(--brass-light)] transition-colors flex items-center gap-2">
                Get a Free Quote <ArrowRight size={16} />
              </MagBtn>
              <MagBtn onClick={() => navigate("#gallery")}
                className="group relative overflow-hidden bg-transparent backdrop-blur-sm border border-[var(--brass)]/50 text-[var(--brass)] px-8 py-4 text-sm font-bold uppercase tracking-wider hover:border-[var(--brass)] hover:text-black transition-all duration-300 flex items-center gap-2">
                <span className="relative z-10 flex items-center gap-2">View Our Work <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" /></span>
                <span className="absolute inset-0 bg-[var(--brass)] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              </MagBtn>
            </motion.div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <motion.div
              className="flex flex-col items-center gap-1.5"
              animate={{ y: [0, 8, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-[1px] h-10 bg-gradient-to-b from-transparent to-[var(--brass)]/38" />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--brass)]/38" />
            </motion.div>
          </motion.div>
        </section>

        {/* ── PROOF STRIP ─────────────────────────────────────────────────────── */}
        <section className="px-8 md:px-20 lg:px-24 xl:px-32 py-20 border-b border-white/[0.055]">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-0 items-start lg:items-center">

            {/* Left: editorial statement */}
            <div className="lg:w-[38%] lg:pr-16 lg:border-r lg:border-white/[0.06] shrink-0">
              <motion.p
                className="text-[var(--brass)] text-m font-bold tracking-widest mb-2 uppercase"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
              >
                Established 1994
              </motion.p>
              <motion.h2
                className="text-[1.9rem] lg:text-4xl font-medium leading-[1.1] tracking-tight text-[#ede6d6]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                Thirty years of masonry,<br />built across Ontario.
              </motion.h2>
              <motion.div
                className="w-8 h-px bg-[var(--brass)]/35 mt-6"
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                style={{ originX: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.3 }}
              />
            </div>

            {/* Right: stats */}
            <div className="lg:flex-1 lg:pl-16 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
              {STATS.map((s, i) => <EditorialStat key={i} s={s} i={i} />)}
            </div>

          </div>
        </section>

        {/* ── MARQUEE ─────────────────────────────────────────────────────────── */}
        <BrassMarquee />

        {/* ── COLLECTION SHOWCASE ─────────────────────────────────────────────── */}
        <section className="py-28 px-8 md:px-20 lg:px-24 xl:px-32 border-b border-white/[0.05] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(201,164,73,0.065),transparent_65%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">

            {/* Headline row */}
            <FadeUp className="mb-16">
              <WipeReveal className="mb-5">
                <p className="text-[var(--brass)] text-[9px] uppercase tracking-[0.3em] font-bold">What Defines Us</p>
              </WipeReveal>
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                <div>
                  <SplitHeading
                    text="Ontario's Most Complete Masonry Collection."
                    className="text-4xl md:text-5xl lg:text-[3.4rem] font-black tracking-tight leading-[1.0] max-w-3xl mb-5"
                    style={{}}
                  />
                  <p className="text-white/50 text-[15px] leading-relaxed max-w-xl">
                    MMG provides their Exclusive Clients with two options to browse through selection of over 10,000+ products spanning every material, every application, every budget — curated by professionals, for professionals.
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span
                    className="block text-[5rem] lg:text-[6.5rem] font-medium leading-none text-transparent tabular-nums"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      WebkitTextStroke: "1px rgba(201,164,73,0.35)",
                    }}
                  >
                    10k+
                  </span>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-white/30 font-semibold mt-1">SKUs in Stock</p>
                </div>
              </div>
            </FadeUp>

            {/* Category chips */}
            <div className="flex flex-wrap gap-2.5 mb-16">
              {CATEGORIES.map((cat, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.32, delay: i * 0.04 }}
                  className="px-4 py-2 border border-white/[0.09] bg-white/[0.025] rounded-full text-[11px] text-white/45 tracking-wide cursor-default hover:border-[var(--brass)]/30 hover:text-white/70 transition-all duration-300"
                >
                  {cat}
                </motion.span>
              ))}
            </div>

            {/* Two access paths */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => navigate("#brick")}
                className="group relative p-8 lg:p-10 border border-white/[0.08] bg-gradient-to-br from-white/[0.025] to-transparent rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-400 cursor-pointer"
              >
                <motion.div className="absolute inset-0 rounded-2xl bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
                <p className="text-[9px] uppercase tracking-[0.28em] text-[var(--brass)]/50 font-bold mb-4">Option 01</p>
                <h3 className="text-[1.55rem] font-bold mb-3 tracking-tight">Browse Online</h3>
                <p className="text-white/45 text-[14px] leading-relaxed mb-7">
                  Filter by Manufacturers, Material, Colour, and Application. 10,000+ SKUs, searchable and ready to quote.
                </p>
                <span className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.2em] font-bold text-[var(--brass)] group-hover:text-white transition-colors duration-300">
                  Open Catalogue <ArrowUpRight size={12} />
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => navigate("#contact")}
                className="group relative p-8 lg:p-10 border border-[var(--brass)]/22 bg-gradient-to-br from-[var(--brass)]/[0.04] to-transparent rounded-2xl overflow-hidden hover:border-[var(--brass)]/40 transition-all duration-400 cursor-pointer"
              >
                <motion.div className="absolute inset-0 rounded-2xl bg-[var(--brass)]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
                <p className="text-[9px] uppercase tracking-[0.28em] text-[var(--brass)]/50 font-bold mb-4">Option 02</p>
                <h3 className="text-[1.55rem] font-bold mb-3 tracking-tight">Visit the Showroom</h3>
                <p className="text-white/45 text-[14px] leading-relaxed mb-7">
                  Touch it, compare it, hold it. Our in-house experts are on the floor to guide every decision.
                </p>
                <span className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.2em] font-bold text-[var(--brass)] group-hover:text-white transition-colors duration-300">
                  Book a Visit <ArrowUpRight size={12} />
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── JOURNEY ─────────────────────────────────────────────────────────── */}
        <section className="py-28 px-8 md:px-20 lg:px-24 xl:px-32">
          <div className="max-w-7xl mx-auto">

            <FadeUp className="mb-20">
              <WipeReveal className="mb-4">
                <p className="text-[var(--brass)] text-[9px] uppercase tracking-[0.3em] font-bold">The Experience</p>
              </WipeReveal>
              <SplitHeading
                text="From First Look to Finished Build."
                className="text-4xl md:text-5xl font-black tracking-tight leading-tight max-w-2xl"
                style={{}}
              />
            </FadeUp>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical brass thread */}
              <motion.div
                className="absolute left-[9px] top-3 w-px bg-gradient-to-b from-[var(--brass)]/35 via-[var(--brass)]/15 to-transparent"
                initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
                style={{ originY: 0, bottom: "5rem" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
              <div className="flex flex-col">
                {JOURNEY.map((step, i) => <JourneyStep key={i} step={step} index={i} />)}
              </div>
            </div>
          </div>
        </section>

        {/* ── WHO WE SERVE ────────────────────────────────────────────────────── */}
        <section className="py-24 px-8 md:px-20 lg:px-24 xl:px-32">
          <div className="max-w-7xl mx-auto">
            <SlideIn className="mb-14">
              <WipeReveal className="mb-4">
                <p className="text-[var(--brass)] text-base font-bold tracking-widest uppercase">
                  Who We Serve
                </p>
              </WipeReveal>
              <SplitHeading text="Built for Every Builder"
                className="text-4xl font-bold tracking-tight max-w-lg"
                style={{}} />
            </SlideIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10" style={{ perspective: 1000 }}>
              {WHO_WE_SERVE.map((w, i) => <WhoWeServeCard key={i} w={w} i={i} />)}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
        <section className="py-24 px-8 md:px-20 lg:px-24 xl:px-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,164,73,0.06),transparent_60%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <FadeUp delay={0.1} className="mb-16">
              <p className="text-[var(--brass)] text-base font-bold tracking-widest uppercase mb-4">
                Client Feedback
              </p>
              <h2 className="text-4xl font-bold tracking-tight max-w-xl">
                Trusted by Ontario's Leading Builders
              </h2>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8">
              {TESTIMONIALS.map((t, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: i * 0.18 }}
                  className="relative p-8 lg:p-10 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.035] to-transparent group overflow-hidden"
                >
                  {/* Large decorative quote mark */}
                  <div className="absolute top-4 right-6 text-[5.5rem] leading-none font-serif pointer-events-none select-none"
                    style={{ color: "rgba(201,164,73,0.1)", fontFamily: "'Cormorant Garamond', serif" }}>"</div>
                  {/* Hover shimmer */}
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-[var(--brass)]/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                  <p className="text-white/72 text-[15px] leading-[1.85] mb-10 relative z-10 italic">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-[var(--brass)]/10 flex items-center justify-center border border-[var(--brass)]/22 shrink-0">
                      <span className="text-[var(--brass)] font-bold text-[13px]">{t.author.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="text-[#ede6d6] font-bold text-[14px] mb-0.5">{t.author}</h4>
                      <p className="text-white/55 text-[11px] uppercase tracking-wider">
                        {t.role}, <span className="text-[var(--brass)]">{t.firm}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICE COVERAGE ────────────────────────────────────────────────── */}
        <section className="py-24 px-8 md:px-20 lg:px-24 xl:px-32 bg-black/30 border-y border-white/[0.05]">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 xl:gap-24 items-center">
            <SlideIn from="left" className="lg:w-1/2">
              <p className="text-[var(--brass)] text-base font-bold tracking-widest uppercase mb-5">
                Service Area
              </p>
              <SplitHeading text="We Work Across All of Ontario"
                className="text-4xl font-bold tracking-tight leading-tight mb-6"
                style={{}} />
              <p className="text-white/65 text-[16px] leading-relaxed mb-8">
                Our crews take on residential and commercial masonry projects across eight Ontario regions. Contact us to confirm availability and schedule a free on-site assessment.
              </p>
              <MagBtn onClick={() => navigate("#contact")}
                className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.2em] font-bold text-[var(--brass)] hover:text-white transition-colors group/arrow">
                Request a Free Quote
                <ArrowRight size={13} className="group-hover/arrow:translate-x-1 transition-transform" />
              </MagBtn>
            </SlideIn>

            <SlideIn from="right" delay={0.15} className="lg:w-1/2">
              <div className="flex flex-wrap gap-3">
                {DELIVERY_REGIONS.map((region, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.05, borderColor: "rgba(204,171,123,0.4)" }}
                    className="flex items-center gap-2 border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 rounded-full text-[12px] text-white/70 hover:text-white transition-colors cursor-default"
                  >
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.25 }}>
                      <MapPin size={10} className="text-[var(--brass)]" />
                    </motion.div>
                    {region}
                  </motion.div>
                ))}
              </div>
              <p className="mt-5 text-[11px] text-white/42 uppercase tracking-[0.15em]">+ surrounding regions on request</p>
            </SlideIn>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
        <section className="py-24 px-8 md:px-20 lg:px-24 xl:px-32">
          <div className="max-w-7xl mx-auto">
            <FadeUp className="mb-14 text-center">
              <p className="text-[var(--brass)] text-base font-bold tracking-widest uppercase mb-4">Common Inquiries</p>
              <h2 className="text-4xl font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
            </FadeUp>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 xl:gap-x-24">
              <div>
                {FAQS.slice(0, Math.ceil(FAQS.length / 2)).map((faq, i) => (
                  <FAQItem key={i} faq={faq} index={i} />
                ))}
              </div>
              <div>
                {FAQS.slice(Math.ceil(FAQS.length / 2)).map((faq, i) => (
                  <FAQItem key={i + Math.ceil(FAQS.length / 2)} faq={faq} index={i + Math.ceil(FAQS.length / 2)} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── GET STARTED ─────────────────────────────────────────────────────── */}
        <CTASection navigate={navigate} />

        <Footer />
      </div>
    </div>
  );
}
