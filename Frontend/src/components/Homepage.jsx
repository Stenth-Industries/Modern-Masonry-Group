import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, ArrowUpRight, Plus, Minus, Mail } from "lucide-react";
import BrickCatalogue from "./BrickCatalogue";
import { TextHoverEffect, FooterBackgroundGradient } from "./ui/hover-footer";
import { InfiniteSlider } from "./ui/infinite-slider";
import Footer from "./Footer";

const BRANDS = [
  "Brampton Brick",
  "Unilock",
  "Techo-Bloc",
  "Permacon",
  "Rinox",
  "General Shale",
  "Shouldice",
  "Cambridge Pavingstones",
  "Oldcastle",
  "Belgard",
];

const TESTIMONIALS = [
  {
    name: "Carla S.",
    role: "Lead Architect",
    company: "Bousfields Inc.",
    rating: 5,
    quote:
      "Working with Modern Masonry Group has been seamless from day one. Their brick selection is unmatched in Ontario.",
  },
  {
    name: "Mike D.",
    role: "Owner",
    company: "Diamond Build Corp",
    rating: 5,
    quote:
      "Fast delivery, competitive trade pricing, and knowledgeable staff. MMG is our go-to for every residential project.",
  },
  {
    name: "James R.",
    role: "Project Manager",
    company: "Windmill Developments",
    rating: 5,
    quote:
      "We spec\u2019d Techo-Bloc for a lakeside estate and MMG had everything in stock same week. Exceptional service.",
  },
  {
    name: "Priya M.",
    role: "Interior Designer",
    company: "Studio North",
    rating: 5,
    quote:
      "The online catalogue saved us hours during the spec phase. Exactly what modern contractors need.",
  },
  {
    name: "Tom H.",
    role: "Heritage Contractor",
    company: "Stoneworks Heritage Co.",
    rating: 5,
    quote:
      "MMG helped us source heritage limestone for a restoration project. Could not have done it without their expertise.",
  },
  {
    name: "Sandra K.",
    role: "Builder",
    company: "Oakwood Homes",
    rating: 5,
    quote:
      "Trade pricing is excellent and they actually know their product. That kind of knowledge is rare in this industry.",
  },
  {
    name: "Carlos V.",
    role: "Project Lead",
    company: "Apex Masonry",
    rating: 5,
    quote:
      "Sample delivery was next day. We closed the homeowner in the same meeting. That is the MMG advantage.",
  },
  {
    name: "Paul N.",
    role: "General Contractor",
    company: "Skyline Contractors",
    rating: 5,
    quote:
      "Five stars across the board \u2014 quality, service, and selection. MMG sets the standard for masonry supply.",
  },
];

const SERVICES = [
  {
    icon: (
      <img
        src="/brick-wall.svg"
        alt="Premium Product Supply"
        className="h-[2em] w-auto relative -top-1 inline-block"
      />
    ),
    tag: "10,000+ SKUs",
    title: "Premium Product Supply",
    desc: "Access one of the Ontario\u2019s most refined collections of brick, natural stone, and architectural masonry products selected for durability, performance, and timeless appeal.",
  },
  {
    icon: (
      <img
        src="/construction-worker.png"
        alt="Expert Consultation"
        className="h-[2em] w-auto relative -top-1 inline-block"
        style={{
          filter:
            "brightness(0) saturate(100%) invert(73%) sepia(19%) saturate(1471%) hue-rotate(6deg) brightness(88%) contrast(84%)",
        }}
      />
    ),
    tag: "Design & Technical Guidance",
    title: "Expert Consultation",
    desc: "Work alongside masonry specialists who collaborate with architects, builders, and designers to specify the right materials, finishes, and systems for your vision.",
  },
  {
    icon: (
      <img
        src="/express-delivery.png"
        alt="Project-Ready Delivery"
        className="h-[2em] w-auto relative -top-1 inline-block"
        style={{
          filter:
            "brightness(0) saturate(100%) invert(73%) sepia(19%) saturate(1471%) hue-rotate(6deg) brightness(88%) contrast(84%)",
        }}
      />
    ),
    tag: "2\u20135 Business Days",
    title: "Project-Ready Delivery",
    desc: "Seamless, on-time delivery directly to your site ensuring your project stays on schedule with zero compromise on handling or quality.",
  },
  {
    icon: (
      <img
        src="/contract.png"
        alt="Trade Partnerships"
        className="h-[2em] w-auto relative -top-1 inline-block"
        style={{
          filter:
            "brightness(0) saturate(100%) invert(73%) sepia(19%) saturate(1471%) hue-rotate(6deg) brightness(88%) contrast(84%)",
        }}
      />
    ),
    tag: "Exclusive Trade Access",
    title: "Trade Partnerships",
    desc: "Unlock preferred pricing, dedicated support, and long-term value with our contractor-focused trade accounts.",
  },
];

const PILLARS = [
  {
    number: "01",
    title: "In-Stock Inventory",
    desc: "The largest masonry inventory in Ontario. No waiting, no back-orders on core products.",
  },
  {
    number: "02",
    title: "Trade Expertise",
    desc: "30+ years of masonry knowledge. We speak architect, contractor, and builder fluently.",
  },
  {
    number: "03",
    title: "Competitive Pricing",
    desc: "Direct supplier relationships. We match or beat any verified Ontario quote.",
  },
  {
    number: "04",
    title: "Fleet Delivery",
    desc: "Province-wide delivery to your job site. Guaranteed 2\u20135 business day lead times.",
  },
];

const MILESTONES = [
  { year: "1994", event: "Founded in Brampton, ON with a single showroom" },
  { year: "2002", event: "Expanded to full warehouse distribution across GTA" },
  { year: "2010", event: "Added natural stone and hardscaping division" },
  { year: "2018", event: "Launched trade account portal for contractors" },
  { year: "2024", event: "10,000+ products and 500+ active trade accounts" },
];

const FAQS = [
  {
    q: "Do you sell to homeowners or only the trade?",
    a: "We welcome both homeowners and trade professionals. Registered contractors and architects receive preferred pricing, net terms, and a dedicated account representative.",
  },
  {
    q: "What is your minimum order quantity?",
    a: "There is no minimum for in-store or curbside pickup. Delivery orders have product-specific minimums contact our team for details.",
  },
  {
    q: "What areas of Ontario do you deliver to?",
    a: "We deliver across Ontario, including the GTA, Ottawa, Hamilton, Kitchener-Waterloo, London, and surrounding regions.",
  },
  {
    q: "Can I request product samples before ordering?",
    a: "Absolutely. Samples are available for most brick, stone, and veneer products. Visit our showroom or request next-day sample shipping.",
  },
  {
    q: "What are typical lead times on orders?",
    a: "In-stock products typically ship within 2\u20135 business days. Special-order items may require 1\u20133 weeks.",
  },
  {
    q: "Do your products come with warranties?",
    a: "Yes. Manufacturer warranties apply to all products. Our team can provide full warranty documentation for any product.",
  },
  {
    q: "Can I see products in person at your showroom?",
    a: "Yes our Toronto showroom is open Monday through Saturday, 8am to 5pm. Walk-ins welcome.",
  },
  {
    q: "Do you work with landscape architects and interior designers?",
    a: "Yes. We regularly work with landscape architects, interior designers, developers, and institutional clients.",
  },
];

/* ── Animated counter (only 4 instances) ── */
const AnimatedStat = ({ value, prefix = "", suffix = "", label }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = Date.now(),
      dur = 1800;
    const t = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 4)) * value));
      if (p >= 1) {
        setCount(value);
        clearInterval(t);
      }
    }, 16);
    return () => clearInterval(t);
  }, [inView, value]);
  return (
    <div ref={ref} className="pl-8 first:pl-0 flex flex-col justify-center">
      <div className="text-4xl lg:text-5xl font-black mb-2 tracking-tight">
        {prefix}
        {count}
        {suffix}
      </div>
      <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
};

/* ── Floating CTA ── */
const FloatingCTA = ({ scrollY }) => {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const u = scrollY.on("change", (v) => setVis(v > window.innerHeight * 0.8));
    return () => u();
  }, [scrollY]);
  return (
    <AnimatePresence>
      {vis && (
        <motion.a
          href="#quote"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-[var(--brass)] text-black px-5 py-3 rounded-full font-bold text-sm uppercase tracking-wider shadow-2xl hover:bg-[var(--brass-light)] transition-colors"
        >
          Free Estimate <ArrowUpRight size={14} />
        </motion.a>
      )}
    </AnimatePresence>
  );
};

/* ── FAQ ── */
const FAQSection = () => {
  const [open, setOpen] = useState(null);

  const renderFaq = (f, i) => (
    <div
      key={i}
      className="border border-white/10 rounded-xl overflow-hidden w-full h-fit flex-shrink-0"
    >
      <button
        onClick={() => setOpen(open === i ? null : i)}
        className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-white font-medium pr-4 text-sm">{f.q}</span>
        <span className="text-[var(--brass)] shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[var(--brass)]/10">
          {open === i ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open === i && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 pt-4 text-[var(--ash)] text-sm leading-relaxed border-t border-white/5">
              {f.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const mid = Math.ceil(FAQS.length / 2);

  return (
    <section id="faq" className="py-24 px-8 md:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 text-center">
          <p className="text-[var(--brass)] text-lg font-bold tracking-widest mb-4 uppercase">
            FAQ
          </p>
          <h2 className="text-4xl font-bold tracking-tight">
            Common Questions
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
          <div className="flex flex-col gap-4 lg:gap-6">
            {FAQS.slice(0, mid).map((f, i) => renderFaq(f, i))}
          </div>
          <div className="flex flex-col gap-4 lg:gap-6">
            {FAQS.slice(mid).map((f, i) => renderFaq(f, i + mid))}
          </div>
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
  const { scrollY } = useScroll();

  useEffect(() => {
    if (introVideoRef.current) introVideoRef.current.playbackRate = 1.5;
  }, []);

  return (
    <div className="min-h-screen text-[var(--limestone)] font-sans selection:bg-[var(--brass)] selection:text-black" style={{ background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/bg.png') center/cover no-repeat fixed, #000" }}>
      <FloatingCTA scrollY={scrollY} />

      {/* HERO */}
      <section id="home" className="relative h-screen bg-black overflow-hidden">
        {/* LOGO IN VIDEO */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute top-6 right-8 z-40 cursor-pointer"
          onClick={() => navigate("#home")}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src="/Logo-MM (1).png"
              alt="MMG"
              className="w-56 h-56 object-contain drop-shadow-[0_4px_16px_rgba(212,175,99,0.2)]"
            />
          </motion.div>
        </motion.div>
        {/* Layer 0: Video 2 (main loop) — preloaded, fades in as Video 1 fades out */}
        <video
          ref={mainVideoRef}
          src="/video2-optim.mp4"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{
            opacity: introFading ? 0.6 : 0,
            transition: "opacity 1.8s ease-in-out",
            willChange: "opacity",
            transform: "translateZ(0)",
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
              {["Where", "Architecture"].map((w, i) => (
                <div key={i} className="overflow-hidden pb-2">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.3 + i * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
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
                transition={{
                  duration: 0.8,
                  delay: 0.58,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brass)] to-[var(--brass-light)]"
              >
                Meets Masonry.
              </motion.div>
            </div>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="text-xl font-bold md:text-2xl text-[var(--limestone)] font-light max-w-2xl mb-10 leading-relaxed"
          >
            Premium brick, stone & masonry products for homeowners, architects,
            contractors & builders across Ontario.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="flex flex-wrap gap-4"
          >
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
              transition: "opacity 1.8s ease-in-out",
              willChange: "opacity",
              transform: "translateZ(0)",
            }}
            onTransitionEnd={() => {
              if (introFading) setIsVideo1Ended(true);
            }}
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
                if (
                  v.duration &&
                  v.currentTime >= v.duration - 1.8 &&
                  !introFading
                ) {
                  setIntroFading(true);
                  if (mainVideoRef.current)
                    mainVideoRef.current.play().catch(console.error);
                }
              }}
              onEnded={() => {
                if (!introFading) {
                  setIntroFading(true);
                  if (mainVideoRef.current)
                    mainVideoRef.current.play().catch(console.error);
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
      {/* <section className="py-20 px-8 md:px-20 bg-black border-b border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-white/10">
          {PILLARS.map((p, i) => (
            <div key={i} className="lg:px-8 first:pl-0 last:pr-0 group">
              <div className="text-[var(--brass)]/20 text-6xl font-black mb-5 group-hover:text-[var(--brass)]/40 transition-colors duration-500">{p.number}</div>
              <h3 className="text-white font-bold text-lg mb-3">{p.title}</h3>
              <p className="text-[var(--ash)] text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* ABOUT */}
      <section id="about" className="py-32 px-8 md:px-20 text-white">
        <div className="max-w-7xl mx-auto mb-16 text-center">
          <p className="text-[var(--brass)] text-5xl font-bold tracking-widest uppercase inline-block">
            A Story of Craft
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-7xl mx-auto">
          <div className="flex flex-col justify-center lg:-mt-12">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-16">
              30 Years of Masonry Excellence
            </h2>

            <p className="text-gray-400 text-xl leading-relaxed mb-6 font-light">
              Modern Masonry Group was founded in 1994 with a single mission:
              bring world-class masonry materials to Ontario's Homeowners,
              architects, builders, and contractors at trade pricing.
            </p>
            <p className="text-gray-400 text-xl leading-relaxed mb-10 font-light">
              Today we're Ontario's premier masonry supplier stocking over
              10,000 + products from the industry's most trusted brands, with
              fleet delivery across the province.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center self-start gap-2 border border-[var(--brass)] text-[var(--brass)] px-8 py-4 text-sm rounded-full font-bold uppercase tracking-wider hover:bg-[var(--brass-light)] hover:text-black transition-colors"
            >
              About Us
              <ArrowRight size={16} />
            </a>
          </div>
          <div className="flex flex-col justify-center pl-0 lg:pl-12">
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-[var(--brass)] mt-1.5 shrink-0 shadow-[0_0_10px_rgba(212,175,99,0.5)]" />
                  {i < MILESTONES.length - 1 && (
                    <div className="w-px bg-white/10 flex-1 my-2" />
                  )}
                </div>
                <div className={i < MILESTONES.length - 1 ? "pb-10" : "pb-0"}>
                  <p className="text-xl font-bold text-[var(--brass)] uppercase tracking-widest mb-2">
                    {m.year}
                  </p>
                  <p className="text-gray-300 font-medium text-xl">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section
        id="products"
        className="py-24 px-8 md:px-20"
      >
        <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <p className="text-[var(--brass)] text-m font-bold tracking-widest mb-2 uppercase">
              New Arrivals
            </p>
            <h2 className="text-4xl font-bold tracking-tight">
              Featured Products
            </h2>
          </div>
          <a
            href="#"
            className="hidden md:flex items-center gap-2 hover:text-[var(--brass)] transition-colors text-m font-medium uppercase tracking-wider"
          >
            View All <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Glacier Grey Western",
              cat: "Brick",
              img: "/Glacier-Grey-1775591959608.jpg",
            },
            {
              name: "Raven Black Granite",
              cat: "Natural Stone",
              img: "/Landscaping_Stone.jpg",
              rotate: true,
            },
            {
              name: "Silver Lining Stacked Stone",
              cat: "Stone",
              img: "/SS-Silver-Lining-600x600.webp",
            },
            {
              name: "Masonry Block",
              cat: "Architectural Block",
              img: "/Masonry-block.png",
            },
          ].map((p, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[4/5] bg-[var(--charcoal)] mb-4 relative overflow-hidden border border-white/5 hover:border-[var(--brass)]/30 transition-colors duration-300">
                <img
                  src={p.img}
                  alt={p.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={
                    p.rotate
                      ? {
                        transform: "rotate(90deg) scale(1.4)",
                        transformOrigin: "center",
                      }
                      : {}
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-[var(--brass)] flex items-center gap-2 text-sm font-bold">
                    View Product <ArrowRight size={14} />
                  </span>
                </div>
              </div>
              <p className="text-xs text-[var(--ash)] uppercase tracking-widest mb-1">
                {p.cat}
              </p>
              <h3 className="text-lg font-bold group-hover:text-[var(--brass)] transition-colors duration-200">
                {p.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* BRAND MARQUEE */}
      <section className="py-12 bg-white/80 border-y border-white/5 overflow-hidden">
        <p className="text-center font-bold text-[24px] text-[var(--brass)] uppercase tracking-[0.35em] mb-7">
          Trusted By Canada's Leading Masonry Brands
        </p>
        <div className="relative">
          <InfiniteSlider
            duration={30}
            durationOnHover={70}
            direction="horizontal"
            gap={90}
          >
            {[
              "/logos/Logo-01png.png",
              "/logos/200x55-1.png",
              "/logos/Logo-03.png",
              "/logos/Logo-04.png",
              "/logos/Logo-05.png",
              "/logos/Logo-06.png",
              "/logos/Logo-07.png",
              "/logos/Logo-08.png",
              "/logos/Logo-09.png",
              "/logos/Logo-10.png",
            ].map((logoFile, i) => (
              <img
                key={i}
                src={logoFile}
                alt={`Trusted Partner ${i + 3}`}
                className="h-12 md:h-16 w-auto object-contain shrink-0 transition-all duration-300"
              />
            ))}
          </InfiniteSlider>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-8 md:px-20">
        <div className="mb-14">
          <p className="text-[var(--brass)] text-m font-bold tracking-widest mb-2 uppercase">
            What Defines Us
          </p>
          <h2 className="text-4xl font-bold tracking-tight">
            Our Core Services
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {SERVICES.map((s, i) => (
            <div
              key={i}
              className="bg-black p-8 group hover:bg-[var(--charcoal)] transition-colors duration-300 cursor-default"
            >
              <div className="text-[var(--brass)] text-3xl mb-5">{s.icon}</div>
              <p className="text-[10px] text-[var(--brass)] uppercase tracking-[0.25em] mb-3 font-bold">
                {s.tag}
              </p>
              <h3 className="text-lg font-bold mb-3 text-white">{s.title}</h3>
              <p className="text-[var(--ash)] text-sm leading-relaxed">
                {s.desc}
              </p>
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
      <section className="py-24 px-8 md:px-20 text-white">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-[var(--brass)] text-xl font-bold tracking-widest mb-4 uppercase">
            Browse by Project Type
          </p>
          <h2 className="text-5xl font-black tracking-tight mb-6">
            What Are You Building Today?
          </h2>
          <p className="text-gray-400 text-lg">
            Discover materials that transform ideas into refined, lasting
            spaces.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Exterior Cladding",
              img: "/Exterior-Cladding.png",
            },
            {
              title: "Driveways",
              img: "/Driveways.png",
            },
            {
              title: "Patios & Walkways",
              img: "/patio.png",
            },
            {
              title: "Retaining Walls",
              img: "/Retaining-walls.png",
            },
            {
              title: "Pool Decks",
              img: "/Pool.png",
            },
            {
              title: "Steps & Caps",
              img: "/Steps.png",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="group relative overflow-hidden cursor-pointer aspect-square border border-white/5 hover:border-[var(--brass)]/30 transition-colors duration-300"
            >
              <img
                src={s.img}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 group-hover:transition-colors duration-300 z-10" />
              <div className="absolute bottom-0 left-0 p-8 z-20">
                <h3 className="text-2xl font-bold text-white group-hover:text-[var(--brass)] transition-colors duration-300 mb-2 drop-shadow-md">
                  {s.title}
                </h3>
                <span className="text-[var(--brass)] flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24 px-8 md:px-20">
        <div className="mb-12">
          <p className="text-[var(--brass)] text-s font-bold tracking-widest mb-2 uppercase">
            Project Gallery
          </p>
          <h2 className="text-4xl font-bold tracking-tight">
            Built to Last. Designed to Impress.
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:h-[640px]">
          <div className="lg:col-span-3 aspect-square lg:aspect-auto relative group overflow-hidden border border-white/5 lg:h-full">
            <img
              src="/House.png"
              alt="The Muskoka Residence"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-80 z-10" />
            <div className="absolute bottom-0 left-0 z-20 p-10">
              <span className="text-[var(--brass)] text-xs font-bold tracking-widest uppercase mb-2 block">
                Featured Project
              </span>
              <h3 className="text-3xl font-bold text-white">
                The Muskoka Residence
              </h3>
              <p className="text-white/70 mt-2 max-w-md">
                Extensive use of raw limestone and deep black brick for a modern
                lakeside home.
              </p>
            </div>
          </div>
          <div className="lg:col-span-2 grid grid-rows-2 gap-4 lg:h-full">
            {[
              {
                title: "Urban Commercial Plaza",
                img: "/Urban.png",
              },
              {
                title: "Heritage Restoration",
                img: "/Heritage.jpeg",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="border border-white/5 relative group cursor-pointer overflow-hidden text-white flex items-end p-6 min-h-48 lg:min-h-0"
              >
                <img
                  src={t.img}
                  alt={t.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 group-hover:transition-colors duration-200" />
                <h4 className="relative z-10 font-bold">{t.title}</h4>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center">
          <button className="border border-[var(--brass)] text-[var(--brass)] rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widerhover:bg-[var(--brass-light)] hover:bg-[var(--brass-light)] hover:text-black transition-colors">
            View All Projects
          </button>
        </div>
      </section>

      {/* Note: Fix make this animation carousel  */}
      {/* TESTIMONIALS */}
      <section
        id="testimonials"
        className="py-24 overflow-hidden"
      >
        <div className="px-8 md:px-20 mb-14">
          <p className="text-[var(--brass)] text-s font-bold tracking-widest mb-2 uppercase">
            Client Testimonials
          </p>
          <h2 className="text-4xl font-bold tracking-tight">
            Stories Behind the Work
          </h2>
        </div>
        <div className="space-y-5">
          {[0, 1].map((row) => (
            <div
              key={row}
              className={`flex ${row === 0 ? "animate-scroll-left" : "animate-scroll-right"} whitespace-nowrap`}
              style={{ willChange: "transform" }}
            >
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div
                  key={i}
                  className="shrink-0 w-80 mx-3 bg-white/5 border border-white/10 rounded-2xl p-6 whitespace-normal inline-block"
                >
                  <div className="flex mb-3">
                    {[...Array(t.rating)].map((_, j) => (
                      <span key={j} className="text-[var(--brass)] text-sm">
                        {"\u2605"}
                      </span>
                    ))}
                  </div>
                  <p className="text-white/75 text-sm leading-relaxed mb-4">
                    "{t.quote}"
                  </p>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-[var(--ash)] text-xs mt-0.5">
                    {t.role}, {t.company}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <section
        id="quote"
        className="py-32 px-8 text-center bg-[var(--brass)] text-black relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMiIgZmlsbD0iIzAwMCI+PC9jaXJjbGU+Cjwvc3ZnPg==')] mix-blend-multiply" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase leading-none">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl md:text-2xl font-medium mb-10 max-w-2xl mx-auto opacity-80">
            Our masonry experts are here to help you select, estimate, and
            supply the perfect materials.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-black rounded-full text-white px-10 py-5 text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors shadow-2xl">
              Request a Quote Today
            </button>
            <button className="bg-transparent rounded-full border-2 border-black text-black px-10 py-5 text-sm font-bold uppercase tracking-wider hover:bg-black/5 transition-colors">
              Consult with an Expert
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
