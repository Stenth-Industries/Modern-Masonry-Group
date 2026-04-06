import { motion } from "motion/react";
import { Link } from "react-router";
import { Hammer, Palette, Wrench, Sparkles } from "lucide-react";

const services = [
  {
    id: "installation",
    name: "Professional Installation",
    icon: Hammer,
    description: "Expert craftsmen bringing your vision to life with precision and care",
    longDescription: "Our team of certified installers has decades of combined experience in masonry installation. We handle projects of all sizes with the same attention to detail and commitment to excellence.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    id: "design",
    name: "Design Consultation",
    icon: Palette,
    description: "Collaborative design process to create the perfect outdoor space",
    longDescription: "Work directly with our design experts to bring your vision to life. We provide 3D renderings, material samples, and expert guidance throughout the entire design process.",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
  },
  {
    id: "maintenance",
    name: "Maintenance & Care",
    icon: Wrench,
    description: "Keep your masonry looking pristine for years to come",
    longDescription: "Regular maintenance ensures your investment stays beautiful and functional. We offer comprehensive maintenance plans including cleaning, sealing, and minor repairs.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  },
  {
    id: "restoration",
    name: "Restoration Services",
    icon: Sparkles,
    description: "Bring old masonry back to its original beauty",
    longDescription: "Breathe new life into worn or damaged masonry. Our restoration services include cleaning, re-pointing, resurfacing, and complete rebuilds when necessary.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
  },
];

export function ServicesPage() {
  return (
    <div className="pt-32 pb-24 px-6 bg-[var(--off-white)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-6xl mb-6">Our Services</h1>
          <p className="text-[var(--slate)] text-2xl max-w-3xl mx-auto">
            Comprehensive masonry solutions from design to installation and beyond
          </p>
        </motion.div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={index === 0 ? "md:col-span-2" : ""}
              >
                <Link to={`/services/${service.id}`}>
                  <motion.div
                    className="bg-white rounded-3xl overflow-hidden shadow-lg group cursor-pointer"
                    whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                    style={{ height: index === 0 ? '500px' : '400px' }}
                  >
                    <div className="h-full flex flex-col md:flex-row">
                      {/* Image */}
                      <div className={`relative overflow-hidden ${index === 0 ? 'md:w-1/2' : 'md:w-full'}`}>
                        <motion.img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
                      </div>

                      {/* Content */}
                      <div className={`p-8 flex flex-col justify-center ${index === 0 ? 'md:w-1/2' : ''}`}>
                        <motion.div
                          className="w-16 h-16 bg-[var(--accent)] rounded-2xl flex items-center justify-center mb-6"
                          whileHover={{ rotate: 5, scale: 1.1 }}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </motion.div>

                        <h2 className="text-3xl mb-4">{service.name}</h2>
                        <p className="text-[var(--slate)] text-lg mb-6">
                          {index === 0 ? service.longDescription : service.description}
                        </p>

                        <motion.div
                          className="text-[var(--accent)] flex items-center gap-2"
                          whileHover={{ x: 5 }}
                        >
                          Learn More →
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl mb-6">Ready to get started?</h2>
          <p className="text-[var(--slate)] text-xl mb-8">
            Schedule a free consultation to discuss your project
          </p>
          <Link to="/estimate">
            <motion.button
              className="px-10 py-5 bg-[var(--accent)] text-white rounded-full text-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Free Estimate
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
