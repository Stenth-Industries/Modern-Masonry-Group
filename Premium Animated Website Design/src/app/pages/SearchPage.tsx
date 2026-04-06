import { useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { ProductCard } from "../components/ProductCard";

const allProducts = [
  { id: "1", name: "Belgian Cobble", brand: "Belgard", category: "pavers", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80", colors: ["#8B7355", "#A0826D", "#6B5D52"] },
  { id: "2", name: "Cambridge Paver", brand: "Cambridge", category: "pavers", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80", colors: ["#9E9E9E", "#757575", "#BDBDBD"] },
  { id: "3", name: "Bluestone Slab", brand: "Unilock", category: "natural-stone", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80", colors: ["#5B6B7A", "#4A5A6A"] },
  { id: "4", name: "Travertine Tile", brand: "MSI Stone", category: "natural-stone", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80", colors: ["#D4C5A9", "#C8B89A"] },
];

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const filteredProducts = searchQuery.trim()
    ? allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 300);
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-[var(--off-white)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <motion.div
          className="max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--slate)]" />
            <input
              type="text"
              placeholder="Search products, brands, or categories..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-16 pr-6 py-6 bg-white rounded-full text-xl outline-none border-2 border-transparent focus:border-[var(--accent)] transition-all shadow-lg"
              autoFocus
            />
          </div>
        </motion.div>

        {/* Results */}
        {searchQuery.trim() ? (
          <>
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-[var(--slate)] text-xl">
                {isSearching ? (
                  "Searching..."
                ) : (
                  <>
                    Found <span className="text-[var(--charcoal)]">{filteredProducts.length}</span> results
                    for "<span className="text-[var(--charcoal)]">{searchQuery}</span>"
                  </>
                )}
              </p>
            </motion.div>

            {isSearching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="bg-white rounded-2xl overflow-hidden"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="h-64 bg-[var(--off-white)]" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-[var(--off-white)] rounded w-1/3" />
                      <div className="h-6 bg-[var(--off-white)] rounded w-2/3" />
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-[var(--off-white)] rounded-full" />
                        <div className="w-8 h-8 bg-[var(--off-white)] rounded-full" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-2xl text-[var(--slate)] mb-4">No products found</p>
                <p className="text-[var(--slate)]">
                  Try searching for different keywords or browse our categories
                </p>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Search className="w-24 h-24 mx-auto mb-6 text-[var(--slate)]" />
            <p className="text-2xl text-[var(--slate)] mb-4">Start searching</p>
            <p className="text-[var(--slate)]">
              Enter a product name, brand, or category to begin
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
