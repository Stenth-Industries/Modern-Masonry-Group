import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Link } from "react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import { CategoryGrid } from "../components/CategoryGrid";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { ServicesGrid } from "../components/ServicesGrid";
import { BrandCarousel } from "../components/BrandCarousel";
import { CTABand } from "../components/CTABand";

export function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="bg-[var(--white)]">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            y: heroY,
            backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80')",
          }}
        >
          {/* Grain Overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          }} />
        </motion.div>

        {/* Content */}
        <motion.div
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
          style={{ y: textY, opacity: heroOpacity }}
        >
          <motion.h1
            className="text-white mb-6"
            style={{
              fontSize: 'clamp(64px, 10vw, 120px)',
              fontWeight: 700,
              lineHeight: 1.1,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Premium Masonry
            <br />
            Crafted to Last
          </motion.h1>

          <motion.p
            className="text-white/90 text-xl md:text-2xl mb-12 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transform your outdoor spaces with expert craftsmanship and premium materials
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to="/estimate"
              className="px-8 py-4 bg-[var(--accent)] text-white rounded-full hover:shadow-2xl transition-all flex items-center gap-2 group"
            >
              Get Free Estimate
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/categories/pavers"
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-full hover:bg-white/20 transition-all"
            >
              Explore Products
            </Link>
          </motion.div>

          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-8 h-8 text-white/70" />
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-6 bg-[var(--off-white)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl mb-4">Browse by Category</h2>
            <p className="text-[var(--slate)] text-xl">Find the perfect materials for your project</p>
          </motion.div>
          <CategoryGrid />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-5xl mb-4">Featured Products</h2>
            <p className="text-[var(--slate)] text-xl">Handpicked selections for exceptional projects</p>
          </motion.div>
          <FeaturedProducts />
        </div>
      </section>

      {/* CTA Band - Request Quote */}
      <CTABand
        title="Have a project in mind?"
        description="Get a detailed quote tailored to your needs"
        buttonText="Request Quote"
        buttonLink="/estimate"
        variant="brick"
      />

      {/* Services Section */}
      <section className="py-24 px-6 bg-[var(--off-white)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl mb-4">Our Services</h2>
            <p className="text-[var(--slate)] text-xl">Comprehensive solutions for every masonry need</p>
          </motion.div>
          <ServicesGrid />
        </div>
      </section>

      {/* Brand Carousel */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl mb-4">Trusted Brands</h2>
            <p className="text-[var(--slate)] text-xl">We partner with industry-leading manufacturers</p>
          </motion.div>
          <BrandCarousel />
        </div>
      </section>

      {/* CTA Band - Free Estimate */}
      <CTABand
        title="Ready to transform your outdoor space?"
        description="Schedule your free consultation today"
        buttonText="Get Free Estimate"
        buttonLink="/estimate"
        variant="charcoal"
      />
    </div>
  );
}
