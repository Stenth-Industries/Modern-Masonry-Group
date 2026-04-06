import { motion } from "motion/react";
import { Link } from "react-router";
import { Hammer, Palette, Wrench, Sparkles } from "lucide-react";

const services = [
  {
    id: "installation",
    name: "Professional Installation",
    icon: Hammer,
    description: "Expert craftsmen bringing your vision to life with precision and care",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  },
  {
    id: "design",
    name: "Design Consultation",
    icon: Palette,
    description: "Collaborative design process to create the perfect outdoor space",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80",
  },
  {
    id: "maintenance",
    name: "Maintenance & Care",
    icon: Wrench,
    description: "Keep your masonry looking pristine for years to come",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
  },
  {
    id: "restoration",
    name: "Restoration Services",
    icon: Sparkles,
    description: "Bring old masonry back to its original beauty",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
  },
];

export function ServicesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/services/${service.id}`}>
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg group cursor-pointer h-full"
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="w-16 h-16 bg-[var(--accent)] rounded-2xl flex items-center justify-center mb-6"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-xl mb-3">{service.name}</h3>
                <p className="text-[var(--slate)]">{service.description}</p>

                <motion.div
                  className="mt-6 text-[var(--accent)] flex items-center gap-2"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  Learn More →
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
