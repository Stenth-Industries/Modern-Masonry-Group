import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CloudUpload, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What files do you require for a takeoff?",
    answer: "We prefer vector-based PDFs of architectural elevations, floor plans, and wall sections. If you have CAD (DWG) files, those provide the highest level of accuracy."
  },
  {
    question: "How long does the free estimate take?",
    answer: "Our standard turnaround time is 24-48 business hours, depending on the complexity and scale of the project."
  },
  {
    question: "What is included in the material report?",
    answer: "You will receive a comprehensive breakdown of required masonry units, mortar, wall ties, flashing, and any specified architectural specials or complementary products."
  }
];

export function EstimatePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedTimeline, setSelectedTimeline] = useState("Urgent");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  return (
    <div className="pt-24 pb-24 min-h-screen bg-[#FCFAF9]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-16 mb-32">
          
          {/* Left Column: Hero Text & Upload Area */}
          <div className="lg:col-span-5 flex flex-col gap-16">
            
            {/* Hero Text */}
            <div className="space-y-6">
              <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--accent)]">Project Estimation</div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Expert Estimates & <br />
                Accurate Takeoffs – <br />
                <span className="text-[var(--accent)]">Fast and Free.</span>
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md pt-2">
                The Digital Architect streamlines your masonry workflow. Upload your blueprints and receive professional quantity surveys within 24-48 hours. Built for precision, designed for builders.
              </p>
              <div className="flex flex-col gap-3 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-[var(--accent)]" />
                  </div>
                  <span className="text-xs font-bold tracking-wide">Professional Accuracy</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-[var(--accent)]" />
                  </div>
                  <span className="text-xs font-bold tracking-wide">One free estimate per project</span>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="flex-1 flex flex-col justify-end">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Submit Your Blueprints</h2>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">Upload your PDF architectural drawings. Our engineering team will review and provide a comprehensive material takeoff.</p>
              
              <div 
                className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-colors ${isDragging ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--accent)]/20 bg-[#Fdfbf9]'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="w-14 h-14 bg-[#F5E6E3] rounded-full flex items-center justify-center mb-4">
                  <CloudUpload className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <h3 className="text-sm font-bold mb-1">Drag & Drop Blueprints</h3>
                <p className="text-[10px] text-muted-foreground mb-6 uppercase tracking-widest font-semibold">PDF, DWG, or high-res JPG formats. Max file size 50MB.</p>
                
                <input type="file" id="file" className="hidden" onChange={handleFileSelect} />
                <label htmlFor="file" className="cursor-pointer bg-[var(--accent)] text-white px-8 py-3 rounded-md text-[10px] font-bold tracking-widest uppercase hover:bg-[var(--accent)]/90 transition-colors">
                  {uploadedFile ? 'Change File' : 'Select Files'}
                </label>
                {uploadedFile && (
                  <p className="mt-4 text-xs font-medium text-[var(--accent)] truncate max-w-full px-4">
                    {uploadedFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Image & Form Area */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            
            {/* Image */}
            <div className="relative pt-6 pl-6">
              <div className="absolute top-0 left-0 w-48 h-48 bg-[var(--accent)] rounded-3xl" />
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-black/5 shadow-2xl relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1542621334-a254cf47733d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwYmx1ZXByaW50cyUyMGNsb3NldXB8ZW58MXx8fHwxNzc1NDQyMjU3fDA&ixlib=rb-4.1.0&q=80&w=1080" 
                  alt="Architectural Blueprints" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Form Area */}
            <div className="bg-white border border-black/5 rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-xl font-bold tracking-tight mb-8">Project Details</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold tracking-widest uppercase text-[var(--accent)]">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-transparent border-b border-black/20 pb-2 text-sm outline-none focus:border-[var(--accent)] transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold tracking-widest uppercase text-[var(--accent)]">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full bg-transparent border-b border-black/20 pb-2 text-sm outline-none focus:border-[var(--accent)] transition-colors" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold tracking-widest uppercase text-[var(--accent)]">Project Scale (Approximate Sq Ft)</label>
                  <div className="relative">
                    <select className="w-full bg-transparent border-b border-black/20 pb-2 text-sm outline-none focus:border-[var(--accent)] transition-colors appearance-none cursor-pointer">
                      <option>Under 1,000 sq ft</option>
                      <option>1,000 - 5,000 sq ft</option>
                      <option>5,000 - 10,000 sq ft</option>
                      <option>Over 10,000 sq ft</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-[9px] font-bold tracking-widest uppercase text-[var(--accent)]">Timeline</label>
                  <div className="flex gap-3">
                    {["Urgent", "1 Month", "Planning"].map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTimeline(time)}
                        className={`flex-1 py-3 text-[10px] font-bold tracking-widest uppercase rounded border transition-colors ${selectedTimeline === time ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5' : 'border-black/10 text-muted-foreground hover:border-black/30'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[9px] font-bold tracking-widest uppercase text-[var(--accent)]">Message</label>
                  <textarea rows={2} placeholder="Tell us about specific masonry needs..." className="w-full bg-transparent border-b border-black/20 pb-2 text-sm outline-none focus:border-[var(--accent)] transition-colors resize-none" />
                </div>

                <button type="submit" className="w-full bg-[var(--accent)] text-white py-4 rounded-md font-bold text-[10px] tracking-widest uppercase hover:bg-[var(--accent)]/90 transition-colors mt-6 shadow-md shadow-[var(--accent)]/20">
                  Request Free Takeoff
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Process Explained / FAQs */}
        <div className="max-w-3xl mx-auto pt-10">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-10">The Process Explained</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#F5F3F0] rounded-xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-sm">{faq.question}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
