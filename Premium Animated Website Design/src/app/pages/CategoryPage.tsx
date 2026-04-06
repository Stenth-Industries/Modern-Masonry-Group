import { useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Loader2 } from "lucide-react";
import { useBricks, Brick } from "../hooks/useBricks";

export function CategoryPage() {
  const { categoryId } = useParams();
  const { bricks, loading, error, getProductFromBrick } = useBricks();
  
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedPriceClass, setSelectedPriceClass] = useState<string[]>([]);

  // Derive filter options from data
  const filterOptions = useMemo(() => {
    const styles = new Set<string>();
    const materials = new Set<string>();
    const priceClasses = new Set<string>();

    bricks.forEach(brick => {
      if (brick.features['STYLE']) {
        brick.features['STYLE'].split(',').forEach(s => styles.add(s.trim()));
      }
      if (brick.features['MATERIAL']) {
        materials.add(brick.features['MATERIAL'].trim());
      }
      if (brick.features['PRICE CLASS']) {
        priceClasses.add(brick.features['PRICE CLASS'].trim());
      }
    });

    return {
      styles: Array.from(styles).sort(),
      materials: Array.from(materials).sort(),
      priceClasses: Array.from(priceClasses).sort()
    };
  }, [bricks]);

  const toggleFilter = (value: string, filters: string[], setFilters: (v: string[]) => void) => {
    if (filters.includes(value)) {
      setFilters(filters.filter(f => f !== value));
    } else {
      setFilters([...filters, value]);
    }
  };

  const clearFilters = () => {
    setSelectedStyles([]);
    setSelectedMaterials([]);
    setSelectedPriceClass([]);
  };

  const filteredBricks = useMemo(() => {
    return bricks.filter(brick => {
      const matchStyle = selectedStyles.length === 0 || 
        selectedStyles.some(s => brick.features['STYLE']?.includes(s));
      const matchMaterial = selectedMaterials.length === 0 || 
        selectedMaterials.includes(brick.features['MATERIAL']);
      const matchPrice = selectedPriceClass.length === 0 || 
        selectedPriceClass.includes(brick.features['PRICE CLASS']);
      
      return matchStyle && matchMaterial && matchPrice;
    });
  }, [bricks, selectedStyles, selectedMaterials, selectedPriceClass]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--accent)]" />
        <p className="text-muted-foreground font-medium">Loading Architectural Materials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500 font-bold">Error: {error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[var(--accent)] text-white rounded-md">Retry</button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 px-6 min-h-screen bg-[#FCFAF9]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Sidebar Filters */}
        <div className="lg:w-64 flex-shrink-0 pt-6">
          <div className="space-y-10 sticky top-32">
            
            {/* Materials */}
            <div>
              <h3 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-4">Materials</h3>
              <div className="space-y-3">
                {filterOptions.materials.map(mat => (
                  <label key={mat} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${selectedMaterials.includes(mat) ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-black/20 group-hover:border-[var(--accent)]'}`}>
                      {selectedMaterials.includes(mat) && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    <input type="checkbox" className="hidden" onChange={() => toggleFilter(mat, selectedMaterials, setSelectedMaterials)} />
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{mat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Styles */}
            <div>
              <h3 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-4">Aesthetic Style</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                {filterOptions.styles.map(style => (
                  <label key={style} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${selectedStyles.includes(style) ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-black/20 group-hover:border-[var(--accent)]'}`}>
                      {selectedStyles.includes(style) && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    <input type="checkbox" className="hidden" onChange={() => toggleFilter(style, selectedStyles, setSelectedStyles)} />
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{style}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Class */}
            <div>
              <h3 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-4">Price Class</h3>
              <div className="space-y-3">
                {filterOptions.priceClasses.map(pc => (
                  <label key={pc} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${selectedPriceClass.includes(pc) ? 'border-[var(--accent)]' : 'border-black/20 group-hover:border-[var(--accent)]'}`}>
                      {selectedPriceClass.includes(pc) && <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />}
                    </div>
                    <input type="checkbox" className="hidden" onChange={() => toggleFilter(pc, selectedPriceClass, setSelectedPriceClass)} />
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{pc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            <button 
              onClick={clearFilters}
              className="w-full py-2.5 border border-[var(--accent)]/30 text-[var(--accent)] text-xs font-semibold tracking-widest uppercase rounded hover:bg-[var(--accent)] hover:text-white transition-all"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
              >
                {categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : 'Architectural Materials'}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground text-lg leading-relaxed"
              >
                Showing {filteredBricks.length} curated masonry solutions from our global collection. Kiln-fired textures and precision-engineered units.
              </motion.p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Sort by:</span>
              <button className="flex items-center gap-2 text-sm font-medium hover:text-[var(--accent)] transition-colors">
                Featured Designs <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredBricks.map((brick, index) => (
                <motion.div
                  key={brick.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.02 }}
                  className="group cursor-pointer"
                >
                  <Link to={`/products/${brick.id}`} className="block">
                    {/* Image Container */}
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-black/5 shadow-sm group-hover:shadow-md transition-shadow">
                      <img 
                        src={brick.brick_image} 
                        alt={brick.variant} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase shadow-sm">
                        {brick.features['MATERIAL']}
                      </div>
                    </div>
                    {/* Content */}
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-bold group-hover:text-[var(--accent)] transition-colors line-clamp-1">{brick.variant}</h3>
                        <span className="text-sm font-bold text-[var(--accent)] shrink-0 ml-2">{brick.features['PRICE CLASS']}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 h-8">{brick.features['STYLE']}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredBricks.length === 0 && (
            <div className="text-center py-32">
              <p className="text-2xl font-bold text-muted-foreground">No materials found matching your criteria.</p>
              <button onClick={clearFilters} className="mt-4 text-[var(--accent)] underline uppercase tracking-widest text-xs font-bold">Clear all filters</button>
            </div>
          )}

          {/* Load More (Simulation) */}
          {filteredBricks.length > 0 && (
            <div className="mt-20 flex flex-col items-center gap-6">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">End of Catalog</span>
              <div className="w-48 h-px bg-black/10" />
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
