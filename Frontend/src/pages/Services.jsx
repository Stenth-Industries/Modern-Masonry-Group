import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import { services } from '../data/mockData';

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

const Services = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1773601103174-306ffa23d441?w=1920)' }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-6 max-w-4xl"
        >
          <h1 className="text-5xl md:text-6xl tracking-tighter font-medium mb-4">
            Our Services
          </h1>
          <p className="text-lg text-white/90">
            Comprehensive masonry solutions for every project need
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 gap-16">
          {services.map((service, index) => (
            <AnimatedSection key={service.id}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="aspect-[4/3] overflow-hidden bg-white">
                    <motion.img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A84232] mb-4">
                    Service
                  </p>
                  <h2 className="text-3xl md:text-4xl tracking-tight font-medium text-[#1E1C1B] mb-6">
                    {service.title}
                  </h2>
                  <p className="text-lg text-[#4A4643] leading-relaxed mb-8">
                    {service.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#A84232] mt-2 flex-shrink-0" />
                        <span className="text-[#1E1C1B]">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/estimate"
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-[#A84232] text-white text-sm font-medium tracking-wide uppercase hover:bg-[#8A3325] transition-all"
                    data-testid={`service-cta-${service.id}`}
                  >
                    <span>Request Quote</span>
                    <ArrowRight size={20} weight="bold" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#E2DFD9]">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl tracking-tight font-medium text-[#1E1C1B] mb-6">
              Let's Build Something Great
            </h2>
            <p className="text-lg text-[#4A4643] mb-12 leading-relaxed">
              Whether it's a small repair or a large commercial project, our expert team is ready to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/estimate"
                className="px-8 py-4 bg-[#A84232] text-white text-sm font-medium tracking-wide uppercase hover:bg-[#8A3325] transition-all"
              >
                Get Free Estimate
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-white text-[#1E1C1B] text-sm font-medium tracking-wide uppercase hover:bg-[#F9F8F6] transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default Services;