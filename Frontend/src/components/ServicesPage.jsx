import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, ArrowUpRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import Footer from './Footer';

/* ─── Data ──────────────────────────────────────────────────── */
const TRUST_BADGES = [
  { icon: '◈', label: 'Ontario Certified', sub: 'Licensed & Insured Supplier' },
  { icon: '◎', label: 'Diverse Selection', sub: '10,000+ Premium SKUs In-Stock' },
  { icon: '◉', label: 'Trade-First Culture', sub: 'Dedicated to Builders & Architects' },
  { icon: '◆', label: 'Quality Guaranteed', sub: 'Every Product Backed by Warranty' },
  { icon: '◐', label: 'Ontario Roots', sub: 'Serving the Province Since 1994' },
];

const SERVICE_CARDS = [
  {
    icon: '⬛',
    title: 'Premium Product Supply',
    desc: 'Our 10,000+ SKU inventory spans brick, natural stone, architectural block, and landscaping products — carefully curated for quality and performance.',
    href: '#supply',
  },
  {
    icon: '◈',
    title: 'Expert Consultation',
    desc: 'Work one-on-one with seasoned masonry specialists who collaborate with architects, designers, and general contractors to select the right materials.',
    href: '#consultation',
  },
  {
    icon: '▶',
    title: 'Project-Ready Delivery',
    desc: 'Our dedicated fleet delivers directly to your job site across Ontario in 2–5 business days. Reliable, insured, and handled with care.',
    href: '#delivery',
  },
  {
    icon: '◆',
    title: 'Trade Partnerships',
    desc: 'Unlock preferred pricing, net-term accounts, and a dedicated account rep through our contractor-focused trade program.',
    href: '#trade',
  },
];

const SPLIT_SECTIONS = [
  {
    id: 'supply',
    tag: 'Product Supply',
    title: 'Ontario\'s Largest Masonry Inventory',
    intro: 'When your project demands the best, MMG delivers. We stock one of Ontario\'s most comprehensive masonry collections, sourced from North America\'s most trusted manufacturers.',
    full: 'Whether you\'re a homebuilder specifying brick for a luxury estate or a commercial contractor sourcing architectural block for a mixed-use development, we have the materials you need — in stock, today. Our team curates every product line with durability, aesthetics, and structural performance in mind, so you never have to compromise on vision or timeline.',
    features: [
      'Over 10,000 SKUs across brick, stone, block & landscaping',
      'Top brands: Brampton Brick, Unilock, Techo-Bloc & more',
      'Guaranteed in-stock availability on core products',
      'Sample program for rapid client approval',
    ],
    img: 'https://images.unsplash.com/photo-1564013434775-f71db0030976?auto=format&fit=crop&w=1200&q=80',
    imgLeft: false,
  },
  {
    id: 'consultation',
    tag: 'Design Guidance',
    title: '30+ Years of Masonry Expertise At Your Side',
    intro: 'Specifying the wrong material costs time and money. Our masonry consultants bridge the gap between your vision and what actually works on site.',
    full: 'We collaborate directly with architects, landscape designers, and general contractors from concept through completion. Whether you\'re reviewing finish options for a heritage restoration or selecting retaining wall systems for a hillside development, our team provides the technical knowledge and material insight to help you make the right call every time.',
    features: [
      'Material specification and product matching',
      'In-showroom and on-site consultation available',
      'Blueprint review and structural compatibility',
      'Heritage restoration sourcing expertise',
    ],
    img: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80',
    imgLeft: true,
  },
  {
    id: 'delivery',
    tag: 'Logistics',
    title: 'Fleet Delivery. Province-Wide. On Time.',
    intro: 'Your build schedule doesn\'t wait. Neither do we. MMG\'s dedicated delivery fleet brings your materials directly to the job site, safely and on schedule.',
    full: 'With guaranteed 2–5 business day lead times on standard in-stock orders and province-wide route coverage, you can count on MMG to keep your project moving. Our drivers are trained in safe handling of masonry materials, and every load is documented and trackable from our warehouse to your site.',
    features: [
      'Province-wide delivery network across Ontario',
      '2–5 business day lead times on in-stock orders',
      'Trained drivers with masonry handling expertise',
      'Trackable deliveries with delivery confirmation',
    ],
    img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
    imgLeft: false,
  },
  {
    id: 'trade',
    tag: 'Trade Program',
    title: 'The Trade Account Built for Builders',
    intro: 'Stop paying retail. MMG\'s contractor program gives you the pricing, priority, and personal support your business actually needs.',
    full: 'Open a trade account and unlock volume pricing, net-term billing, and access to a dedicated account manager who knows your project load and preferred products. We match or beat any verified Ontario quote — because your loyalty deserves a genuine return. From small renovation contractors to major developers, MMG trade partners build more for less.',
    features: [
      'Preferred volume pricing — we match any Ontario quote',
      'Net-term billing for qualified contractors',
      'Dedicated account manager for every trade partner',
      'Priority order processing and fulfillment',
    ],
    img: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80',
    imgLeft: true,
  },
  {
    id: 'design-support',
    tag: 'Design Support',
    title: 'Architect, Engineer & Designer Services',
    intro: 'We help bridge design and constructability so that your project comes to life just as you envisioned it.',
    full: 'From material selection to structural design assistance, our team offers free technical support at any stage of your building\'s lifecycle. We provide comprehensive conceptual engineering and lifecycle analysis to ensure your masonry projects are both beautiful and built to last.',
    features: [
      'Material selection guidance & Constructability review',
      'Drawing, detail, and specification review',
      'Qualified labor sample specification language',
      'Structural design assistance & Conceptual engineering',
      'Lifecycle analysis, Energy and sustainability guidance'
    ],
    img: '/logos/1746106515466.gif',
    isGif: true,
    imgLeft: false,
  },
];

/* ─── Sub-components ────────────────────────────────────────── */

function SplitSection({ section, navigate }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  const textCol = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: section.imgLeft ? 40 : -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col justify-center px-0 lg:px-12 py-12 lg:py-24"
    >
      <p className="text-[var(--brass)] text-xs font-bold tracking-[0.25em] uppercase mb-4">{section.tag}</p>
      <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-6">{section.title}</h2>
      <p className="text-[var(--ash)] text-lg leading-relaxed mb-6">{section.intro}</p>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-[var(--limestone)] text-base leading-relaxed mb-8">{section.full}</p>
            <ul className="space-y-3 mb-8">
              {section.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[var(--ash)]">
                  <CheckCircle2 size={16} className="text-[var(--brass)] mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center gap-4 mt-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-[var(--brass)] font-bold text-sm uppercase tracking-wider hover:text-[var(--brass-light)] transition-colors"
        >
          {expanded ? 'Show Less' : 'Read More'}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <button
          onClick={() => navigate('#quote')}
          className="flex items-center gap-2 bg-[var(--brass)] text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[var(--brass-light)] transition-colors shadow-lg"
        >
          Get a Quote <ArrowUpRight size={14} />
        </button>
      </div>
    </motion.div>
  );

  const imgCol = (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden min-h-[360px] lg:min-h-[520px] group flex items-center justify-center bg-black"
    >
      {section.isGif ? (
        <img
          src={section.img}
          alt={section.title}
          className="w-full h-full object-contain max-h-[520px]"
        />
      ) : (
        <img
          src={section.img}
          alt={section.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      )}
      {!section.isGif && <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-500" />}
      {/* Brass corner accent */}
      <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[var(--brass)] opacity-60" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[var(--brass)] opacity-60" />
    </motion.div>
  );

  return (
    <div id={section.id} className="grid grid-cols-1 lg:grid-cols-2 border-b border-white/10 last:border-0">
      {section.imgLeft ? (
        <>{imgCol}{textCol}</>
      ) : (
        <>{textCol}{imgCol}</>
      )}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function ServicesPage({ navigate }) {
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 600], [0, 180]);
  const heroTextY = useTransform(scrollY, [0, 400], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0]);

  return (
    <div
      className="min-h-screen text-[var(--limestone)] font-sans selection:bg-[var(--brass)] selection:text-black bg-black"
    >
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-[80vh] min-h-[560px] flex items-center justify-center overflow-hidden">
        {/* Parallax background */}
        <motion.div style={{ y: heroBgY }} className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1800&q=80"
            alt="Masonry services background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
          {/* Diagonal overlay stripe */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/30" />
        </motion.div>

        {/* Decorative grid lines */}
        <div className="absolute inset-0 z-[1] opacity-10 pointer-events-none">
          <div className="absolute top-0 right-[20%] w-px h-full bg-white/40" />
          <div className="absolute top-[40%] left-0 w-full h-px bg-white/40" />
        </div>

        {/* Hero text */}
        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 text-center max-w-5xl px-8 mx-auto"
        >
          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[var(--brass)] text-sm font-bold tracking-[0.3em] uppercase mb-6"
          >
            Capabilities & Expertise
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.92] mb-8"
          >
            Built With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brass)] to-[var(--brass-light)]">
              Precision.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-lg md:text-xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed mb-12"
          >
            From product supply to project-ready delivery — discover the services that power Ontario's most ambitious masonry projects.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={() => navigate('#quote')}
              className="bg-[var(--brass)] text-black px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[var(--brass-light)] transition-colors flex items-center gap-2 shadow-2xl"
            >
              Get a Quote <ArrowUpRight size={16} />
            </button>
            <a
              href="#supply"
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              View Services <ArrowRight size={16} />
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-[var(--brass)] to-transparent" />
        </motion.div>
      </section>

      {/* ── TRUST BADGES BAR ─────────────────────────────────── */}
      <section className="bg-[var(--charcoal)] border-y border-white/10 py-0">
        <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-white/10">
          {TRUST_BADGES.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="flex flex-col items-center text-center px-6 py-8 group hover:bg-white/5 transition-colors duration-300 cursor-default"
            >
              <span className="text-[var(--brass)] text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">{badge.icon}</span>
              <p className="text-white text-sm font-bold uppercase tracking-wider mb-1">{badge.label}</p>
              <p className="text-[var(--ash)] text-xs leading-snug">{badge.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SERVICE CARDS GRID ───────────────────────────────── */}
      <section className="py-24 px-8 md:px-20 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-[var(--brass)] text-xs font-bold tracking-[0.25em] uppercase mb-3">What We Offer</p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Our Core Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {SERVICE_CARDS.map((card, i) => (
              <motion.a
                key={i}
                href={card.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group bg-black hover:bg-[var(--charcoal)] transition-colors duration-300 p-10 flex flex-col cursor-pointer"
              >
                <span className="text-[var(--brass)] text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 inline-block">{card.icon}</span>
                <h3 className="text-lg font-bold text-white mb-4 group-hover:text-[var(--brass)] transition-colors duration-200">{card.title}</h3>
                <p className="text-[var(--ash)] text-sm leading-relaxed flex-1">{card.desc}</p>
                <div className="mt-8 flex items-center gap-2 text-[var(--brass)] text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  Learn More <ArrowRight size={13} />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION INTRO ────────────────────────────────────── */}
      <section className="py-20 px-8 md:px-20 bg-[var(--charcoal)] text-center border-y border-white/10">
        <div className="max-w-3xl mx-auto">
          <p className="text-[var(--brass)] text-xs font-bold tracking-[0.25em] uppercase mb-4">Why MMG?</p>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Residential & Commercial Masonry Supply Across Ontario
          </h2>
          <p className="text-[var(--ash)] text-lg leading-relaxed">
            A fresh concept can do wonders, but when your vision stretches beyond surface improvements — that's where true masonry begins. At MMG, we help turn architectural blueprints into landmark buildings and everyday spaces into something exceptional. Whether you're a builder constructing an estate or a designer specifying stone for a signature project, our team is here to make sure every material reflects your goals and your budget.
          </p>
          <button
            onClick={() => navigate('#gallery')}
            className="mt-10 inline-flex items-center gap-2 border border-[var(--brass)] text-[var(--brass)] px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-full hover:bg-[var(--brass)] hover:text-black transition-colors"
          >
            View Past Projects <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── ALTERNATING SPLIT SECTIONS ───────────────────────── */}
      <section className="bg-black">
        <div className="max-w-7xl mx-auto">
          {SPLIT_SECTIONS.map((section) => (
            <SplitSection key={section.id} section={section} navigate={navigate} />
          ))}
        </div>
      </section>

      {/* ── TESTIMONIAL ──────────────────────────────────────── */}
      <section className="py-24 px-8 md:px-20 bg-[var(--charcoal)] border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[var(--brass)] text-xs font-bold tracking-[0.25em] uppercase mb-6">What Our Clients Say</p>
          <blockquote className="text-2xl md:text-3xl font-light text-white leading-relaxed mb-10 italic">
            "MMG helped us source heritage limestone for a restoration project on a tight timeline. Their team's knowledge and in-stock availability were exactly what we needed. Could not have done it without them."
          </blockquote>
          <div>
            <p className="text-white font-bold text-sm">Tom H.</p>
            <p className="text-[var(--ash)] text-xs mt-1">Heritage Contractor — Stoneworks Heritage Co.</p>
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ──────────────────────────────────────── */}
      <section className="py-32 px-8 text-center bg-[var(--brass)] text-black relative overflow-hidden">
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMiIgZmlsbD0iIzAwMCI+PC9jaXJjbGU+Cjwvc3ZnPg==')] mix-blend-multiply" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase leading-none"
          >
            Contact Our Masonry Experts Today!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-xl font-medium mb-12 max-w-2xl mx-auto opacity-80"
          >
            At MMG, we're more than a masonry supplier — we're your renovation partners, project management pros, and go-to material source.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={() => navigate('#quote')}
              className="bg-black rounded-full text-white px-10 py-5 text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors shadow-2xl flex items-center gap-2"
            >
              Get a Quote Today <ArrowUpRight size={16} />
            </button>
            <a
              href="tel:+19059390695"
              className="bg-transparent rounded-full border-2 border-black text-black px-10 py-5 text-sm font-bold uppercase tracking-wider hover:bg-black/5 transition-colors flex items-center gap-2"
            >
              Call Now: 1-905-939-0695
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
