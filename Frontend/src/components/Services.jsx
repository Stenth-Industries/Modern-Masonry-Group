import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
  useMotionTemplate,
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
      "Source from our expansive, curated inventory of premium architectural brick, natural stone, and hardscaping systems. We partner exclusively with the world's most disciplined manufacturers to ensure every material we supply meets the highest standards of durability and aesthetic refinement.",
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
      "Leverage decades of specialized masonry expertise. Whether you are an architect orchestrating a heritage restoration or a builder refining a modern facade, our specialists collaborate closely with you to ensure your vision is realized with the perfect materials.",
    bullets: [
      "Comprehensive specification for architectural drawings",
      "Expert colour, texture & finish curation",
      "Code-compliant technical recommendations",
      "Dedicated on-site and virtual consultations",
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
      "Experience seamless logistics with our dedicated fleet, delivering directly to job sites across Ontario. We prioritize rigorous order tracking and careful pallet staging, coordinating directly with site supervisors to ensure materials arrive precisely when required.",
    bullets: [
      "Guaranteed 2–5 business day lead times",
      "Pallet delivery with crane off-load available",
      "Real-time logistical tracking",
      "Express delivery for urgent commercial projects",
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
      "We empower contractors, builders, and architects with preferred commercial frameworks. Trade accounts unlock priority pricing, structured Net-30 terms, and dedicated account management. Over 500 active partners rely on MMG to keep their projects competitive and fully supplied.",
    bullets: [
      "Preferred pricing tiers on all catalogue lines",
      "Structured Net-30 payment terms",
      "Dedicated commercial account representative",
      "Tender & volume pricing upon request",
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
    headline: "Tactile Evaluation. Total Confidence.",
    description:
      "Visit our Schomberg showroom—a meticulously designed space intended for tactile exploration. Review large-scale material vignettes, compare complex textures side by side, and consult directly with our product specialists in an environment built to inspire design confidence.",
    bullets: [
      "Comprehensive display vignettes for every line",
      "Precise side-by-side colour & texture evaluation",
      "Architectural product specialists on-site Mon–Sat",
      "Extensive sample library for design firms",
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
    headline: "Order Samples. Decide with Certainty.",
    description:
      "Make critical design decisions with absolute certainty. Request physical material samples from across our entire catalogue, rapidly dispatched to your firm or residence. This is an essential service for client presentations, mood boards, and final structural approvals.",
    bullets: [
      "Complimentary samples on select architectural lines",
      "Expedited next-day dispatch from our facility",
      "Up to 5 premium samples per request",
      "Curated bulk sample packs for trade professionals",
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
    desc: "Explore our extensive catalogue of over 10,000 premium brick, stone, and landscaping products, online or within our immersive showroom.",
  },
  {
    step: "02",
    title: "Consult",
    desc: "Engage with our technical specialists. By reviewing your architectural plans, we provide precise specifications and accurate quantity take-offs.",
  },
  {
    step: "03",
    title: "Order",
    desc: "Secure your materials with confidence. Trade professionals benefit from immediate access to net terms and proactive account support.",
  },
  {
    step: "04",
    title: "Deliver",
    desc: "Rely on coordinated logistics. Your materials arrive securely palletized, strictly on schedule, and delivered directly to your job site.",
  },
];

const WHO_WE_SERVE = [
  {
    icon: <Home size={28} />,
    title: "Homeowners",
    desc: "Refining a residential exterior, patio, or landscape? Our showroom specialists guide you from initial inspiration to final material selection, ensuring a seamless architectural process.",
    points: ["Dedicated design consultation", "Expedited sample service", "In-store aesthetic curation"],
  },
  {
    icon: <HardHat size={28} />,
    title: "Contractors & Builders",
    desc: "Depend on consistent supply lines, competitive volume pricing, and punctual delivery. MMG is structured to keep your projects advancing and your financial margins strong.",
    points: ["Structured Net-30 accounts", "Aggressive volume pricing", "Dedicated account management"],
  },
  {
    icon: <Compass size={28} />,
    title: "Architects & Designers",
    desc: "Specify with absolute assurance. We inventory Ontario's most sought-after architectural masonry lines and provide rigorous technical support for bespoke and heritage projects.",
    points: ["Extensive sample library", "Material board collaboration", "Technical specification support"],
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

const TESTIMONIALS = [
  {
    quote: "MMG supplied the architectural brick for our Yorkville mid-rise. Their specification knowledge and reliable delivery cadence are unparalleled in Ontario.",
    author: "Jonathan R.",
    role: "Lead Architect",
    firm: "Stratos Design Group"
  },
  {
    quote: "The ability to send clients to the Schomberg showroom with full confidence changes how we do business. The tactile experience combined with their expert guidance is truly professional.",
    author: "Sarah M.",
    role: "Custom Home Builder",
    firm: "M-Tier Construction"
  },
  {
    quote: "We rely heavily on their dedicated trade support network. The commercial account reps keep our profit margins tight and our build sites consistently supplied without delay.",
    author: "David K.",
    role: "Procurement Director",
    firm: "Pinnacle Developments"
  }
];

const FAQS = [
  {
    question: "Do you supply masonry for residential renovations?",
    answer: "Absolutely. While we heavily supply large-scale commercial structural projects, our showroom team frequently collaborates directly with homeowners and custom builders to specify premium materials for residential exterior renovations, facades, and hardscaping."
  },
  {
    question: "Can I request custom structural brick profiles?",
    answer: "Yes. Through our preferred network of elite manufacturers, we can source bespoke profiles, specific dimensional brick, and specialized heritage matches required for restoration projects. Lead times vary strictly by specification."
  },
  {
    question: "What is the standard delivery timeframe for in-stock materials?",
    answer: "For materials currently inventoried in our Schomberg facility, delivery within the Greater Toronto Area is typically executed within 2 to 5 business days, fully palletized and tracked."
  },
  {
    question: "Do trade accounts require a minimum annual spend?",
    answer: "Our trade accounts are built for active industry professionals. While we do not strictly enforce a rigid minimum order quantity (MOQ), preferred volume pricing tiers scale effectively with sustained volume and consistent procurement."
  }
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
  const { scrollYProgress: cardScroll } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(cardScroll, [0, 1], ["-10%", "10%"]);
  const imgScale = useTransform(cardScroll, [0, 0.5, 1], [1.1, 1, 1.1]);
  const inView = useInView(ref, { once: true, margin: "-200px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50, y: 20 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} border border-white/[0.07] rounded-2xl overflow-hidden group hover:border-[var(--brass)]/40 transition-all duration-500 hover:shadow-[0_0_60px_rgba(204,171,123,0.06)]`}
    >
      {/* Image panel with local parallax */}
      <div className="relative lg:w-[42%] aspect-[4/3] lg:aspect-auto shrink-0 overflow-hidden bg-black/50 group-hover:bg-black/40 transition-colors duration-700">
        <motion.img
          src={service.img}
          alt={service.title}
          style={{ y: imgY, scale: imgScale, transformOrigin: 'center' }}
          className="absolute inset-0 w-full h-[120%] -top-[10%] object-cover opacity-40 group-hover:opacity-65 transition-opacity duration-700 ease-out mix-blend-screen"
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
   Who We Serve 3D Card
───────────────────────────────────────────────────────────────────────────── */

function WhoWeServeCard({ w, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 300, damping: 30 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const onMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };
  
  const onMouseLeave = () => { x.set(0); y.set(0); };

  const glareBackground = useTransform(
    () => `radial-gradient(circle at ${(x.get() + 0.5) * 100}% ${(y.get() + 0.5) * 100}%, rgba(204,171,123,0.15), transparent 60%)`
  );

  return (
    <motion.div
      ref={ref}
      style={{ perspective: 1200 }}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 w-full h-full"
    >
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative p-8 rounded-2xl border border-white/[0.07] bg-black/40 backdrop-blur-md hover:border-[var(--brass)]/40 transition-colors duration-400 group cursor-default shadow-xl h-full flex flex-col"
      >
        {/* Dynamic Glare */}
        <motion.div 
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen" 
          style={{ background: glareBackground }} 
        />
        
        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--brass)]/[0.04] to-transparent skew-x-12 pointer-events-none overflow-hidden rounded-2xl"
          initial={{ x: "-100%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 0.8 }}
        />
        
        {/* Floating Content Wrapper */}
        <div style={{ transform: "translateZ(45px)", transformStyle: "preserve-3d" }} className="flex-1 flex flex-col pointer-events-none">
          {/* Corner accent */}
          <div className="absolute top-[-8px] right-[-8px] w-12 h-12 border-t-[1.5px] border-r-[1.5px] border-[var(--brass)]/30 rounded-tr-xl pointer-events-none" />

          <motion.div 
            className="text-[var(--brass)] mb-6 mt-2" 
            animate={{ rotate: [0, 8, -8, 0] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
          >
            {w.icon}
          </motion.div>
          
          <h3 className="text-xl font-normal text-[#e3decb] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {w.title}
          </h3>
          
          <p className="text-[13px] text-white/50 leading-relaxed mb-8 flex-1">
            {w.desc}
          </p>
          
          <ul className="space-y-3">
            {w.points.map((pt, j) => (
              <li key={j} className="flex items-center gap-3 text-[12px] text-white/60">
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full shrink-0" 
                  animate={{ 
                    scale: [1, 1.5, 1], 
                    backgroundColor: ["rgba(204,171,123,0.4)", "rgba(204,171,123,1)", "rgba(204,171,123,0.4)"],
                    boxShadow: ["0 0 0px rgba(204,171,123,0)", "0 0 8px rgba(204,171,123,0.8)", "0 0 0px rgba(204,171,123,0)"]
                  }} 
                  transition={{ duration: 2.5, repeat: Infinity, delay: j * 0.4 + i * 0.6 }} 
                />
                {pt}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FAQ Accordion Item
───────────────────────────────────────────────────────────────────────────── */

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border-b border-white/[0.08]"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left focus:outline-none group"
      >
        <span className={`text-[15px] font-bold transition-colors duration-300 ${isOpen ? "text-[var(--brass)]" : "text-[#e3decb] group-hover:text-white"}`}>
          {faq.question}
        </span>
        <motion.div 
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:bg-[var(--brass)]/10 transition-colors"
        >
          <span className="text-[var(--brass)] text-[20px] font-light leading-none">+</span>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-white/50 text-[14px] leading-relaxed pr-10">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────────────────────── */

export default function Services({ navigate }) {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  
  // Interactive flashlight
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    let isUserActive = false;
    
    // Auto-tease Cinematic Sweep
    const sweep1 = setTimeout(() => { if (!isUserActive) { mouseX.set(w * 0.8); mouseY.set(h * 0.3); } }, 600);
    const sweep2 = setTimeout(() => { if (!isUserActive) { mouseX.set(w * 0.2); mouseY.set(h * 0.7); } }, 1800);
    const sweep3 = setTimeout(() => { if (!isUserActive) { mouseX.set(w * 0.5); mouseY.set(h * 0.5); } }, 3200);

    const handleMouseMove = (e) => {
      isUserActive = true;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(sweep1);
      clearTimeout(sweep2);
      clearTimeout(sweep3);
    };
  }, [mouseX, mouseY]);

  const flashlightBg = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(circle 800px at ${x}px ${y}px, rgba(204,171,123,0.06), transparent 80%)`
  );

  // SCROLL HOOKS
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const globalBgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.5], [1, 0]);
  const springProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // X-RAY MASK LOGIC
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 100, mass: 0.8 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 100, mass: 0.8 });
  
  // Base radius expands massively and rapidly when scrolled down (accelerated reveal)
  const scrollRadius = useTransform(heroScroll, [0, 0.03], [22, 160]);
  const maskRadius = useSpring(scrollRadius, { damping: 30, stiffness: 120 });
  const xrayMask = useMotionTemplate`radial-gradient(circle ${maskRadius}vh at ${smoothX}px ${smoothY}px, black 0%, rgba(0,0,0,0.8) 20%, transparent 60%)`;

  return (
    <div ref={containerRef} className="min-h-screen text-white font-sans relative">

      {/* ── SCROLL PROGRESS BAR ────────────────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--brass)] to-[var(--brass-light)] z-[100] origin-left"
        style={{ scaleX: springProgress }}
      />

      {/* ── GLOBAL BACKGROUND ──────────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-[var(--obsidian)]">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center h-[115%] w-full pointer-events-none mix-blend-luminosity opacity-40" 
          style={{ backgroundImage: "url('/bg.png')", y: globalBgY }} 
        />
        {/* Dynamic Interactive Flashlight */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-10" 
          style={{ background: flashlightBg }} 
        />
      </div>
      <div className="fixed inset-0 z-0 bg-black/40 pointer-events-none" />

      <div className="relative z-10">

        {/* ── HERO: X-Ray Refraction Reality Shift ──────────────────────────── */}
        <section ref={heroRef} className="relative h-screen min-h-[850px] w-full flex items-center justify-center overflow-hidden bg-black cursor-crosshair">
          
           {/* BOTTOM LAYER (The Raw Material) */}
           <div className="absolute inset-0 z-0 bg-black">
              <motion.div 
                style={{ y: useTransform(heroScroll, [0, 1], ["0%", "15%"]) }}
                className="absolute inset-0 w-full h-[120%] bg-cover bg-center grayscale opacity-20 transition-transform duration-1000"
                style={{ backgroundImage: "url('/bg.png')" }} 
              />
              <div className="absolute inset-0 bg-black/80 mix-blend-multiply" />
              <div className="absolute inset-0 flex flex-col items-center justify-center pb-20 pointer-events-none">
                 <span className="text-white/20 tracking-[1em] text-[10px] md:text-xs uppercase mb-8 font-medium">The Foundation</span>
                 <h1 className="text-[10vw] font-black tracking-tighter text-transparent uppercase leading-[0.9] drop-shadow-2xl text-center pb-4" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.15)" }}>
                   THE RAW ELEMENT
                 </h1>
              </div>
              
              {/* Raw floating particles */}
              {[...Array(15)].map((_, i) => (
                 <motion.div
                   key={i}
                   className="absolute w-1 h-1 rounded-sm bg-white/5 pointer-events-none backdrop-blur-sm"
                   style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                   animate={{ y: [0, -60, 0], opacity: [0, 1, 0] }}
                   transition={{ duration: 7 + i, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                 />
              ))}
           </div>
 
           {/* TOP LAYER (The Finished Reality - Masked dynamically by Cursor) */}
           <motion.div 
              className="absolute inset-0 z-10 pointer-events-none"
              style={{ maskImage: xrayMask, WebkitMaskImage: xrayMask }}
           >
              {/* The completed architecture masterpiece image */}
              <motion.div 
                style={{ y: useTransform(heroScroll, [0, 1], ["0%", "20%"]), scale: 1.05 }}
                className="absolute inset-0 w-full h-[120%] bg-cover bg-center brightness-110 saturate-[1.1]"
                style={{ backgroundImage: "url('/nano_banana.png')" }} 
              />
              
              {/* Very elegant vignette to ensure text always pops */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50" />
              
              {/* The "Perfect" Reality Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pb-20">
                 <span className="text-[var(--brass-light)] tracking-[1em] text-[10px] md:text-xs uppercase mb-8 font-bold drop-shadow-[0_0_15px_rgba(0,0,0,1)]">The Masterpiece</span>
                 <h1 className="text-[12vw] font-normal tracking-tight text-white leading-[0.9] drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)] text-center pb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                   The Final Vision.
                 </h1>
              </div>
           </motion.div>

          {/* STATIC FLOATING CONTROLS (Always Visible on Top of everything) */}
          <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-8 md:p-12">
             <div className="w-full flex justify-between items-start text-white/60 text-[10px] uppercase tracking-[0.3em] font-bold">
                <span className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/10"><div className="w-2 h-2 rounded-full bg-[var(--brass)] animate-pulse shadow-[0_0_10px_#d4af37]" /> Scroll to Expand Reality</span>
                <span>Services / 01</span>
             </div>
             
             <div className="w-full flex justify-between items-end">
                <div className="max-w-[300px]">
                   <p className="text-white/40 text-[13px] leading-[2] font-light mb-8">
                     We bridge the gap between raw natural supply and unparalleled structural design across Ontario.
                   </p>
                   <MagBtn
                     onClick={() => navigate("#contact")}
                     className="flex w-fit items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brass)] hover:text-white transition-all duration-500 pointer-events-auto"
                   >
                     Partner With Us <ArrowRight size={14} />
                   </MagBtn>
                </div>
                
                <div className="hidden md:flex flex-col items-end gap-3 text-[10px] uppercase tracking-[0.3em] text-white/30 text-right font-bold">
                   <span className="hover:text-white transition-colors">Scale</span>
                   <span className="hover:text-white transition-colors">Precision</span>
                   <span className="hover:text-white transition-colors">Endurance</span>
                </div>
             </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-[25vh] bg-gradient-to-t from-[var(--obsidian)] to-transparent z-30 pointer-events-none" />
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

            {/* Desktop Sequence */}
            <div className="hidden md:flex justify-between relative mt-4">
              {/* The continuous background track */}
              <div className="absolute top-6 left-[12%] right-[12%] h-[2px] bg-white/[0.05]" />
              
              {/* The animated gold timeline that "draws" across */}
              <motion.div 
                 className="absolute top-6 left-[12%] h-[2px] shadow-[0_0_15px_rgba(204,171,123,0.5)] bg-gradient-to-r from-transparent via-[var(--brass)] to-[var(--brass-light)]"
                 initial={{ width: "0%" }}
                 whileInView={{ width: "76%" }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
              />

              {PROCESS_STEPS.map((step, i) => {
                // Calculate precise delay so the node pops right when the line reaches it
                const popDelay = 0.2 + (i * 0.45); 

                return (
                  <div key={i} className="flex flex-col items-center text-center px-4 w-[25%] relative pt-0">
                    
                    {/* Node Pop */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: popDelay }}
                      className="relative mb-8 flex items-center justify-center z-10"
                    >
                      {/* Ambient Pulse that starts slightly after pop */}
                      <motion.div
                        className="absolute inset-0 rounded-full border border-[var(--brass)]/40"
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                        viewport={{ once: true }}
                        transition={{ duration: 3, repeat: Infinity, delay: popDelay + 0.3 }}
                      />
                      
                      {/* Core Node */}
                      <motion.div
                        className="w-12 h-12 rounded-full border-[2px] border-[var(--brass)] bg-[var(--obsidian)] shadow-lg flex items-center justify-center shadow-[0_0_20px_rgba(204,171,123,0.2)]"
                        whileHover={{ scale: 1.15, borderColor: "var(--brass-light)" }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-[11px] font-black text-[var(--brass)] tracking-wider">
                          {step.step}
                        </span>
                      </motion.div>
                    </motion.div>

                    {/* Content cascade */}
                    <motion.h3 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: popDelay + 0.15 }}
                      className="text-[14px] font-bold text-[#e3decb] mb-3 uppercase tracking-[0.14em]"
                    >
                      {step.title}
                    </motion.h3>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: popDelay + 0.25 }}
                      className="text-white/40 text-[13px] leading-relaxed max-w-[220px]"
                    >
                      {step.desc}
                    </motion.p>
                  </div>
                );
              })}
            </div>

            {/* Mobile Sequence */}
            <div className="flex flex-col gap-0 md:hidden relative pt-4 pl-2">
              {/* Continuous vertical background track */}
              <div className="absolute top-8 bottom-12 left-[27px] w-[2px] bg-white/[0.05]" />
              
              {/* Animated vertical gold timeline */}
              <motion.div 
                className="absolute top-8 left-[27px] w-[2px] shadow-[0_0_15px_rgba(204,171,123,0.5)] bg-gradient-to-b from-transparent via-[var(--brass)] to-[var(--brass-light)] origin-top"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
              />

              {PROCESS_STEPS.map((step, i) => {
                const popDelay = 0.2 + (i * 0.45); 
                return (
                  <div key={i} className="flex gap-6 relative z-10 w-full mb-10 last:mb-0">
                    
                    <motion.div 
                      className="flex flex-col items-center shrink-0"
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: popDelay }}
                    >
                      <div className="relative">
                        <motion.div
                          className="absolute inset-0 rounded-full border border-[var(--brass)]/40"
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileInView={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                          viewport={{ once: true }}
                          transition={{ duration: 3, repeat: Infinity, delay: popDelay + 0.3 }}
                        />
                        <div className="w-10 h-10 rounded-full border-[2px] border-[var(--brass)] bg-[var(--obsidian)] shadow-[0_0_15px_rgba(204,171,123,0.3)] flex items-center justify-center relative">
                          <span className="text-[10px] font-black text-[var(--brass)]">
                            {step.step}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <div className="pt-1">
                      <motion.h3 
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: popDelay + 0.15 }}
                        className="text-[15px] font-bold text-[#e3decb] mb-2 uppercase tracking-widest"
                      >
                        {step.title}
                      </motion.h3>
                      
                      <motion.p 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: popDelay + 0.25 }}
                        className="text-white/45 text-[13px] leading-relaxed pr-2"
                      >
                        {step.desc}
                      </motion.p>
                    </div>
                  </div>
                );
              })}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 perspective-1000">
              {WHO_WE_SERVE.map((w, i) => (
                <WhoWeServeCard key={i} w={w} i={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── PARTNER TESTIMONIALS ──────────────────────────────────────────────── */}
        <section className="py-24 px-8 md:px-20 relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <FadeUp delay={0.1} className="mb-16">
              <p className="text-[var(--brass)] text-[11px] font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
                <motion.span className="h-px bg-[var(--brass)]" initial={{ width: 0 }} whileInView={{ width: 24 }} viewport={{ once: true }} transition={{ duration: 0.5 }} />
                Client Feedback
              </p>
              <h2 className="text-4xl lg:text-5xl font-normal text-[#e3decb] max-w-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                Trusted by Ontario's Leading Builders
              </h2>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.2 }}
                  className="p-8 rounded-2xl border border-white/[0.05] bg-gradient-to-br from-white/[0.03] to-transparent relative group"
                >
                  <div className="text-[var(--brass)]/30 absolute top-6 right-6 text-6xl font-serif pointer-events-none">"</div>
                  <p className="text-white/60 text-[14px] leading-relaxed mb-8 relative z-10 italic">
                    {t.quote}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--brass)]/10 flex items-center justify-center border border-[var(--brass)]/20">
                      <span className="text-[var(--brass)] font-bold text-[12px]">{t.author.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="text-[#e3decb] font-bold text-[13px]">{t.author}</h4>
                      <p className="text-white/40 text-[11px] uppercase tracking-wider">{t.role}, <span className="text-[var(--brass)]">{t.firm}</span></p>
                    </div>
                  </div>
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

        {/* ── FAQ SECTION ──────────────────────────────────────────────────────── */}
        <section className="py-24 px-8 md:px-20 max-w-4xl mx-auto">
          <FadeUp className="mb-14 text-center">
            <p className="text-[var(--brass)] text-[11px] font-bold tracking-[0.3em] uppercase mb-4">
              Common Inquiries
            </p>
            <h2 className="text-4xl lg:text-5xl font-normal text-[#e3decb]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Frequently Asked Questions
            </h2>
          </FadeUp>
          
          <div className="flex flex-col">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
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
                Join Over 500 Industry Professionals<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brass)] to-[var(--brass-light)]">
                  Who Trust MMG
                </span>
              </h2>
              <p className="text-white/45 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
                Establish a trade account today and gain access to preferred tier pricing, flexible Net-30 terms, a dedicated commercial account manager, and priority access to our newest architectural material collections.
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
