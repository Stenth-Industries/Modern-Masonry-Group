import { motion } from "motion/react";
import { Link } from "react-router";

interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  colors: string[];
}

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      }}
    >
      <Link to={`/products/${product.id}`}>
        <motion.div
          className="bg-white rounded-2xl overflow-hidden shadow-lg group cursor-pointer h-full"
          whileHover={{
            y: -8,
            rotateX: 2,
            rotateY: 2,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Image */}
          <div className="relative h-64 overflow-hidden" data-cursor-image>
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
            />

            {/* Quick View */}
            <motion.div
              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <motion.span
                className="text-white px-6 py-2 border-2 border-white rounded-full"
                whileHover={{ scale: 1.1 }}
              >
                Quick View
              </motion.span>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-[var(--slate)] text-sm mb-2">{product.brand}</p>
            <h3 className="text-xl mb-4">{product.name}</h3>

            {/* Color Swatches */}
            <div className="flex gap-2">
              {product.colors.map((color, i) => (
                <motion.div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-black/10"
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
