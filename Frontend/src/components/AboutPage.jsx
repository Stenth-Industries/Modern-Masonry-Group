import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MoveRight, Plus, Minus } from 'lucide-react';
import { InfiniteSlider } from "./ui/infinite-slider";
import Footer from './Footer';

const FadeUp = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Accordion = ({ title, children, delay = 0 }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-5 text-left hover:text-white transition-colors text-[var(--brass)] font-bold uppercase tracking-widest text-sm"
      >
        <span>{title}</span>
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--brass)]/10">
          {open ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>
      <AnimatePresence>
        {open && (
           <motion.div 
             initial={{ height: 0, opacity: 0 }} 
             animate={{ height: "auto", opacity: 1 }} 
             exit={{ height: 0, opacity: 0 }}
             transition={{ duration: 0.3 }}
             className="overflow-hidden text-[var(--ash)] leading-relaxed text-sm"
           >
             <div className="pb-5 pt-2">
               {children}
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AboutPage({ navigate }) {
  return (
    <div className="min-h-screen text-[var(--limestone)] font-sans selection:bg-[var(--brass)] selection:text-black bg-black">
      {/* GLOBAL BACKGROUND NOISE */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-screen bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"/%3E%3C/svg%3E')" }} />

      {/* HERO SECTION */}
      <section className="relative h-screen bg-black overflow-hidden flex items-center justify-center text-center px-4">
        {/* <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] brightness-75" 
          src="https://usbrick.com/wp-content/uploads/2024/09/4279-476c-ba9c-4ff2bf93a2f9.mov" 
        /> */}
        <img 
          src="https://usbrick.com/wp-content/uploads/2024/09/05853e6ea60ef9c81013003cc0a8221b-scaled.jpeg" 
          alt="Hero background" 
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.1] brightness-[0.5]" 
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-end h-full text-right px-8 md:px-20 items-end pb-24 md:pb-32">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl lg:text-[80px] font-black text-white uppercase tracking-tighter leading-none pr-20"
          >
            BORN HERE. BUILT HERE.
          </motion.h1>
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4 mt-8"
          >
            <div className="h-px w-12 bg-[var(--brass)]" />
            <span className="text-xl md:text-2xl text-[var(--brass)] font-bold uppercase tracking-[0.3em]">
              Since 1994
            </span>
          </motion.div>
        </div>
      </section>

      {/* OUR ROOTS */}
      <section className="relative py-24 px-8 md:px-20 bg-black z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-start">
          <div className="w-full md:w-1/2">
            <FadeUp>
              <h2 className="text-[var(--brass)] text-4xl md:text-5xl font-bold mb-6 tracking-tight">Our Roots</h2>
            </FadeUp>
            <FadeUp delay={0.2} className="text-[var(--ash)] text-lg mb-10 leading-relaxed ">
              <p className="mb-6">
                Modern Masonry Group was built on a foundation of craftsmanship, experience, and a vision to redefine masonry in Ontario. With decades of combined expertise in both material supply and installation, we bring together the precision of skilled artisans with a deep understanding of architectural design.
              </p>
              <p>
             From premium brick and natural stone to custom precast and limestone, our work is driven by quality, durability, and refined execution. We partner with homeowners, builders, and architects across Ontario to deliver tailored solutions and lasting results — built on precision, performance, and trust.
              </p>
            </FadeUp>
            
            <FadeUp delay={0.3} className="flex flex-col gap-2">
               <Accordion title="Our Craft">
                 <p className="mb-4">Building on years of industry experience, we continuously refine our approach to sourcing and supplying materials that meet the demands of modern architecture. Our collections are carefully curated to balance performance, durability, and timeless design ensuring every project is built with intention. Inspired by evolving architectural trends and real-world application, we work closely with builders, designers, and homeowners to deliver solutions that seamlessly bring structure and aesthetic together.</p>
                 <p>Beyond brick and stone, we offer a complete range of masonry and hardscape materials from natural stone and precast elements to outdoor living solutions. Supporting every stage of your project, we deliver with precision, reliability, and a commitment to lasting quality.</p>
               </Accordion>
               <Accordion title="Our Approach">
                 <p>We work as partners in every project offering expert guidance, responsive support, and tailored solutions from start to finish. Our focus is simple: make the process seamless and deliver results you can rely on.</p>
               </Accordion>
            </FadeUp>
          </div>
          <div className="w-full md:w-1/2">
             <FadeUp delay={0.4} className="relative overflow-hidden rounded-sm group">
               <img src="https://usbrick.com/wp-content/uploads/2024/09/b907a77e2046051c71b62f4bb5d4fcfb.png" alt="Our Roots" className="w-full h-auto object-cover grayscale-[0.2] transition-transform duration-1000 group-hover:scale-105" />
             </FadeUp>
          </div>
        </div>
      </section>

      {/* MEET OUR CEO */}
      <section className="relative py-24 px-8 md:px-20 bg-[#0a0a0a] border-y border-white/5 z-10">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row gap-16 md:gap-24 items-center">
           <div className="w-full md:w-1/2">
             <FadeUp delay={0.2} className="relative overflow-hidden rounded-sm group">
               <img src="../public/carmine-enhanced.png" alt="Meet Our CEO" className="w-full h-auto object-cover grayscale-[0.2] transition-transform duration-1000 group-hover:scale-105" />
             </FadeUp>
           </div>
           <div className="w-full md:w-1/2">
              <FadeUp>
                 <h2 className="text-white text-4xl md:text-5xl font-bold mb-6 tracking-tight">Meet Our CEO, Carmine</h2>
              </FadeUp>
              <FadeUp delay={0.2} className="text-[var(--ash)] text-lg leading-relaxed mb-8">
                 <p className="mb-4">"I didn't start this company to build walls — I started it to build something that lasts."</p>
                 <p className="mb-4">Carmine Bruno founded Modern Masonry Group with a simple but powerful conviction: that skilled craftsmanship and modern standards belong together. Growing up with a deep respect for the trades, Carmine saw firsthand how much pride goes into building something with your hands and how little recognition that work often receives.</p>
                 <p>That passion led him to Seneca Polytechnic, where he combined a practical, hands-on education with a growing vision for what a masonry company could be not just a contractor, but a trusted partner in the communities it serves. Armed with technical knowledge and an entrepreneurial drive, Carmine set out to build a company that would raise the bar for quality, reliability, and professionalism in the industry.

Today, Modern Masonry Group is a reflection of everything Carmine believes in: meticulous attention to detail, long-lasting relationships with clients, and a team that takes as much pride in their work as he does. For Carmine, every project is personal because every structure his team builds is meant to stand the test of time, just like the values it was built on.</p>
              </FadeUp>
              <FadeUp delay={0.3}>
                 {/* <Accordion title="Continue Reading">
                    <p className="mb-4">Outside of US Brick, Mikee is an avid outdoorsman and family man, devoted to his wife Cyndi and their three children, Brady, Lilly Rae, and Causey, and grandson William. Academically, he holds a degree in English and Political Science from Furman University and two MBAs—one from Kennesaw State University, focusing on Family Business, and another from the Darla Moore School of Business at the University of South Carolina.</p>
                    <p>He has received numerous accolades, including South Carolina Business Leader of the Year and the Order of the Palmetto. Through his transformative leadership, Mikee has turned US Brick into a close-knit family dedicated to excellence, integrity, and making a significant impact both inside and outside the workplace.</p>
                 </Accordion> */}
              </FadeUp>
           </div>
        </div>
      </section>

      {/* OUR TEAM */}
      <section className="relative py-24 px-8 md:px-20 bg-black z-10">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="mb-20">
            <h2 className="text-[var(--brass)] text-4xl font-bold text-center uppercase tracking-widest">Our Team</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { name: "Chris Smith", title: "President", img: "https://usbrick.com/wp-content/uploads/2024/09/fa63b3913f0ab150c9582f18baf46775-scaled.jpeg" },
              { name: "Jed Lee", title: "Chief Operating Officer", img: "https://usbrick.com/wp-content/uploads/2024/09/6c595fd6a4057f3c2c9c9ee3e7572306-scaled.jpeg" },
              { name: "Bill Tudor", title: "Chief Manufacturing Officer", img: "https://usbrick.com/wp-content/uploads/2024/09/4ec05f543d11029d3c268998b3baabe8-scaled.jpeg" },
              { name: "Carl Keenum", title: "Chief Sales Officer", img: "https://usbrick.com/wp-content/uploads/2024/09/ab5fb02f25cb2d9f53d50ec673a9ea94-scaled.jpeg" },
              { name: "Robert Coker", title: "Chief Revenue Officer", img: "https://usbrick.com/wp-content/uploads/2024/09/9e87a52901f7fed18445e265a2bed055-1-scaled.jpeg" },
              { name: "Jay Fuqua", title: "EVP: Direct Sales", img: "https://usbrick.com/wp-content/uploads/2024/09/b94ba19bdd3eb581bbcc9731d4228565-scaled.jpeg" },
              { name: "Steve Shelton", title: "SVP of 3rd-Party Distribution", img: "https://usbrick.com/wp-content/uploads/2024/09/6193f16adbcc178300aeecbe18ac88fa-scaled.jpeg" },
              { name: "Louis Sabourin", title: "Director of Resale & Sales", img: "https://usbrick.com/wp-content/uploads/2024/09/6a4114754eebcde8c6928fac20b13704-scaled.jpeg" },
              { name: "Sarah Paige Bozardt", title: "Director of Marketing & PR", img: "https://usbrick.com/wp-content/uploads/2024/09/5394dc1de5795f67081d36cd5211484e.jpeg" },
              { name: "David Kutner", title: "Director of Operations", img: "https://usbrick.com/wp-content/uploads/2024/09/1e366b5c7b75a7c307ddc262a20dcd4d-scaled.jpeg" },
              { name: "Marcy Hartjes", title: "HR Manager", img: "https://usbrick.com/wp-content/uploads/2024/09/1328f73ef9bbb86ae77025b999dfa7b6.jpeg" },
              { name: "Bill Parker", title: "Senior Vice President of IT", img: "https://usbrick.com/wp-content/uploads/2024/09/1013da7ae2afce3171d646559f1a67df-scaled.jpeg" },
            ].map((member, i) => (
              <FadeUp delay={i * 0.05} key={i} className="flex flex-col text-center items-center group cursor-pointer">
                <div className="w-full aspect-[3/4] mb-6 overflow-hidden rounded-sm relative border border-white/5">
                   <img src={member.img} alt={member.name} className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <h3 className="text-white font-bold text-xl mb-1">{member.name}</h3>
                <p className="text-[var(--brass)] text-sm font-medium tracking-wide uppercase">{member.title}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS & AFFILIATIONS */}
      {/* <section className="relative py-32 bg-[#0a0a0a] overflow-hidden z-10 border-t border-white/5">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none mix-blend-screen" style={{ backgroundImage: "url('https://usbrick.com/wp-content/uploads/2024/07/Rectangle-113.png')" }} />
        <div className="relative z-10 w-full">
          <FadeUp className="mb-16">
            <h2 className="text-[var(--brass)] text-4xl font-bold text-center uppercase tracking-widest">Press & Affiliations</h2>
          </FadeUp>
          <div className="relative h-[80px] md:h-[120px] w-full">
            <InfiniteSlider className="flex h-full w-full items-center" duration={40} gap={60}>
              {[
                "https://usbrick.com/wp-content/uploads/2024/10/HBA.png",
                "https://usbrick.com/wp-content/uploads/2024/10/ElleDecor.png",
                "https://usbrick.com/wp-content/uploads/2024/10/BuildPerks-1.png",
                "https://usbrick.com/wp-content/uploads/2024/10/BrickIndustryAssoc.png",
                "https://usbrick.com/wp-content/uploads/2024/10/AlabamaLiving.png",
                "https://usbrick.com/wp-content/uploads/2024/10/ScoutGuide.png",
                "https://usbrick.com/wp-content/uploads/2024/10/NationalBrickResearchCenter.png",
                "https://usbrick.com/wp-content/uploads/2024/10/MCAA.png",
                "https://usbrick.com/wp-content/uploads/2024/10/ManufacturingToday.png"
              ].map((src, i) => (
                <img key={i} src={src} alt="Press" className="h-12 md:h-20 w-auto object-contain brightness-0 invert opacity-40 hover:opacity-100 transition-opacity duration-300" />
              ))}
            </InfiniteSlider>
          </div>
        </div>
      </section> */}

      {/* GIVE US A SHOUT */}
      <section className="relative py-24 px-8 md:px-20 bg-black border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-center">
           <div className="w-full md:w-1/2">
              <FadeUp>
                 <h2 className="text-[var(--brass)] text-4xl md:text-5xl font-bold mb-6 tracking-tight">Give Us a Shout</h2>
              </FadeUp>
              <FadeUp delay={0.2} className="text-[var(--ash)] text-lg leading-relaxed mb-10 ">
                 <p>We're here to help. Whether you're a homeowner planning your next project, a builder looking for a reliable masonry partner, or an architect sourcing premium materials the Modern Masonry Group team is ready to step in and make things happen.

Working directly with us or through our extensive network of distributors across Ontario, you can count on responsive support, expert guidance, and a team that genuinely cares about getting it right. No project is too big, no question too small we're in your corner from the first call to the final stone.</p>
              </FadeUp>
              <FadeUp delay={0.4}>
                 <button onClick={() => navigate('#contact')} className="bg-transparent border border-[var(--brass)] text-[var(--brass)] px-10 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[var(--brass)] hover:text-black transition-colors rounded-full flex items-center gap-3">
                   Get in Touch <ArrowRight size={16} />
                 </button>
              </FadeUp>
           </div>
           <div className="w-full md:w-1/2">
             <FadeUp delay={0.3} className="relative overflow-hidden rounded-sm group">
               <img src="../public/2024-06-07.webp" alt="Give Us A Shout" className="w-[80%] h-auto object-cover grayscale-[0.2] transition-transform duration-1000 group-hover:scale-105" />
             </FadeUp>
           </div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="relative z-20">
        <Footer />
      </div>

    </div>
  );
}
