import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/ui/CategoryCard';
import BentoCard from '../components/ui/BentoCard';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="w-full relative">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full object-cover" 
            alt="Cinematic wide shot of a modern architectural building" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwoFoJPTbBN-92DHcRy_VZwDekNtabaYsiepeaUjS-ZI7w0YZT-HodwwZsD_mEmVG_DJqVaAg35GlfNihx6z77jhVpIcITFvFM1x-4Bg0h8IhquurUb6WJjpUMgROs068Xe-PLVcADst91f8bkZ9jEK0T19T0KJFCe2uzNjQ-EEt5D8SW2PBOvjCNzKQYp-OJFq1r1NShKtstTDF7qP130d5o4U94In2jBPvTlbrByKFKLnFoEF5jKg94G8o3w6wTkuNleNfuJfoN6" 
          />
          <div className="absolute inset-0 bg-stone-950/40"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-3xl space-y-8">
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-white font-headline text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9]"
            >
              Building Modern Spaces with Timeless Materials
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-stone-200 text-lg md:text-xl font-medium max-w-xl leading-relaxed"
            >
              Experience the intersection of architectural heritage and digital precision. We curate the world's finest masonry for the visionary architect.
            </motion.p>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link to="/estimation" className="hero-gradient text-on-primary px-10 py-4 rounded-lg font-bold text-lg shadow-2xl hover:opacity-90 transition-all flex items-center gap-2 active:scale-95">
                Request a Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-all active:scale-95">
                View Portfolio
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="flex justify-between items-end mb-16"
          >
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Our Specialties</span>
              <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-on-surface">Curated Categories</h2>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <CategoryCard 
              title="Brick" 
              description="Kiln-fired durability meeting modern aesthetic demands." 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuCDl8I7UVEvBCoxwzQJSUNGvWDW0YHhQwZgPWiX4KTQDoZCZCrZT7uudQ7Lt7mc-BVyytIXPk_99_UAj8BIYBhbf48YYHvsOOjIkkhkgfbb0IlGW1Zsy2oruyhCJeSx7NIir-9F_me6iZamsMGppXlfesXvnfyzKP2yJFwvIn3HMfwlmv8Dk7mV9A0XwaMjWPblV1C26AhBISoPt-GqTbQCpgfaQi8f154EACyqkY8lQBM6I1ecIbrqpZ5KYzbsC-IYL_lT3eDob6Pl"
              link="/masonry/brick"
            />
            <CategoryCard 
              title="Stone" 
              description="Hand-selected natural veneers for timeless organic luxury." 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuA4aN7MZDlUJew4oQ1EdDOXl2auX5tm_lXfKYXrVf605g5rEjc9SlVWx8qpK6_iO9k7x-pujwH7gWgYnElHk4LIbNOOVPGK9uYcCJy1KpIcukU5qxz6iOttaVD8WJCAOMUnW4tMTr4LXS-mVOnyH_mMM9IGZ5ERdk53XtFAgW1g5nFARriavzCdZLu4ro0Kt9f5eTYrDCfYCr1ZOA015V4XHCmYn5MboOxMvILsL4zfmNBV1MPo5hllYsinxundSY_BmaLiylByEajt"
              link="/masonry/stone"
            />
            <CategoryCard 
              title="Precast" 
              description="Precision-engineered elements for structural elegance." 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuBwRDWlhwALKEx7LV5uH00l6A9iCVEYE-29p91aKqNwWnGTXxvjavSnViWLw3wWrFNdNKPHOYXvu8lZ8Fp_bKpQgRWbCvJwARd-islUvhm2qyYoMa7Wsow6D7Mb0DkmeHt8nyOPdzwe1I_LCq-jtbS9mWiEETFlbh7DzayGCAJLce_F4P0TQlmHWaurGoBElMMzuEWfoS4-j59utdbsTK9Z-WC9Pjml38TmtBrbiVB8UdplVQR-Poeqpe-c1LGIJaYj1PqSjYfj0F9D"
              link="/masonry/precast"
            />
            <CategoryCard 
              title="Siding" 
              description="Advanced protective layers with high-end visual impact." 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuBMdLUYHqfhQdoXT_cKQ6Qf9yU-3IPHbA0CkhbRxNylRmL-rPMUTVFGKiyIjkc5sZwC8scfqaRsE_ZBMwHN7R602gTGFqIAXUQSjqpPns2YtV8BkdNt5Cuo8dWgVeaHYTcxKGTE2O39n2i9PskIRZa5pzQh2Uz1J8UEkb8km7RI-pZOJT8RfdcKYbssK48mYRwy8f5JpEVdO6xMqcjJCIDnoIRVo1PmsNVjmEf4YYMgWnwCGW5lWzFbx8kwYRnVCbOmKZSIaqqsz9xK"
              link="/masonry/siding"
            />
          </div>
        </div>
      </section>

      {/* Featured Products (Masonry/Bento Grid) */}
      <section className="py-32 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 text-center"
          >
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Signature Collection</span>
            <h2 className="text-5xl md:text-6xl font-headline font-bold tracking-tight text-on-surface">Architectural Masterpieces</h2>
          </motion.div>
          
          <div className="masonry-grid">
            <BentoCard 
              className="masonry-item-tall" 
              category="Brick" 
              title="Midnight Linear Series" 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuDuiSW_dZ7ys9HxU6t6NBC0WkeDwIlcQivtGOENnckxzpWRPSHYLpNvNE_wQenuzFu8ofLm1Z2dOeZtYv6ZqkrsbN5MZmFqWrd80SYfs6S3_wgU-e9EyBsfo0ye7-T3kjaeIQsQi09UZhY-0-NjGq0XvjS84sdZzlmx-BlXUJ2kaxmAdyrA81jHOcav1XObMju-nX2z_FB94IdVghH1eLwvoYHRHkuxzeh4L5O_ODjMn8jnE6Xj0IzXKvvFkH-pqM15nIoGN9kBScCv"
              link="/masonry/brick/midnight-linear" 
            />
            <BentoCard 
              className="masonry-item-wide" 
              category="Stone" 
              title="Artisan Limestone Large Format" 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuAewxiT3cSl3QimdQ6E3I-GI7i0iaekmc6FdOtW4Q_tplH2-3CgdktDx00M5xXZcrXqIpHRMzkeHJFeBK6ZiQHpMSEpviTAUJ09ggliIOPkGjBvQ2wkAjdDLh0G-cKKri5mIVo1BC9uT3pGjAxCvsBqSFRW0kMNxi2uwoxi6PtrNFO8sf6rC_TlYGJ_tZzqFPQ-V2b7r0CjAjEDnc5B4RhBYI6aRyQZE0R7xWPWuBUaDJbBu_UlRntAA5faJpYhv2GCz8R_V4yqg6J4"
              link="/masonry/stone/artisan-limestone" 
            />
            <BentoCard 
              className="" 
              category="Precast" 
              title="Ionic Surround Series" 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuBiI-6xeUAxfzOkktxpGuvtP46Zb8fOEJRzN1FXN6C2bVOyp6hrHFVXC7s1LgDJuKRDW7I2hqXgXBACQLcLf_icsbMsTuuUWeQQDVuN_nbi3cFoXx15zr8iKc76WNK-Mpv3_J4d-vMU01i2mJkPa97hbMEEByD09WERLLoPlQLTgBz8asaPh_Q9S1qkDJVcI8L5Cjkb6xvhd1zVM7dyxDQzRuhTagc6SqXFHDj49f-7oK6qTcae_Vaqsd3WS8DbBakpUFHvVxhZkIq9"
              link="/masonry/precast/ionic-surround" 
            />
            <BentoCard 
              className="masonry-item-tall" 
              category="Natural Stone" 
              title="Alpine Slate Mosaic" 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuCuxQ9F3oV4LJEIHuI8YgUzGPhSxxI-IJ0GGBrjyYdjCFmEL9ckcONNB1ttgjfXdwSI4ChndEAUIqFzYT1wmNmNQwCFwimKKDjkn3OcJfT076YJWDiGABHnXRcdAjSepHCXxMKIxT39msX3AKOPR_xwKhxoW9YIJCm18Qdvd9rnTs1kGfy5HBlvriVU2bmGb2Tx9NR_v9r4Ar0__78nubW9r0CTd6zxy6oQa-4b69RppIDGr-KME6HfoicwHL1T5IW7lZrW2GBqW8_q"
              link="/masonry/stone/alpine-slate" 
            />
            <BentoCard 
              className="masonry-item-wide" 
              category="Siding" 
              title="Vantage Panel System" 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuBV0Ht4SlCzG9_gzK6SbkwmmBKlk9ox-Bl_8enNokImoHxNw1T33LlxaFbmcCLFuseTDjtO2RGR1WTAEExtPsZCm8Jew8ePPfwBb1rxKeGtX3SUl9ZOlyL3SooXOXCAnsLJ2Xj_O2gmOiP4kAYMArq3k7jaO7Vu8ZJn6OmfbHPlIrPT4gQVWuo0B7dR0qbZA4lC98S8cINxPD2vcq2tciwhMYt79v131FsXUV7bAykiwGj1HnzZ2vzyCi7EuXHHuusmSsVAdipooCwd"
              link="/masonry/siding/vantage-panel" 
            />
          </div>
        </div>
      </section>

      {/* Brand Carousel */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="flex items-center space-x-12 animate-scroll whitespace-nowrap">
          <div className="flex items-center gap-24 px-12 opacity-40 hover:opacity-100 transition-opacity">
            {["BRICKWORKS", "STONEMASTER", "TERRACOTTA CO", "MASONRY ELITE", "QUARRY PLUS", "BRICKWORKS", "STONEMASTER", "TERRACOTTA CO"].map((brand, i) => (
              <span key={i} className="text-2xl font-black font-headline tracking-tighter text-on-surface">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Dual CTA Section */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {/* Free Estimate */}
        <div className="relative group bg-primary-container p-20 flex flex-col justify-center min-h-[500px] overflow-hidden cursor-pointer" onClick={() => window.location.href='/estimation'}>
          <div className="absolute top-0 right-0 p-8 text-on-primary-container opacity-10 group-hover:scale-110 transition-transform duration-700">
            <span className="material-symbols-outlined text-[200px]">architecture</span>
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-headline font-black text-white mb-6 leading-tight">Free Estimate</h2>
            <p className="text-on-primary-container/80 text-lg mb-10 max-w-md">Our consultants provide detailed cost analysis for your next architectural project within 24 hours.</p>
            <Link to="/estimation" className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold hover:scale-105 transition-transform shadow-lg active:scale-95">Start Estimate</Link>
          </div>
        </div>

        {/* Get a Takeoff */}
        <div className="relative group bg-stone-900 p-20 flex flex-col justify-center min-h-[500px] overflow-hidden cursor-pointer" onClick={() => window.location.href='/estimation'}>
          <div className="absolute top-0 right-0 p-8 text-stone-700 opacity-20 group-hover:scale-110 transition-transform duration-700">
            <span className="material-symbols-outlined text-[200px]">edit_note</span>
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-headline font-black text-white mb-6 leading-tight">Get a Takeoff</h2>
            <p className="text-stone-400 text-lg mb-10 max-w-md">Send us your blueprints and our digital architect team will provide a comprehensive materials list and quote.</p>
            <Link to="/estimation" className="inline-block bg-primary text-on-primary px-8 py-4 rounded-lg font-bold hover:scale-105 transition-transform shadow-lg active:scale-95">Submit Plans</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
