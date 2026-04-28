import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {ArrowRight, CheckCircle, Mail, MapPin, Phone, User, Briefcase, MessageSquare, ChevronRight, Upload} from 'lucide-react';
import Footer from './Footer';

const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="relative group mb-8">
    <label className="absolute -top-3 left-4 bg-black px-2 text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--brass)] z-10">
      {label}
    </label>
    <div className="relative flex items-center">
      <div className="absolute left-4 text-white/30 group-focus-within:text-[var(--brass)] transition-colors">
        {Icon && <Icon size={16} />}
      </div>
      {props.textarea ? (
        <textarea
          {...props}
          className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-[14px] text-white placeholder-white/20 focus:outline-none focus:border-[var(--brass)] focus:bg-[var(--brass)]/5 transition-all min-h-[120px] resize-none"
        />
      ) : (
        <input
          {...props}
          className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-[14px] text-white placeholder-white/20 focus:outline-none focus:border-[var(--brass)] focus:bg-[var(--brass)]/5 transition-all"
        />
      )}
    </div>
  </div>
);

const FileField = ({ label, onChange, fileName }) => (
  <div className="relative group mb-8">
    <label className="absolute -top-3 left-4 bg-black px-2 text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--brass)] z-10">
      {label}
    </label>
    <div className="relative flex items-center">
      <div className="absolute left-4 text-white/30 group-focus-within:text-[var(--brass)] transition-colors">
        <Upload size={16} />
      </div>
      <div className="relative w-full">
        <input
          type="file"
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
        <div className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-[14px] text-white/50 hover:bg-white/10 transition-all flex items-center justify-between">
          <span>{fileName || "Click to upload blueprints or docs"}</span>
          <span className="text-[var(--brass)] text-[10px] font-bold uppercase tracking-widest">Browse</span>
        </div>
      </div>
    </div>
  </div>
);

const RadioCard = ({ selected, onClick, label, desc }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left p-5 rounded-lg border transition-all duration-300 flex flex-col gap-2 ${
      selected 
      ? 'border-[var(--brass)] bg-[var(--brass)]/10 shadow-[0_0_20px_rgba(212,175,99,0.15)]' 
      : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
    }`}
  >
    <div className="flex items-center justify-between w-full">
      <span className={`text-[12px] uppercase tracking-[0.15em] font-bold ${selected ? 'text-[var(--limestone)]' : 'text-white/60'}`}>
        {label}
      </span>
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-[var(--brass)]' : 'border-white/20'}`}>
        {selected && <motion.div layoutId="radio" className="w-2 h-2 rounded-full bg-[var(--brass)]" />}
      </div>
    </div>
    <span className="text-[12px] text-white/40 leading-relaxed font-light">
      {desc}
    </span>
  </button>
);

export default function QuotePage({ navigate }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', role: 'Architect / Designer', details: '', file: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      const subject = encodeURIComponent(`Quote Request — ${formData.role} | ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nCompany: ${formData.company || 'N/A'}\nProject Type: ${formData.role}\n\nProject Details:\n${formData.details}`
      );
      window.location.href = `mailto:info@modernmasonrygroup.ca?subject=${subject}&body=${body}`;
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans relative flex flex-col">
      <div className="flex flex-col md:flex-row flex-1">
        {/* GLOBAL BACKGROUND LAYER */}
        <div className="fixed inset-0 z-0">
           <div className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-40" style={{ backgroundImage: "url('/bg.png')" }} />
           <div className="absolute inset-0 bg-black/60" />
           <div className="absolute inset-0 opacity-[0.03] mix-blend-screen pointer-events-none bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"/%3E%3C/svg%3E')" }} />
        </div>

        {/* LEFT PANEL: LUXURY FEATURE (Hidden on Mobile) */}
        <div className="hidden md:flex w-[55%] relative z-10 flex-col items-center justify-center overflow-hidden border-r border-white/5 bg-black min-h-screen">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full bg-cover bg-center brightness-50 grayscale-[0.2]"
            style={{ backgroundImage: "url('/Urban.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

          <div className="relative z-20 p-16 flex flex-col justify-between h-full w-full py-24">
             <div>
               <img src="/Logo-MM (1).png" alt="Modern Masonry" className="h-20 w-auto mb-16 opacity-90 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => navigate('#home')} />
               <div className="w-12 h-[2px] bg-[var(--brass)] mb-6" />
               <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-[1.05] text-white mb-6 tracking-tighter uppercase">
                  Initiate<br/>Project.
               </h1>
               <p className="text-[var(--ash)] text-[14px] leading-loose max-w-sm">
                 Partner with the premier masonry supplier in Ontario. Let our experts actualize your architectural vision with uncompromising quality.
               </p>
             </div>
             
             <div className="flex flex-col gap-6 backdrop-blur-md bg-black/40 p-8 rounded-2xl border border-white/10 w-fit mt-20">
                <div className="flex items-center gap-4 text-[12px] font-bold tracking-[0.1em] uppercase text-white/50 hover:text-[var(--brass)] transition-colors cursor-pointer">
                   <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5"><Phone size={14} className="text-[var(--brass)]"/></div>
                   +1 (905) 939-0695
                </div>
                <div className="flex items-center gap-4 text-[12px] font-bold tracking-[0.1em] uppercase text-white/50 hover:text-[var(--brass)] transition-colors cursor-pointer">
                   <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5"><Mail size={14} className="text-[var(--brass)]"/></div>
                   info@modernmasonry.ca
                </div>
                <div className="flex items-center gap-4 text-[12px] font-bold tracking-[0.1em] uppercase text-white/50 hover:text-[var(--brass)] transition-colors cursor-pointer">
                   <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5"><MapPin size={14} className="text-[var(--brass)]"/></div>
                   Schomberg, Ontario
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT PANEL: DYNAMIC FORM */}
        <div className="w-full md:w-[45%] min-h-screen relative z-10 flex flex-col justify-center px-6 py-12 md:p-16 lg:px-24 pt-32 md:pt-40">
          
          {/* Step Indicator */}
          <div className="w-full max-w-lg mx-auto mb-16 flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -z-10" />
            <motion.div className="absolute top-1/2 left-0 bottom-0 h-[1px] bg-[var(--brass)] -z-10 origin-left" initial={{ scaleX: 0 }} animate={{ scaleX: step === 1 ? 0.2 : (step === 2 ? 0.5 : 1) }} transition={{ duration: 0.8 }} />
            
            {[1, 2, 3].map((num) => (
               <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${step >= num ? 'bg-[var(--brass)] text-black shadow-[0_0_15px_rgba(212,175,99,0.4)]' : 'bg-[#111] text-white/30 border border-white/20'}`}>
                 {step > num ? <CheckCircle size={14} /> : `0${num}`}
               </div>
            ))}
          </div>

          <div className="w-full max-w-lg mx-auto flex-1 flex flex-col justify-center mb-24">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: CONTACT INFO */}
              {step === 1 && (
                <motion.form 
                  key="step1" onSubmit={handleSubmit}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}
                >
                  <div className="mb-10">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-3">Client Details</h2>
                    <p className="text-[var(--ash)] text-[13px] font-medium uppercase tracking-wider">Please provide your contact information so our team can reach you.</p>
                  </div>

                  <InputField label="Full Name" icon={User} placeholder="John Doe" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <InputField label="Email Address" icon={Mail} type="email" placeholder="john@architecture.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  <InputField label="Phone Number" icon={Phone} type="tel" placeholder="+1 (555) 000-0000" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <InputField label="Company (Optional)" icon={Briefcase} placeholder="Doe Design Group" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                  
                  <button type="submit" className="w-full mt-4 bg-[var(--brass)] hover:bg-[var(--brass-light)] text-black font-bold uppercase tracking-[0.2em] text-[11px] py-5 rounded-lg flex items-center justify-center gap-3 transition-colors shadow-[0_0_20px_rgba(212,175,99,0.3)] hover:shadow-[0_0_30px_rgba(212,175,99,0.5)]">
                    Continue to Project Scope <ArrowRight size={14} />
                  </button>
                </motion.form>
              )}

              {/* STEP 2: PROJECT TYPE */}
              {step === 2 && (
                <motion.form 
                  key="step2" onSubmit={handleSubmit}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}
                >
                  <div className="mb-10">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-3">Project Scope</h2>
                    <p className="text-[var(--ash)] text-[13px] font-medium uppercase tracking-wider">Tell us what type of project you are building.</p>
                  </div>

                  <div className="flex flex-col gap-4 mb-10">
                     <RadioCard 
                       label="Residential Estate" 
                       desc="Luxury custom homes, manors, and private upscale landscaping."
                       selected={formData.role === 'Residential Estate'}
                       onClick={() => setFormData({...formData, role: 'Residential Estate'})}
                     />
                     <RadioCard 
                       label="Commercial Landmark" 
                       desc="Large scale corporate buildings, high-rises, and institutional hubs."
                       selected={formData.role === 'Commercial Landmark'}
                       onClick={() => setFormData({...formData, role: 'Commercial Landmark'})}
                     />
                     <RadioCard 
                       label="Architect / Designer" 
                       desc="I am a professional designing on behalf of a client requiring samples."
                       selected={formData.role === 'Architect / Designer'}
                       onClick={() => setFormData({...formData, role: 'Architect / Designer'})}
                     />
                  </div>

                  <InputField label="Project Details" icon={MessageSquare} textarea placeholder="Tell us about the materials you are looking for, estimated quantities, and timelines..." required value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} />
                  
                  <FileField 
                    label="Attachments (Optional)" 
                    fileName={formData.file ? formData.file.name : ""} 
                    onChange={e => setFormData({...formData, file: e.target.files[0]})} 
                  />
                  
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(1)} className="w-1/3 border border-white/20 text-white/60 hover:text-white hover:border-[var(--brass)] font-bold uppercase tracking-[0.1em] text-[11px] py-5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                      Back
                    </button>
                    <button type="submit" className="w-2/3 bg-[var(--brass)] hover:bg-[var(--brass-light)] text-black font-bold uppercase tracking-[0.2em] text-[11px] py-5 rounded-lg flex items-center justify-center gap-3 transition-colors shadow-[0_0_20px_rgba(212,175,99,0.3)]">
                      Submit Inquiry <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 3: SUCCESS */}
              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col items-center justify-center text-center px-4"
                >
                   <motion.div 
                     initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.4 }}
                     className="w-24 h-24 rounded-full bg-[var(--brass)]/10 border border-[var(--brass)]/30 flex items-center justify-center mb-10 text-[var(--brass)] shadow-[0_0_40px_rgba(212,175,99,0.3)]"
                   >
                     <CheckCircle size={40} />
                   </motion.div>
                   
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Inquiry Received.</h2>
                   <p className="text-[var(--ash)] leading-loose max-w-md text-[14px] font-medium mb-10">
                     Thank you, {formData.name || 'Visionary'}. Your project details have been securely routed to our masonry specialists. We will contact you at <strong>{formData.email}</strong> shortly.
                   </p>

                   <button onClick={() => navigate('#home')} className="border border-white/20 text-white hover:border-[var(--brass)] font-bold uppercase tracking-[0.2em] text-[11px] px-10 py-5 rounded-full flex items-center justify-center transition-all duration-300">
                      Return to Home
                   </button>
                </motion.div>
              )}
              
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
