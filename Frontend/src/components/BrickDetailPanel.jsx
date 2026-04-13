import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle,
  Package,
  Zap,
  Droplets,
  Thermometer,
  Ruler,
  Building2,
  ChevronRight,
  Send,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { BrickWallPattern } from "./BrickWallPattern";

function SpecRow({ icon, label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center justify-between py-6 border-b border-white/[0.04] group hover:border-[#ccab7b]/20 transition-colors"
    >
      <div className="flex items-center gap-4 text-[#9a9488]">
        <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-[#ccab7b] group-hover:bg-[#ccab7b]/10 transition-colors">
          {React.cloneElement(icon, { size: 14 })}
        </div>
        <span className="text-[12px] tracking-widest uppercase font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</span>
      </div>
      <span className="text-[13px] text-[#e3decb] font-medium tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>{value}</span>
    </motion.div>
  );
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.4 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export function BrickDetailPanel({ brick, onClose, initialTab = "overview" }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [submitState, setSubmitState] = useState("idle");
  const panelRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    projectType: "",
    projectAddress: "",
    quantity: "",
    quantityUnit: "m²",
    timeline: "",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (brick) {
      setActiveTab(initialTab);
      setSubmitState("idle");
      setFormData({
        fullName: "",
        company: "",
        email: "",
        phone: "",
        projectType: "",
        projectAddress: "",
        quantity: "",
        quantityUnit: "m²",
        timeline: "",
        notes: "",
      });
      setFormErrors({});
      if (panelRef.current) panelRef.current.scrollTop = 0;
    }
  }, [brick, initialTab]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const validate = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email";
    }
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    if (!formData.projectType) errors.projectType = "Project type is required";
    if (!formData.quantity.trim()) errors.quantity = "Quantity is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitState("loading");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1800));
    console.log("Quote request:", { brick: brick?.name, ...formData });
    setSubmitState("success");
  };

  return (
    <AnimatePresence>
      {brick && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[100] w-full h-[100dvh] overflow-y-auto scrollbar-none bg-[#0a0806]"
        >
          {/* Subtle Background Texture Layer */}
          <div 
            className="fixed inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none" 
            style={{ backgroundImage: "url('/bg.png')", backgroundSize: 'cover', backgroundAttachment: 'fixed' }} 
          />

          {/* Top Navbar Area */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="sticky top-0 z-50 w-full px-8 xl:px-14 py-6 flex items-center justify-between border-b border-white/[0.04] bg-black/80 backdrop-blur-xl"
          >
            <button
              onClick={onClose}
              className="flex items-center gap-3 text-[#9a9488] hover:text-white transition-colors group"
            >
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5 transition-all">
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span className="text-[11px] uppercase tracking-widest font-bold">Back to Catalogue</span>
            </button>
            <div className="flex items-center gap-4 hidden sm:flex">
                <span className="text-[10px] text-white/30 uppercase tracking-[0.2em]" style={{ fontFamily: "'Inter', sans-serif" }}>Catalogue Reference</span>
                <span className="px-3 py-1 border border-[#ccab7b]/20 text-[#ccab7b] rounded bg-[#ccab7b]/10 text-[10px] uppercase tracking-widest font-bold">{brick.code}</span>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="relative z-10 w-full max-w-[1500px] mx-auto px-8 xl:px-14 py-16 flex flex-col lg:flex-row gap-16 xl:gap-24">
            
            {/* Left Column: Framed Elegance Image */}
            <motion.div 
              initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="w-full lg:w-[420px] shrink-0"
            >
              <div className="sticky top-[120px] flex flex-col gap-8">
                {/* Image Frame */}
                <div className="w-full aspect-[4/5] bg-[#111] rounded-[8px] overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative group">
                  {brick.image ? (
                    <img 
                      src={brick.image} 
                      alt={brick.name} 
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                    />
                  ) : (
                    <BrickWallPattern colorHex={brick.colorHex} rows={8} animated />
                  )}
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40 pointer-events-none" />
                </div>

                {/* Left side quick details */}
                <div className="p-6 border border-white/5 bg-white/[0.01] rounded-[8px]">
                   <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#ccab7b] font-bold mb-4">Material Profile</h4>
                   <div className="flex items-center gap-4 mb-4">
                     <div className="w-10 h-10 rounded-full border border-white/20 shadow-inner" style={{ background: brick.colorHex }} />
                     <div>
                       <p className="text-[14px] text-[#e3decb] font-medium tracking-wide">{brick.color}</p>
                       <p className="text-[11px] uppercase tracking-[0.1em] text-[#9a9488]">{brick.finish}</p>
                     </div>
                   </div>
                   <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                     <span className="text-[11px] uppercase tracking-[0.1em] text-[#9a9488]">Type</span>
                     <span className="text-[11px] uppercase tracking-[0.1em] text-[#e3decb] font-medium">{brick.collection}</span>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Title, Tabs, Detail Flow */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
              }}
              className="flex-1 min-w-0 pb-32"
            >
              <motion.div variants={itemVariants} className="mb-14">
                <h1 className="text-[52px] xl:text-[64px] text-[#e3decb] tracking-[0.01em] leading-[1.05] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {brick.name}
                </h1>
                <p className="text-[16px] text-white/50 leading-relaxed font-light max-w-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {brick.description || "A foundational masonry element combining architectural purity with uncompromising structural integrity. Designed specifically for highly refined residential exterior facades and feature interior installations."}
                </p>
                
                <div className="flex flex-wrap items-center gap-12 mt-10">
                  <div>
                    <span className="block text-[10px] text-[#ccab7b] uppercase tracking-[0.2em] font-bold mb-2">Manufacturer</span>
                    <span className="text-[14px] text-[#e3decb] tracking-wider">{brick.manufacturer}</span>
                  </div>
                  <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
                  <div>
                    <span className="block text-[10px] text-[#ccab7b] uppercase tracking-[0.2em] font-bold mb-2">Standard Dimensions</span>
                    <span className="text-[14px] text-[#e3decb] tracking-wider">{brick.size}</span>
                  </div>
                </div>
              </motion.div>

              {/* Classic Navigation Tabs */}
              <motion.div variants={itemVariants} className="border-b border-white/[0.08] mb-12 flex items-center gap-10 overflow-x-auto scrollbar-none">
                {["overview", "specs", "quote"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative py-4 text-[12px] uppercase tracking-[0.15em] transition-colors whitespace-nowrap ${
                      activeTab === tab ? "text-[#ccab7b] font-bold" : "text-[#8c857b] font-medium hover:text-[#e3decb]"
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {tab === "quote" ? "Request Quote" : tab === "specs" ? "Full Specifications" : "Product Features"}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="active-tab"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ccab7b]"
                      />
                    )}
                  </button>
                ))}
              </motion.div>

              {/* Tab Contents */}
              <motion.div variants={itemVariants}>
                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-2xl"
                  >
                    <div className="mb-12">
                      <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#ccab7b] mb-6">
                        Suitable Applications
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {brick.applications?.map((app) => (
                          <div
                            key={app}
                            className="px-5 py-2.5 rounded-[4px] bg-white/[0.03] border border-white/[0.06] text-[12px] text-[#e3decb] tracking-wide flex items-center gap-2" 
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ccab7b]" />
                            {app}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-12">
                      <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#ccab7b] mb-6">
                        Sustainability & Sourcing
                      </h4>
                      <p className="text-[#a8a195] leading-[1.8] text-[14px] font-light">
                        All our masonry materials are securely sourced from highly vetted manufacturers. Fired in high-efficiency kilns, `{brick.name}` maintains exceptional thermal mass characteristics, significantly reducing energy costs over the lifetime of structurally integrated applications.
                      </p>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                      <button
                        onClick={() => setActiveTab("quote")}
                        className="px-8 py-4 bg-transparent border border-[#ccab7b] text-[#ccab7b] font-bold uppercase tracking-[0.15em] text-[12px] hover:bg-[#ccab7b] hover:text-black transition-all duration-500 flex items-center justify-center gap-3 group rounded"
                      >
                        <Send size={16} />
                        <span>Build A Quote Request</span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "specs" && (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-3xl"
                  >
                    <div className="border-t border-white/[0.04]">
                      <SpecRow icon={<Ruler />} label="Unit Dimensions (L × W × H)" value={brick.size} delay={0.05} />
                      <SpecRow icon={<Package />} label="Average Weight per unit" value={brick.weight} delay={0.1} />
                      <SpecRow icon={<Zap />} label="Compressive Strength" value={brick.compressiveStrength} delay={0.15} />
                      <SpecRow icon={<Droplets />} label="Max Water Absorption" value={brick.waterAbsorption} delay={0.2} />
                      <SpecRow icon={<Thermometer />} label="Frost Resistance Grade" value={brick.frostResistance} delay={0.25} />
                      <SpecRow icon={<Building2 />} label="Sourcing Manufacturer" value={brick.manufacturer} delay={0.3} />
                    </div>

                    <div className="mt-12 p-6 rounded-[8px] bg-[#ccab7b]/5 border-l-[3px] border-[#ccab7b]">
                      <p className="text-[12px] text-[#ccab7b]/80 tracking-wide leading-[1.8] font-light italic">
                        * All specifications are subject to manufacturing tolerances as per AS/NZS 4455.
                        Please ensure you consult with your structural engineer regarding load-bearing applications. 
                        Contact our technical team for full project-specific compliance data or Material Safety Data Sheets (MSDS).
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "quote" && (
                  <motion.div
                    key="quote"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-2xl"
                  >
                    {submitState === "success" ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center border border-[#ccab7b]/20 bg-[#ccab7b]/5 rounded-[8px]">
                          <CheckCircle size={72} className="text-[#ccab7b] mb-8" strokeWidth={1.5} />
                          <h3 className="text-[28px] font-serif tracking-tight text-[#e3decb] mb-4">Quotation Initialized</h3>
                          <p className="text-[#9a9488] max-w-md leading-relaxed mb-8 text-[14px]">
                            Your request regarding <strong className="text-[#ccab7b] font-normal">{brick.name}</strong> has securely reached our desk. An architectural consultant will reach out within 1–2 business days.
                          </p>
                          <p className="text-[10px] text-white/30 font-mono tracking-widest uppercase mb-10">TICKET REF: {brick.code}-REQ</p>
                          <button
                            onClick={() => setSubmitState("idle")}
                            className="px-8 py-3 border border-white/20 text-[#e3decb] font-bold uppercase text-[11px] tracking-[0.15em] hover:bg-white/10 transition-colors rounded"
                          >
                            Start Another Request
                          </button>
                        </div>
                      ) : (
                        <motion.form
                          key="form"
                          onSubmit={onSubmit}
                          className="space-y-10"
                        >
                          <div className="flex items-center gap-5 mb-8 border-b border-white/[0.04] pb-8">
                              <div className="w-14 h-14 border border-[#ccab7b]/30 rounded-full flex items-center justify-center text-[#ccab7b] bg-[#ccab7b]/5 shrink-0">
                                <Send size={22} strokeWidth={1.5}/>
                              </div>
                              <div>
                                <h3 className="text-[24px] text-[#e3decb] tracking-wide leading-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Product Quotation Form</h3>
                                <p className="text-[12px] text-[#8c857b] tracking-wider uppercase font-light" style={{ fontFamily: "'Inter', sans-serif" }}>Secure pricing, delivery constraints, and sample ordering</p>
                              </div>
                          </div>

                          {/* Contact Details Fields */}
                          <div>
                            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#ccab7b] mb-6 flex items-center gap-3">
                              <span className="w-6 border-b border-[#ccab7b]"></span>
                              Contact Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-[11px] uppercase tracking-widest text-[#9a9488] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  Full Name <span className="text-[#ccab7b]">*</span>
                                </label>
                                <input
                                  value={formData.fullName}
                                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                  placeholder="John Smith"
                                  className={`w-full px-5 py-3.5 rounded-[4px] bg-black/40 border text-[#e3decb] text-[13px] placeholder:text-white/10 focus:outline-none focus:border-[#ccab7b]/60 transition-colors font-light shadow-inner ${
                                    formErrors.fullName ? "border-red-500/50" : "border-white/10"
                                  }`} 
                                />
                                {formErrors.fullName && <p className="text-red-400 text-[11px] mt-2">{formErrors.fullName}</p>}
                              </div>
                              <div>
                                <label className="block text-[11px] uppercase tracking-widest text-[#9a9488] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  Email Address <span className="text-[#ccab7b]">*</span>
                                </label>
                                <input
                                  type="email"
                                  value={formData.email}
                                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                                  placeholder="john@example.com"
                                  className={`w-full px-5 py-3.5 rounded-[4px] bg-black/40 border text-[#e3decb] text-[13px] placeholder:text-white/10 focus:outline-none focus:border-[#ccab7b]/60 transition-colors font-light shadow-inner ${
                                    formErrors.email ? "border-red-500/50" : "border-white/10"
                                  }`} 
                                />
                                {formErrors.email && <p className="text-red-400 text-[11px] mt-2">{formErrors.email}</p>}
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-[11px] uppercase tracking-widest text-[#9a9488] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  Company Name / Project Name
                                </label>
                                <input
                                  value={formData.company}
                                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                                  placeholder="Acme Constructions / Northville Build"
                                  className="w-full px-5 py-3.5 rounded-[4px] bg-black/40 border border-white/10 text-[#e3decb] text-[13px] placeholder:text-white/10 focus:outline-none focus:border-[#ccab7b]/60 transition-colors font-light shadow-inner" 
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Project Specifications */}
                          <div className="pt-4">
                            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#ccab7b] mb-6 flex items-center gap-3">
                              <span className="w-6 border-b border-[#ccab7b]"></span>
                              Project Requirements
                            </h4>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                              <div>
                                <label className="block text-[11px] uppercase tracking-widest text-[#9a9488] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  Estimated Quantity <span className="text-[#ccab7b]">*</span>
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                    placeholder="e.g. 1500"
                                    className={`w-full px-5 py-3.5 rounded-[4px] bg-black/40 border text-[#e3decb] text-[13px] placeholder:text-white/10 focus:outline-none focus:border-[#ccab7b]/60 transition-colors font-light shadow-inner ${
                                      formErrors.quantity ? "border-red-500/50" : "border-white/10"
                                    }`} 
                                  />
                                  <select 
                                    className="px-5 py-3.5 rounded-[4px] bg-[#1a1815] border border-white/10 text-[#e3decb] text-[12px] focus:outline-none focus:border-[#ccab7b]/50 transition-colors font-light tracking-wide cursor-pointer w-[120px]"
                                  >
                                    <option value="m²">sqm</option>
                                    <option value="Pallets">Pallets</option>
                                    <option value="Pieces">Pieces</option>
                                  </select>
                                </div>
                                {formErrors.quantity && <p className="text-red-400 text-[11px] mt-2">{formErrors.quantity}</p>}
                              </div>
                            </div>
                          </div>

                          {/* Submit */}
                          <div className="pt-8 mb-10 w-full md:w-3/4">
                              <button
                                type="submit"
                                disabled={submitState === "loading"}
                                className="w-full py-[20px] bg-[#ccab7b] text-black font-bold uppercase tracking-[0.15em] text-[12px] hover:shadow-[0_15px_40px_rgba(204,171,123,0.35)] transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed rounded" 
                              >
                                {submitState === "loading" ? (
                                  <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Processing Document...</span>
                                  </>
                                ) : (
                                  <>
                                    <Send size={16} />
                                    <span>Execute Quote Request</span>
                                  </>
                                )}
                              </button>
                          </div>
                        </motion.form>
                      )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
