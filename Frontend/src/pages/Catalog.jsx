import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ui/ProductCard';
import { MOCK_PRODUCTS, CATEGORY_META } from '../data/mockData';

const Catalog = () => {
  const { category } = useParams();
  
  // Safely get meta/products, default to brick if unknown
  const validCategory = CATEGORY_META[category] ? category : 'brick';
  const meta = CATEGORY_META[validCategory];
  const products = MOCK_PRODUCTS.filter(p => p.category === validCategory);

  return (
    <main className="pt-32 pb-20 px-8 max-w-[1600px] mx-auto flex flex-col md:flex-row gap-12 min-h-screen">
      {/* Sidebar Filter */}
      <aside className="w-full xl:w-64 flex-shrink-0">
        <div className="sticky top-32 space-y-10">
          <div>
            <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest text-outline mb-6">Collections</h3>
            <div className="space-y-3">
              {['Heritage Series', 'Modern Minimalist', 'Industrial Loft'].map(item => (
                <label key={item} className="flex items-center group cursor-pointer">
                  <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary/20 mr-3 transition-colors" />
                  <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">{item}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest text-outline mb-6">Color Palette</h3>
            <div className="grid grid-cols-5 gap-3">
              {[
                { code: '#8E352E', name: 'Deep Red' },
                { code: '#4A4A4A', name: 'Ash Gray' },
                { code: '#D2B48C', name: 'Sandstone' },
                { code: '#2B1B17', name: 'Obsidian' },
                { code: '#F5F5F5', name: 'Frost White' },
              ].map(color => (
                <button 
                  key={color.name}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform ring-1 ring-black/5" 
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          
          <div className="pt-6 border-t border-outline-variant/20">
            <button className="w-full py-3 text-xs font-bold uppercase tracking-widest text-primary border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors active:scale-95 transform">
              Reset Filters
            </button>
          </div>
        </div>
      </aside>

      {/* Product Content */}
      <section className="flex-1">
        <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <motion.div 
            key={category} // Animate on category change
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-headline font-extrabold tracking-tight text-on-surface mb-2">{meta.title}</h1>
            <p className="text-on-surface-variant text-lg max-w-2xl">{meta.description}</p>
          </motion.div>
          
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-outline">Sort by:</span>
            <select className="bg-transparent border-none focus:ring-0 font-bold text-on-surface cursor-pointer p-0 pr-8">
              <option>Featured Designs</option>
              <option>New Arrivals</option>
              <option>Price: Low to High</option>
            </select>
          </div>
        </header>

        {/* Product Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
        
        {products.length === 0 && (
          <div className="text-center py-20 text-on-surface-variant font-medium text-lg">
            No products found for this category.
          </div>
        )}

        {/* Pagination Indicator */}
        {products.length > 0 && (
          <div className="mt-24 flex flex-col items-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-outline-variant/30"></div>
              <span className="text-sm font-bold uppercase tracking-widest text-outline">Viewing {products.length} Products</span>
              <div className="w-12 h-[2px] bg-outline-variant/30"></div>
            </div>
            <button className="px-10 py-4 border-2 border-primary text-primary font-headline font-extrabold rounded-lg hover:bg-primary hover:text-white transition-all transform active:scale-95">
              Load More Materials
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Catalog;
