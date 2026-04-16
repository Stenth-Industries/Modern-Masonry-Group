import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {ArrowRight, MoveRight} from 'lucide-react';
import Footer from './Footer';

// ── Cinematic Text Reveal Component ── //
const FadeInText = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function AboutPage({ navigate }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#111] text-white font-sans relative">
      
      {/* GLOBAL BACKGROUND NOISE & DARK TONE */}
      <div className="fixed inset-0 z-0">
         <div className="absolute inset-0 bg-[#0a0a0a]" />
         <div className="absolute inset-0 opacity-[0.03] mix-blend-screen pointer-events-none bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"/%3E%3C/svg%3E')" }} />
      </div>

      {/* HERO SECTION */}
      <div className="relative z-10 w-full h-[90vh] flex flex-col justify-end overflow-hidden px-6 lg:px-24 pb-24">
         {/* Parallax Image */}
         <motion.div 
           style={{ y: heroY, opacity: heroOpacity }}
           className="absolute inset-0 w-full h-[120%] bg-cover bg-center brightness-75 grayscale-[0.2]"
         >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/House.png')" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent" />
            <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#0a0a0a] to-transparent" />
         </motion.div>

         <div className="relative z-20 max-w-5xl mix-blend-lighten">
             <motion.div 
               initial={{ width: 0 }} animate={{ width: "80px" }} transition={{ duration: 1.5, ease: "easeOut" }}
               className="h-[2px] bg-[#ccab7b] mb-8" 
             />
             <motion.h1 
               initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
               className="text-[12vw] sm:text-[100px] lg:text-[140px] font-normal leading-[0.85] text-[#e3decb] tracking-tighter" 
               style={{ fontFamily: "'Playfair Display', serif" }}
             >
                The
                <br/>
                Foundation.
             </motion.h1>
         </div>
      </div>

      {/* EDITORIAL STORY SECTION */}
      <div className="relative z-10 w-full py-32 px-6 lg:px-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-start">
           
           {/* Left Big Text */}
           <div className="w-full lg:w-5/12 sticky top-40">
             <FadeInText>
               <h2 className="text-4xl md:text-5xl font-serif text-[#e3decb] leading-[1.1] tracking-tight">
                 We curate the world's most enduring and breathtaking architectural masonry.
               </h2>
             </FadeInText>
           </div>

           {/* Right Copy */}
           <div className="w-full lg:w-7/12 flex flex-col gap-12 font-light text-white/50 text-lg md:text-xl leading-relaxed">
             <FadeInText delay={0.2}>
                <p>
                  Modern Masonry Group was not founded simply to supply stone and brick. We were forged from a deep reverence for the materials that build our world. Based in Schomberg, Ontario, we serve as the critical bridge between visionary design and tangible reality.
                </p>
             </FadeInText>
             <FadeInText delay={0.3}>
                <p>
                  Our role is to be architectural concierges. Whether you are constructing a towering commercial landmark, restoring a century-old heritage site, or building a bespoke luxury estate, we source only the absolute highest echelon of commercial and natural materials. We partner with the most prestigious manufacturers across the globe—and locally—to bring unparalleled options directly to your drafting table.
                </p>
             </FadeInText>
             
             {/* Feature Image inside copy */}
             <FadeInText delay={0.4} className="my-10 h-[400px] w-full relative overflow-hidden rounded-xl border border-white/5 group">
                 <div className="absolute inset-0 bg-cover bg-center brightness-90 grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2s]" style={{ backgroundImage: "url('/Heritage.jpeg')" }} />
                 <div className="absolute inset-0 border border-white/10 rounded-xl" />
             </FadeInText>

             <FadeInText delay={0.5}>
                <p>
                  Quality is uncompromising. Every brick, every slab of natural stone, and every piece of architectural cladding that leaves our facilities is vetted to withstand generations. We believe that true luxury lies in longevity.
                </p>
             </FadeInText>
           </div>

        </div>
      </div>

      {/* THREE PILLARS */}
      <div className="relative z-10 w-full py-32 px-6 lg:px-24 border-t border-white/5 bg-[#0a0a0a]/50">
        <div className="max-w-7xl mx-auto">
           <FadeInText>
             <h3 className="text-[#ccab7b] uppercase tracking-[0.3em] text-xs font-bold mb-20 text-center">Core Pillars</h3>
           </FadeInText>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-20">
              
              <FadeInText delay={0.1} className="flex flex-col border-l border-[#ccab7b]/20 pl-8">
                 <span className="text-5xl font-serif text-white/10 mb-6">01</span>
                 <h4 className="text-xl text-[#e3decb] font-serif mb-4">Uncompromising Quality</h4>
                 <p className="text-white/40 font-light text-sm leading-relaxed">
                   From standard masonry to exotic natural stone, we only represent manufacturers and quarries that pass our stringent standards for durability, colorfastness, and structural integrity.
                 </p>
              </FadeInText>

              <FadeInText delay={0.2} className="flex flex-col border-l border-[#ccab7b]/20 pl-8">
                 <span className="text-5xl font-serif text-white/10 mb-6">02</span>
                 <h4 className="text-xl text-[#e3decb] font-serif mb-4">Concierge Service</h4>
                 <p className="text-white/40 font-light text-sm leading-relaxed">
                   We do not leave architects and builders to browse blindly. Our expert team provides dedicated sampling, custom matching, and technical specification support from concept to completion.
                 </p>
              </FadeInText>

              <FadeInText delay={0.3} className="flex flex-col border-l border-[#ccab7b]/20 pl-8">
                 <span className="text-5xl font-serif text-white/10 mb-6">03</span>
                 <h4 className="text-xl text-[#e3decb] font-serif mb-4">Enduring Aesthetics</h4>
                 <p className="text-white/40 font-light text-sm leading-relaxed">
                   We believe buildings should become more beautiful as they age. We curate materials that develop a rich patina and maintain their architectural presence for centuries.
                 </p>
              </FadeInText>

           </div>
        </div>
      </div>

      {/* CALL TO ACTION NEXT PAGE */}
      <div className="relative z-10 w-full py-40 border-t border-white/5 overflow-hidden flex items-center justify-center group cursor-pointer" onClick={() => navigate('#contact')}>
         <div className="absolute inset-0 bg-cover bg-center brightness-[0.2] transition-transform duration-[3s] group-hover:scale-105" style={{ backgroundImage: "url('/bg.png')" }} />
         <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-1000" />
         
         <div className="relative z-10 flex flex-col items-center text-center px-4">
            <span className="text-[#ccab7b] text-xs font-bold uppercase tracking-[0.4em] mb-4">Ready to Build?</span>
            <div className="flex items-center gap-6 group-hover:gap-10 transition-all duration-700 ease-out">
               <h2 className="text-5xl md:text-7xl font-serif text-[#e3decb] tracking-tight">Initiate Project</h2>
               <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:border-[#ccab7b] group-hover:text-[#ccab7b] group-hover:bg-[#ccab7b]/10 transition-all duration-500">
                  <MoveRight strokeWidth={1} className="w-8 h-8 md:w-12 md:h-12" />
               </div>
            </div>
         </div>
      </div>
      
      {/* Standard Footer */}
      <div className="relative z-10 bg-black">
        <Footer />
      </div>

    </div>
  );
}
