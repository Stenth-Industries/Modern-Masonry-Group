import { motion } from 'framer-motion';

const Estimation = () => {
  return (
    <main className="pt-28 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <span className="text-primary font-bold tracking-widest text-[10px] uppercase mb-4 block">Precision Estimation</span>
            <h1 className="text-6xl md:text-7xl font-headline font-extrabold tracking-tighter text-on-surface mb-8 leading-[0.95]">
              Expert Estimates &amp; Accurate Takeoffs – <span className="text-primary">Fast and Free.</span>
            </h1>
            <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed mb-10">
              The Digital Architect streamlines your masonry workflow. Upload your blueprints and receive professional quantity surveys within 24-48 hours. Built for precision, designed for builders.
            </p>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                <span className="text-sm font-semibold tracking-tight">Professional Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">event_available</span>
                <span className="text-sm font-semibold tracking-tight">One free estimate per project</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden shadow-[0_40px_60px_-15px_rgba(28,27,27,0.1)]">
              <img 
                className="w-full h-full object-cover" 
                alt="architectural blueprint details" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWic5qYEKX_iwn-dIjf7dlp7xC9xMhude8h5AGYmnGfMy9ap6JIlFghLVrebNbIdNYbGXMz63Hg50Q2V11n0dzUuP5zAcykQ3Ptw6GnuX3iRlLcSeGVMRHNe-a3AEwjenQIneN8Lc6ayF2NAK977MspoVasuwzHglVs1HxxvfcIHVyqRX1-gjRoGAmOKsgzKWfkhMw8zWotjRzY4h7HtLKQXWYhJbxnmue8JHqQsUa65R_cikTNUev0QLXPfK5lwv5oJxzYFO_CGXr" 
              />
            </div>
            {/* Decorative architectural element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-container rounded-xl -z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* Main Transactional Section */}
      <section className="bg-surface-container-low py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* File Upload Zone */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-8"
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-headline font-bold tracking-tight">Submit Your Blueprints</h2>
                <p className="text-on-surface-variant">Upload your PDF architectural drawings. Our engineering team will review and provide a comprehensive material takeoff.</p>
              </div>
              <div className="glass-panel border-2 border-dashed border-outline-variant rounded-2xl p-12 text-center group hover:border-primary transition-all duration-300 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-primary-fixed-dim rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-primary text-4xl">cloud_upload</span>
                </div>
                <h3 className="text-xl font-headline font-bold mb-2">Drag &amp; Drop Blueprints</h3>
                <p className="text-on-surface-variant text-sm mb-8">PDF, DWG, or high-res JPG formats. Max file size 50MB.</p>
                <button className="hero-gradient text-white px-8 py-3 rounded-lg font-headline font-bold text-sm shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
                  Select Files
                </button>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-surface-container-lowest p-10 rounded-2xl shadow-sm border border-surface-container-high"
            >
              <h2 className="text-2xl font-headline font-bold mb-8">Project Details</h2>
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-primary">Full Name</label>
                    <input className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 px-0 py-2 text-sm transition-colors" placeholder="John Doe" type="text" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-primary">Email Address</label>
                    <input className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 px-0 py-2 text-sm transition-colors" placeholder="john@example.com" type="email" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary">Project Scale (Estimated SQFT)</label>
                  <select className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 px-0 py-2 text-sm transition-colors cursor-pointer">
                    <option>Under 1,000 sqft</option>
                    <option>1,000 - 5,000 sqft</option>
                    <option>5,000 - 15,000 sqft</option>
                    <option>15,000+ sqft (Commercial)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary">Timeline</label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <button className="border-2 border-primary text-primary font-bold py-3 rounded-lg text-xs hover:bg-primary-container hover:text-white transition-colors active:scale-95" type="button">Urgent</button>
                    <button className="border-2 border-outline-variant text-on-surface-variant font-bold py-3 rounded-lg text-xs hover:border-primary hover:text-primary transition-colors active:scale-95" type="button">1 Month</button>
                    <button className="border-2 border-outline-variant text-on-surface-variant font-bold py-3 rounded-lg text-xs hover:border-primary hover:text-primary transition-colors active:scale-95" type="button">Planning</button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary">Message</label>
                  <textarea className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 px-0 py-2 text-sm transition-colors" placeholder="Tell us about specific masonry needs..." rows="3"></textarea>
                </div>
                <button className="w-full hero-gradient text-white py-4 rounded-lg font-headline font-extrabold tracking-tight shadow-xl hover:scale-[0.98] transition-all" type="submit">
                  Request Free Takeoff
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-8 py-24">
        <h2 className="text-4xl font-headline font-extrabold tracking-tighter text-center mb-16">The Process Explained</h2>
        <div className="space-y-4">
          <div className="bg-surface-container rounded-xl p-6 group cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <h4 className="font-headline font-bold text-lg">What files do you require for a takeoff?</h4>
              <span className="material-symbols-outlined text-primary transition-transform group-hover:rotate-180">expand_more</span>
            </div>
            <div className="mt-4 text-on-surface-variant leading-relaxed">
              We prefer vector-based PDFs of architectural elevations, floor plans, and wall sections. If you have CAD (DWG) files, those provide the highest level of accuracy.
            </div>
          </div>
          
          <div className="bg-surface-container-low border border-surface-container-high rounded-xl p-6 cursor-pointer hover:bg-surface-container transition-colors">
            <div className="flex justify-between items-center">
              <h4 className="font-headline font-bold text-lg">How long does the free estimate take?</h4>
              <span className="material-symbols-outlined text-stone-400">add</span>
            </div>
          </div>
          
          <div className="bg-surface-container-low border border-surface-container-high rounded-xl p-6 cursor-pointer hover:bg-surface-container transition-colors">
            <div className="flex justify-between items-center">
              <h4 className="font-headline font-bold text-lg">What is included in the material report?</h4>
              <span className="material-symbols-outlined text-stone-400">add</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Estimation;
