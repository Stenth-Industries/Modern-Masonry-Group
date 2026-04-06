import { useParams, Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Check, ArrowRight } from "lucide-react";

const servicesData: Record<string, any> = {
  installation: {
    name: "Professional Installation",
    tagline: "Craftsmanship that stands the test of time",
    hero: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
    sections: [
      {
        title: "Expert Installation Process",
        content: "Our certified installers follow industry best practices and manufacturer guidelines to ensure your masonry project is built to last. Every installation is supervised by experienced project managers who maintain the highest quality standards.",
        image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
      },
      {
        title: "Quality Materials",
        content: "We work exclusively with premium materials from trusted manufacturers. Our partnerships with leading brands ensure you receive products backed by comprehensive warranties and proven performance.",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      },
    ],
    benefits: [
      "Lifetime craftsmanship warranty",
      "Licensed and insured professionals",
      "On-time project completion",
      "Detailed project timeline",
      "Post-installation support",
    ],
  },
  design: {
    name: "Design Consultation",
    tagline: "Transform your vision into reality",
    hero: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1920&q=80",
    sections: [
      {
        title: "Collaborative Design",
        content: "Work directly with our design team to create a space that reflects your style and meets your functional needs. We provide detailed 3D renderings so you can visualize your project before installation begins.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      },
      {
        title: "Material Selection",
        content: "Explore our extensive collection of materials in our showroom. Our designers help you select colors, textures, and patterns that complement your home's architecture and your personal aesthetic.",
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
      },
    ],
    benefits: [
      "Complimentary design consultation",
      "3D visualization and renderings",
      "Material samples and mockups",
      "Budget-conscious recommendations",
      "Detailed project proposals",
    ],
  },
  maintenance: {
    name: "Maintenance & Care",
    tagline: "Protect your investment",
    hero: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
    sections: [
      {
        title: "Regular Maintenance",
        content: "Proper maintenance extends the life and beauty of your masonry. Our maintenance programs include professional cleaning, sealing, and inspection services tailored to your specific materials.",
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
      },
      {
        title: "Seasonal Care",
        content: "Different seasons require different care approaches. We provide seasonal maintenance recommendations and services to protect your masonry from weather-related wear and damage.",
        image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80",
      },
    ],
    benefits: [
      "Annual maintenance plans",
      "Professional cleaning services",
      "Sealing and protection",
      "Minor repair services",
      "Seasonal care guidance",
    ],
  },
  restoration: {
    name: "Restoration Services",
    tagline: "Renew and restore beauty",
    hero: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80",
    sections: [
      {
        title: "Comprehensive Restoration",
        content: "Whether your masonry has suffered from age, weather, or damage, our restoration experts can bring it back to life. We assess the condition and recommend the most effective and cost-efficient restoration approach.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      },
      {
        title: "Specialized Techniques",
        content: "Our team employs specialized restoration techniques including deep cleaning, re-pointing, resurfacing, and complete rebuilds when necessary. We match existing materials and finishes for seamless results.",
        image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
      },
    ],
    benefits: [
      "Free condition assessment",
      "Historical masonry expertise",
      "Color and texture matching",
      "Structural repair services",
      "Preventive maintenance plans",
    ],
  },
};

export function ServiceDetailPage() {
  const { serviceId } = useParams();
  const service = serviceId ? servicesData[serviceId] : null;
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  if (!service) {
    return <div className="pt-32 pb-24 px-6 text-center">Service not found</div>;
  }

  return (
    <div className="bg-[var(--off-white)]">
      {/* Parallax Hero */}
      <section ref={heroRef} className="relative h-[60vh] overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            y: heroY,
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${service.hero}')`,
          }}
        />

        <motion.div
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: heroOpacity }}
        >
          <motion.h1
            className="text-white text-6xl md:text-7xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {service.name}
          </motion.h1>
          <motion.p
            className="text-white/90 text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {service.tagline}
          </motion.p>
        </motion.div>
      </section>

      {/* Content Sections - Alternating Layout */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        {service.sections.map((section: any, index: number) => (
          <motion.div
            key={index}
            className={`grid md:grid-cols-2 gap-12 mb-24 items-center ${
              index % 2 === 1 ? 'md:grid-flow-dense' : ''
            }`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
              <h2 className="text-4xl mb-6">{section.title}</h2>
              <p className="text-[var(--slate)] text-lg leading-relaxed">{section.content}</p>
            </div>

            <motion.div
              className="relative h-96 rounded-3xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        ))}

        {/* Benefits */}
        <motion.div
          className="bg-white rounded-3xl p-12 mb-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl mb-8 text-center">What You Get</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {service.benefits.map((benefit: string, index: number) => (
              <motion.div
                key={index}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="bg-[var(--charcoal)] rounded-3xl p-12 text-center text-white"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl mb-6">Ready to start your project?</h2>
          <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
            Get a free estimate and consultation to discuss your needs
          </p>
          <Link to="/estimate">
            <motion.button
              className="px-10 py-5 bg-white text-[var(--charcoal)] rounded-full text-lg inline-flex items-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Free Estimate
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
