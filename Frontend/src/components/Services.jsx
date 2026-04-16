import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
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
   Shared animation primitives
───────────────────────────────────────────────────────────────────────────── */

const FadeUp = ({ children, delay = 0, className = "", as: Tag = motion.div }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <Tag
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: inView ? "auto" : "transform, opacity" }}
      className={className}
    >
      {children}
    </Tag>
  );
};

const SplitHeading = ({ text, className = "", delay = 0, Tag = "h2" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <Tag ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
          <motion.span
            initial={{ y: "100%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.55, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
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

const SlideReveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className={`relative ${className}`}>
      {children}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={inView ? { scaleX: 0 } : {}}
        transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "right", position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }}
        className="bg-[var(--brass)]"
      />
    </div>
  );
};

const GrowLine = ({ delay = 0, horizontal = false }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={horizontal ? { scaleX: 0 } : { scaleY: 0 }}
      animate={inView ? (horizontal ? { scaleX: 1 } : { scaleY: 1 }) : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: horizontal ? "left" : "top" }}
      className={horizontal ? "h-px bg-[var(--brass)]/30 w-full" : "w-px bg-[var(--brass)]/30 flex-1 my-2"}
    />
  );
};

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
    img: "/bg.png",
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
    img: "/bg.png",
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
    img: "/bg.png",
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
    img: "/bg.png",
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
    img: "/bg.png",
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
    img: "/bg.png",
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
    colour: "from-[#ccab7b]/10 to-transparent",
  },
  {
    icon: <HardHat size={28} />,
    title: "Contractors & Builders",
    desc: "Reliable supply, competitive trade pricing, and on-time delivery across Ontario. MMG keeps your projects moving and your margins healthy.",
    points: ["Net-30 trade accounts", "Volume pricing", "Dedicated account rep"],
    colour: "from-white/5 to-transparent",
  },
  {
    icon: <Compass size={28} />,
    title: "Architects & Designers",
    desc: "Spec with confidence. We stock the most specified architectural masonry lines in Ontario and offer technical support for heritage, commercial, and bespoke projects.",
    points: ["Sample library", "Material boards", "Specification assistance"],
    colour: "from-[#ccab7b]/10 to-transparent",
  },
];

const STATS = [
  { value: "30+", label: "Years in Business" },
  { value: "10k+", label: "Products in Stock" },
  { value: "500+", label: "Active Trade Accounts" },
  { value: "2–5", label: "Business Day Delivery" },
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
   Sub-components
───────────────────────────────────────────────────────────────────────────── */

function ServiceCard({ service, index, navigate }) {
  const isEven = index % 2 === 0;
  return (
    <FadeUp delay={0.05} className="w-full">
      <div
        className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-0 border border-white/[0.07] rounded-2xl overflow-hidden group hover:border-[var(--brass)]/30 transition-all duration-500`}
      >
        {/* Image panel — bg.png shows through from fixed background */}
        <div className="relative lg:w-[42%] aspect-[4/3] lg:aspect-auto shrink-0 overflow-hidden bg-black/50 group-hover:bg-black/40 transition-colors duration-500">
          {/* Number watermark */}
          <div className="absolute bottom-4 left-6 font-black text-[100px] leading-none text-white/[0.04] select-none pointer-events-none"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            {service.number}
          </div>
          {/* Brass corner accent */}
          <div className="absolute top-5 right-5 w-10 h-10 border-t border-r border-[var(--brass)]/20 pointer-events-none" />
          <div className="absolute bottom-5 left-5 w-10 h-10 border-b border-l border-[var(--brass)]/20 pointer-events-none" />
          {/* Tag chip */}
          <div className="absolute top-5 left-5">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--brass)] bg-black/60 backdrop-blur-sm border border-[var(--brass)]/30 px-3 py-1.5 rounded-full">
              {service.tag}
            </span>
          </div>
          {/* Icon centred */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[var(--brass)]/20 group-hover:text-[var(--brass)]/35 transition-colors duration-500" style={{ transform: 'scale(3.5)' }}>
              {service.icon}
            </div>
          </div>
        </div>

        {/* Content panel */}
        <div className="flex flex-col justify-between p-8 lg:p-12 flex-1 bg-gradient-to-br from-white/[0.02] to-transparent">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-[var(--brass)]">{service.icon}</div>
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--brass)]/30 to-transparent" />
            </div>

            <h3
              className="text-3xl lg:text-4xl font-normal text-[#e3decb] mb-2 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {service.headline}
            </h3>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--brass)] font-bold mb-5">
              {service.title}
            </p>
            <p className="text-white/55 text-[15px] leading-relaxed mb-7 max-w-xl">
              {service.description}
            </p>

            <ul className="space-y-2.5 mb-8">
              {service.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] text-white/60">
                  <CheckCircle size={14} className="text-[var(--brass)] shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <button
              onClick={() => navigate(service.ctaHash)}
              className="group/cta inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-bold text-[var(--brass)] hover:text-white transition-colors duration-300"
            >
              {service.cta}
              <ArrowUpRight size={14} className="group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

function StatCounter({ value, label, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center"
    >
      <span
        className="text-5xl lg:text-6xl font-black text-[var(--brass)] mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {value}
      </span>
      <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold">{label}</span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────────────────────── */

export default function Services({ navigate }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const [activeService, setActiveService] = useState(null);

  return (
    <div ref={containerRef} className="min-h-screen text-white font-sans relative">

      {/* ── GLOBAL BACKGROUND ─────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center w-full h-full"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      {/* Dark overlay so content stays readable */}
      <div className="fixed inset-0 z-0 bg-black/60" />

      {/* All page content sits above the fixed bg */}
      <div className="relative z-10">

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
        {/* Hero gradient overlay */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </motion.div>

        {/* Decorative grid lines */}
        <div className="absolute inset-0 z-[1] pointer-events-none opacity-15">
          <div className="absolute top-0 left-[30%] w-px h-full bg-white/20" />
          <div className="absolute top-[40%] left-0 w-full h-px bg-white/20" />
        </div>

        {/* Brass corner accent */}
        <div className="absolute top-28 right-12 w-24 h-24 border-t-2 border-r-2 border-[var(--brass)]/30 pointer-events-none z-[2]" />
        <div className="absolute bottom-16 left-12 w-16 h-16 border-b-2 border-l-2 border-[var(--brass)]/20 pointer-events-none z-[2]" />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 px-8 md:px-20 max-w-7xl w-full"
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[var(--brass)] text-[11px] font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-3"
          >
            <span className="w-8 h-px bg-[var(--brass)]" />
            What We Offer
          </motion.p>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-normal text-[#e3decb] leading-[0.95] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <div className="overflow-hidden pb-2">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Premium
              </motion.span>
            </div>
            <div className="overflow-hidden pb-2">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--brass)] to-[var(--brass-light)]"
              >
                Masonry Services
              </motion.span>
            </div>
            <div className="overflow-hidden pb-2">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Across Ontario.
              </motion.span>
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="text-white/50 text-lg max-w-xl leading-relaxed mb-10"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            From material specification to site delivery — Modern Masonry Group delivers end-to-end support for homeowners, contractors, and architects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => navigate("#contact")}
              className="flex items-center gap-2 bg-[var(--brass)] text-black px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-full hover:bg-[var(--brass-light)] transition-colors"
            >
              Get a Quote <ArrowRight size={14} />
            </button>
            <button
              onClick={() => navigate("#brick")}
              className="flex items-center gap-2 border border-white/20 text-white px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-full hover:border-white/40 hover:bg-white/5 transition-colors"
            >
              Browse Catalogue
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/30">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={16} className="text-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────────────────── */}
      <section className="border-y border-white/[0.07] bg-black/40 backdrop-blur-sm py-12 px-8 md:px-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 divide-x divide-white/[0.07]">
          {STATS.map((s, i) => (
            <div key={i} className={i > 0 ? "pl-10" : ""}>
              <StatCounter value={s.value} label={s.label} delay={i * 0.1} />
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-8 md:px-16 lg:px-20 max-w-[1400px] mx-auto">
        <FadeUp className="mb-16 max-w-2xl">
          <p className="text-[var(--brass)] text-[11px] font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
            <span className="w-6 h-px bg-[var(--brass)]" />
            What We Do
          </p>
          <SplitHeading
            text="Everything Your Project Needs"
            className="text-4xl lg:text-5xl font-normal text-[#e3decb] leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          />
          <p className="text-white/40 text-[15px] leading-relaxed">
            Six integrated services built around the way architects, contractors, and homeowners actually work.
          </p>
        </FadeUp>

        <div className="flex flex-col gap-6">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.number} service={s} index={i} navigate={navigate} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-8 md:px-20 bg-black/30 border-y border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-16">
            <p className="text-[var(--brass)] text-[11px] font-bold tracking-[0.3em] uppercase mb-4">The Process</p>
            <SplitHeading
              text="How Working With MMG Works"
              className="text-4xl lg:text-5xl font-normal text-[#e3decb]"
            />
          </FadeUp>

          {/* Desktop: horizontal steps */}
          <div className="hidden md:grid grid-cols-4 gap-0 relative">
            {PROCESS_STEPS.map((step, i) => (
              <FadeUp key={i} delay={i * 0.12} className="flex flex-col items-center text-center px-6">
                {/* Number node */}
                <div className="relative mb-6 flex items-center w-full justify-center">
                  {i > 0 && (
                    <div className="absolute right-1/2 top-1/2 -translate-y-1/2 w-1/2 pr-3">
                      <GrowLine horizontal delay={i * 0.12} />
                    </div>
                  )}
                  <div className="w-12 h-12 rounded-full border-2 border-[var(--brass)] bg-[var(--obsidian)] flex items-center justify-center z-10 shrink-0">
                    <span className="text-[11px] font-black text-[var(--brass)] tracking-wider">{step.step}</span>
                  </div>
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-1/2 pl-3">
                      <GrowLine horizontal delay={i * 0.12 + 0.1} />
                    </div>
                  )}
                </div>

                <h3 className="text-[15px] font-bold text-[#e3decb] mb-3 tracking-wide uppercase" style={{ letterSpacing: "0.1em" }}>
                  {step.title}
                </h3>
                <p className="text-white/40 text-[13px] leading-relaxed">{step.desc}</p>
              </FadeUp>
            ))}
          </div>

          {/* Mobile: vertical steps */}
          <div className="flex flex-col gap-0 md:hidden">
            {PROCESS_STEPS.map((step, i) => (
              <FadeUp key={i} delay={i * 0.1} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-[var(--brass)] bg-[var(--obsidian)] flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-black text-[var(--brass)]">{step.step}</span>
                  </div>
                  {i < PROCESS_STEPS.length - 1 && <GrowLine delay={i * 0.1} />}
                </div>
                <div className="pb-10">
                  <h3 className="text-[14px] font-bold text-[#e3decb] mb-2 uppercase tracking-widest">{step.title}</h3>
                  <p className="text-white/40 text-[13px] leading-relaxed">{step.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE SERVE ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-8 md:px-20">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="mb-14">
            <p className="text-[var(--brass)] text-[11px] font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-[var(--brass)]" />
              Who We Serve
            </p>
            <SplitHeading
              text="Built for Every Builder"
              className="text-4xl lg:text-5xl font-normal text-[#e3decb] max-w-lg"
            />
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WHO_WE_SERVE.map((w, i) => (
              <FadeUp
                key={i}
                delay={i * 0.12}
                className={`relative p-8 rounded-2xl border border-white/[0.07] bg-gradient-to-b ${w.colour} hover:border-[var(--brass)]/30 transition-all duration-400 group cursor-default overflow-hidden`}
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-[var(--brass)]/20 rounded-tr-2xl pointer-events-none" />

                <div className="text-[var(--brass)] mb-5">{w.icon}</div>
                <h3
                  className="text-xl font-normal text-[#e3decb] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {w.title}
                </h3>
                <p className="text-white/45 text-[13px] leading-relaxed mb-6">{w.desc}</p>
                <ul className="space-y-2">
                  {w.points.map((pt, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-[12px] text-white/55">
                      <div className="w-1 h-1 rounded-full bg-[var(--brass)] shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── DELIVERY COVERAGE ──────────────────────────────────────────────────── */}
      <section className="py-24 px-8 md:px-20 bg-black/30 border-y border-white/[0.05]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          {/* Left: text */}
          <div className="lg:w-1/2">
            <FadeUp>
              <p className="text-[var(--brass)] text-[11px] font-bold tracking-[0.3em] uppercase mb-5 flex items-center gap-3">
                <span className="w-6 h-px bg-[var(--brass)]" />
                Delivery Coverage
              </p>
              <SplitHeading
                text="We Deliver Across All of Ontario"
                className="text-4xl lg:text-5xl font-normal text-[#e3decb] leading-tight mb-6"
              />
              <p className="text-white/45 text-[15px] leading-relaxed mb-8">
                Our dedicated fleet handles deliveries province-wide with guaranteed 2–5 business day lead times. Palletised, tracked, and coordinated directly with your site.
              </p>
              <button
                onClick={() => navigate("#contact")}
                className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-bold text-[var(--brass)] hover:text-white transition-colors group/arrow"
              >
                Get a Delivery Quote
                <ArrowRight size={14} className="group-hover/arrow:translate-x-1 transition-transform" />
              </button>
            </FadeUp>
          </div>

          {/* Right: region pills */}
          <div className="lg:w-1/2">
            <FadeUp delay={0.15}>
              <div className="flex flex-wrap gap-3">
                {DELIVERY_REGIONS.map((region, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-2 border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 rounded-full text-[12px] text-white/60 hover:border-[var(--brass)]/30 hover:text-white/80 transition-colors cursor-default"
                  >
                    <MapPin size={11} className="text-[var(--brass)]" />
                    {region}
                  </motion.div>
                ))}
              </div>
              <p className="mt-5 text-[11px] text-white/25 uppercase tracking-[0.15em]">+ surrounding regions on request</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── TRADE CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-28 px-8 md:px-20 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--brass)]/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--brass)]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--brass)]/20 to-transparent" />
        </div>
        <div className="absolute top-8 right-16 w-40 h-40 border border-[var(--brass)]/10 rounded-full pointer-events-none" />
        <div className="absolute top-16 right-24 w-20 h-20 border border-[var(--brass)]/15 rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeUp>
            <p className="text-[var(--brass)] text-[11px] font-bold tracking-[0.3em] uppercase mb-6">Trade Professionals</p>
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
              Register for a trade account and unlock preferred pricing, net-30 terms, a dedicated account rep, and early access to new product lines — all built for the way you work.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate("#contact")}
                className="group relative flex items-center gap-2 bg-[var(--brass)] text-black px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full overflow-hidden hover:shadow-[0_0_30px_rgba(204,171,123,0.4)] transition-shadow"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Apply for Trade Account <ArrowUpRight size={14} />
                </span>
                <motion.div
                  animate={{ x: ["100%", "-100%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
                />
              </button>
              <button
                onClick={() => navigate("#brick")}
                className="flex items-center gap-2 border border-white/20 text-white/70 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full hover:border-white/40 hover:text-white transition-colors"
              >
                Browse Full Catalogue
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────────── */}
      <Footer />
      </div>{/* end relative z-10 wrapper */}
    </div>
  );
}
