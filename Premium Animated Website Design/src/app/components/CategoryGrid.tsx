import { motion } from "motion/react";
import { Link } from "react-router";

const categories = [
  {
    id: "pavers",
    name: "Pavers",
    icon: "🧱",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    description: "Durable paving solutions",
  },
  {
    id: "natural-stone",
    name: "Natural Stone",
    icon: "🪨",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80",
    description: "Timeless natural beauty",
  },
  {
    id: "concrete",
    name: "Concrete",
    icon: "🏗️",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
    description: "Versatile & modern",
  },
  {
    id: "retaining-walls",
    name: "Retaining Walls",
    icon: "🧱",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
    description: "Structural solutions",
  },
  {
    id: "outdoor-living",
    name: "Outdoor Living",
    icon: "🏡",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80",
    description: "Create your oasis",
  },
  {
    id: "fireplaces",
    name: "Fireplaces",
    icon: "🔥",
    image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=600&q=80",
    description: "Warmth & ambiance",
  },
  {
    id: "landscaping",
    name: "Landscaping",
    icon: "🌿",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    description: "Complete your vision",
  },
  {
    id: "tools",
    name: "Tools & Supplies",
    icon: "🛠️",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80",
    description: "Professional equipment",
  },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <Link to={`/categories/${category.id}`}>
            <motion.div
              className="relative h-80 rounded-3xl overflow-hidden bg-[var(--card)] group cursor-pointer"
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Image */}
              <div className="absolute inset-0">
                <motion.img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <motion.div
                  className="text-4xl mb-3"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  {category.icon}
                </motion.div>
                <h3 className="text-white text-2xl mb-2">{category.name}</h3>
                <p className="text-white/80">{category.description}</p>
              </div>

              {/* Hover effect */}
              <motion.div
                className="absolute inset-0 border-2 border-[var(--accent)] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
