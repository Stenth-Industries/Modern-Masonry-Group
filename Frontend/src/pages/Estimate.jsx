import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Upload, FileText, Check, X } from '@phosphor-icons/react';

const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Estimate = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectType: '',
    message: ''
  });
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles([...files, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        projectType: '',
        message: ''
      });
      setFiles([]);
    }, 3000);
  };

  return (
    <div className="min-h-screen pt-20 bg-[#F9F8F6]">
      {/* Hero */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#1E1C1B] text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl tracking-tighter font-medium mb-6">
            Free Estimate & Takeoff Service
          </h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Submit your drawings or tender documents and receive one complimentary estimate and takeoff service.
            Our experts will analyze your project requirements and provide accurate material estimates.
          </p>
        </motion.div>
      </section>

      {/* Form */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 md:p-16 shadow-lg text-center"
              data-testid="estimate-success"
            >
              <div className="w-20 h-20 bg-[#A84232] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} weight="bold" className="text-white" />
              </div>
              <h2 className="text-3xl font-medium text-[#1E1C1B] mb-4">Thank You!</h2>
              <p className="text-lg text-[#4A4643] leading-relaxed">
                Your estimate request has been submitted successfully. Our team will review your documents and contact you within 24-48 hours.
              </p>
            </motion.div>
          ) : (
            <AnimatedSection>
              <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 shadow-lg" data-testid="estimate-form">
                <h2 className="text-3xl tracking-tight font-medium text-[#1E1C1B] mb-8">
                  Request Your Free Estimate
                </h2>

                <div className="space-y-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1E1C1B] mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B]"
                        data-testid="estimate-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1E1C1B] mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B]"
                        data-testid="estimate-company"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1E1C1B] mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B]"
                        data-testid="estimate-email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1E1C1B] mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B]"
                        data-testid="estimate-phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1E1C1B] mb-2">
                      Project Type *
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B]"
                      data-testid="estimate-project-type"
                    >
                      <option value="">Select project type...</option>
                      <option value="commercial">Commercial</option>
                      <option value="custom-home">Custom Home</option>
                      <option value="residential">Residential</option>
                      <option value="renovation">Renovation/Repair</option>
                      <option value="restoration">Restoration</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1E1C1B] mb-2">
                      Project Details
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describe your project requirements, timeline, and any specific needs..."
                      className="w-full px-4 py-3 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B] resize-none"
                      data-testid="estimate-message"
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-[#1E1C1B] mb-2">
                    Upload Documents (Drawings, Plans, Tenders)
                  </label>
                  <div
                    className={`border-2 border-dashed transition-colors ${
                      dragActive ? 'border-[#A84232] bg-[#A84232]/5' : 'border-[#E2DFD9]'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    data-testid="file-upload-zone"
                  >
                    <div className="p-12 text-center">
                      <Upload size={48} weight="light" className="text-[#A84232] mx-auto mb-4" />
                      <p className="text-[#1E1C1B] font-medium mb-2">
                        Drag and drop files here, or click to select
                      </p>
                      <p className="text-sm text-[#4A4643] mb-4">
                        PDF, DWG, JPG, PNG (Max 50MB per file)
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="px-6 py-3 bg-[#E2DFD9] text-[#1E1C1B] text-sm font-medium hover:bg-[#D8CBB6] transition-colors"
                        data-testid="file-select-btn"
                      >
                        Select Files
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".pdf,.dwg,.jpg,.jpeg,.png"
                        data-testid="file-input"
                      />
                    </div>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 bg-[#E2DFD9]"
                          data-testid={`file-item-${index}`}
                        >
                          <div className="flex items-center space-x-3">
                            <FileText size={24} weight="bold" className="text-[#A84232]" />
                            <span className="text-sm text-[#1E1C1B]">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-1 hover:bg-white/50 transition-colors"
                            data-testid={`remove-file-${index}`}
                          >
                            <X size={20} weight="bold" className="text-[#1E1C1B]" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-[#A84232] text-white text-sm font-medium tracking-wide uppercase hover:bg-[#8A3325] transition-all"
                  data-testid="estimate-submit"
                >
                  Submit Estimate Request
                </button>
              </form>
            </AnimatedSection>
          )}
        </div>
      </section>
    </div>
  );
};

export default Estimate;