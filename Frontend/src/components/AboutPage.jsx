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
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] brightness-75" 
          src="https://usbrick.com/wp-content/uploads/2024/09/4279-476c-ba9c-4ff2bf93a2f9.mov" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center h-full text-center">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl lg:text-[120px] font-black text-white uppercase tracking-tighter leading-none shadow-sm"
          >
            BORN HERE.<br/>BUILT HERE.
          </motion.h1>
          <motion.span 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-3xl text-[var(--brass)] mt-6 font-light uppercase tracking-widest drop-shadow-md"
          >
            Since 1939
          </motion.span>
        </div>
      </section>

      {/* OUR ROOTS */}
      <section className="relative py-24 px-8 md:px-20 bg-black z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-start">
          <div className="w-full md:w-1/2">
            <FadeUp>
              <h2 className="text-[var(--brass)] text-4xl md:text-5xl font-bold mb-6 tracking-tight">Our Roots</h2>
            </FadeUp>
            <FadeUp delay={0.2} className="text-[var(--ash)] text-lg mb-10 leading-relaxed font-light">
              <p className="mb-6">
                US Brick was born from the acquisition of Carolina Ceramics, a family-owned firebrick manufacturer founded in 1939 in Columbia, South Carolina. This rich legacy of craftsmanship and dedication to quality laid the foundation for who we are today.
              </p>
              <p>
                Since our inception in 2020, we have increased our production capabilities from 60 million to 350 million bricks annually and expanded our operations to include manufacturing facilities in Tennessee, Alabama, and Indiana. As we continue to grow, we remain focused on crafting relationships as strong as the products we produce. Our success is driven by our core values: flexibility, customer advocacy, teamwork and personal responsibility.
              </p>
            </FadeUp>
            
            <FadeUp delay={0.3} className="flex flex-col gap-2">
               <Accordion title="Our Craft">
                 <p className="mb-4">Building on the classic collections inherited from various Legacy Brands, we’re continuously expanding our product offerings to meet diverse architectural and modern-day needs. We believe in the power of local inspiration, drawing from the unique charm and history of our surroundings to create products that unite tradition with modern aesthetics.</p>
                 <p>Beyond brick, we also supply a wide range of materials from hardscapes and stone to premium shutters and outdoor living kits.</p>
               </Accordion>
               <Accordion title="Our Approach">
                 <p>We view every interaction as an opportunity to build a lasting relationship. We’re here to guide you every step of the way, providing quick support and, if needed, connecting you with the right sources to ensure your project’s success.</p>
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
               <img src="https://usbrick.com/wp-content/uploads/2024/09/d010b39f73e25a438e3a94731371b76d-scaled.jpeg" alt="Meet Our CEO" className="w-full h-auto object-cover grayscale-[0.2] transition-transform duration-1000 group-hover:scale-105" />
             </FadeUp>
           </div>
           <div className="w-full md:w-1/2">
              <FadeUp>
                 <h2 className="text-white text-4xl md:text-5xl font-bold mb-6 tracking-tight">Meet Our CEO, Mikee</h2>
              </FadeUp>
              <FadeUp delay={0.2} className="text-[var(--ash)] text-lg leading-relaxed mb-8 font-light">
                 <p className="mb-6">Mikee Johnson, the driving force behind US Brick, exemplifies leadership characterized by a hands-on, accountable approach. Growing up in Orangeburg, South Carolina, Mikee’s journey began in his family’s business, Cox Industries. From a summer laborer in 1985 to CEO in 2008, he’s always believed in the importance of community involvement and leadership beyond the boardroom. In 2020, he transitioned from ‘sticks to bricks’ by acquiring Carolina Ceramics, leading to the founding of US Brick.</p>
                 <p>Today, Mikee remains actively involved in the company’s daily operations. He drives his team to celebrate successes, tackle challenges head-on, and take initiative. His proactive and empowering leadership style encourages team members to lead by example and stay responsive to each other’s needs. As he often says, “Success comes from making more good decisions than bad.”</p>
              </FadeUp>
              <FadeUp delay={0.3}>
                 <Accordion title="Continue Reading">
                    <p className="mb-4">Outside of US Brick, Mikee is an avid outdoorsman and family man, devoted to his wife Cyndi and their three children, Brady, Lilly Rae, and Causey, and grandson William. Academically, he holds a degree in English and Political Science from Furman University and two MBAs—one from Kennesaw State University, focusing on Family Business, and another from the Darla Moore School of Business at the University of South Carolina.</p>
                    <p>He has received numerous accolades, including South Carolina Business Leader of the Year and the Order of the Palmetto. Through his transformative leadership, Mikee has turned US Brick into a close-knit family dedicated to excellence, integrity, and making a significant impact both inside and outside the workplace.</p>
                 </Accordion>
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
      <section className="relative py-32 bg-[#0a0a0a] overflow-hidden z-10 border-t border-white/5">
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
      </section>

      {/* GIVE US A SHOUT */}
      <section className="relative py-24 px-8 md:px-20 bg-black border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-center">
           <div className="w-full md:w-1/2">
              <FadeUp>
                 <h2 className="text-[var(--brass)] text-4xl md:text-5xl font-bold mb-6 tracking-tight">Give Us a Shout</h2>
              </FadeUp>
              <FadeUp delay={0.2} className="text-[var(--ash)] text-lg leading-relaxed mb-10 font-light">
                 <p>We’re here to help! Whether you are working directly with us or through our extensive network of distributors, you can count on us to be there with the support you need.</p>
              </FadeUp>
              <FadeUp delay={0.4}>
                 <button onClick={() => navigate('#contact')} className="bg-transparent border border-[var(--brass)] text-[var(--brass)] px-10 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[var(--brass)] hover:text-black transition-colors rounded-full flex items-center gap-3">
                   Get in Touch <ArrowRight size={16} />
                 </button>
              </FadeUp>
           </div>
           <div className="w-full md:w-1/2">
             <FadeUp delay={0.3} className="relative overflow-hidden rounded-sm group">
               <img src="https://usbrick.com/wp-content/uploads/2024/09/05853e6ea60ef9c81013003cc0a8221b-scaled.jpeg" alt="Give Us A Shout" className="w-full h-auto object-cover grayscale-[0.2] transition-transform duration-1000 group-hover:scale-105" />
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
