import { motion } from "motion/react";
import { Link } from "react-router";

const brands = [
  { name: "Belgard", category: "Pavers" },
  { name: "Unilock", category: "Pavers" },
  { name: "Techo-Bloc", category: "Pavers" },
  { name: "Cambridge", category: "Pavers" },
  { name: "EP Henry", category: "Pavers" },
  { name: "MSI Stone", category: "Natural Stone" },
  { name: "Eldorado Stone", category: "Stone Veneer" },
  { name: "Cultured Stone", category: "Stone Veneer" },
];

export function BrandCarousel() {
  return (
    <div className="relative overflow-hidden py-8">
      <motion.div
        className="flex gap-16"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...brands, ...brands, ...brands].map((brand, index) => (
          <Link
            key={index}
            to={`/brands?brand=${brand.name.toLowerCase().replace(' ', '-')}`}
            className="flex-none"
          >
            <motion.div
              className="w-48 h-32 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 grayscale hover:grayscale-0 transition-all cursor-pointer"
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <div className="text-2xl">{brand.name}</div>
              <div className="text-sm text-[var(--slate)]">{brand.category}</div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
