import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Phone } from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function UnderConstruction({ navigate }) {
  return (
    <div className="h-screen relative font-sans text-white flex flex-col overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/bg.png')" }} />
      <div className="fixed inset-0 z-0 bg-black/60" />

      <div className="relative z-10 flex flex-col h-full w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-20">

        {/* ── Top: main message ── */}
        <div className="flex-1 flex flex-col justify-center">

          {/* Label */}
          <motion.div {...fade(0)} className="mb-6 flex items-center gap-3">

            <span className="text-[#c9a449] text-[11px] font-bold tracking-[0.3em] uppercase">
              Currently In Development
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            {...fade(0.1)}
            className="text-[44px] sm:text-[60px] md:text-[76px] lg:text-[90px] leading-[0.92] tracking-tighter text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            We're Refining<br />
            <em className="text-[#c9a449]">Every Last Detail.</em>
          </motion.h1>

          {/* Body */}
          <motion.p
            {...fade(0.2)}
            className="text-white/50 text-[17px] sm:text-[19px] max-w-xl leading-relaxed font-light mb-8"
          >
            This section is currently being finalized and will be available shortly. In the meantime, our team is ready to help with any product questions, availability, or project requirements.

            For faster assistance, please call us directly and we’ll be happy to guide you.
          </motion.p>

          {/* Buttons */}
          <motion.div {...fade(0.3)} className="flex flex-wrap items-center gap-5">
            <button
              onClick={() => navigate('#contact')}
              className="group relative overflow-hidden border border-[#c9a449]/50 text-[#c9a449] px-8 py-4 text-[12px] font-bold uppercase tracking-[0.2em] hover:text-black transition-colors duration-300 flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                Inquire Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <span className="absolute inset-0 bg-[#c9a449] -translate-x-full group-hover:translate-x-0 transition-transform duration-400 ease-out" />
            </button>
            <button
              onClick={() => navigate('#home')}
              className="text-white/35 text-[13px] font-bold tracking-[0.2em] uppercase hover:text-white transition-colors duration-200"
            >
              ← Return Home
            </button>
          </motion.div>
        </div>

        {/* ── Bottom: contact strip ── */}
        <motion.div
          {...fade(0.45)}
          className="border-t border-[#c9a449]/20 py-8 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-0"
        >
          {/* Showroom */}
          <div className="sm:pr-12 sm:border-r border-[#c9a449]/15 flex items-start gap-4">
            <div className="w-10 h-10 shrink-0 rounded-full border border-[#c9a449]/30 flex items-center justify-center mt-0.5">
              <MapPin size={16} className="text-[#c9a449]" />
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-[#c9a449] mb-2">Showroom</p>
              <p className="text-white text-[18px] leading-snug mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                7195 Highway 9, Schomberg ON
              </p>
              <p className="text-white/40 text-[13px] tracking-wide">
                Mon – Fri &nbsp;8 am – 5 pm &nbsp;·&nbsp; Sat &nbsp;9 am – 2 pm
              </p>
            </div>
          </div>

          {/* Direct Line */}
          <div className="sm:pl-12 flex items-start gap-4">
            <div className="w-10 h-10 shrink-0 rounded-full border border-[#c9a449]/30 flex items-center justify-center mt-0.5">
              <Phone size={16} className="text-[#c9a449]" />
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-[#c9a449] mb-2">Direct Line</p>
              <a
                href="tel:+19059390695"
                className="text-white text-[28px] sm:text-[32px] leading-none tracking-tight hover:text-[#c9a449] transition-colors duration-200 block mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                +1 905 939 0695
              </a>
              <p className="text-white/40 text-[13px] leading-relaxed">
                Available during showroom hours for product &amp; project inquiries.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
