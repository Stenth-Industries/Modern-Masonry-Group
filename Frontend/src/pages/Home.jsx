import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import MarqueeImport from 'react-fast-marquee';
const Marquee = MarqueeImport.default || MarqueeImport;
import { ArrowRight, CheckCircle, Upload } from '@phosphor-icons/react';
import { products, brands, services } from '../data/mockData';

const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const featuredProducts = products.filter(p => p.featured);
  const categories = ['Brick', 'Stone', 'Precast', 'Siding', 'Aggregates', 'Hardscape', 'Landscape Materials', 'Accessories'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        data-testid="hero-section"
      >
        <motion.div
          style={{ y }}
          className="absolute inset-0 z-0"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1755140584836-9771b5f51575?w=1920)'
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        <motion.div
          style={{ opacity }}
          className="relative z-10 text-center px-6 max-w-5xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl tracking-tighter font-medium text-white mb-6"
          >
            Building Modern Spaces<br />with Timeless Materials
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 mb-12 leading-relaxed"
          >
            Premium supplier of brick, stone, and masonry products for residential and commercial projects
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/products/brick"
              className="px-8 py-4 bg-[#A84232] text-white text-sm font-medium tracking-wide uppercase hover:bg-[#8A3325] transition-all flex items-center space-x-2 group"
              data-testid="explore-products-btn"
            >
              <span>Explore Products</span>
              <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/estimate"
              className="px-8 py-4 bg-white text-[#1E1C1B] text-sm font-medium tracking-wide uppercase hover:bg-[#E2DFD9] transition-all"
              data-testid="get-quote-btn"
            >
              Get Free Quote
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Category Cards */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A84232] mb-4">Our Products</p>
            <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[#1E1C1B]">
              Premium Masonry Solutions
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="category-grid">
          {categories.map((category, index) => (
            <AnimatedSection key={category}>
              <Link
                to={`/products/${category.toLowerCase().replace(/\s/g, '-')}`}
                className="group block relative overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500"
                data-testid={`category-card-${category.toLowerCase().replace(/\s/g, '-')}`}
              >
                <div className="aspect-square overflow-hidden">
                  <motion.img
                    src={`https://images.unsplash.com/photo-${1600607687920 + index}?w=600`}
                    alt={category}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-[#1E1C1B] group-hover:text-[#A84232] transition-colors">
                    {category}
                  </h3>
                  <div className="mt-2 flex items-center space-x-2 text-[#A84232] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">View Products</span>
                    <ArrowRight size={16} weight="bold" />
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#E2DFD9]">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A84232] mb-4">Featured</p>
            <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[#1E1C1B]">
              Popular Products
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="featured-products">
          {featuredProducts.map((product) => (
            <AnimatedSection key={product.id}>
              <Link
                to={`/product/${product.id}`}
                className="group block bg-white overflow-hidden hover:shadow-xl transition-all duration-500"
                data-testid={`product-card-${product.id}`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A84232] mb-2">
                    {product.brand}
                  </p>
                  <h3 className="text-xl font-medium text-[#1E1C1B] mb-2 group-hover:text-[#A84232] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#4A4643] mb-4">{product.category}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.slice(0, 3).map(color => (
                      <span key={color} className="text-xs px-2 py-1 bg-[#E2DFD9] text-[#1E1C1B]">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A84232] mb-4">What We Do</p>
            <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[#1E1C1B]">
              Our Services
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.slice(0, 6).map((service) => (
            <AnimatedSection key={service.id}>
              <div className="bg-white p-8 hover:shadow-xl transition-all duration-500 group">
                <h3 className="text-2xl font-medium text-[#1E1C1B] mb-4 group-hover:text-[#A84232] transition-colors">
                  {service.title}
                </h3>
                <p className="text-[#4A4643] mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-center space-x-2 text-sm text-[#4A4643]">
                      <CheckCircle size={16} weight="fill" className="text-[#A84232]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/services"
                  className="inline-flex items-center space-x-2 text-[#A84232] hover:text-[#8A3325] font-medium text-sm"
                >
                  <span>Learn More</span>
                  <ArrowRight size={16} weight="bold" />
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Brand Marquee */}
      <section className="py-24 bg-[#1E1C1B]">
        <AnimatedSection>
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A84232] mb-4">Partners</p>
            <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-white">
              Trusted Brands
            </h2>
          </div>
        </AnimatedSection>

        <Marquee gradient={false} speed={40} className="py-8">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="mx-8 w-32 h-32 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
            >
              <span className="text-4xl font-bold text-white/50 hover:text-white transition-colors">
                {brand.logo}
              </span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#A84232] text-white">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl tracking-tight font-medium mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Get a free estimate and takeoff service for any drawings or tenders submitted.
            </p>
            <Link
              to="/estimate"
              className="inline-flex items-center space-x-2 px-10 py-5 bg-white text-[#A84232] text-sm font-medium tracking-wide uppercase hover:bg-[#E2DFD9] transition-all"
              data-testid="cta-estimate-btn"
            >
              <Upload size={20} weight="bold" />
              <span>Request Free Estimate</span>
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default Home;