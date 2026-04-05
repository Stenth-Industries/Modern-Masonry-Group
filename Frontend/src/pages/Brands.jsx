import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { brands } from '../data/mockData';

const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Brands = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = ['all', ...new Set(brands.map(b => b.category))];
  
  const filteredBrands = selectedCategory === 'all'
    ? brands
    : brands.filter(b => b.category === selectedCategory);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#1E1C1B] text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl tracking-tighter font-medium mb-6">
            Our Brand Partners
          </h1>
          <p className="text-lg text-white/90 leading-relaxed">
            We partner with industry-leading manufacturers to bring you the highest quality masonry products.
            Every brand we carry meets our rigorous standards for durability, aesthetics, and value.
          </p>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="py-12 px-6 md:px-12 lg:px-24 bg-[#E2DFD9]">
        <AnimatedSection>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 text-sm font-medium tracking-wide uppercase transition-all ${
                  selectedCategory === category
                    ? 'bg-[#A84232] text-white'
                    : 'bg-white text-[#1E1C1B] hover:bg-[#F9F8F6]'
                }`}
                data-testid={`brand-filter-${category}`}
              >
                {category === 'all' ? 'All Brands' : category}
              </button>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Brands Grid */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6" data-testid="brands-grid">
          {filteredBrands.map((brand) => (
            <AnimatedSection key={brand.name}>
              <motion.div
                className="aspect-square bg-white flex items-center justify-center p-8 group cursor-pointer hover:shadow-xl transition-all duration-500"
                whileHover={{ y: -8 }}
                data-testid={`brand-card-${brand.name.toLowerCase().replace(/\s/g, '-')}`}
              >
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#1E1C1B]/20 group-hover:text-[#A84232] transition-colors mb-2">
                    {brand.logo}
                  </div>
                  <p className="text-xs font-medium text-[#4A4643] group-hover:text-[#1E1C1B] transition-colors">
                    {brand.name}
                  </p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#A84232] text-white">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl tracking-tight font-medium mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              We work with many more manufacturers and can special order products to meet your specific needs.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-[#A84232] text-sm font-medium tracking-wide uppercase hover:bg-[#E2DFD9] transition-all"
              data-testid="brands-contact-cta"
            >
              Contact Us
            </a>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default Brands;