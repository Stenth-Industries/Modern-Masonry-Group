import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Phone } from 'lucide-react';
import Footer from './Footer';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function UnderConstruction({ navigate }) {
  return (
    <div className="min-h-screen relative font-sans text-white flex flex-col items-center">

      {/* Background */}
      <div className="fixed inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/bg.png')" }} />
      <div className="fixed inset-0 z-0 bg-black/60" />

      <div className="relative z-10 mt-20 sm:mt-32 mb-8 mx-auto w-[min(92vw,88vh)] aspect-square border border-[#c9a449]/40 flex flex-col px-5 sm:px-14 md:px-20 py-8 sm:py-10 [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_90%)]">

        {/* ── Top: main message ── */}
        <div className="flex-1 flex flex-col justify-center items-center text-center">

          {/* Label */}
          <motion.div {...fade(0)} className="mb-6 flex items-center gap-3">
            <span className="text-[var(--brass)] text-[13px] font-bold tracking-[0.3em] uppercase">
              Currently In Development
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            {...fade(0.1)}
            className="text-[40px] sm:text-[54px] md:text-[68px] lg:text-[80px] leading-[0.92] tracking-tighter text-[var(--limestone)] font-black mb-6"
          >
            We're Refining<br />
            <span className="text-[var(--brass)]">Every Last Detail.</span>
          </motion.h1>

          {/* Body */}
          <motion.p
            {...fade(0.2)}
            className="text-[var(--ash)] text-[17px] sm:text-[19px] max-w-xl leading-relaxed font-light mb-6 mx-auto"
          >
            This section is currently being finalized and will be available shortly. In the meantime, our team is ready to help with any product inquiries, availability, or project requirements. Either call us directly or visit our showroom, where you can browse through a wide selection of 10,000+ products. See the materials up close, touch them, and experience the feeling in person before choosing what's right for your project.
          </motion.p>

          {/* Call CTA highlight */}
          <motion.a
            {...fade(0.28)}
            href="tel:+19059390695"
            className="group inline-flex items-center gap-2 mb-8 text-[var(--ash)] hover:text-white/70 transition-colors duration-300"
          >
            <Phone size={13} className="text-[var(--brass)] flex-shrink-0" />
            <span className="text-[15px] font-bold tracking-wide">
              For faster assistance &mdash; <span className="text-[var(--brass)] group-hover:underline underline-offset-4">call us directly</span>
            </span>
          </motion.a>

          {/* Buttons */}
          <motion.div {...fade(0.3)} className="flex flex-wrap justify-center items-center gap-5">
            <button
              onClick={() => navigate('#contact')}
              className="group relative overflow-hidden border border-[var(--brass)]/50 text-[var(--brass)] px-5 sm:px-8 py-3 sm:py-4 text-[12px] font-bold uppercase tracking-[0.2em] hover:text-black transition-colors duration-300 flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                Inquire Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <span className="absolute inset-0 bg-[var(--brass)] -translate-x-full group-hover:translate-x-0 transition-transform duration-400 ease-out" />
            </button>
            <button
              onClick={() => navigate('#home')}
              className="text-white/35 text-[13px] font-bold tracking-[0.2em] uppercase hover:text-white transition-colors duration-200"
            >
              &larr; Return Home
            </button>
          </motion.div>
        </div>

      </div>

      {/* ── Bottom: contact strip ── */}
      <motion.div
        {...fade(0.45)}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-20 border-t border-[var(--brass)]/20 py-8 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-0"
      >
        {/* Showroom */}
        <div className="sm:pr-12 sm:border-r border-[var(--brass)]/15 flex items-start gap-4">
          <div className="w-10 h-10 shrink-0 rounded-full border border-[var(--brass)]/30 flex items-center justify-center mt-0.5">
            <MapPin size={16} className="text-[var(--brass)]" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-[var(--brass)] mb-2">Showroom</p>
            <p className="text-[var(--limestone)] text-[18px] leading-snug mb-1">
              7195 Highway 9, Schomberg ON
            </p>
            <p className="text-[var(--ash)] text-[13px] tracking-wide">
              Mon &ndash; Fri &nbsp;8 am &ndash; 5 pm &nbsp;&middot;&nbsp; Sat &nbsp;9 am &ndash; 2 pm
            </p>
          </div>
        </div>

        {/* Direct Line */}
        <div className="sm:pl-12 flex items-start gap-4">
          <div className="w-10 h-10 shrink-0 rounded-full border border-[var(--brass)]/30 flex items-center justify-center mt-0.5">
            <Phone size={16} className="text-[var(--brass)]" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-[var(--brass)] mb-2">Direct Line</p>
            <a
              href="tel:+19059390695"
              className="text-[var(--limestone)] text-[28px] sm:text-[32px] leading-none tracking-tight hover:text-[var(--brass)] transition-colors duration-200 block mb-1"
            >
              +1 905 939 0695
            </a>
            <p className="text-[var(--ash)] text-[13px] leading-relaxed">
              Available during showroom hours for product &amp; project inquiries.
            </p>
          </div>
        </div>
      </motion.div>

      <Footer />

    </div>
  );
}
