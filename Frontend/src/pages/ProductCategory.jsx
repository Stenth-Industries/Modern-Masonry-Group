import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Funnel, X, ArrowRight } from '@phosphor-icons/react';
import { products } from '../data/mockData';

const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ProductCategory = () => {
  const { category } = useParams();
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const categoryName = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const categoryProducts = products.filter(
    p => p.category.toLowerCase().replace(/\s/g, '-') === category
  );

  const brands = ['all', ...new Set(categoryProducts.map(p => p.brand))];
  const colors = ['all', ...new Set(categoryProducts.flatMap(p => p.colors))];

  const filteredProducts = categoryProducts.filter(product => {
    const brandMatch = selectedBrand === 'all' || product.brand === selectedBrand;
    const colorMatch = selectedColor === 'all' || product.colors.includes(selectedColor);
    return brandMatch && colorMatch;
  });

  const categoryImages = {
    'brick': 'https://images.unsplash.com/photo-1767452657161-dba27fe846e1?w=1920',
    'stone': 'https://images.unsplash.com/photo-1760774716625-b9a9f3077237?w=1920',
    'precast': 'https://images.unsplash.com/photo-1590908199253-050e6c4cc0c5?w=1920',
    'siding': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920',
    'aggregates': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920',
    'hardscape': 'https://images.unsplash.com/photo-1629466665657-12d85745654f?w=1920',
    'landscape-materials': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920',
    'accessories': 'https://images.unsplash.com/photo-1581092918484-8313e1f7e8c7?w=1920'
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Banner */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${categoryImages[category]})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-6"
        >
          <h1 className="text-5xl md:text-6xl tracking-tighter font-medium mb-4">
            {categoryName}
          </h1>
          <p className="text-lg text-white/90">
            {filteredProducts.length} products available
          </p>
        </motion.div>
      </section>

      {/* Filters & Products */}
      <section className="py-12 px-6 md:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white p-6 shadow-sm sticky top-24">
              <h3 className="text-xs tracking-[0.2em] uppercase font-bold text-[#A84232] mb-6">
                Filters
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#1E1C1B] mb-3">
                    Brand
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B]"
                    data-testid="brand-filter"
                  >
                    {brands.map(brand => (
                      <option key={brand} value={brand}>
                        {brand === 'all' ? 'All Brands' : brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E1C1B] mb-3">
                    Color
                  </label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B]"
                    data-testid="color-filter"
                  >
                    {colors.map(color => (
                      <option key={color} value={color}>
                        {color === 'all' ? 'All Colors' : color}
                      </option>
                    ))}
                  </select>
                </div>

                {(selectedBrand !== 'all' || selectedColor !== 'all') && (
                  <button
                    onClick={() => {
                      setSelectedBrand('all');
                      setSelectedColor('all');
                    }}
                    className="w-full px-4 py-2 text-sm text-[#A84232] hover:bg-[#A84232]/5 transition-colors flex items-center justify-center space-x-2"
                    data-testid="clear-filters"
                  >
                    <X size={16} weight="bold" />
                    <span>Clear Filters</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-[#E2DFD9] text-[#1E1C1B] hover:border-[#A84232] transition-colors"
              data-testid="mobile-filter-toggle"
            >
              <Funnel size={20} weight="bold" />
              <span className="font-medium">Filters</span>
            </button>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 bg-white p-6 shadow-sm space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-[#1E1C1B] mb-3">
                    Brand
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B]"
                  >
                    {brands.map(brand => (
                      <option key={brand} value={brand}>
                        {brand === 'all' ? 'All Brands' : brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E1C1B] mb-3">
                    Color
                  </label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B]"
                  >
                    {colors.map(color => (
                      <option key={color} value={color}>
                        {color === 'all' ? 'All Colors' : color}
                      </option>
                    ))}
                  </select>
                </div>

                {(selectedBrand !== 'all' || selectedColor !== 'all') && (
                  <button
                    onClick={() => {
                      setSelectedBrand('all');
                      setSelectedColor('all');
                    }}
                    className="w-full px-4 py-2 text-sm text-[#A84232] hover:bg-[#A84232]/5 transition-colors flex items-center justify-center space-x-2"
                  >
                    <X size={16} weight="bold" />
                    <span>Clear Filters</span>
                  </button>
                )}
              </motion.div>
            )}
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#4A4643] text-lg">No products found matching your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="product-grid">
                {filteredProducts.map((product) => (
                  <AnimatedSection key={product.id}>
                    <Link
                      to={`/product/${product.id}`}
                      className="group block bg-white overflow-hidden hover:shadow-xl transition-all duration-500"
                      data-testid={`product-item-${product.id}`}
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <motion.img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                      <div className="p-6">
                        <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A84232] mb-2">
                          {product.brand}
                        </p>
                        <h3 className="text-xl font-medium text-[#1E1C1B] mb-3 group-hover:text-[#A84232] transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.colors.slice(0, 3).map(color => (
                            <span key={color} className="text-xs px-2 py-1 bg-[#E2DFD9] text-[#1E1C1B]">
                              {color}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2 text-[#A84232] opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-sm font-medium">View Details</span>
                          <ArrowRight size={16} weight="bold" />
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductCategory;