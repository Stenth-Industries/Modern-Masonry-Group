import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, Users, Package, Handshake } from '@phosphor-icons/react';

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

const About = () => {
  const stats = [
    { number: '25+', label: 'Years Experience' },
    { number: '5000+', label: 'Projects Completed' },
    { number: '50+', label: 'Brand Partners' },
    { number: '100%', label: 'Customer Satisfaction' }
  ];

  const values = [
    {
      icon: <CheckCircle size={48} weight="light" />,
      title: 'Quality First',
      description: 'We only supply premium materials from trusted manufacturers, ensuring every project meets the highest standards.'
    },
    {
      icon: <Users size={48} weight="light" />,
      title: 'Expert Support',
      description: 'Our knowledgeable team provides guidance throughout your project, from material selection to installation advice.'
    },
    {
      icon: <Package size={48} weight="light" />,
      title: 'Wide Selection',
      description: 'Comprehensive inventory of masonry products across all categories, with special order capabilities for unique needs.'
    },
    {
      icon: <Handshake size={48} weight="light" />,
      title: 'Trusted Partner',
      description: 'Building lasting relationships with contractors, architects, and homeowners through reliable service and expertise.'
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1755140584836-9771b5f51575?w=1920)' }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-6 max-w-4xl"
        >
          <h1 className="text-5xl md:text-6xl tracking-tighter font-medium mb-6">
            About Modern Masonry
          </h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Your trusted partner for premium masonry products and expert service since 1998
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#1E1C1B] text-white">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <AnimatedSection key={stat.label}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-medium tracking-tight text-[#A84232] mb-2">
                  {stat.number}
                </div>
                <div className="text-sm tracking-[0.2em] uppercase text-white/70">
                  {stat.label}
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A84232] mb-4">Our Story</p>
              <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[#1E1C1B] mb-8">
                Building Excellence for Over Two Decades
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="space-y-6 text-lg text-[#4A4643] leading-relaxed">
              <p>
                Founded in 1998, Modern Masonry has grown from a small local supplier to a regional leader 
                in premium masonry products. Our journey began with a simple mission: to provide contractors 
                and homeowners with the highest quality materials and unmatched expertise.
              </p>
              <p>
                Today, we partner with the industry's most respected manufacturers to offer an extensive 
                selection of brick, stone, precast, siding, and masonry accessories. Our team of masonry 
                specialists brings decades of combined experience, ensuring every customer receives expert 
                guidance tailored to their specific project needs.
              </p>
              <p>
                Whether you're a professional contractor working on a commercial development or a homeowner 
                planning a dream renovation, we're committed to helping you achieve exceptional results. 
                From material selection to installation support, Modern Masonry is your partner in building 
                spaces that stand the test of time.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#E2DFD9]">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A84232] mb-4">What Drives Us</p>
            <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[#1E1C1B]">
              Our Values
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {values.map((value) => (
            <AnimatedSection key={value.title}>
              <div className="bg-white p-8 hover:shadow-xl transition-all duration-500 group">
                <div className="text-[#A84232] mb-6 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-medium text-[#1E1C1B] mb-4">
                  {value.title}
                </h3>
                <p className="text-[#4A4643] leading-relaxed">
                  {value.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl tracking-tight font-medium text-[#1E1C1B] mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-[#4A4643] mb-12 leading-relaxed">
              Let's discuss how we can help bring your vision to life with premium masonry materials.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 bg-[#A84232] text-white text-sm font-medium tracking-wide uppercase hover:bg-[#8A3325] transition-all"
              >
                Contact Us
              </Link>
              <Link
                to="/estimate"
                className="px-8 py-4 bg-white border-2 border-[#E2DFD9] text-[#1E1C1B] text-sm font-medium tracking-wide uppercase hover:border-[#A84232] transition-all"
              >
                Get Free Estimate
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default About;