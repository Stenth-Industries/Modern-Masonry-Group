import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";

const brandsByCategory = {
  Pavers: [
    { name: "Belgard", description: "Premium pavers and outdoor living products" },
    { name: "Unilock", description: "Innovative paver and wall solutions" },
    { name: "Techo-Bloc", description: "Modern architectural outdoor living" },
    { name: "Cambridge", description: "Quality hardscape products" },
    { name: "EP Henry", description: "Beautiful and durable pavers" },
  ],
  "Natural Stone": [
    { name: "MSI Stone", description: "Premium natural stone surfaces" },
    { name: "Arizona Tile", description: "Natural stone and porcelain" },
    { name: "Polycor", description: "North American natural stone" },
  ],
  "Stone Veneer": [
    { name: "Eldorado Stone", description: "Architectural stone veneer" },
    { name: "Cultured Stone", description: "Manufactured stone veneer" },
    { name: "Boral Stone", description: "Natural and manufactured stone" },
  ],
  "Retaining Walls": [
    { name: "Anchor Wall", description: "Modular block retaining walls" },
    { name: "Keystone", description: "Innovative wall systems" },
    { name: "Versa-Lok", description: "Engineered retaining walls" },
  ],
};

export function BrandsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);

  const categories = Object.keys(brandsByCategory);
  const displayBrands = selectedCategory
    ? { [selectedCategory]: brandsByCategory[selectedCategory as keyof typeof brandsByCategory] }
    : brandsByCategory;

  return (
    <div className="pt-32 pb-24 px-6 bg-[var(--off-white)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-6xl mb-6">Our Trusted Brands</h1>
          <p className="text-[var(--slate)] text-2xl max-w-3xl mx-auto">
            We partner with industry-leading manufacturers to bring you the finest masonry products
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={() => setSelectedCategory(null)}
            className="px-6 py-3 rounded-full border-2 transition-all"
            style={{
              backgroundColor: selectedCategory === null ? 'var(--accent)' : 'white',
              borderColor: selectedCategory === null ? 'var(--accent)' : 'var(--border)',
              color: selectedCategory === null ? 'white' : 'var(--charcoal)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Brands
          </motion.button>

          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-6 py-3 rounded-full border-2 transition-all"
              style={{
                backgroundColor: selectedCategory === category ? 'var(--accent)' : 'white',
                borderColor: selectedCategory === category ? 'var(--accent)' : 'var(--border)',
                color: selectedCategory === category ? 'white' : 'var(--charcoal)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Brands by Category */}
        <div className="space-y-16">
          {Object.entries(displayBrands).map(([category, brands]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl mb-8">{category}</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {brands.map((brand, index) => (
                  <motion.div
                    key={brand.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/categories/${category.toLowerCase().replace(' ', '-')}?brand=${brand.name.toLowerCase()}`}>
                      <motion.div
                        className="bg-white rounded-2xl p-8 h-48 flex flex-col items-center justify-center text-center shadow-lg cursor-pointer transition-all"
                        style={{
                          filter: hoveredBrand === brand.name ? 'grayscale(0%)' : 'grayscale(100%)',
                        }}
                        onMouseEnter={() => setHoveredBrand(brand.name)}
                        onMouseLeave={() => setHoveredBrand(null)}
                        whileHover={{
                          y: -8,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <h3 className="text-2xl mb-3">{brand.name}</h3>
                        <p className="text-sm text-[var(--slate)]">{brand.description}</p>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-24 text-center bg-white rounded-3xl p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl mb-6">Can't find what you're looking for?</h2>
          <p className="text-[var(--slate)] text-xl mb-8">
            Contact us to discuss special orders and custom solutions
          </p>
          <Link to="/contact">
            <motion.button
              className="px-10 py-5 bg-[var(--accent)] text-white rounded-full text-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
