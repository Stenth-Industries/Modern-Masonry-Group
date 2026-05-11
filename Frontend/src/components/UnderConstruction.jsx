import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import Footer from './Footer';
import { ProgressiveBlur } from './ui/progressive-blur';

export default function UnderConstruction({ navigate }) {
  return (
    <div className="min-h-screen relative font-sans text-white selection:bg-[var(--brass)] selection:text-black flex flex-col overflow-hidden">
      
      {/* Progressive Blur Overlays for Obsidian Aesthetic */}
      <ProgressiveBlur direction="top" className="absolute top-0 w-full h-48 z-0 opacity-80" />
      <ProgressiveBlur direction="bottom" className="absolute bottom-0 w-full h-48 z-0 opacity-80" />

      {/* Decorative Gradients exactly as used in the rest of the app */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_15%_50%,rgba(201,164,73,0.055),transparent)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,164,73,0.12),transparent_70%)] pointer-events-none z-0" />
      
      <div className="relative z-10 flex flex-col flex-grow w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-20 pt-32 pb-24">
        
        {/* Main Content Area */}
        <div className="flex-grow flex flex-col justify-center items-center text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-10"
          >
            <div className="inline-block border-b border-[var(--brass)]/30 pb-2">
              <span className="text-[var(--brass)] text-[11px] font-bold tracking-[0.3em] uppercase">
                Currently In Development
              </span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[56px] sm:text-[72px] md:text-[90px] lg:text-[110px] leading-[0.9] tracking-tighter text-white mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            We're Refining<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brass)] to-[var(--brass-light)] italic pr-4">
              Every Last Detail.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[var(--text-secondary)] text-[18px] sm:text-[20px] md:text-[22px] max-w-2xl leading-relaxed font-light mb-16"
          >
            This section of our website is still being developed. We apologise for the inconvenience — it will be live shortly. In the meantime, our showroom is open and our team is ready to help with any product requests.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <button
              onClick={() => navigate('#contact')}
              className="group relative overflow-hidden bg-transparent backdrop-blur-sm border border-[var(--brass)]/50 text-[var(--brass)] px-10 py-5 text-[12px] font-bold uppercase tracking-[0.2em] hover:border-[var(--brass)] hover:text-black transition-all duration-300 flex items-center gap-3"
            >
              <span className="relative z-10 flex items-center gap-2">
                Inquire Now <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <span className="absolute inset-0 bg-[var(--brass)] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            </button>
            <button
              onClick={() => navigate('#home')}
              className="group text-white/40 text-[15px] font-bold tracking-[0.2em] uppercase hover:text-[var(--brass)] transition-colors duration-300 flex items-center gap-2"
            >
              <span className="w-0 h-px bg-[var(--brass)] group-hover:w-6 transition-all duration-500"></span>
              Return Home
            </button>
          </motion.div>
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-28 w-full relative"
        >
          {/* Top rule */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--brass)]/35 to-transparent mb-14" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0">

            {/* Showroom */}
            <div className="md:pr-16 md:border-r border-[var(--brass)]/15">
              <p className="text-[12px] font-bold tracking-[0.35em] uppercase text-[var(--brass)] mb-6">
                Showroom
              </p>
              <p className="text-white text-[28px] sm:text-[34px] leading-[1.15] tracking-tight mb-1" style={{ fontFamily: "var(--font-display)" }}>
                7195 Highway 9
              </p>
              <p className="text-white/40 text-[20px] sm:text-[24px] leading-snug tracking-tight italic mb-8" style={{ fontFamily: "var(--font-display)" }}>
                Schomberg, ON
              </p>
              <div className="flex items-center gap-4 text-[14px] tracking-[0.12em] uppercase">
                <span className="text-white/60">Mon – Fri</span>
                <span className="text-white/80 font-medium">8 am – 5 pm</span>
                <span className="w-px h-4 bg-[var(--brass)]/30" />
                <span className="text-white/60">Sat</span>
                <span className="text-white/80 font-medium">9 am – 2 pm</span>
              </div>
            </div>

            {/* Direct Line */}
            <div className="md:pl-16 flex flex-col justify-between gap-6">
              <p className="text-[12px] font-bold tracking-[0.35em] uppercase text-[var(--brass)] mb-6">
                Direct Line
              </p>
              <a
                href="tel:+19059390695"
                className="text-white text-[36px] sm:text-[48px] lg:text-[56px] leading-none tracking-tight hover:text-[var(--brass)] transition-colors duration-300 block"
                style={{ fontFamily: "var(--font-display)" }}
              >
                +1 905 939 0695
              </a>
              <p className="text-white/35 text-[16px] leading-relaxed max-w-sm font-light">
                Our specialists are available during showroom hours to assist with product selection, pricing, and project planning.
              </p>
            </div>

          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}
