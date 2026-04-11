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
} from "lucide-react";
import { BrickWallPattern } from "./BrickWallPattern";

const projectTypes = [
  "Residential – New Build",
  "Residential – Extension / Renovation",
  "Commercial – New Build",
  "Commercial – Refurbishment",
  "Heritage Restoration",
  "Landscaping / Hardscaping",
  "Other",
];

const timelines = [
  "ASAP – Within 2 weeks",
  "1–3 Months",
  "3–6 Months",
  "6–12 Months",
  "12+ Months / Planning Stage",
];

const quantityUnits = ["m²", "Pallets", "Pieces (000s)", "Lineal Metres"];

function SpecRow({ icon, label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center justify-between py-4 border-b border-white/[0.04]"
    >
      <div className="flex items-center gap-3 text-[#9a9488]">
        <span className="text-[#ccab7b] opacity-80">{icon}</span>
        <span className="text-[12px] tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</span>
      </div>
      <span className="text-[12px] text-[#e3decb] font-medium tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>{value}</span>
    </motion.div>
  );
}

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
  }, [brick]);

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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 38 }}
            className="fixed top-0 right-0 h-full w-full max-w-[32rem] border-l border-white/5 z-50 flex flex-col overflow-hidden shadow-[-40px_0_100px_rgba(0,0,0,0.8)] bg-cover bg-center"
            style={{ backgroundImage: "linear-gradient(to bottom, rgba(10,8,6,0.92), rgba(10,8,6,0.85)), url('/bg.png')" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-10 py-8 flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
              <div className="relative z-10 w-full">
                <div className="flex justify-end w-full mb-4">
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] text-[#ccab7b] font-bold tracking-[0.25em] uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {brick.collection}
                  </span>
                </div>
                <h2 className="text-[28px] text-[#e3decb] tracking-[0.04em] mb-1 leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>{brick.name}</h2>
                <p className="text-[11px] text-[#8c857b] tracking-[0.1em] uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>{brick.code}</p>
              </div>
            </div>

            {/* Hero Brick Display */}
            <div className="relative flex-shrink-0 h-[280px] overflow-hidden border-y border-white/[0.04]">
              {brick.image ? (
                <img src={brick.image} alt={brick.name} className="w-full h-full object-cover scale-[1.02]" />
              ) : (
                <BrickWallPattern colorHex={brick.colorHex} rows={6} animated />
              )}
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
              
              {/* Color swatch & Metrics */}
              <div className="absolute bottom-6 left-10 flex w-full pr-20 justify-between items-end relative z-10 w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full border border-white/20 shadow-2xl"
                    style={{ background: brick.colorHex }}
                  />
                  <div>
                    <p className="text-[14px] text-[#e3decb] font-medium tracking-wide mb-0.5">{brick.color}</p>
                    <p className="text-[10px] tracking-[0.1em] text-white/50 uppercase">{brick.finish}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[12px] text-[#ccab7b] font-medium tracking-widest uppercase mb-1">{brick.size}</p>
                  <p className="text-[9px] tracking-widest text-[#8c857b] uppercase">{brick.manufacturer}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/[0.04] flex-shrink-0 px-6 mt-4">
              {["overview", "specs", "quote"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-4 text-[11px] uppercase tracking-widest transition-colors ${
                    activeTab === tab ? "text-[#ccab7b] font-bold" : "text-[#8c857b] font-medium hover:text-[#e3decb]"
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {tab === "quote" ? "Request Quote" : tab === "specs" ? "Specifications" : "Overview"}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#ccab7b]"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Scrollable Content */}
            <div ref={panelRef} className="flex-1 overflow-y-auto scrollbar-none">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="p-8 space-y-8"
                  >
                    <div className="px-4">
                      <p className="text-[#a8a195] leading-relaxed text-[13px] font-light" style={{ fontFamily: "'Inter', sans-serif" }}>{brick.description}</p>
                    </div>

                    {/* Applications */}
                    <div className="px-4">
                      <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#ccab7b] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Suitable Applications
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {brick.applications?.map((app) => (
                          <div
                            key={app}
                            className="flex items-center gap-2 px-4 py-2 rounded-[6px] bg-white/[0.02] border border-white/5 text-[11px] text-[#e3decb] tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            <ChevronRight size={10} className="text-[#ccab7b]" />
                            {app}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="px-4 pb-6">
                      <button
                        onClick={() => setActiveTab("quote")}
                        className="w-full py-[18px] bg-transparent border border-[#ccab7b] text-[#ccab7b] font-bold uppercase tracking-[0.15em] text-[11px] rounded-lg hover:bg-[#ccab7b] hover:text-black transition-all duration-500 flex items-center justify-center gap-2 group" style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        <Send size={14} />
                        <span>Request a Quote</span>
                        <ChevronRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "specs" && (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="p-10"
                  >
                    <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#ccab7b] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Technical Specifications
                    </h4>
                    <div className="space-y-0">
                      <SpecRow icon={<Ruler size={14} />} label="Dimensions" value={brick.size} delay={0.05} />
                      <SpecRow icon={<Package size={14} />} label="Weight per unit" value={brick.weight} delay={0.1} />
                      <SpecRow icon={<Zap size={14} />} label="Compressive Strength" value={brick.compressiveStrength} delay={0.15} />
                      <SpecRow icon={<Droplets size={14} />} label="Water Absorption" value={brick.waterAbsorption} delay={0.2} />
                      <SpecRow icon={<Thermometer size={14} />} label="Frost Resistance" value={brick.frostResistance} delay={0.25} />
                      <SpecRow icon={<Building2 size={14} />} label="Manufacturer" value={brick.manufacturer} delay={0.3} />
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mt-8 p-5 rounded-lg bg-white/[0.02] border border-white/5"
                    >
                      <p className="text-[11px] text-[#8c857b] tracking-wide leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                        All specifications are subject to manufacturing tolerances as per AS/NZS 4455.
                        Contact our technical team for project-specific compliance data or MSDS documents.
                      </p>
                    </motion.div>

                    <button
                      onClick={() => setActiveTab("quote")}
                      className="w-full mt-8 py-[18px] bg-[#ccab7b] text-black font-bold uppercase tracking-[0.15em] text-[11px] rounded-lg hover:shadow-[0_0_30px_rgba(204,171,123,0.3)] transition-all duration-500 flex items-center justify-center gap-2 group" style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <Send size={14} />
                      <span>Request a Quote</span>
                      <ChevronRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </motion.div>
                )}

                {activeTab === "quote" && (
                  <motion.div
                    key="quote"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="p-8"
                  >
                    <AnimatePresence mode="wait">
                      {submitState === "success" ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center justify-center py-16 text-center"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
                          >
                            <CheckCircle size={64} className="text-[var(--brass)] mb-6" />
                          </motion.div>
                          <h3 className="text-2xl font-bold tracking-tight text-white mb-3">Quote Request Sent!</h3>
                          <p className="text-gray-400 max-w-sm leading-relaxed mb-6">
                            Thank you for your interest in{" "}
                            <span className="text-[var(--brass)] font-semibold">{brick.name}</span>. Our team will be in
                            touch within 1–2 business days with a tailored quotation.
                          </p>
                          <p className="text-gray-500 font-mono text-xs mb-8">Reference: {brick.code}</p>
                          <button
                            onClick={() => {
                              setSubmitState("idle");
                            }}
                            className="px-8 py-3 rounded-xl border-2 border-[var(--brass)] text-[var(--brass)] font-bold uppercase text-xs tracking-wider hover:bg-[var(--brass)] hover:text-black transition-colors"
                          >
                            Submit Another Request
                          </button>
                        </motion.div>
                      ) : (
                        <motion.form
                          key="form"
                          onSubmit={onSubmit}
                          className="space-y-8"
                        >
                                <div className="flex items-center gap-3 mb-12">
                                   <div className="w-10 h-10 border border-white/10 rounded flex items-center justify-center text-[#ccab7b]">
                                     <CheckCircle size={20} />
                                   </div>
                                   <div>
                                     <h3 className="text-[18px] text-[#e3decb] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>Product Quotation</h3>
                                     <p className="text-[11px] text-[#8c857b] tracking-wider uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>Please fill your details</p>
                                   </div>
                                </div>

                          {/* Contact Details */}
                          <div>
                            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--brass)] mb-4">
                              Contact Details
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#9a9488] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  Full Name <span className="text-[#ccab7b]">*</span>
                                </label>
                                <input
                                  value={formData.fullName}
                                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                  placeholder="John Smith"
                                  className={`w-full px-4 py-3 rounded-md bg-white/[0.03] border text-[#e3decb] text-[12px] placeholder:text-white/20 focus:outline-none focus:border-[#ccab7b]/50 transition-colors font-light ${
                                    formErrors.fullName ? "border-red-500/50" : "border-white/5"
                                  }`} style={{ fontFamily: "'Inter', sans-serif" }}
                                />
                                {formErrors.fullName && (
                                  <p className="text-red-400 text-[10px] mt-1.5">{formErrors.fullName}</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#9a9488] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  Company Name
                                </label>
                                <input
                                  value={formData.company}
                                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                                  placeholder="Acme Constructions"
                                  className="w-full px-4 py-3 rounded-md bg-white/[0.03] border border-white/5 text-[#e3decb] text-[12px] placeholder:text-white/20 focus:outline-none focus:border-[#ccab7b]/50 transition-colors font-light" style={{ fontFamily: "'Inter', sans-serif" }}
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#9a9488] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  Email Address <span className="text-[#ccab7b]">*</span>
                                </label>
                                <input
                                  type="email"
                                  value={formData.email}
                                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                                  placeholder="john@example.com"
                                  className={`w-full px-4 py-3 rounded-md bg-white/[0.03] border text-[#e3decb] text-[12px] placeholder:text-white/20 focus:outline-none focus:border-[#ccab7b]/50 transition-colors font-light ${
                                    formErrors.email ? "border-red-500/50" : "border-white/5"
                                  }`} style={{ fontFamily: "'Inter', sans-serif" }}
                                />
                                {formErrors.email && (
                                  <p className="text-red-400 text-[10px] mt-1.5">{formErrors.email}</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#9a9488] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  Phone Number <span className="text-[#ccab7b]">*</span>
                                </label>
                                <input
                                  type="tel"
                                  value={formData.phone}
                                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                  placeholder="0400 000 000"
                                  className={`w-full px-4 py-3 rounded-md bg-white/[0.03] border text-[#e3decb] text-[12px] placeholder:text-white/20 focus:outline-none focus:border-[#ccab7b]/50 transition-colors font-light ${
                                    formErrors.phone ? "border-red-500/50" : "border-white/5"
                                  }`} style={{ fontFamily: "'Inter', sans-serif" }}
                                />
                                {formErrors.phone && (
                                  <p className="text-red-400 text-[10px] mt-1.5">{formErrors.phone}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Submit */}
                          <div className="pt-6">
                              <button
                                type="submit"
                                disabled={submitState === "loading"}
                                className="w-full py-[18px] bg-[#ccab7b] text-black font-bold uppercase tracking-[0.15em] text-[11px] rounded-lg hover:shadow-[0_0_30px_rgba(204,171,123,0.3)] transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" style={{ fontFamily: "'Inter', sans-serif" }}
                              >
                                {submitState === "loading" ? (
                                  <>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>Sending...</span>
                                  </>
                                ) : (
                                  <>
                                    <Send size={14} />
                                    <span>Send Quote Request</span>
                                  </>
                                )}
                              </button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
