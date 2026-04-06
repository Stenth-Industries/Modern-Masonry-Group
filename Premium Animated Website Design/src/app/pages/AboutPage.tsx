import { motion } from "motion/react";
import { Award, Users, Clock, Heart } from "lucide-react";

const timeline = [
  { year: "1985", event: "Company Founded", description: "Started as a small family-owned masonry business" },
  { year: "1995", event: "First Major Project", description: "Completed our first commercial development" },
  { year: "2005", event: "Expansion", description: "Opened second location and grew team to 50+" },
  { year: "2015", event: "Innovation Award", description: "Recognized for sustainable masonry practices" },
  { year: "2020", event: "Digital Transformation", description: "Launched 3D design consultation services" },
  { year: "2025", event: "Industry Leader", description: "Now serving 1000+ projects annually" },
];

const stats = [
  { icon: Award, value: "40+", label: "Years of Excellence" },
  { icon: Users, value: "100+", label: "Expert Craftsmen" },
  { icon: Clock, value: "5,000+", label: "Projects Completed" },
  { icon: Heart, value: "98%", label: "Customer Satisfaction" },
];

export function AboutPage() {
  return (
    <div className="pt-32 pb-24 px-6 bg-[var(--off-white)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-6xl mb-6">About Modern Masonry</h1>
          <p className="text-[var(--slate)] text-2xl max-w-3xl mx-auto">
            Building beautiful, lasting outdoor spaces since 1985
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className="relative h-96 rounded-3xl overflow-hidden mb-20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80"
            alt="Modern Masonry Team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
              >
                <Icon className="w-12 h-12 mx-auto mb-4 text-[var(--accent)]" />
                <motion.div
                  className="text-4xl mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-[var(--slate)]">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Our Story */}
        <motion.div
          className="bg-white rounded-3xl p-12 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl mb-8">Our Story</h2>
          <div className="prose prose-lg max-w-none text-[var(--slate)] space-y-6">
            <p>
              Founded in 1985, Modern Masonry began with a simple mission: to bring exceptional craftsmanship
              and premium materials to outdoor living spaces. What started as a small family-owned business
              has grown into one of the region's most trusted masonry contractors.
            </p>
            <p>
              Our commitment to quality and customer satisfaction has remained unchanged over four decades.
              We believe that every project, whether a modest patio or an elaborate outdoor living space,
              deserves the same attention to detail and expert craftsmanship.
            </p>
            <p>
              Today, we combine traditional masonry techniques with modern technology and sustainable
              practices. Our team of over 100 skilled craftsmen brings together centuries of combined
              experience, ensuring every project meets our exacting standards.
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="mb-20">
          <motion.h2
            className="text-4xl mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Journey
          </motion.h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[var(--accent)]/20 hidden md:block" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`md:flex items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="md:w-1/2" />
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--accent)] rounded-full hidden md:block" />
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                      <motion.div
                        className="bg-white rounded-2xl p-6 shadow-lg"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-[var(--accent)] text-xl mb-2">{item.year}</div>
                        <h3 className="text-2xl mb-2">{item.event}</h3>
                        <p className="text-[var(--slate)]">{item.description}</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <motion.div
          className="bg-[var(--charcoal)] rounded-3xl p-12 text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl mb-4">Craftsmanship</h3>
              <p className="text-white/80">
                Every project receives meticulous attention to detail and expert execution
              </p>
            </div>
            <div>
              <h3 className="text-2xl mb-4">Integrity</h3>
              <p className="text-white/80">
                Honest communication, transparent pricing, and reliable service
              </p>
            </div>
            <div>
              <h3 className="text-2xl mb-4">Innovation</h3>
              <p className="text-white/80">
                Embracing new techniques and sustainable practices while honoring tradition
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
