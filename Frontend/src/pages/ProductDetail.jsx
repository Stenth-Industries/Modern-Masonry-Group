import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Verified, Leaf, Plus } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockData';

const ProductDetail = () => {
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0]; // fallback if not found

  return (
    <main className="pt-32 pb-24 px-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Hero Gallery */}
        <div className="lg:col-span-7 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/3] rounded-xl overflow-hidden group bg-surface-container-low shadow-sm"
          >
            <img 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              src={product.image}
            />
            <div className="absolute bottom-6 left-6 flex space-x-2">
              <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-on-surface">Main View</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-4 gap-4"
          >
            <div className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-surface-container">
              <img alt="Detail" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClDBh2oLmvxtm4zKiLiUFGTsqTfse5ZtbBfnkr38YcW9MDlh6D0oy_M01tcvfyU-Eg4egoJ69b198hEKd-_cy7LtH-nK76qDnZayoBPV33QjY7YeCc103QLxPDh91hWBMIYMKDkhjUDQH4tpekmCUicj44XWd4GpaPAE18JxR3A6yzEGiSTf-ORSOJMwqIivKhoP3_ch9S-lg2GPndVDA7Abs4iRFbsyHc9ZUH9yyus1boJQGT8kHlaDldgkeyNBLNSPizdXBFFra3" />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-surface-container">
              <img alt="Material" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYVvsKBGe8FSs_pU6wK5bxXAzseBIQmjx-pdD98SFZZs528oXbPx6Ja15ydF4yylwx_I9VPlk3nw5JwgGJq4V-vp-0kye6HYrU6DvA5Jckp0EeBLksblJlu_iD7qh86hd-Mw2tRCDVRRN5zn4MLVl00uM5au-zJhqs6ZPtYfmluE7BH5_PUUzwhct0BaoLQIYUjj_zFzQEIaxGxl_VyTWcf6Csg1sSbNvGjREMC5F_KtXadbHjdzkdvtfCjFS4en1RTJeCfWUNY91N" />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-surface-container">
              <img alt="Installation" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJi4LczuF8jRJRfQuFyPiSTXinFnjpTeZ-oGtiB41dCMokmBPsy1c_0ThBpHxtMhBzPJFjxw-2nJqfMq_lr3Wico_6aWq0M4gB6zUZKe25gUHEkjqhopt6q21y-7kus_sur7gESkvpWLjw316gwjX6xVmA6rJtc9zLXZGfodxXcYVfSmu057TutW6Ak72Ul6iu49enNWeXe8vhXBnnaX0WLsenXIybd5XIw_4zSQ-hUMyQ_JQopxvcW6jFvcgm_zhdBsXLHFlSpO3X" />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden cursor-pointer bg-primary-container flex flex-col items-center justify-center text-on-primary-container p-4 text-center">
              <span className="material-symbols-outlined text-3xl mb-1">view_module</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">+12 Views</span>
            </div>
          </motion.div>

          {/* Product Content */}
          <div className="pt-12 space-y-12">
            <section>
              <h2 className="font-headline text-sm font-extrabold uppercase tracking-[0.2em] text-primary mb-4">Material Profile</h2>
              <p className="text-xl leading-relaxed text-on-surface-variant max-w-3xl">
                The {product.name} is our premier offering, characterized by its deep, irregular pigmentation and exceptional structural integrity. Each piece is crafted from local materials, processed to achieve a finish that is both tactile and timeless. {product.description}
              </p>
            </section>

            {/* Color Swatches */}
            <section>
              <h3 className="font-headline text-sm font-extrabold uppercase tracking-[0.2em] text-on-surface-variant mb-6">Available Textures</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                <button className="group space-y-2 focus:outline-none">
                  <div className="aspect-square rounded-lg bg-[#6f1e1a] shadow-inner ring-2 ring-primary ring-offset-4 ring-offset-surface"></div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-on-surface">Oxidized</span>
                </button>
                <button className="group space-y-2 focus:outline-none">
                  <div className="aspect-square rounded-lg bg-[#4a4a4a] shadow-inner"></div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">Carbon</span>
                </button>
                <button className="group space-y-2 focus:outline-none">
                  <div className="aspect-square rounded-lg bg-[#d4c5b3] shadow-inner"></div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">Silt</span>
                </button>
                <button className="group space-y-2 focus:outline-none">
                  <div className="aspect-square rounded-lg bg-[#8e6c56] shadow-inner"></div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">Umber</span>
                </button>
                <button className="group space-y-2 focus:outline-none">
                  <div className="aspect-square rounded-lg bg-[#3d2e2e] shadow-inner"></div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">Basalt</span>
                </button>
                <button className="group space-y-2 focus:outline-none">
                  <div className="aspect-square rounded-lg bg-[#e5e2e1] shadow-inner flex items-center justify-center group-hover:bg-primary-container group-hover:text-primary transition-colors">
                    <Plus className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">Custom</span>
                </button>
              </div>
            </section>

            {/* Specifications Table */}
            <section className="bg-surface-container-low rounded-xl p-8 shadow-sm">
              <h3 className="font-headline text-sm font-extrabold uppercase tracking-[0.2em] text-on-surface-variant mb-8">Technical Specifications</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-end pb-4 border-b border-outline-variant/30 hover:border-primary/50 transition-colors">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Dimensions</span>
                  <span className="font-headline font-bold text-lg">215 x 102.5 x 65 mm</span>
                </div>
                <div className="flex justify-between items-end pb-4 border-b border-outline-variant/30 hover:border-primary/50 transition-colors">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Weight (per unit)</span>
                  <span className="font-headline font-bold text-lg">2.4 kg</span>
                </div>
                <div className="flex justify-between items-end pb-4 border-b border-outline-variant/30 hover:border-primary/50 transition-colors">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Compressive Strength</span>
                  <span className="font-headline font-bold text-lg">75 N/mm²</span>
                </div>
                <div className="flex justify-between items-end pb-4 border-b border-outline-variant/30 hover:border-primary/50 transition-colors">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Water Absorption</span>
                  <span className="font-headline font-bold text-lg">&lt; 7.0%</span>
                </div>
                <div className="flex justify-between items-end pb-4 border-b border-outline-variant/30 hover:border-primary/50 transition-colors">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Durability Rating</span>
                  <span className="font-headline font-bold text-lg">F2 (Frost Resistant)</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Sticky Sidebar Content */}
        <aside className="lg:col-span-5 lg:sticky lg:top-32 space-y-10">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <nav className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              <Link to={`/masonry/${product.category}`} className="hover:text-primary transition-colors">Collections</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="capitalize">{product.category}</span>
            </nav>
            <h1 className="font-headline text-6xl font-extrabold tracking-tighter text-on-surface">{product.name}</h1>
            <div className="flex items-center space-x-4 pt-2">
              <span className="bg-primary-container/10 text-primary-container px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">{product.tag || 'Standard'}</span>
              <span className="text-on-surface-variant text-sm font-medium">Model: MZ-900</span>
            </div>
            <div className="pt-2 text-2xl font-headline font-black text-primary">
              {product.price}
            </div>
          </motion.div>

          {/* Inquiry Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] p-10 border border-surface-container-low"
          >
            <h3 className="font-headline text-2xl font-bold tracking-tight mb-8">Specification &amp; Quote</h3>
            <form className="space-y-6" onSubmit={e => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-on-surface-variant ml-1">Full Name</label>
                  <input className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-colors p-3 text-sm" placeholder="John Doe" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-on-surface-variant ml-1">Company</label>
                  <input className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-colors p-3 text-sm" placeholder="Architectural Firm" type="text" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-on-surface-variant ml-1">Estimated Quantity (Units)</label>
                <input className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-colors p-3 text-sm" placeholder="5,000" type="number" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-on-surface-variant ml-1">Project Details</label>
                <textarea className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-colors p-3 text-sm resize-none" placeholder="Brief description of the application..." rows="4"></textarea>
              </div>
              <button className="w-full masonry-gradient text-white py-5 rounded-lg font-headline font-extrabold tracking-tight hover:opacity-95 transition-all shadow-xl shadow-primary/30 flex items-center justify-center space-x-2 active:scale-95" type="submit">
                <span>Request Firm Quote</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
            </form>
            <p className="text-[11px] text-center text-on-surface-variant mt-6 leading-relaxed">
              Our engineering team will respond with a technical specification sheet and tiered pricing within 24 business hours.
            </p>
          </motion.div>

          {/* Feature Accents */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
              <Verified className="text-primary w-8 h-8 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">Guarantee</span>
                <span className="text-sm font-bold text-on-surface">50-Year Warranty</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
              <Leaf className="text-primary w-8 h-8 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">Impact</span>
                <span className="text-sm font-bold text-on-surface">Low Carbon Path</span>
              </div>
            </div>
          </motion.div>
        </aside>

      </div>

      {/* Related Products */}
      <section className="mt-40 border-t border-outline-variant/20 pt-20">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-4">
            <h2 className="font-headline text-sm font-extrabold uppercase tracking-[0.3em] text-primary">System Elements</h2>
            <h3 className="font-headline text-4xl font-extrabold tracking-tighter">Complementary Solutions</h3>
          </div>
          <Link to={`/masonry/${product.category}`} className="text-xs font-bold uppercase tracking-widest border-b-2 border-primary pb-1 hover:text-primary transition-colors">
            View System Catalog
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Related 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-surface-container shadow-sm">
              <img alt="Mortar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzMSApOZZ0kFkhbfwOp3C4honDbc7OoTX6rZUFnT_hmKLhXBkrQDq3YFKeA41OcNI28DySvb_l8EbKK-273u7NyrVP07xhYa6PnqV3B05V1Sg32mYZ3tP6mJV_e1ziNc8BtFPLzH93uDJPQjATs9uc8vl8uvtgDR_-dA1cF5UJZayub3DNg6M1Eoz3VJLuDlUPOr-Y11jQuMzowcMypxYr73DV0HgTZXv0pzF8F6ijjOvQVF8KlWlxSESyp-mNClphhFBqJrTJFp3M" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
            </div>
            <h4 className="font-headline font-bold text-xl mb-2 group-hover:text-primary transition-colors">Deep-Tone Mortar (MZ-5)</h4>
            <p className="text-sm text-on-surface-variant font-medium">Optimized for high-contrast jointing with Zenith Series.</p>
          </motion.div>
          {/* Related 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-surface-container shadow-sm">
              <img alt="Stone" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTinpDSGpa8IkHav7VZWoF3dNQi8cAP2zqfrAbhKZlCG2ffXm4BTz0hr_5taZJRHtxOmIbJBqoSYkIow20s02fZkarsdU8xo1S7_7cc1yPZrLjBQPQYDJ4R9hN6zrXpeg9nbpb0S9Csvk587ijteds84NNCi63ud-eeAFmLm4Q0FzyyQDIG8lYsBesizXz0c7DnlyKOXbXvDzKEQwOrzdTNFptMdHviWFzwK3bjpHstvo8zA45nwftu6A-wVnm4ndjnjPnlrxwd0RF" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
            </div>
            <h4 className="font-headline font-bold text-xl mb-2 group-hover:text-primary transition-colors">Linear Sills</h4>
            <p className="text-sm text-on-surface-variant font-medium">Precision-cut precast elements for window and ledge detailing.</p>
          </motion.div>
          {/* Related 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-surface-container shadow-sm">
              <img alt="Sealer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiuV2J0A3HqfgQZKtcQ5tA8KIsjZVrkRIpFMY_4DuuXaF7uDvcHm_KnAnTa_zc1Bn8c3_uIYlNux6U3u3_S-ZMjuTnzoOtOdG6wSoh9zMDoxY9zx_bPlw5w4CbPpCqy7TUgCvAdRBcMIPBI39AQRomhGwf6IbRfOsKn1cnK9LmzIufwztDg1wIVym79aZ1DMvycUILU3OTDD1KntFJjF1j_X2jXdpfgbH71V3-jP_hsbkttmXDMe7wfdeBL1Q9EP27_IAx-ml8yIvT" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
            </div>
            <h4 className="font-headline font-bold text-xl mb-2 group-hover:text-primary transition-colors">Architectural Sealer</h4>
            <p className="text-sm text-on-surface-variant font-medium">Invisible matte finish for long-term efflorescence protection.</p>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;
