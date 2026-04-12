import { useRef } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useBricks } from "../hooks/useBricks";

export function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { bricks, loading, error, getProductFromBrick } = useBricks();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (error || bricks.length === 0) {
    return null;
  }

  // Take the first 8 bricks as featured
  const featuredBricks = bricks.slice(0, 8);

  return (
    <div className="relative">
      {/* Scroll buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-12 py-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {featuredBricks.map((brick, index) => {
          const product = getProductFromBrick(brick);
          return (
            <motion.div
              key={product.id}
              className="flex-none w-96"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/products/${product.id}`}>
                <motion.div
                  className="bg-white rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
                  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
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
                      referrerPolicy="no-referrer"
                    />

                    {/* Quick View */}
                    <motion.div
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-white px-6 py-2 border-2 border-white rounded-full">
                        Quick View
                      </span>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-[var(--slate)] text-sm mb-2">{product.brand}</p>
                    <h3 className="text-xl mb-4 line-clamp-1">{product.name}</h3>

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
        })}
      </div>
    </div>
  );
}
