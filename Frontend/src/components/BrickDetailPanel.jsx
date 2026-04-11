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
      className="flex items-center justify-between py-3 border-b border-white/5"
    >
      <div className="flex items-center gap-3 text-gray-400">
        <span className="text-[var(--brass)] opacity-70">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm text-white font-mono tracking-wide">{value}</span>
    </motion.div>
  );
}

export function BrickDetailPanel({ brick, onClose }) {
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
      setActiveTab("overview");
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
            className="fixed top-0 right-0 h-full w-full max-w-3xl bg-[var(--charcoal)] z-50 flex flex-col overflow-hidden shadow-[-20px_0_80px_rgba(0,0,0,0.9)]"
          >
            {/* Gold accent line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--brass)] to-transparent flex-shrink-0" />

            {/* Header */}
            <div className="flex items-start justify-between px-8 py-5 border-b border-white/5 flex-shrink-0">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono text-[var(--brass)] tracking-[0.15em] uppercase">
                    {brick.collection}
                  </span>
                  {brick.isNew && (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--brass)]/15 text-[var(--brass)] text-xs border border-[var(--brass)]/30">
                      New
                    </span>
                  )}
                  {!brick.inStock && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20">
                      Out of Stock
                    </span>
                  )}
                </div>
                <h2 className="text-2xl text-white font-bold tracking-tight">{brick.name}</h2>
                <p className="text-sm text-gray-500 mt-0.5 font-mono">{brick.code}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors mt-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Hero Brick Display */}
            <div className="relative flex-shrink-0 h-52 overflow-hidden bg-black">
              {brick.image ? (
                <img src={brick.image} alt={brick.name} className="w-full h-full object-cover opacity-80" />
              ) : (
                <BrickWallPattern colorHex={brick.colorHex} rows={6} animated />
              )}
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
              {/* Color swatch */}
              <div className="absolute bottom-4 left-8 flex items-center gap-3 relative z-10">
                <div
                  className="w-8 h-8 rounded-full border-2 border-white/20 shadow-lg"
                  style={{ background: brick.colorHex }}
                />
                <div>
                  <p className="text-xs text-gray-400">{brick.color}</p>
                  <p className="text-xs font-mono text-gray-500">{brick.colorHex}</p>
                </div>
              </div>
              {/* Finish badge */}
              <div className="absolute bottom-4 right-8 relative z-10">
                <span className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-gray-300 backdrop-blur-sm shadow-xl">
                  {brick.finish} Finish
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 flex-shrink-0 px-8 bg-black">
              {["overview", "specs", "quote"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-5 py-4 text-sm capitalize transition-colors font-medium ${
                    activeTab === tab ? "text-[var(--brass)]" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab === "quote" ? "Request Quote" : tab === "specs" ? "Specifications" : "Overview"}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--brass)]"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Scrollable Content */}
            <div ref={panelRef} className="flex-1 overflow-y-auto bg-[var(--charcoal)]">
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
                    {/* Description */}
                    <div>
                      <p className="text-gray-300 leading-relaxed">{brick.description}</p>
                    </div>

                    {/* Applications */}
                    <div>
                      <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--brass)] mb-4">
                        Suitable Applications
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {brick.applications.map((app) => (
                          <div
                            key={app}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 shadow-sm"
                          >
                            <ChevronRight size={12} className="text-[var(--brass)]" />
                            {app}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick specs */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Manufacturer", value: brick.manufacturer },
                        { label: "Collection", value: brick.collection },
                        { label: "Finish", value: brick.finish },
                        { label: "Size", value: brick.size },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="p-4 rounded-xl bg-white/5 border border-white/10 shadow-sm"
                        >
                          <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                          <p className="text-sm text-white font-medium">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => setActiveTab("quote")}
                      className="w-full py-4 bg-[var(--brass)] text-black font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-[var(--brass-light)] hover:shadow-[0_0_20px_rgba(212,175,99,0.3)] transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      <Send size={16} />
                      <span>Request a Quote for {brick.name}</span>
                      <ChevronRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </motion.div>
                )}

                {activeTab === "specs" && (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="p-8"
                  >
                    <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--brass)] mb-6">
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
                      className="mt-8 p-5 rounded-xl bg-white/5 border border-white/10"
                    >
                      <p className="text-xs text-gray-500 leading-relaxed font-mono">
                        All specifications are subject to manufacturing tolerances as per AS/NZS 4455.
                        Contact our technical team for project-specific compliance data or MSDS documents.
                      </p>
                    </motion.div>

                    <button
                      onClick={() => setActiveTab("quote")}
                      className="w-full mt-6 py-4 bg-[var(--brass)] text-black font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-[var(--brass-light)] hover:shadow-[0_0_20px_rgba(212,175,99,0.3)] transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      <Send size={16} />
                      <span>Request a Quote</span>
                      <ChevronRight
                        size={16}
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
                          {/* Product reference */}
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-black border border-white/5 shadow-sm">
                            <div className="w-16 h-10 rounded overflow-hidden flex-shrink-0">
                              {brick.image ? (
                                <img src={brick.image} className="w-full h-full object-cover" />
                              ) : (
                                <BrickWallPattern colorHex={brick.colorHex} rows={3} />
                              )}
                            </div>
                            <div>
                              <p className="text-white font-bold">{brick.name}</p>
                              <p className="text-xs font-mono text-gray-500">{brick.code}</p>
                            </div>
                          </div>

                          {/* Contact Details */}
                          <div>
                            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--brass)] mb-4">
                              Contact Details
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                  Full Name <span className="text-[var(--brass)]">*</span>
                                </label>
                                <input
                                  value={formData.fullName}
                                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                  placeholder="John Smith"
                                  className={`w-full px-4 py-3 rounded-lg bg-black border text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[var(--brass)] transition-colors shadow-sm ${
                                    formErrors.fullName ? "border-red-500/50" : "border-white/5"
                                  }`}
                                />
                                {formErrors.fullName && (
                                  <p className="text-red-400 text-xs mt-1.5">{formErrors.fullName}</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                  Company Name
                                </label>
                                <input
                                  value={formData.company}
                                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                                  placeholder="Acme Constructions"
                                  className="w-full px-4 py-3 rounded-lg bg-black border border-white/5 shadow-sm text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[var(--brass)] transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                  Email Address <span className="text-[var(--brass)]">*</span>
                                </label>
                                <input
                                  type="email"
                                  value={formData.email}
                                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                                  placeholder="john@example.com"
                                  className={`w-full px-4 py-3 rounded-lg bg-black border text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[var(--brass)] transition-colors shadow-sm ${
                                    formErrors.email ? "border-red-500/50" : "border-white/5"
                                  }`}
                                />
                                {formErrors.email && (
                                  <p className="text-red-400 text-xs mt-1.5">{formErrors.email}</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                  Phone Number <span className="text-[var(--brass)]">*</span>
                                </label>
                                <input
                                  type="tel"
                                  value={formData.phone}
                                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                  placeholder="0400 000 000"
                                  className={`w-full px-4 py-3 rounded-lg bg-black border text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[var(--brass)] transition-colors shadow-sm ${
                                    formErrors.phone ? "border-red-500/50" : "border-white/5"
                                  }`}
                                />
                                {formErrors.phone && (
                                  <p className="text-red-400 text-xs mt-1.5">{formErrors.phone}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Project Details */}
                          <div>
                            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--brass)] mb-4">
                              Project Details
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                  Project Type <span className="text-[var(--brass)]">*</span>
                                </label>
                                <div className="relative">
                                  <select
                                    value={formData.projectType}
                                    onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-lg bg-black border text-sm text-white focus:outline-none focus:border-[var(--brass)] transition-colors appearance-none shadow-sm ${
                                      formErrors.projectType ? "border-red-500/50" : "border-white/5"
                                    }`}
                                  >
                                    <option value="" disabled>Select project type...</option>
                                    {projectTypes.map((t) => (
                                      <option key={t} value={t} className="bg-black text-white">{t}</option>
                                    ))}
                                  </select>
                                  <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
                                </div>
                                {formErrors.projectType && (
                                  <p className="text-red-400 text-xs mt-1.5">{formErrors.projectType}</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                  Project Address / Location
                                </label>
                                <input
                                  value={formData.projectAddress}
                                  onChange={e => setFormData({ ...formData, projectAddress: e.target.value })}
                                  placeholder="123 Main Street, Sydney NSW"
                                  className="w-full px-4 py-3 rounded-lg bg-black border border-white/5 shadow-sm text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[var(--brass)] transition-colors"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Quantity & Timeline */}
                          <div>
                            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--brass)] mb-4">
                              Requirements
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                  Estimated Quantity <span className="text-[var(--brass)]">*</span>
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                    placeholder="e.g. 500"
                                    className={`flex-1 min-w-0 px-4 py-3 rounded-lg bg-black border text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[var(--brass)] transition-colors shadow-sm ${
                                      formErrors.quantity ? "border-red-500/50" : "border-white/5"
                                    }`}
                                  />
                                  <div className="relative w-28">
                                    <select
                                      value={formData.quantityUnit}
                                      onChange={e => setFormData({ ...formData, quantityUnit: e.target.value })}
                                      className="w-full h-full px-3 py-3 rounded-lg bg-black border border-white/5 shadow-sm text-white text-sm focus:outline-none focus:border-[var(--brass)] transition-colors appearance-none pr-8"
                                    >
                                      {quantityUnits.map((u) => (
                                        <option key={u} value={u} className="bg-black">{u}</option>
                                      ))}
                                    </select>
                                      <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
                                  </div>
                                </div>
                                {formErrors.quantity && (
                                  <p className="text-red-400 text-xs mt-1.5">{formErrors.quantity}</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                  Project Timeline
                                </label>
                                <div className="relative">
                                  <select
                                    value={formData.timeline}
                                    onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black border border-white/5 shadow-sm text-white text-sm focus:outline-none focus:border-[var(--brass)] transition-colors appearance-none"
                                  >
                                    <option value="" className="bg-black text-white">Select timeline...</option>
                                    {timelines.map((t) => (
                                      <option key={t} value={t} className="bg-black text-white">{t}</option>
                                    ))}
                                  </select>
                                  <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5">
                              Additional Notes
                            </label>
                            <textarea
                              rows={4}
                              value={formData.notes}
                              onChange={e => setFormData({ ...formData, notes: e.target.value })}
                              placeholder="Tell us more about your project, special requirements, or any questions..."
                              className="w-full px-4 py-3 rounded-lg bg-black border border-white/5 shadow-sm text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[var(--brass)] transition-colors resize-none leading-relaxed"
                            />
                          </div>

                          {/* Submit */}
                          <div className="pt-2">
                              <button
                                type="submit"
                                disabled={submitState === "loading"}
                                className="w-full py-4 bg-[var(--brass)] text-black font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-[var(--brass-light)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(212,175,99,0.2)] hover:shadow-[0_8px_30px_rgba(212,175,99,0.4)]"
                              >
                                {submitState === "loading" ? (
                                  <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Sending Request...</span>
                                  </>
                                ) : (
                                  <>
                                    <Send size={16} />
                                    <span>Send Quote Request</span>
                                  </>
                                )}
                              </button>
                              <p className="text-xs font-medium text-gray-500 text-center mt-4">
                                We typically respond within 1–2 business days.
                              </p>
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
