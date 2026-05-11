import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import Footer from './Footer';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function UnderConstruction({ navigate }) {
  return (
    <div className="min-h-screen relative font-sans text-white flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/bg.png')" }} />
      <div className="fixed inset-0 z-0 bg-black/70" />

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Hero */}
        <div className="flex-grow flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">

          {/* Status pill */}
          <motion.div {...fade(0)} className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#c9a449]/30 bg-[#c9a449]/5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a449] animate-pulse" />
            <span className="text-[#c9a449] text-[10px] font-bold tracking-[0.28em] uppercase">
              Currently In Development
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            {...fade(0.1)}
            className="text-[38px] sm:text-[56px] md:text-[72px] leading-[0.92] tracking-tight text-[#e3decb] max-w-3xl mx-auto mb-7"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            We're Refining<br />
            <em>Every Last Detail.</em>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            {...fade(0.2)}
            className="text-white/45 text-[16px] sm:text-[18px] max-w-lg mx-auto leading-relaxed mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            This section of our website is still being developed. We apologise
            for the inconvenience — it will be live shortly.
          </motion.p>
          <motion.p
            {...fade(0.25)}
            className="text-white/30 text-[15px] max-w-md mx-auto leading-relaxed mb-14"
          >
            In the meantime, our studio is open and our team is ready to help
            with any inquiry or product request.
          </motion.p>

          {/* Divider */}
          <motion.div {...fade(0.3)} className="w-12 h-px bg-[#c9a449]/40 mx-auto mb-14" />

          {/* Contact cards */}
          <motion.div
            {...fade(0.35)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl mx-auto"
          >
            {/* Showroom card */}
            <div className="group relative p-7 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm hover:border-[#c9a449]/40 hover:bg-[#c9a449]/[0.04] transition-all duration-400 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#c9a449]/10 border border-[#c9a449]/20 flex items-center justify-center mb-5">
                <MapPin size={18} className="text-[#c9a449]" />
              </div>
              <p className="text-[#c9a449] text-[9px] font-bold tracking-[0.28em] uppercase mb-2">Visit Our Showroom</p>
              <h3 className="text-[#e3decb] text-[18px] mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                Come See Us In Person
              </h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-1">
                1 King Street West<br />
                Brampton, ON
              </p>
              <div className="flex items-center gap-1.5 mt-4 text-white/30">
                <Clock size={12} />
                <span className="text-[12px]">Mon – Fri: 8 am – 5 pm &nbsp;·&nbsp; Sat: 9 am – 2 pm</span>
              </div>
            </div>

            {/* Call card */}
            <div className="group relative p-7 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm hover:border-[#c9a449]/40 hover:bg-[#c9a449]/[0.04] transition-all duration-400 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#c9a449]/10 border border-[#c9a449]/20 flex items-center justify-center mb-5">
                <Phone size={18} className="text-[#c9a449]" />
              </div>
              <p className="text-[#c9a449] text-[9px] font-bold tracking-[0.28em] uppercase mb-2">Give Us a Call</p>
              <h3 className="text-[#e3decb] text-[18px] mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                Speak With an Expert
              </h3>
              <a
                href="tel:18005551234"
                className="text-white/70 text-[22px] font-light tracking-wide hover:text-[#c9a449] transition-colors duration-200"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                1‑800‑555‑1234
              </a>
              <p className="text-white/30 text-[12px] mt-3">
                Our team is available during showroom hours to assist with product selection, pricing, and project planning.
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div {...fade(0.45)} className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={() => navigate('#contact')}
              className="inline-flex items-center gap-2.5 bg-[#c9a449] text-black px-7 py-3.5 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#d4b55a] transition-colors duration-200 shadow-[0_0_30px_rgba(201,164,73,0.25)]"
            >
              Send an Inquiry <ArrowRight size={14} />
            </button>
            <button
              onClick={() => navigate('#home')}
              className="text-white/40 text-[11px] font-bold tracking-[0.15em] uppercase hover:text-white transition-colors duration-200"
            >
              ← Back to Home
            </button>
          </motion.div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
