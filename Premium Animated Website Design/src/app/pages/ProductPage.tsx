import { useState, useMemo } from "react";
import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight, ShieldCheck, Leaf, Loader2, ArrowLeft } from "lucide-react";
import { useBrick } from "../hooks/useBricks";

export function ProductPage() {
  const { productId } = useParams();
  const { brick, loading, error } = useBrick(productId || '');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = useMemo(() => {
    if (!brick) return [];
    const all = [brick.brick_image, ...(brick.house_images || [])];
    return all.filter(img => img && img.startsWith('http'));
  }, [brick]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--accent)]" />
        <p className="text-muted-foreground font-medium">Loading Material Details...</p>
      </div>
    );
  }

  if (error || !brick) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500 font-bold">Error: {error || 'Product not found'}</p>
        <Link to="/categories/brick" className="flex items-center gap-2 text-[var(--accent)]">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const currentImage = selectedImage || brick.brick_image;

  return (
    <div className="pt-24 pb-24 px-6 min-h-screen bg-[#FCFAF9]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Column: Imagery & Details */}
          <div className="lg:w-7/12 space-y-12">
            
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/5 shadow-inner">
                <motion.img 
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={currentImage} 
                  alt={brick.variant} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                  {brick.features['MATERIAL'] || 'MASONRY'}
                </div>
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-4">
                  {images.slice(0, 5).map((img, i) => (
                    <div 
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-square rounded-xl overflow-hidden bg-black/5 cursor-pointer transition-all ${currentImage === img ? 'ring-2 ring-[var(--accent)] ring-offset-2' : 'hover:opacity-80'}`}
                    >
                      <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Material Profile */}
            <div>
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--accent)] mb-4">Material Profile</h3>
              <div className="prose prose-slate max-w-none">
                <p className="text-foreground/80 leading-relaxed text-lg">
                  {brick.variant} is a premium {brick.features['MATERIAL']?.toLowerCase()} masonry solution. 
                  Featuring a {brick.features['FINISH']?.toLowerCase()} finish and {brick.features['STYLE']?.toLowerCase()} style, 
                  it is recommended for {brick.features['RECOMMENDED USE']?.toLowerCase()} applications.
                </p>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="bg-[#F5F3F0] rounded-xl p-8">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-6">Technical Specifications</h3>
              <div className="space-y-4">
                {Object.entries(brick.features).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-black/5 last:border-0">
                    <span className="text-xs font-bold tracking-widest uppercase text-foreground/60">{key}</span>
                    <span className="text-sm font-medium text-right ml-4">{value}</span>
                  </div>
                ))}
                {brick.dimensions && (
                  <div className="pt-4 mt-4 border-t-2 border-black/5">
                    <span className="text-xs font-bold tracking-widest uppercase text-foreground/60 block mb-3">Dimensions & Coverage</span>
                    <p className="text-sm font-medium whitespace-pre-line leading-relaxed bg-white/50 p-4 rounded-lg">
                      {brick.dimensions}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Form */}
          <div className="lg:w-5/12">
            <div className="sticky top-32">
              <div className="mb-8">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
                  <Link to="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
                  <span>&gt;</span>
                  <Link to="/categories/brick" className="hover:text-[var(--accent)] transition-colors">Catalog</Link>
                  <span>&gt;</span>
                  <span className="text-[var(--accent)]">{brick.variant}</span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight mb-4">{brick.variant}</h1>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-bold tracking-widest uppercase rounded">
                    {brick.features['PRICE CLASS'] || 'Standard Series'}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-tight">
                    {brick.features['COLOUR CLASS']}
                  </span>
                </div>
              </div>

              {/* Form Box */}
              <div className="bg-white border border-black/5 rounded-2xl p-8 shadow-sm mb-6">
                <h3 className="text-xl font-bold tracking-tight mb-6">Specification & Quote</h3>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Full Name</label>
                      <input type="text" placeholder="John Doe" className="w-full bg-[#F5F3F0] px-4 py-3 rounded-md text-sm outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Company</label>
                      <input type="text" placeholder="Architectural Firm" className="w-full bg-[#F5F3F0] px-4 py-3 rounded-md text-sm outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Estimated Quantity (Sq Ft)</label>
                    <input type="text" placeholder="1,000" className="w-full bg-[#F5F3F0] px-4 py-3 rounded-md text-sm outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Project Details</label>
                    <textarea rows={4} placeholder={`Interested in ${brick.variant} for a new project...`} className="w-full bg-[#F5F3F0] px-4 py-3 rounded-md text-sm outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all resize-none"></textarea>
                  </div>

                  <button className="w-full bg-[var(--accent)] text-white py-4 rounded-md font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[var(--accent)]/90 transition-colors">
                    Request Firm Quote <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-[10px] text-muted-foreground leading-relaxed mt-2 px-4">
                    Our engineering team will respond with a detailed specification sheet and pricing within 24 business hours.
                  </p>
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F5F3F0] p-4 rounded-xl flex items-center gap-3 border border-black/5">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[var(--accent)] shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground">Guarantee</div>
                    <div className="text-xs font-bold">25 Year Warranty</div>
                  </div>
                </div>
                <div className="bg-[#F5F3F0] p-4 rounded-xl flex items-center gap-3 border border-black/5">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[var(--accent)] shadow-sm">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground">Impact</div>
                    <div className="text-xs font-bold">Low Carbon Path</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12">
          <Link to="/categories/brick" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-[var(--accent)] transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Collection
          </Link>
        </div>

      </div>
    </div>
  );
}
